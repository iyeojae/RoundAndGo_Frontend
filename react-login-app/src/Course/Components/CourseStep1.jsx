import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Layout/Header';
import Footer from '../../Layout/Footer';
import './CourseStep1.css';

const CourseStep1 = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [selectedPeriod, setSelectedPeriod] = useState('day');
  const [golfTimes, setGolfTimes] = useState(['']); // 기본 골프 시간
  const [departureDate, setDepartureDate] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // 현재 단계
  
  // 골프장 선택 상태 관리
  const [selectedGolfCourses, setSelectedGolfCourses] = useState([]); // 선택된 골프장들
  const [golfCourseSearchResults, setGolfCourseSearchResults] = useState([]); // 검색 결과
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [isSearching, setIsSearching] = useState(false); // 검색 중 상태
  const [showSearchResults, setShowSearchResults] = useState(false); // 검색 결과 표시 여부
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0); // 현재 검색 중인 골프 시간 인덱스
  
  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [tempTime, setTempTime] = useState({
    period: '오전',
    hour: '9',
    minute: '00'
  });
  
  // 골프장 검색 모달 상태
  const [isGolfCourseModalOpen, setIsGolfCourseModalOpen] = useState(false);
  const [currentGolfCourseIndex, setCurrentGolfCourseIndex] = useState(0);

  // 컴포넌트 마운트 시 기본 골프장으로만 초기화
  useEffect(() => {
    // 항상 기본 골프장으로 초기화 (이전 데이터 무시)
    const initializeWithDefaultGolfCourse = async () => {
      const localGolfCourseId = localStorage.getItem('selectedGolfCourseId');
      if (localGolfCourseId) {
        const defaultGolfCourse = await fetchGolfCourseById(localGolfCourseId);
        if (defaultGolfCourse) {
          setSelectedGolfCourses([defaultGolfCourse]);
        }
      } else {
        // localStorage에 기본 골프장 ID가 없으면 기본값으로 설정
        const defaultGolfCourse = await fetchGolfCourseById(1); // 기본 골프장 ID: 1
        if (defaultGolfCourse) {
          setSelectedGolfCourses([defaultGolfCourse]);
        }
      }
    };
    initializeWithDefaultGolfCourse();
  }, []);

  // 골프장 ID로 골프장 정보를 가져오는 함수
  const fetchGolfCourseById = async (golfCourseId) => {
    try {
      const response = await fetch(`https://api.roundandgo.com/api/golf-courses/${golfCourseId}`);
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (error) {
      console.error('골프장 정보 가져오기 실패:', error);
    }
    return null;
  };

  // 이 useEffect는 제거 (이전 데이터 복원하지 않음)
  
  // 여행 기간 옵션
  const periodOptions = [
    { id: 'day', title: '당일 치기', subtitle: '하루코스', days: 1 },
    { id: '1night', title: '1박 2일', subtitle: '주말 여행', days: 2 },
    { id: '2night', title: '2박 3일', subtitle: '짧은 휴가', days: 3 },
    { id: '3night', title: '3박 4일', subtitle: '여유로운 여행', days: 4 }
  ];

  // 골프장 검색 API 함수
  const searchGolfCourses = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.roundandgo.com/api/golf-courses/search?name=${encodeURIComponent(searchTerm)}`
      );
      
      if (!response.ok) {
        throw new Error('골프장 정보를 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      const results = Array.isArray(data.data) ? data.data : [];
      setGolfCourseSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error("골프장 검색 중 에러 발생:", error);
      setGolfCourseSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 골프장 선택 함수
  const selectGolfCourse = (golfCourse, index) => {
    const newSelectedCourses = [...selectedGolfCourses];
    newSelectedCourses[index] = golfCourse;
    setSelectedGolfCourses(newSelectedCourses);
    setShowSearchResults(false);
    setSearchTerm('');
    setIsGolfCourseModalOpen(false);
  };

  // 골프장 검색 모달 열기
  const openGolfCourseModal = (index) => {
    setCurrentGolfCourseIndex(index);
    setIsGolfCourseModalOpen(true);
    setSearchTerm('');
    setGolfCourseSearchResults([]);
    setShowSearchResults(false);
  };

  // 골프장 검색 모달 닫기
  const closeGolfCourseModal = () => {
    setIsGolfCourseModalOpen(false);
    setSearchTerm('');
    setGolfCourseSearchResults([]);
    setShowSearchResults(false);
  };

  // 여행 기간에 따른 골프 시간 개수 설정
  const getGolfTimeCount = (period) => {
    switch (period) {
      case 'day': return 1;      // 당일치기: 1개
      case '1night': return 2;   // 1박 2일: 2개
      case '2night': return 3;   // 2박 3일: 3개
      case '3night': return 4;   // 3박 4일: 4개
      default: return 1;
    }
  };

  // 여행 기간 변경 시 골프 시간 개수 조정
  const handlePeriodChange = async (period) => {
    setSelectedPeriod(period);
    const requiredCount = getGolfTimeCount(period);
    const currentCount = golfTimes.length;
    
    if (currentCount < requiredCount) {
      // 부족한 개수만큼 기본 골프장으로 채우기
      const newTimes = [...golfTimes];
      const newSelectedCourses = [...selectedGolfCourses];
      
      // localStorage에서 기본 골프장 ID 가져오기
      const localGolfCourseId = localStorage.getItem('selectedGolfCourseId');
      
      for (let i = currentCount; i < requiredCount; i++) {
        newTimes.push('');
        
        // 기본 골프장이 있으면 해당 골프장 정보 가져오기
        if (localGolfCourseId) {
          const defaultGolfCourse = await fetchGolfCourseById(localGolfCourseId);
          newSelectedCourses.push(defaultGolfCourse);
        } else {
          newSelectedCourses.push(null);
        }
      }
      setGolfTimes(newTimes);
      setSelectedGolfCourses(newSelectedCourses);
    } else if (currentCount > requiredCount) {
      // 초과하는 개수만큼 제거 (뒤에서부터)
      const newTimes = golfTimes.slice(0, requiredCount);
      const newSelectedCourses = selectedGolfCourses.slice(0, requiredCount);
      setGolfTimes(newTimes);
      setSelectedGolfCourses(newSelectedCourses);
    }
  };

  // 골프 시간 변경
  const updateGolfTime = (index, newTime) => {
    const updatedTimes = [...golfTimes];
    updatedTimes[index] = newTime;
    setGolfTimes(updatedTimes);
  };

  // 모든 필드가 입력되었는지 확인
  const isAllFieldsFilled = () => {
    const requiredCount = getGolfTimeCount(selectedPeriod);
    const hasAllGolfTimes = golfTimes.length === requiredCount && 
                           golfTimes.every(time => time !== '');
    const hasSelectedPeriod = selectedPeriod !== '';
    const hasAllGolfCourses = selectedGolfCourses.length === requiredCount && 
                              selectedGolfCourses.every(course => course !== null && course !== undefined);
    
    // 1박 2일 이상 선택 시 날짜도 확인
    if (selectedPeriod !== 'day') {
      return hasAllGolfTimes && hasSelectedPeriod && hasAllGolfCourses && departureDate;
    }
    
    return hasAllGolfTimes && hasSelectedPeriod && hasAllGolfCourses;
  };

  // 다음 단계로 이동
  const handleNext = () => {
    // 골프장 ID 배열 생성
    const golfCourseIds = selectedGolfCourses.map(course => course ? course.id : null).filter(id => id !== null);
    
    // 데이터를 sessionStorage에 저장
    const step1Data = {
      selectedPeriod,
      golfTimes,
      departureDate,
      selectedGolfCourses,
      golfCourseIds,
      travelDays: periodOptions.find(p => p.id === selectedPeriod)?.days || 1
    };
    
    sessionStorage.setItem('courseStep1', JSON.stringify(step1Data));
    navigate('/course/step2');
  };

  // 뒤로가기
  const handleBack = () => {
    navigate('/main');
  };

  // 모달 열기
  const openTimeModal = (index) => {
    setCurrentTimeIndex(index);
    if (golfTimes[index] && golfTimes[index] !== '') {
      // 기존 시간이 있으면 파싱
      const time = golfTimes[index];
      const [hour, minute] = time.split(':');
      const hourNum = parseInt(hour);
      setTempTime({
        period: hourNum >= 12 ? '오후' : '오전',
        hour: hourNum > 12 ? (hourNum - 12).toString() : hourNum.toString(),
        minute: minute
      });
    } else {
      // 새 시간 설정
      setTempTime({
        period: '오전',
        hour: '9',
        minute: '00'
      });
    }
    setIsModalOpen(true);
    // 페이지 스크롤 막기
    document.body.style.overflow = 'hidden';
  };

  // 모달 닫기
  const closeTimeModal = () => {
    setIsModalOpen(false);
    // 페이지 스크롤 다시 활성화
    document.body.style.overflow = 'auto';
  };

  // 시간 확인
  const confirmTime = () => {
    const hour24 = tempTime.period === '오후' && tempTime.hour !== '12' 
      ? (parseInt(tempTime.hour) + 12).toString()
      : tempTime.period === '오전' && tempTime.hour === '12'
      ? '0'
      : tempTime.hour;
    
    const formattedTime = `${hour24.padStart(2, '0')}:${tempTime.minute}`;
    updateGolfTime(currentTimeIndex, formattedTime);
    setIsModalOpen(false);
    // 페이지 스크롤 다시 활성화
    document.body.style.overflow = 'auto';
  };

  // 선택된 항목을 중앙으로 스크롤
  const scrollToSelected = (columnIndex) => {
    setTimeout(() => {
      const column = document.querySelector(`.time-column:nth-child(${columnIndex + 1})`);
      const selectedOption = column?.querySelector('.time-option.selected');
      if (column && selectedOption) {
        // 선택된 요소의 위치를 컬럼 중앙으로 계산
        const columnHeight = column.clientHeight;
        const optionHeight = selectedOption.offsetHeight;
        const optionOffsetTop = selectedOption.offsetTop;
        
        // 중앙에 오도록 하는 스크롤 위치 계산
        const targetScrollTop = optionOffsetTop - (columnHeight / 2) + (optionHeight / 2);
        
        console.log('스크롤 계산:', {
          columnHeight,
          optionHeight,
          optionOffsetTop,
          targetScrollTop,
          maxScrollTop: column.scrollHeight - column.clientHeight
        });
        
        // 스크롤 실행
        column.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth'
        });
        
        // 추가: 즉시 스크롤도 시도
        setTimeout(() => {
          column.scrollTop = targetScrollTop;
        }, 100);
      }
    }, 50);
  };

  return (
    <main className="main-container">
      <Header />
      
      <div className="course-step1-page">
        {/* 네비게이션 헤더 */}
        <div className="step-header">
          <div className="header-content">
            <button className="back-btn" onClick={handleBack}>
              ←
            </button>
            <h1 className="step-title">맞춤 코스 설정</h1>
          </div>
          
          {/* 진행 단계 표시 */}
          <div className="step-indicator">
            <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`}>
              <div className={`step-circle ${currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : ''}`}>1</div>
              <span className={`step-label ${currentStep >= 1 ? 'active' : ''}`}>기간 설정</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${currentStep >= 2 ? 'active' : ''}`}>
              <div className={`step-circle ${currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : ''}`}>2</div>
              <span className={`step-label ${currentStep >= 2 ? 'active' : ''}`}>스타일 설정</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`}>
              <div className={`step-circle ${currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : ''}`}>3</div>
              <span className={`step-label ${currentStep >= 3 ? 'active' : ''}`}>코스 추천</span>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="step-content">
        {/* 안내 섹션 */}
        <div className="instruction-section">
          <div className="instruction-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="40" fill="url(#paint0_linear_1003_17)"/>
              <path d="M28.9136 21V26.5309" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M35.136 21V26.5309" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M40.6667 21V26.5309" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M46.1978 21V26.5309" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M51.7285 21V26.5309" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M24.074 31.3705H55.8765" stroke="white" strokeWidth="2"/>
              <mask id="path-8-inside-1_1003_17" fill="white">
                <rect x="22" y="22.3827" width="35.9507" height="35.9507" rx="1"/>
              </mask>
              <rect x="22" y="22.3827" width="35.9507" height="35.9507" rx="1" stroke="white" strokeWidth="4" mask="url(#path-8-inside-1_1003_17)"/>
              <path d="M24.074 52.1112H48.9629M48.9629 52.1112L56.5895 45.5742C57.2944 44.97 56.8671 43.8149 55.9387 43.8149H49.9629C49.4106 43.8149 48.9629 44.2627 48.9629 44.8149V52.1112Z" stroke="white" strokeWidth="2"/>
              <defs>
                <linearGradient id="paint0_linear_1003_17" x1="14.4444" y1="11.1111" x2="64.4444" y2="71.1111" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#269962"/>
                  <stop offset="1" stopColor="#2C8C7D"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="instruction-title">여행 기간을 선택해주세요</h2>
          <p className="instruction-subtitle">여행 기간에 따라 최적의 코스를 추천해드려요</p>
        </div>

        {/* 입력 섹션들을 묶는 컨테이너 */}
        <div className="input-sections-container">
          {/* 날짜 선택 섹션 */}
          <div className="date-selection-section">
            <div className="date-grid">
              <div className="date-input-container">
                <label className="date-label">출발 날짜</label>
                <input
                  type="date"
                  className="date-input"
                  placeholder='날짜 선택'
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>
            </div>
          </div>

        {/* 골프 치는 시간 섹션 */}
          <div className="golf-time-section">
            {/*<div className="section-header">*/}
            {/*  <h3 className="section-title">골프 치는 시간</h3>*/}
            {/*</div>*/}
            <p>골프 치는 시간</p>
            {golfTimes.map((time, index) => (
                <>
                <div key={index} className="golf-time-input">
                  {/*<div className="golf-time-label">*/}
                  {/*  {selectedPeriod === 'day' ? '골프 시간' : `${index + 1}일차`}*/}
                  {/*</div>*/}
                  {time === '' ? (
                      <div
                          className="time-input time-placeholder"
                          onClick={() => openTimeModal(index)}
                      >
                        골프 치는 시간을 선택해주세요
                        <span className="clock-icon">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="9" cy="9" r="8" stroke="#999" strokeWidth="1.5"/>
                      <path d="M9 5V9L12 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round"
                            strokeLinejoin="round"/>
                    </svg>
                  </span>
                      </div>
                  ) : null}
                  {time !== '' && (
                      <div
                          className="time-input time-display"
                          onClick={() => openTimeModal(index)}
                      >
                        {time}
                        <span className="clock-icon">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="9" cy="9" r="8" stroke="#999" strokeWidth="1.5"/>
                      <path d="M9 5V9L12 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round"
                            strokeLinejoin="round"/>
                    </svg>
                  </span>
                      </div>
                  )}
                </div>
                <div style={{width: '100%', height: '1px', borderBottom:'1px dashed #595959', margin: '10px 0'}}></div>
                </>
            ))}

          </div>

          {/* 골프장 선택 섹션 */}
        <div className="golf-course-section">
          {/*<div className="section-header">*/}
          {/*  <h3 className="section-title">골프장 선택</h3>*/}
          {/*</div>*/}
          
          {golfTimes.map((time, index) => (
            <div key={index} className="golf-course-input">
              <div className="golf-course-label">
                {selectedPeriod === 'day' ? '골프장' : `${index + 1}일차 골프장`}
              </div>
              {selectedGolfCourses[index] ? (
                <div 
                  className="golf-course-display"
                  onClick={() => openGolfCourseModal(index)}
                >
                  <div className="golf-course-info">
                    <div className="golf-course-name">{selectedGolfCourses[index].name}</div>
                    <div className="golf-course-address">{selectedGolfCourses[index].address}</div>
                  </div>
                  <span className="edit-icon">
                    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.75 8.41667L9.16667 2L12.375 5.20833L5.95833 11.625H2.75V8.41667Z" stroke="#269962" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M1 14.25H15" stroke="#269962" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                </div>
              ) : (
                <div 
                  className="golf-course-placeholder"
                  onClick={() => openGolfCourseModal(index)}
                >
                  {selectedGolfCourses[index] ? (
                    <div className="golf-course-info">
                      <div className="golf-course-name">{selectedGolfCourses[index].name}</div>
                      <div className="golf-course-address">{selectedGolfCourses[index].address}</div>
                    </div>
                  ) : (
                    <>
                      골프장을 선택해주세요
                      <span className="search-icon">🔍</span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 여행기간 섹션 */}
        <div className="travel-period-section">
          <div className="section-header">
            <h3 className="section-title">여행기간</h3>
          </div>
          <div className="period-grid">
            {periodOptions.map((option) => (
              <button
                key={option.id}
                className={`period-card ${selectedPeriod === option.id ? 'selected' : ''}`}
                onClick={() => handlePeriodChange(option.id)}
              >
                <div className="period-content">
                  <div className="period-title">{option.title}</div>
                  <div className="period-subtitle">{option.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
          
        </div>
        </div>

        {/* 다음 버튼 */}
        <div className="next-button-container">
          <button 
            className={`next-btn ${isAllFieldsFilled() ? 'active' : ''}`}
            onClick={handleNext}
            disabled={!isAllFieldsFilled()}
          >
            다음
          </button>
        </div>
        </div>
      </div>
      
      {/* 시간 선택 모달 */}
      {isModalOpen && (
        <div className="time-modal-overlay" onClick={closeTimeModal}>
          <div className="time-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-clock-icon">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="17" cy="17" r="15.75" stroke="#269962" strokeWidth="2.5"/>
                  <path d="M17 10V17.3234C17 17.5038 17.0972 17.6702 17.2543 17.7589L23 21" stroke="#269962" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="modal-title">골프 치는 시간대를 알려주세요</h3>
            </div>

            <div className="time-picker">
              <div className="time-column period-column">
                {['오전', '오후'].map((period) => (
                  <div
                    key={period}
                    className={`time-option ${tempTime.period === period ? 'selected' : ''}`}
                    onClick={() => {
                      console.log('Period clicked:', period);
                      setTempTime({...tempTime, period});
                      scrollToSelected(0);
                    }}
                  >
                    {period}
                  </div>
                ))}
              </div>

              <div className="time-column">
                {Array.from({length: 12}, (_, i) => {
                  const hour = (i + 1).toString();
                  return (
                    <div
                      key={hour}
                      className={`time-option ${tempTime.hour === hour ? 'selected' : ''}`}
                      onClick={() => {
                        console.log('Hour clicked:', hour);
                        setTempTime({...tempTime, hour});
                        scrollToSelected(1);
                      }}
                    >
                      {hour}시
                    </div>
                  );
                })}
              </div>

              <div className="time-column">
                {['00', '10', '20', '30', '40', '50'].map((minute) => (
                  <div
                    key={minute}
                    className={`time-option ${tempTime.minute === minute ? 'selected' : ''}`}
                    onClick={() => {
                      console.log('Minute clicked:', minute);
                      setTempTime({...tempTime, minute});
                      scrollToSelected(2);
                    }}
                  >
                    {minute}분
                  </div>
                ))}
              </div>
            </div>

            <button className="confirm-btn" onClick={confirmTime}>
              입력
            </button>
          </div>
        </div>
      )}
      
      {/* 골프장 검색 모달 */}
      {isGolfCourseModalOpen && (
        <div className="golf-course-modal-overlay" onClick={closeGolfCourseModal}>
          <div className="golf-course-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">골프장 검색</h3>
              <button className="close-btn" onClick={closeGolfCourseModal}>×</button>
            </div>
            
            <div className="search-input-container">
              <input
                type="text"
                className="search-input"
                placeholder="골프장 이름을 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchGolfCourses(searchTerm)}
              />
              <button 
                className="search-btn"
                onClick={() => searchGolfCourses(searchTerm)}
                disabled={isSearching}
              >
                {isSearching ? '검색중...' : '검색'}
              </button>
            </div>
            
            {showSearchResults && (
              <div className="search-results">
                {golfCourseSearchResults.length > 0 ? (
                  golfCourseSearchResults.map((course, index) => (
                    <div
                      key={course.id}
                      className="golf-course-result"
                      onClick={() => selectGolfCourse(course, currentGolfCourseIndex)}
                    >
                      <div className="course-info">
                        <div className="course-name">{course.name}</div>
                        <div className="course-address">{course.address}</div>
                      </div>
                      <div className="select-btn">선택</div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">검색 결과가 없습니다.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      <Footer />
    </main>
  );
};

export default CourseStep1;
