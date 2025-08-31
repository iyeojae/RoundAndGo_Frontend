import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const AddScheduleModal = ({ onClose, onAdd, schedule, setSchedule }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('회의');
  const [isAllDay, setIsAllDay] = useState(false);

  const categories = [
    { id: '기념일', label: '기념일' },
    { id: '생일', label: '생일' },
    { id: '모임', label: '모임' },
    { id: '회의', label: '회의' },
    { id: '결혼', label: '결혼' },
    { id: '할 일', label: '할 일' },
    { id: '여행', label: '여행' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (schedule.title && schedule.startDate) {
      onAdd({
        ...schedule,
        category: selectedCategory,
        isAllDay
      });
      setSchedule({
        title: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        isAllDay: false,
        color: '#E70012'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}. ${days[date.getDay()]}`;
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <Header>
          <HeaderBackground />
          <HeaderContent>
            <LogoSection>
              <LogoImage src={process.env.PUBLIC_URL + "/images/logo-280a0a.png"} alt="ROUND & GO" />
              <LogoText>ROUND & GO</LogoText>
            </LogoSection>
            <HeaderIcons>
              <NotificationIcon>🔔</NotificationIcon>
              <ProfileIcon>👤</ProfileIcon>
            </HeaderIcons>
          </HeaderContent>
          <NavigationBar>
            <NavItem onClick={() => navigate('/')}>홈</NavItem>
            <NavItem active>일정</NavItem>
            <NavItem>오늘의 운세</NavItem>
          </NavigationBar>
          <CloseButton onClick={onClose}>취소</CloseButton>
        </Header>

        {/* 모달 창 */}
        <ModalWindow>
          <ModalTitle>새로운 일정</ModalTitle>
          
          <Form>
            {/* 일정 제목 */}
            <InputSection>
              <Input
                type="text"
                name="title"
                value={schedule.title}
                onChange={handleChange}
                placeholder="일정 제목을 입력해주세요"
                required
              />
            </InputSection>

            {/* 날짜 선택 */}
            <DateSection>
              <DateLabel>시작일</DateLabel>
              <DateInput
                type="date"
                name="startDate"
                value={schedule.startDate}
                onChange={handleChange}
                required
              />
              <DateDisplay>{formatDate(schedule.startDate)}</DateDisplay>
            </DateSection>

            <DateSection>
              <DateLabel>종료일</DateLabel>
              <DateInput
                type="date"
                name="endDate"
                value={schedule.endDate}
                onChange={handleChange}
                min={schedule.startDate}
              />
              <DateDisplay>{formatDate(schedule.endDate)}</DateDisplay>
            </DateSection>

            {/* 시간 선택 */}
            <TimeSection>
              <TimeLabel>시작 시간</TimeLabel>
              <TimeInput
                type="time"
                name="startTime"
                value={schedule.startTime}
                onChange={handleChange}
                disabled={isAllDay}
              />
            </TimeSection>

            <TimeSection>
              <TimeLabel>종료 시간</TimeLabel>
              <TimeInput
                type="time"
                name="endTime"
                value={schedule.endTime}
                onChange={handleChange}
                disabled={isAllDay}
              />
            </TimeSection>

            {/* 하루종일 옵션 */}
            <AllDaySection>
              <AllDayLabel>하루 종일</AllDayLabel>
              <AllDayToggle
                type="checkbox"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
              />
            </AllDaySection>

            {/* 카테고리 */}
            <CategorySection>
              <CategoryLabel>카테고리</CategoryLabel>
              <CategoryGrid>
                {categories.map(category => (
                  <CategoryButton
                    key={category.id}
                    selected={selectedCategory === category.id}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.label}
                  </CategoryButton>
                ))}
              </CategoryGrid>
            </CategorySection>

            {/* 장소 */}
            <LocationSection>
              <LocationLabel>장소</LocationLabel>
              <LocationInput
                type="text"
                name="location"
                value={schedule.location || ''}
                onChange={handleChange}
                placeholder="장소를 입력하세요"
              />
            </LocationSection>

            {/* 참석자 초대 */}
            <AttendeeSection>
              <AttendeeLabel>참석자 초대</AttendeeLabel>
              <AttendeeInput
                type="text"
                name="attendees"
                value={schedule.attendees || ''}
                onChange={handleChange}
                placeholder="참석자를 입력하세요"
              />
            </AttendeeSection>

            {/* 알림 */}
            <ReminderSection>
              <ReminderLabel>알림</ReminderLabel>
              <ReminderSelect
                name="reminder"
                value={schedule.reminder || '15분 전'}
                onChange={handleChange}
              >
                <option value="15분 전">15분 전</option>
                <option value="30분 전">30분 전</option>
                <option value="1시간 전">1시간 전</option>
                <option value="1일 전">1일 전</option>
              </ReminderSelect>
            </ReminderSection>

          </Form>
        </ModalWindow>

        {/* 하단 버튼 영역 */}
        <BottomButtonSection>
          <AddButton type="button" onClick={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}>
            일정 추가
          </AddButton>
        </BottomButtonSection>
      </ModalContent>
    </ModalOverlay>
  );
};

// 스타일 컴포넌트들
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 440px;
  height: 956px;
  background: #FFFFFF;
  border-radius: 20px 20px 0px 0px;
  overflow: hidden;
  position: relative;
`;

const Header = styled.div`
  position: relative;
  height: 100px;
`;

const HeaderBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: #269962;
  border-radius: 20px 20px 0px 0px;
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoImage = styled.img`
  width: 24px;
  height: 23px;
`;

const LogoText = styled.span`
  font-family: 'Julius Sans One', sans-serif;
  font-size: 10px;
  color: #FFFFFF;
  font-weight: 400;
`;

const HeaderIcons = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const NotificationIcon = styled.span`
  font-size: 16px;
  color: #FFFFFF;
`;

const ProfileIcon = styled.div`
  width: 15px;
  height: 15px;
  border: 2px solid #FFFFFF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: #FFFFFF;
`;

const NavigationBar = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  gap: 20px;
  padding: 10px 20px;
`;

const NavItem = styled.span`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 700;
  font-size: 14px;
  color: #FFFFFF;
  cursor: pointer;
  
  ${props => props.active && `
    color: #FFFFFF;
    font-weight: 700;
  `}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: transparent;
  border: none;
  color: #003CFF;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 300;
  font-size: 16px;
  cursor: pointer;
  z-index: 10;
`;

const ModalWindow = styled.div`
  padding: 20px;
  height: calc(100% - 200px);
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: #000000;
  text-align: center;
  margin: 0 0 20px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputSection = styled.div`
  border: 1px solid #269962;
  border-radius: 27px;
  padding: 15px 20px;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 14px;
  color: #9C9C9C;
  background: transparent;

  &::placeholder {
    color: #9C9C9C;
  }
`;

const DateSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const DateLabel = styled.label`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
  margin-left: 20px;
`;

const DateInput = styled.input`
  border: 1px solid #269962;
  border-radius: 27px;
  padding: 10px 20px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
  background: transparent;
`;

const DateDisplay = styled.div`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
  margin-left: 20px;
`;

const TimeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const TimeLabel = styled.label`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
  margin-left: 20px;
`;

const TimeInput = styled.input`
  border: 1px solid #269962;
  border-radius: 27px;
  padding: 10px 20px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
  background: transparent;
  text-align: right;
  margin-right: 20px;

  &:disabled {
    opacity: 0.5;
  }
`;

const AllDaySection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
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
  gap: 10px;
`;

const CategoryLabel = styled.label`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
  margin-left: 20px;
`;

const CategoryGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-left: 20px;
`;

const CategoryButton = styled.button`
  border: 1px solid #9A9A9A;
  border-radius: 40px;
  padding: 5px 15px;
  background: ${props => props.selected ? '#269962' : 'transparent'};
  color: ${props => props.selected ? '#FFFFFF' : '#9A9A9A'};
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #269962;
    color: #269962;
  }
`;

const LocationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const LocationLabel = styled.label`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
  margin-left: 20px;
`;

const LocationInput = styled.input`
  border: 1px solid #269962;
  border-radius: 27px;
  padding: 10px 20px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
  background: transparent;
  margin: 0 20px;
`;

const AttendeeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const AttendeeLabel = styled.label`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
  margin-left: 20px;
`;

const AttendeeInput = styled.input`
  border: 1px solid #269962;
  border-radius: 27px;
  padding: 10px 20px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
  background: transparent;
  margin: 0 20px;
`;

const ReminderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ReminderLabel = styled.label`
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
  margin-left: 20px;
`;

const ReminderSelect = styled.select`
  border: 1px solid #269962;
  border-radius: 27px;
  padding: 10px 20px;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-size: 13px;
  color: #050505;
  background: transparent;
  margin: 0 20px;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const BottomButtonSection = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: #FFFFFF;
  border-top: 1px solid #E5E5E5;
`;

const AddButton = styled.button`
  width: 100%;
  padding: 15px;
  border: 1px solid #9C9C9C;
  border-radius: 27px;
  background: transparent;
  color: #9C9C9C;
  font-family: 'Spoqa Han Sans Neo', sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #269962;
    color: #269962;
  }
`;

export default AddScheduleModal; 