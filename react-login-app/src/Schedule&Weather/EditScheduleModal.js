import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import LocationSelectPage from './LocationSelectPage';
import { getCategoryCSSColor } from './ScheduleAPI';

// 달력 팝업 전역 스타일 (AddScheduleModal과 동일)
const GlobalDatePickerStyle = createGlobalStyle`
  input[type="date"] {
    position: relative;
  }
  input[type="date"]::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
  }
  
  input[type="date"]::-webkit-datetime-edit-fields-wrapper {
    padding: 0;
  }
  
  input[type="date"]::-webkit-datetime-edit-text {
    padding: 0 2px;
  }
  
  input[type="date"]::-webkit-datetime-edit-month-field,
  input[type="date"]::-webkit-datetime-edit-day-field,
  input[type="date"]::-webkit-datetime-edit-year-field {
    padding: 0 2px;
  }
  
  .date-input-container {
    position: relative;
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: center;
  }
  .date-input-container input[type="date"] {
    width: 100%;
    text-align: left;
  }
  input[type="date"]::-webkit-calendar-picker-indicator {
    right: 0;
    left: auto;
    position: absolute;
    width: 100%;
    height: 100%;
  }
 
  input[type="date"]::-webkit-datetime-edit-fields-wrapper {
    text-align: left;
  }
  
  .date-input-container input[type="date"]:focus {
    outline: none;
  }
  
  input[type="date"]::-webkit-calendar-picker-indicator:active {
    right: 0;
    left: auto;
  }
`;

const EditScheduleModal = ({ onClose, onUpdate, onDelete, schedule }) => {
  const [selectedCategory, setSelectedCategory] = useState(schedule?.category || '골프');
  const [isAllDay, setIsAllDay] = useState(schedule?.isAllDay || false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerType, setTimePickerType] = useState('start');
  const [tempTime, setTempTime] = useState({ period: '오전', hour: '09', minute: '00' });
  const [showLocationSelect, setShowLocationSelect] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }));

  const updateTime = () => {
    setCurrentTime(new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }));
  };

  useEffect(() => {
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval); // 컴포넌트가 unmount 될 때 interval 해제
  }, []);

  const [editSchedule, setEditSchedule] = useState({
    title: schedule?.title || '',
    startDate: schedule?.startDate || '',
    endDate: schedule?.endDate || schedule?.startDate || '',
    startTime: schedule?.startTime || '',
    endTime: schedule?.endTime || '',
    isAllDay: schedule?.isAllDay || false,
    color: schedule?.color || '#E70012',
    location: schedule?.location || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('일정 수정 시도:', {
      title: editSchedule.title,
      startDate: editSchedule.startDate,
      category: selectedCategory,
      location: editSchedule.location,
      isAllDay
    });

    if (editSchedule.title && editSchedule.startDate && selectedCategory && editSchedule.location) {
      onUpdate({
        ...editSchedule,
        category: selectedCategory,
        isAllDay
      });
    } else {
      console.log('필수 필드 누락:', {
        title: !!editSchedule.title,
        startDate: !!editSchedule.startDate,
        category: !!selectedCategory,
        location: !!editSchedule.location
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      onDelete();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'endDate' && editSchedule.startDate && value < editSchedule.startDate) {
      alert('종료일은 시작일보다 늦거나 같아야 합니다.');
      return;
    }

    if (name === 'startDate' && editSchedule.endDate && value > editSchedule.endDate) {
      alert('시작일은 종료일보다 이르거나 같아야 합니다.');
      return;
    }

    setEditSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? '오후' : '오전';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${period} ${displayHour.toString().padStart(2, '0')}:${minutes}`;
  };

  const openTimePicker = (type) => {
    setTimePickerType(type);
    const currentTime = type === 'start' ? editSchedule.startTime : editSchedule.endTime;
    if (currentTime) {
      const [hours, minutes] = currentTime.split(':');
      const hour = parseInt(hours);
      const period = hour >= 12 ? '오후' : '오전';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      setTempTime({
        period,
        hour: displayHour.toString().padStart(2, '0'),
        minute: minutes
      });
    }
    setShowTimePicker(true);
  };

  const closeTimePicker = () => {
    setShowTimePicker(false);
  };

  const applyTime = () => {
    const hour24 = tempTime.period === '오후'
      ? (tempTime.hour === '12' ? 12 : parseInt(tempTime.hour) + 12)
      : (tempTime.hour === '12' ? 0 : parseInt(tempTime.hour));

    const timeString = `${hour24.toString().padStart(2, '0')}:${tempTime.minute}`;

    if (timePickerType === 'start') {
      setEditSchedule(prev => {
        const newSchedule = { ...prev, startTime: timeString };

        if (prev.endTime && timeString >= prev.endTime) {
          const [hours, minutes] = timeString.split(':');
          const endHour = (parseInt(hours) + 1) % 24;
          newSchedule.endTime = `${endHour.toString().padStart(2, '0')}:${minutes}`;
        }

        return newSchedule;
      });
    } else {
      if (editSchedule.startTime && timeString <= editSchedule.startTime) {
        alert('종료 시간은 시작 시간보다 늦어야 합니다.');
        return;
      }
      setEditSchedule(prev => ({ ...prev, endTime: timeString }));
    }

    closeTimePicker();
  };

  const openLocationSelect = () => {
    setShowLocationSelect(true);
  };

  const closeLocationSelect = () => {
    setShowLocationSelect(false);
  };

  const handleLocationSelect = (location) => {
    setEditSchedule(prev => ({ ...prev, location }));
    closeLocationSelect();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
      <div style={{ display: 'flex', position: 'relative' }}>
    <ModalOverlay onClick={handleOverlayClick}>
      <GlobalDatePickerStyle />
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderLeft>
            <ModalTitle>일정 수정</ModalTitle>
            <DateSubtitle>{schedule?.date ? new Date(schedule.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</DateSubtitle>
          </HeaderLeft>
          <CloseButton onClick={onClose}>취소</CloseButton>
        </Header>

        <ModalWindow>
          <Form>
            <CategorySection>
              <CategoryLabel>카테고리 *</CategoryLabel>
              <CategoryGrid>
                <CategoryItem
                  selected={selectedCategory === '골프'}
                  onClick={() => setSelectedCategory('골프')}
                  $categoryColor={getCategoryCSSColor('골프')}
                >
                  <CategoryIcon>
                    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <mask id="path-1-inside-1_988_3015" fill="white">
                        <path d="M9.48047 0C12.6142 0 15.3926 1.52041 17.1187 3.86377C17.2605 4.0562 17.2336 4.32209 17.0646 4.4911L12.2051 9.35153C12.0098 9.54679 12.0098 9.86335 12.2051 10.0586L16.8688 14.7224C17.0424 14.8959 17.0654 15.1706 16.913 15.363C15.1765 17.5543 12.4935 18.9609 9.48047 18.9609C4.24451 18.9607 0 14.7165 0 9.48047C9.66358e-08 4.24445 4.24451 0.000248432 9.48047 0Z"/>
                      </mask>
                      <path d="M9.48047 0V-2H9.48037L9.48047 0ZM9.48047 18.9609L9.48037 20.9609H9.48047V18.9609ZM0 9.48047H-2H0ZM16.8688 14.7224L18.2831 13.3081L16.8688 14.7224ZM12.2051 9.35153L13.6194 10.7656V10.7656L12.2051 9.35153ZM17.1187 3.86377L15.5084 5.04992L17.1187 3.86377ZM17.0646 4.4911L15.6503 3.07702L17.0646 4.4911ZM9.48047 0V2C11.9517 2 14.143 3.19621 15.5084 5.04992L17.1187 3.86377L18.729 2.67762C16.6422 -0.155395 13.2767 -2 9.48047 -2V0ZM17.0646 4.4911L15.6503 3.07702L10.7907 7.93744L12.2051 9.35153L13.6194 10.7656L18.479 5.90519L17.0646 4.4911ZM12.2051 10.0586L10.7909 11.4728L15.4546 16.1366L16.8688 14.7224L18.2831 13.3081L13.6193 8.64439L12.2051 10.0586ZM16.913 15.363L15.3455 14.1208C13.9715 15.8547 11.856 16.9609 9.48047 16.9609V18.9609V20.9609C13.131 20.9609 16.3816 19.2538 18.4805 16.6051L16.913 15.363ZM9.48047 18.9609L9.48056 16.9609C5.349 16.9607 2 13.6118 2 9.48047H0H-2C-2 15.8212 3.14001 20.9606 9.48037 20.9609L9.48047 18.9609ZM0 9.48047H2C2 5.34911 5.349 2.0002 9.48056 2L9.48047 0L9.48037 -2C3.14001 -1.9997 -2 3.13979 -2 9.48047H0ZM16.8688 14.7224L15.4546 16.1366C14.9498 15.6318 14.8328 14.7678 15.3455 14.1208L16.913 15.363L18.4805 16.6051C19.298 15.5735 19.1349 14.16 18.2831 13.3081L16.8688 14.7224ZM12.2051 9.35153L10.7907 7.93744C9.81455 8.91377 9.81462 10.4966 10.7909 11.4728L12.2051 10.0586L13.6193 8.64439C14.205 9.23013 14.2051 10.1798 13.6194 10.7656L12.2051 9.35153ZM17.1187 3.86377L15.5084 5.04992C15.0324 4.40375 15.1582 3.56913 15.6503 3.07702L17.0646 4.4911L18.479 5.90519C19.3089 5.07506 19.4885 3.70865 18.729 2.67762L17.1187 3.86377Z" fill="#269962" mask="url(#path-1-inside-1_988_3015)"/>
                      <circle cx="9.35547" cy="5.48047" r="1" fill="#269962"/>
                    </svg>
                  </CategoryIcon>
                  <CategoryText>골프</CategoryText>
                </CategoryItem>
                <CategoryItem
                  selected={selectedCategory === '맛집'}
                  onClick={() => setSelectedCategory('맛집')}
                  $categoryColor={getCategoryCSSColor('맛집')}
                >
                  <CategoryIcon>
                    <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.0342 0.00134277C16.0515 0.00193704 16.0688 0.0027826 16.0859 0.00427246C16.1087 0.00620759 16.131 0.00963133 16.1533 0.0130615C16.1624 0.0144823 16.1716 0.0152983 16.1807 0.0169678C16.1875 0.0182197 16.1944 0.0194829 16.2012 0.020874L16.2676 0.0374756H16.2695C16.3244 0.0527997 16.3771 0.0730347 16.4277 0.0970459C16.4396 0.102655 16.4513 0.108556 16.4629 0.114624C16.4762 0.121609 16.489 0.129524 16.502 0.137085C16.5147 0.14449 16.5276 0.151581 16.54 0.159546C16.5554 0.169439 16.5702 0.180098 16.585 0.190796C16.5984 0.200465 16.6121 0.209752 16.625 0.220093C16.6354 0.228473 16.6452 0.237675 16.6553 0.24646C16.6685 0.257932 16.6817 0.269427 16.6943 0.281616C16.7034 0.290422 16.7119 0.299816 16.7207 0.30896C16.7365 0.325389 16.7519 0.342164 16.7666 0.359741C16.7733 0.367741 16.7797 0.375946 16.7861 0.384155C16.7964 0.397301 16.8067 0.410468 16.8164 0.424194C16.8288 0.441665 16.8403 0.459632 16.8516 0.477905C16.8581 0.488594 16.8649 0.499142 16.8711 0.510132C16.9289 0.612586 16.9677 0.726249 16.9863 0.847046C16.9885 0.860792 16.9916 0.874326 16.9932 0.888062C16.9949 0.903245 16.9951 0.918579 16.9961 0.93396C16.9974 0.95324 16.9989 0.972389 16.999 0.991577C16.999 0.994507 17 0.997431 17 1.00037V18.5004C17 19.0527 16.5523 19.5004 16 19.5004C15.4477 19.5004 15 19.0527 15 18.5004V13.5004H14C12.8954 13.5004 12 12.6049 12 11.5004V8.00037C12 3.05082 14.0456 0.656291 15.6045 0.0804443C15.6574 0.0576595 15.7133 0.041149 15.7705 0.02771C15.7754 0.0265438 15.7802 0.0248924 15.7852 0.0238037C15.8054 0.019368 15.826 0.0162489 15.8467 0.0130615C15.8604 0.0109138 15.874 0.00778843 15.8877 0.00622559C15.9029 0.00453097 15.9182 0.00430409 15.9336 0.0032959C15.9489 0.00226443 15.9642 0.000684237 15.9795 0.000366211H16C16.0114 0.000366211 16.0228 0.00096138 16.0342 0.00134277ZM15 3.30994C14.4734 4.23372 14 5.71212 14 8.00037V11.5004H15V3.30994Z" fill="#EA580C"/>
                      <path d="M7.89844 0C8.45065 0 8.89833 0.44781 8.89844 1V5.58789C8.89844 6.69246 8.00301 7.58789 6.89844 7.58789H5.44922V18C5.44922 18.5523 5.0015 19 4.44922 19C3.89713 18.9998 3.44922 18.5521 3.44922 18V7.58789H2C0.895557 7.58774 0 6.69237 0 5.58789V1C0.000111199 0.4479 0.447908 0.000146363 1 0C1.55222 0 1.99989 0.44781 2 1V5.58789H3.44922V1C3.44935 0.44797 3.89721 0.00023074 4.44922 0C5.00142 2.41376e-08 5.44909 0.447828 5.44922 1V5.58789H6.89844V1C6.89855 0.44801 7.3465 0.000324362 7.89844 0Z" fill="#EA580C"/>
                    </svg>
                  </CategoryIcon>
                  <CategoryText>맛집</CategoryText>
                </CategoryItem>
                <CategoryItem
                  selected={selectedCategory === '숙소'}
                  onClick={() => setSelectedCategory('숙소')}
                  $categoryColor={getCategoryCSSColor('숙소')}
                >
                  <CategoryIcon>
                    <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 18.5H20.5" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M3 18.5V2C3 1.44772 3.44772 1 4 1H14.5C15.0523 1 15.5 1.44772 15.5 2V6" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
                      <rect x="10" y="8" width="10" height="11" rx="1" fill="#2563EB"/>
                      <rect x="6" y="4" width="2" height="2" fill="#2563EB"/>
                      <rect x="6" y="9" width="2" height="2" fill="#2563EB"/>
                      <rect x="6" y="14" width="2" height="2" fill="#2563EB"/>
                      <rect x="14" y="14" width="2" height="2" fill="white"/>
                      <rect x="14" y="10" width="2" height="2" fill="white"/>
                    </svg>
                  </CategoryIcon>
                  <CategoryText>숙소</CategoryText>
                </CategoryItem>
                <CategoryItem
                  selected={selectedCategory === '관광'}
                  onClick={() => setSelectedCategory('관광')}
                  $categoryColor={getCategoryCSSColor('관광')}
                >
                  <CategoryIcon>
                    <svg width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <mask id="path-1-inside-1_988_3045" fill="white">
                        <path d="M15.8662 1.83301C15.8662 2.38529 16.3139 2.83301 16.8662 2.83301H20.1553C20.7076 2.83301 21.1553 3.28072 21.1553 3.83301V16C21.1553 16.5523 20.7076 17 20.1553 17H1C0.447715 17 0 16.5523 0 16V3.83301C0 3.28072 0.447715 2.83301 1 2.83301H4.28809C4.84037 2.83301 5.28809 2.38529 5.28809 1.83301V1C5.28809 0.447715 5.7358 0 6.28809 0H14.8662C15.4185 0 15.8662 0.447715 15.8662 1V1.83301Z"/>
                      </mask>
                      <path d="M16.8662 2.83301V4.83301H20.1553V2.83301V0.833008H16.8662V2.83301ZM21.1553 3.83301H19.1553V16H21.1553H23.1553V3.83301H21.1553ZM20.1553 17V15H1V17V19H20.1553V17ZM0 16H2V3.83301H0H-2V16H0ZM1 2.83301V4.83301H4.28809V2.83301V0.833008H1V2.83301ZM5.28809 1.83301H7.28809V1H5.28809H3.28809V1.83301H5.28809ZM6.28809 0V2H14.8662V0V-2H6.28809V0ZM15.8662 1H13.8662V1.83301H15.8662H17.8662V1H15.8662ZM14.8662 0V2C14.3139 2 13.8662 1.55228 13.8662 1H15.8662H17.8662C17.8662 -0.656854 16.5231 -2 14.8662 -2V0ZM5.28809 1H7.28809C7.28809 1.55228 6.84037 2 6.28809 2V0V-2C4.63123 -2 3.28809 -0.656854 3.28809 1H5.28809ZM4.28809 2.83301V4.83301C5.94494 4.83301 7.28809 3.48986 7.28809 1.83301H5.28809H3.28809C3.28809 1.28072 3.7358 0.833008 4.28809 0.833008V2.83301ZM0 3.83301H2C2 4.38529 1.55229 4.83301 1 4.83301V2.83301V0.833008C-0.656855 0.833008 -2 2.17615 -2 3.83301H0ZM1 17V15C1.55229 15 2 15.4477 2 16H0H-2C-2 17.6569 -0.656855 19 1 19V17ZM21.1553 16H19.1553C19.1553 15.4477 19.603 15 20.1553 15V17V19C21.8121 19 23.1553 17.6569 23.1553 16H21.1553ZM20.1553 2.83301V4.83301C19.603 4.83301 19.1553 4.38529 19.1553 3.83301H21.1553H23.1553C23.1553 2.17615 21.8121 0.833008 20.1553 0.833008V2.83301ZM16.8662 2.83301V0.833008C17.4185 0.833008 17.8662 1.28072 17.8662 1.83301H15.8662H13.8662C13.8662 3.48986 15.2094 4.83301 16.8662 4.83301V2.83301Z" fill="#9333EA" mask="url(#path-1-inside-1_988_3045)"/>
                      <circle cx="10.5" cy="9" r="3.5" stroke="#9333EA" strokeWidth="2"/>
                    </svg>
                  </CategoryIcon>
                  <CategoryText>관광</CategoryText>
                </CategoryItem>
                <CategoryItem
                  selected={selectedCategory === '모임'}
                  onClick={() => setSelectedCategory('모임')}
                  $categoryColor={getCategoryCSSColor('모임')}
                >
                  <CategoryIcon>
                    <svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="5" cy="5" r="4" transform="matrix(-1 0 0 1 13 0)" stroke="#EF4444" strokeWidth="2"/>
                      <path d="M8 11C12.4183 11 16 14.5817 16 19H14C14 15.6863 11.3137 13 8 13C4.68629 13 2 15.6863 2 19H0C0 14.5817 3.58172 11 8 11Z" fill="#EF4444"/>
                    </svg>
                  </CategoryIcon>
                  <CategoryText>모임</CategoryText>
                </CategoryItem>
                <CategoryItem
                  selected={selectedCategory === '기타'}
                  onClick={() => setSelectedCategory('기타')}
                  $categoryColor={getCategoryCSSColor('기타')}
                >
                  <CategoryIcon>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="9" cy="9" r="8" stroke="#6B7280" strokeWidth="2"/>
                      <path d="M9 5V9M9 13H9.01" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </CategoryIcon>
                  <CategoryText>기타</CategoryText>
                </CategoryItem>
              </CategoryGrid>
            </CategorySection>

            <TitleSection>
              <TitleLabel>일정 제목 *</TitleLabel>
              <TitleInput
                type="text"
                name="title"
                value={editSchedule.title || ''}
                onChange={handleChange}
                placeholder="일정 제목을 입력해주세요"
                required
              />
            </TitleSection>

            <DateRowSection>
              <DateRow>
                <DateLabel>시작</DateLabel>
                <div className="date-input-container">
                  <DateInput
                    type="date"
                    name="startDate"
                    value={editSchedule.startDate || ''}
                    onChange={handleChange}
                    required
                  />
                  <TimeButton
                      type="button"
                      onClick={() => openTimePicker('start')}
                      disabled={isAllDay}
                  >
                    {editSchedule.startTime
                        ? formatTime(editSchedule.startTime)
                        : currentTime
                    }
                  </TimeButton> {/* 현재 시간 */}
                </div>
              </DateRow>
            </DateRowSection>

            <DateRowSection>
              <DateRow>
                <DateLabel>종료</DateLabel>
                <div className="date-input-container">
                  <DateInput
                    type="date"
                    name="endDate"
                    value={editSchedule.endDate || ''}
                    onChange={handleChange}
                    min={editSchedule.startDate}
                  />
                  <TimeButton
                      type="button"
                      onClick={() => openTimePicker('end')}
                      disabled={isAllDay}
                  >
                    {editSchedule.endTime
                        ? formatTime(editSchedule.endTime)
                        : currentTime
                    }
                  </TimeButton> {/* 현재 시간 */}
                </div>
              </DateRow>
            </DateRowSection>

            <AllDaySection>
              <AllDayLabel>하루 종일</AllDayLabel>
              <AllDayToggle
                type="checkbox"
                checked={isAllDay}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setIsAllDay(checked);

                  if (checked) {
                    setEditSchedule(prev => ({
                      ...prev,
                      startTime: '',
                      endTime: ''
                    }));
                  }
                }}
              />
            </AllDaySection>

            <LocationSection>
              <LocationLabel>장소</LocationLabel>
              <LocationInputContainer onClick={(e) => {
                e.stopPropagation();
                openLocationSelect();
              }}>
                <LocationDisplay>
                  {editSchedule.location || '장소를 입력하세요'}
                </LocationDisplay>
                <LocationIcon onClick={(e) => {
                  e.stopPropagation();
                  openLocationSelect();
                }}>
                  <svg width="16" height="23" viewBox="0 0 16 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="7.82032" cy="8.3057" r="3.01859" stroke="#A7A7A7"/>
                    <path d="M7.8916 1.26831V0.768311H7.8916L7.8916 1.26831ZM15 8.37671H15.5V8.3767L15 8.37671ZM14.4473 11.1267L13.9863 10.9331L13.9778 10.9532L13.9712 10.974L14.4473 11.1267ZM7.8916 21.5007L7.60326 21.9092L7.86945 22.0971L8.14885 21.9295L7.8916 21.5007ZM1.33496 11.1257L1.8113 10.9737L1.80457 10.9526L1.79599 10.9322L1.33496 11.1257ZM0.783203 8.37671L0.283203 8.3767V8.37671H0.783203ZM7.8916 1.26831V1.76831C11.5413 1.76831 14.4999 4.72697 14.5 8.37672L15 8.37671L15.5 8.3767C15.4999 4.1747 12.0936 0.768311 7.8916 0.768311V1.26831ZM15 8.37671H14.5C14.5 9.28376 14.3165 10.1469 13.9863 10.9331L14.4473 11.1267L14.9083 11.3203C15.2887 10.4145 15.5 9.41991 15.5 8.37671H15ZM14.4473 11.1267L13.9712 10.974C13.1127 13.6502 11.8394 15.995 10.6134 17.7698C10.0007 18.6568 9.40283 19.3971 8.87911 19.962C8.34824 20.5346 7.91523 20.9035 7.63435 21.072L7.8916 21.5007L8.14885 21.9295C8.55081 21.6883 9.05976 21.238 9.61245 20.6418C10.1723 20.038 10.7996 19.2597 11.4362 18.3381C12.7088 16.4958 14.0304 14.0633 14.9234 11.2794L14.4473 11.1267ZM7.8916 21.5007L8.17994 21.0922C6.41729 19.848 4.9837 17.8371 3.90315 15.8495C2.82706 13.8701 2.12656 11.9617 1.8113 10.9737L1.33496 11.1257L0.858624 11.2777C1.18742 12.3081 1.91066 14.2781 3.02459 16.3271C4.13406 18.3679 5.65676 20.5352 7.60326 21.9092L7.8916 21.5007ZM1.33496 11.1257L1.79599 10.9322C1.46618 10.1465 1.2832 9.28349 1.2832 8.37671H0.783203H0.283203C0.283203 9.41922 0.493778 10.4136 0.873929 11.3193L1.33496 11.1257ZM0.783203 8.37671L1.2832 8.37672C1.28326 4.72701 4.2419 1.76836 7.89161 1.76831L7.8916 1.26831L7.8916 0.768311C3.68961 0.768363 0.283268 4.17473 0.283203 8.3767L0.783203 8.37671Z" fill="#A7A7A7"/>
                  </svg>
                </LocationIcon>
              </LocationInputContainer>
            </LocationSection>
          </Form>
        </ModalWindow>

        <BottomButtonSection>
          <DeleteButton onClick={handleDelete}>
            삭제
          </DeleteButton>
          <UpdateButton
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            disabled={!editSchedule.title || !editSchedule.startDate || !selectedCategory || !editSchedule.location || (!isAllDay && (!editSchedule.startTime || !editSchedule.endTime))}
          >
            수정
          </UpdateButton>
        </BottomButtonSection>
      </ModalContent>

      {/* 시간 선택 팝업 (AddScheduleModal과 동일) */}
      {/* 시간 선택 팝업 */}
      {showTimePicker && (
          <TimePickerOverlay onClick={closeTimePicker}>
            <TimePickerContent onClick={(e) => e.stopPropagation()}>

              <TimePickerBody>
                <TimeColumn>
                  <TimeOption
                      selected={tempTime.period === '오전'}
                      onClick={() => setTempTime(prev => ({...prev, period: '오전'}))}
                  >
                    오전
                  </TimeOption>
                  <TimeOption
                      selected={tempTime.period === '오후'}
                      onClick={() => setTempTime(prev => ({...prev, period: '오후'}))}
                  >
                    오후
                  </TimeOption>
                </TimeColumn>

                <TimeColumn>
                  {Array.from({length: 12}, (_, i) => {
                    const hour = (i + 1).toString().padStart(2, '0');
                    return (
                        <TimeOption
                            key={hour}
                            selected={tempTime.hour === hour}
                            onClick={() => setTempTime(prev => ({...prev, hour}))}
                        >
                          {hour}
                        </TimeOption>
                    );
                  })}
                </TimeColumn>

                <TimeColumn>
                  {Array.from({length: 60}, (_, i) => {
                    const minute = i.toString().padStart(2, '0');
                    return (
                        <TimeOption
                            key={minute}
                            selected={tempTime.minute === minute}
                            onClick={() => setTempTime(prev => ({...prev, minute}))}
                        >
                          {minute}
                        </TimeOption>
                    );
                  })}
                </TimeColumn>
              </TimePickerBody>

              <TimePickerFooter>
                <TimePickerButton type="button" onClick={closeTimePicker}>취소</TimePickerButton>
                <TimePickerButton type="button" $primary onClick={applyTime}>확인</TimePickerButton>
              </TimePickerFooter>
            </TimePickerContent>
          </TimePickerOverlay>
      )}

      {/* 장소 선택 페이지 */}
      {showLocationSelect && (
        <LocationSelectOverlay>
          <LocationSelectPage
            onLocationSelect={handleLocationSelect}
            onBack={closeLocationSelect}
          />
        </LocationSelectOverlay>
      )}
    </ModalOverlay>
      </div>
  );
};

// 스타일 컴포넌트들 (AddScheduleModal과 동일하지만 일부 수정)
const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.6s ease-out;
  
  @keyframes fadeIn {
    from {
      background: rgba(0, 0, 0, 0);
    }
    to {
      background: rgba(0, 0, 0, 0.3);
    }
  }
`;

const ModalContent = styled.div`
  width: 100%;
  aspect-ratio: 440 / 600;
  background: #FFFFFF;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  position: relative;
  animation: slideUp 0.6s ease-out;
  
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
  
  @media (max-width: 480px) {
    width: calc(100% - 60px);
    height: 75vh;
    border-radius: 20px 20px 0px 0px;
  }
`;

const Header = styled.div`
  position: relative;
  height: 80px;
  background: #FFFFFF;
  border-radius: 20px 20px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 20px 20px;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #003CFF;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 300;
  font-size: 16px;
  cursor: pointer;
`;

const ModalWindow = styled.div`
  padding: 20px;
  height: calc(75vh - 250px);
  overflow-y: auto;
  
  /* 웹킷 기반 브라우저 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Firefox 스크롤바 숨기기 */
  scrollbar-width: none;

  @media (max-width: 480px) {
    padding: 15px;
    height: calc(75vh - 230px);
  }
`;

const ModalTitle = styled.h2`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #000000;
  text-align: left;
  margin: 0;
  padding: 0;
  line-height: 1;
`;

const DateSubtitle = styled.div`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #595959;
  margin: 5px 0 0 0;
  padding: 0;
  line-height: 1;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DateRowSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;

  .date-input-container {
    flex: 1;
    display: flex;
    border: 1px solid #A7A7A7;
    border-radius: 12px;
    overflow: hidden;
    background: #FFFFFF;
    transition: border-color 0.3s ease;

    &:focus-within {
      border-color: #269962;
    }
  }
`;

const DateLabel = styled.label`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
`;

const DateInput = styled.input`
  border: none;
  border-radius: 0;
  padding: 15px 20px;
  box-sizing: border-box;
  
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  color: #050505;
  
  background: transparent;
  outline: none;
  
  
  flex: 1;
  position: relative;

  &:focus {
    outline: none;
  }
`;

const AllDaySection = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 10px;
`;

const AllDayLabel = styled.label`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
`;

const AllDayToggle = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #269962;
`;

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 5%;
`;

const CategoryLabel = styled.label`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
  font-weight: 400;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const ACTIVE_COLOR = '#2D8779';
const ACTIVE_BG = 'rgba(44, 140, 125, 0.15)';
const HOVER_BG = 'rgba(44, 140, 125, 0.07)';

const CategoryItem = styled.div`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  text-align: center;
  color: ${props => props.selected ? ACTIVE_COLOR : '#666666'};
  font-size: 12px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 15px 10px;
  box-sizing: border-box;
  aspect-ratio: 126 / 88;

  border: 1px solid ${props => props.selected ? ACTIVE_COLOR : '#A7A7A7'};
  border-radius: 10px;

  background: ${props => props.selected ? ACTIVE_BG : '#FFFFFF'};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${ACTIVE_COLOR};
    background: ${HOVER_BG};
    color: ${ACTIVE_COLOR};
  }
`;

const CategoryText = styled.div`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 12px;
  text-align: center;
`;

const CategoryIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: auto;
    height: auto;
    max-width: 22px;
    max-height: 20px;
  }
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleLabel = styled.label`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  color: #050505;
  font-weight: 500;
`;

const TitleInput = styled.input`
  width: 100%;
  border: 1px solid #A7A7A7;
  border-radius: 12px;
  padding: 15px 20px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  color: #050505;
  background: #FFFFFF;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #269962;
  }

  &::placeholder {
    color: #A7A7A7;
  }
`;

const LocationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LocationLabel = styled.label`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  color: #050505;
  font-weight: 500;
`;

const LocationInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const LocationDisplay = styled.div`
  width: 100%;
  border: 1px solid #A7A7A7;
  border-radius: 12px;
  padding: 15px 50px 15px 20px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  color: ${props => props.children === '장소를 입력하세요' ? '#A7A7A7' : '#050505'};
  background: #FFFFFF;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  cursor: pointer;
  min-height: 20px;
  display: flex;
  align-items: center;

  &:hover {
    border-color: #269962;
  }
`;

const LocationIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  svg {
    width: 16px;
    height: 23px;
  }
`;

const BottomButtonSection = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 90%;
  margin: 0 auto;
  background: #FFFFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5%;
`;

const DeleteButton = styled.button`
  flex: 1;
  padding: 15px;
  border: 1px solid #EF4444;
  border-radius: 27px;
  background: #FFFFFF;
  color: #EF4444;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #EF4444;
    color: #FFFFFF;
  }
`;

const UpdateButton = styled.button`
  flex: 2;
  padding: 15px;
  border: 1px solid #269962;
  border-radius: 27px;
  background: #269962;
  color: #FFFFFF;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #1e7a4f;
    border-color: #1e7a4f;
  }
  
  &:disabled {
    background: #9C9C9C;
    border-color: #9C9C9C;
    cursor: not-allowed;
  }
`;

// 시간 선택 관련 스타일 컴포넌트들 (AddScheduleModal과 동일)
const TimeButton = styled.button`
  border: none;
  border-radius: 0;
  padding: 15px 20px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  color: #050505;
  background: transparent;
  outline: none;
  transition: background-color 0.3s ease;
  box-sizing: border-box;
  min-width: 120px;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #F8F9FA;
  }

  &:disabled {
    opacity: 0.5;
    background: #F5F5F5;
    cursor: not-allowed;
  }
`;

const TimePickerOverlay = styled.div`
  position: absolute;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimePickerContent = styled.div`
  background: #FFFFFF;
  border: 1px solid #2C8C7D;
  border-radius: 10px;

  width: 188px;
  aspect-ratio: 188 / 234;
`;

const TimePickerBody = styled.div`
  display: flex;
  overflow: hidden;
`;

const TimeColumn = styled.div`
  flex: 1;
  padding: 5px;
  border-right: 1px solid #2C8C7D;

  max-height: 188px;
  overflow-y: auto;

  &:last-child {
    border-right: none;
  }

  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const TimeOption = styled.div`
  padding: 12px;
  box-sizing: border-box;

  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 12px;
  transition: all 0.2s ease;
  text-align: center;

  border-radius: 8px;

  margin: 1% 0;

  cursor: pointer;

  &:hover {
    background: #F8F9FA;
  }

  ${props => props.selected && `
    background: rgba(44, 140, 125, 0.3);
    color: #2C8C7D;
    font-weight: 300;
  `}
`;

const TimePickerFooter = styled.div`
  display: flex;
  gap: 10px;
  padding: 5px;
  border-top: 1px solid #2C8C7D;
`;

const TimePickerButton = styled.button`
  flex: 1;
  padding: 8px;
  border: 1px solid rgba(44, 140, 125, 0.8);
  border-radius: 10px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 12px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #FFFFFF;
  color: #050505;

  &:hover {
    background: rgba(44, 140, 125, 0.3);
    color: #2C8C7D;
  }

  ${props => props.$primary && `

    &:hover {
      background: rgba(44, 140, 125, 0.3);
      color: #2C8C7D;
    }
  `}
`;

const LocationSelectOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #FFFFFF;
  z-index: 3000;
`;

export default EditScheduleModal;