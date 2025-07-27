import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import AddScheduleModal from './AddScheduleModal';
import WeatherLocationModal from './WeatherLocationModal';

const SchedulePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 1)); // 5월로 설정
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 4, 6)); // 5월 6일 선택
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      title: '골프장 투어',
      time: '하루종일',
      date: '2025-05-06',
      color: '#E70012',
      dayOfWeek: '화',
      category: '여행',
      location: '제주골프장',
      attendees: '개인',
      reminder: '1시간 전'
    },
    {
      id: 2,
      title: '점심약속',
      time: '12:00~14:00',
      date: '2025-05-07',
      color: '#7D308E',
      dayOfWeek: '수',
      category: '식사',
      location: '제주맛집',
      attendees: '친구들',
      reminder: '30분 전'
    },
    {
      id: 3,
      title: '저녁약속',
      time: '18:00~20:00',
      date: '2025-05-08',
      color: '#FFE009',
      dayOfWeek: '목',
      category: '식사',
      location: '레스토랑',
      attendees: '가족',
      reminder: '1시간 전'
    },
    {
      id: 4,
      title: '골프장 투어',
      time: '하루종일',
      date: '2025-05-11',
      color: '#E70012',
      dayOfWeek: '일',
      category: '여행',
      location: '제주골프장',
      attendees: '개인',
      reminder: '1시간 전'
    },
    {
      id: 5,
      title: '골프장 투어',
      time: '하루종일',
      date: '2025-05-16',
      color: '#E70012',
      dayOfWeek: '금',
      category: '여행',
      location: '제주골프장',
      attendees: '개인',
      reminder: '1시간 전'
    },
    {
      id: 6,
      title: '점심냠냠',
      time: '12:00~14:00',
      date: '2025-05-17',
      color: '#00A0EA',
      dayOfWeek: '토',
      category: '식사',
      location: '맛집',
      attendees: '친구들',
      reminder: '30분 전'
    },
    {
      id: 7,
      title: '어쩌구골프장 투어',
      time: '하루종일',
      date: '2025-05-18',
      color: '#EB6100',
      dayOfWeek: '일',
      category: '여행',
      location: '골프장',
      attendees: '개인',
      reminder: '1시간 전'
    },
    {
      id: 8,
      title: '점심냠냠',
      time: '12:00~14:00',
      date: '2025-05-25',
      color: '#079A3F',
      dayOfWeek: '일',
      category: '식사',
      location: '맛집',
      attendees: '친구들',
      reminder: '30분 전'
    }
  ]);
  const [showWeather, setShowWeather] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('제주시 아라동');
  const [showWeatherLocationModal, setShowWeatherLocationModal] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    isAllDay: false,
    color: '#E70012'
  });

  // JejuLocationPage에서 선택된 지역 정보 처리
  useEffect(() => {
    if (location.state?.selectedLocation) {
      console.log('새로운 지역 선택됨:', location.state.selectedLocation);
      setSelectedLocation(location.state.selectedLocation);
      fetchWeatherData(location.state.selectedLocation);

      // 날씨 섹션을 바로 보여주기
      if (location.state.showWeather) {
        setShowWeather(true);
      }
    } else if (location.state?.showWeather) {
      // 뒤로가기 시에도 날씨 섹션 표시
      setShowWeather(true);
    }
  }, [location.state]);

  // 컴포넌트 마운트 시 초기 날씨 데이터 로드
  useEffect(() => {
    fetchWeatherData(selectedLocation);
  }, []);

  // 브라우저 뒤로가기/앞으로가기 처리
  useEffect(() => {
    const handlePopState = (event) => {
      // 뒤로가기 시 날씨 섹션 유지
      if (event.state && event.state.showWeather) {
        setShowWeather(true);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 스크롤이 페이지 하단에 가까워지면 힌트 숨김
      if (scrollTop + windowHeight >= documentHeight - 100) {
        setShowScrollHint(false);
      } else {
        setShowScrollHint(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDaysArray = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getSchedulesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedules.filter(schedule => schedule.date === dateStr);
  };

  const hasScheduleOnDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedules.some(schedule => schedule.date === dateStr);
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const toggleWeather = () => {
    setShowWeather(!showWeather);
  };

  const openWeatherLocationModal = () => {
    setShowWeatherLocationModal(true);
  };

  const handleWeatherLocationChange = (newLocation) => {
    setSelectedLocation(newLocation);
    fetchWeatherData(newLocation);
    setShowWeatherLocationModal(false);
  };

  const handleAddSchedule = (scheduleData) => {
    const newSchedule = {
      id: Date.now(),
      title: scheduleData.title,
      time: scheduleData.isAllDay ? '하루종일' : `${scheduleData.startTime}~${scheduleData.endTime}`,
      date: scheduleData.startDate,
      color: scheduleData.color,
      dayOfWeek: new Date(scheduleData.startDate).toLocaleDateString('ko-KR', { weekday: 'short' }),
      category: '일정',
      location: '',
      attendees: '',
      reminder: '1시간 전'
    };

    setSchedules([...schedules, newSchedule]);
    setShowAddScheduleModal(false);
    setNewSchedule({
      title: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      isAllDay: false,
      color: '#E70012'
    });
  };

  const fetchWeatherData = async (location) => {
    setLoading(true);
    try {
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
      if (!apiKey) {
        console.error('OpenWeatherMap API 키가 설정되지 않았습니다.');
        setLoading(false);
        return;
      }

      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location},KR&appid=${apiKey}&units=metric&lang=kr`);
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
      } else {
        console.error('날씨 데이터를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('날씨 API 호출 중 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWeatherIcon = (weatherCode) => {
    const weatherIcons = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️'
    };
    return weatherIcons[weatherCode] || '🌤️';
  };

  const days = getDaysArray();
  const selectedSchedules = getSchedulesForDate(selectedDate);

  return (
    <Container>
      <Header>
        <LogoSection>
          <Logo src="/images/logo-280a0a.png" alt="Logo" />
          <LogoText>ROUND & GO</LogoText>
        </LogoSection>
        <NavSection>
          <NavButton onClick={() => navigate('/')}>홈</NavButton>
          <NavButton onClick={() => navigate('/jeju-location')}>지역선택</NavButton>
          <NavButton active>일정</NavButton>
        </NavSection>
      </Header>

      <MainContent>
        <CalendarSection>
          <CalendarHeader>
            <MonthButton onClick={prevMonth}>&lt;</MonthButton>
            <MonthTitle>
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </MonthTitle>
            <MonthButton onClick={nextMonth}>&gt;</MonthButton>
          </CalendarHeader>

          <CalendarGrid>
            <WeekdayHeader>
              <Weekday>일</Weekday>
              <Weekday>월</Weekday>
              <Weekday>화</Weekday>
              <Weekday>수</Weekday>
              <Weekday>목</Weekday>
              <Weekday>금</Weekday>
              <Weekday>토</Weekday>
            </WeekdayHeader>

            <DaysGrid>
              {days.map((day, index) => {
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = day.toDateString() === new Date().toDateString();
                const isSelected = day.toDateString() === selectedDate.toDateString();
                const hasSchedule = hasScheduleOnDate(day);

                return (
                  <DayCell
                    key={index}
                    isCurrentMonth={isCurrentMonth}
                    isToday={isToday}
                    isSelected={isSelected}
                    hasSchedule={hasSchedule}
                    onClick={() => handleDateClick(day)}
                  >
                    <DayNumber
                      isCurrentMonth={isCurrentMonth}
                      isToday={isToday}
                      isSelected={isSelected}
                      hasSchedule={hasSchedule}
                    >
                      {day.getDate()}
                    </DayNumber>
                    {hasSchedule && (
                      <ScheduleIndicator />
                    )}
                  </DayCell>
                );
              })}
            </DaysGrid>
          </CalendarGrid>

          <CalendarActions>
            <ActionButton onClick={() => setShowAddScheduleModal(true)}>
              일정 추가
            </ActionButton>
            <ActionButton onClick={() => navigate('/weather')}>
              날씨 페이지로
            </ActionButton>
            <ActionButton onClick={openWeatherLocationModal}>
              지역 변경
            </ActionButton>
          </CalendarActions>
        </CalendarSection>

        {showWeather && (
          <WeatherSection>
            <WeatherHeader>
              <WeatherTitle>날씨 정보</WeatherTitle>
              <WeatherLocation>{selectedLocation}</WeatherLocation>
            </WeatherHeader>

            {loading ? (
              <WeatherLoading>날씨 정보를 불러오는 중...</WeatherLoading>
            ) : weatherData ? (
              <WeatherInfo>
                <WeatherIcon>
                  {getWeatherIcon(weatherData.weather[0].icon)}
                </WeatherIcon>
                <WeatherDetails>
                  <WeatherTemp>{Math.round(weatherData.main.temp)}°C</WeatherTemp>
                  <WeatherDescription>
                    {weatherData.weather[0].description}
                  </WeatherDescription>
                  <WeatherHumidity>습도: {weatherData.main.humidity}%</WeatherHumidity>
                  <WeatherWind>풍속: {weatherData.wind.speed}m/s</WeatherWind>
                </WeatherDetails>
              </WeatherInfo>
            ) : (
              <WeatherError>날씨 정보를 불러올 수 없습니다.</WeatherError>
            )}
          </WeatherSection>
        )}

        <ScheduleSection>
          <ScheduleHeader>
            <ScheduleTitle>예정된 일정</ScheduleTitle>
            <ScheduleCount>
              {schedules.length}개의 일정
            </ScheduleCount>
          </ScheduleHeader>

          <ScheduleList>
            {schedules.map((schedule) => (
              <ScheduleItem key={schedule.id} color={schedule.color}>
                <ScheduleTime>{schedule.time}</ScheduleTime>
                <ScheduleContent>
                  <ScheduleTitleText>{schedule.title}</ScheduleTitleText>
                  <ScheduleDetails>
                    <ScheduleDetail>카테고리: {schedule.category}</ScheduleDetail>
                    {schedule.location && (
                      <ScheduleDetail>위치: {schedule.location}</ScheduleDetail>
                    )}
                    {schedule.attendees && (
                      <ScheduleDetail>참석자: {schedule.attendees}</ScheduleDetail>
                    )}
                    <ScheduleDetail>알림: {schedule.reminder}</ScheduleDetail>
                  </ScheduleDetails>
                </ScheduleContent>
                <ScheduleDots>
                  <Dot />
                  <Dot />
                  <Dot />
                  <Dot />
                </ScheduleDots>
              </ScheduleItem>
            ))}
          </ScheduleList>
        </ScheduleSection>

        {showScrollHint && (
          <ScrollHint>
            <ScrollHintText>아래로 스크롤하여 더 많은 정보를 확인하세요</ScrollHintText>
            <ScrollHintArrow>↓</ScrollHintArrow>
          </ScrollHint>
        )}
      </MainContent>

      {showAddScheduleModal && (
        <AddScheduleModal
          onClose={() => setShowAddScheduleModal(false)}
          onAdd={handleAddSchedule}
          schedule={newSchedule}
          setSchedule={setNewSchedule}
        />
      )}

      {showWeatherLocationModal && (
        <WeatherLocationModal
          onClose={() => setShowWeatherLocationModal(false)}
          onLocationChange={handleWeatherLocationChange}
          currentLocation={selectedLocation}
        />
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(135deg, #269962 0%, #2C8C7D 100%);
  color: white;
  font-family: 'Arial', sans-serif;
  overflow: auto;
  padding-bottom: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
`;

const LogoText = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

const NavSection = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const MainContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 110px);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CalendarSection = styled.section`
  background: linear-gradient(135deg, #269962 0%, #2C8C7D 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MonthButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }
`;

const MonthTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
`;

const CalendarGrid = styled.div`
  margin-bottom: 2rem;
`;

const WeekdayHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Weekday = styled.div`
  text-align: center;
  font-weight: bold;
  padding: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const DayCell = styled.div`
  position: relative;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
  background: ${props => {
    if (props.isSelected) return '#2C8C7D';
    if (props.hasSchedule) return '#FFFFFF';
    if (props.isToday) return '#FFFFFF';
    return 'transparent';
  }};
  border: 2px solid ${props => {
    if (props.isSelected) return '#FFFFFF';
    if (props.hasSchedule) return '#2C8C7D';
    if (props.isToday) return '#2C8C7D';
    return 'transparent';
  }};

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const DayNumber = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: ${props => {
    if (props.isSelected) return '#FFFFFF';
    if (props.hasSchedule) return '#2C8C7D';
    return '#FFFFFF';
  }};
  opacity: ${props => props.isCurrentMonth ? 1 : 0.3};
`;

const ScheduleIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  width: 6px;
  height: 6px;
  background: #FFFFFF;
  border-radius: 50%;
  box-shadow: 0px 0px 4px rgba(255, 255, 255, 0.5);
`;

const CalendarActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const WeatherSection = styled.section`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const WeatherHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const WeatherTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

const WeatherLocation = styled.span`
  font-size: 1rem;
  opacity: 0.8;
`;

const WeatherLoading = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
`;

const WeatherInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const WeatherIcon = styled.div`
  font-size: 4rem;
`;

const WeatherDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const WeatherTemp = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
`;

const WeatherDescription = styled.div`
  font-size: 1.2rem;
  text-transform: capitalize;
`;

const WeatherHumidity = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const WeatherWind = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const WeatherError = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ff6b6b;
  font-size: 1.1rem;
`;

const ScheduleSection = styled.section`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ScheduleTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
`;

const ScheduleCount = styled.span`
  font-size: 1rem;
  opacity: 0.8;
`;

const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ScheduleItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-left: 4px solid ${props => props.color};
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(5px);
  }
`;

const ScheduleTime = styled.div`
  background: ${props => props.color};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  white-space: nowrap;
`;

const ScheduleContent = styled.div`
  flex: 1;
`;

const ScheduleTitleText = styled.h4`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
`;

const ScheduleDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ScheduleDetail = styled.span`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ScheduleDots = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
`;

const Dot = styled.div`
  width: 4px;
  height: 4px;
  background: #FFFFFF;
  border-radius: 50%;
`;

const ScrollHint = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: bounce 2s infinite;
  z-index: 1000;

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const ScrollHintText = styled.span`
  font-size: 0.8rem;
  white-space: nowrap;
`;

const ScrollHintArrow = styled.span`
  font-size: 1.2rem;
  animation: pulse 1.5s infinite;
`;

export default SchedulePage;