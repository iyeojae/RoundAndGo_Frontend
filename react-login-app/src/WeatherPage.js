import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import WeatherLocationModal from './WeatherLocationModal';

const WeatherPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('제주시 아라동');
  const [showWeatherLocationModal, setShowWeatherLocationModal] = useState(false);
  const [currentDate] = useState(new Date(2025, 4, 1)); // 5월로 설정

  // JejuLocationPage에서 선택된 지역 정보 처리
  useEffect(() => {
    if (location.state?.selectedLocation) {
      console.log('새로운 지역 선택됨:', location.state.selectedLocation);
      setSelectedLocation(location.state.selectedLocation);
      fetchWeatherData(location.state.selectedLocation);
    }
  }, [location.state]);

  // 컴포넌트 마운트 시 초기 날씨 데이터 로드
  useEffect(() => {
    fetchWeatherData(selectedLocation);
  }, []);

  const fetchWeatherData = async (location) => {
    setLoading(true);
    try {
      const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
      if (!apiKey) {
        console.error('OpenWeatherMap API 키가 설정되지 않았습니다.');
        setLoading(false);
        return;
      }

      // 현재 날씨 데이터
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location},KR&appid=${apiKey}&units=metric&lang=kr`
      );

      if (!currentResponse.ok) {
        throw new Error('현재 날씨 데이터를 가져올 수 없습니다.');
      }

      const currentData = await currentResponse.json();

      // 5일 예보 데이터
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location},KR&appid=${apiKey}&units=metric&lang=kr`
      );

      if (!forecastResponse.ok) {
        throw new Error('예보 데이터를 가져올 수 없습니다.');
      }

      const forecastData = await forecastResponse.json();

      setWeatherData(currentData);
      setForecastData(forecastData);
    } catch (error) {
      console.error('날씨 데이터 로드 실패:', error);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const openWeatherLocationModal = () => {
    setShowWeatherLocationModal(true);
  };

  const handleWeatherLocationChange = (newLocation) => {
    setSelectedLocation(newLocation);
    fetchWeatherData(newLocation);
    setShowWeatherLocationModal(false);
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

  const getHourlyForecast = () => {
    if (!forecastData) return [];

    const now = new Date();
    const hourlyData = [];

    // 현재 시간부터 10시간 후까지의 데이터 추출
    for (let i = 0; i < 10; i++) {
      const targetTime = new Date(now.getTime() + i * 60 * 60 * 1000);
      const forecastItem = forecastData.list.find(item => {
        const itemTime = new Date(item.dt * 1000);
        return itemTime.getHours() === targetTime.getHours() &&
               itemTime.getDate() === targetTime.getDate();
      });

      if (forecastItem) {
        hourlyData.push({
          time: targetTime.getHours() + '시',
          temp: Math.round(forecastItem.main.temp),
          icon: forecastItem.weather[0].icon,
          description: forecastItem.weather[0].description
        });
      }
    }

    return hourlyData;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    });
  };

  const hourlyForecast = getHourlyForecast();

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
          <NavButton onClick={() => navigate('/schedule')}>일정</NavButton>
        </NavSection>
      </Header>

      <MainContent>
        {/* 현재 날씨 섹션 */}
        <CurrentWeatherSection>
          <WeatherHeader>
            <WeatherInfo>
              <WeatherIcon>
                {weatherData ? getWeatherIcon(weatherData.weather[0].icon) : '🌤️'}
              </WeatherIcon>
              <WeatherTemp>
                {weatherData ? Math.round(weatherData.main.temp) : 20}°
              </WeatherTemp>
            </WeatherInfo>
            <WeatherDetails>
              <WeatherLocation>{selectedLocation}</WeatherLocation>
              <WeatherDate>현재 {formatDate(new Date())}</WeatherDate>
              <WeatherDescription>
                {weatherData ? weatherData.weather[0].description : '구름'}
              </WeatherDescription>
            </WeatherDetails>
          </WeatherHeader>

          <WeatherStats>
            <StatItem>
              <StatLabel>최고</StatLabel>
              <StatValue high>
                {weatherData ? Math.round(weatherData.main.temp_max) : 20}°
              </StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>최저</StatLabel>
              <StatValue low>
                {weatherData ? Math.round(weatherData.main.temp_min) : 17}°
              </StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>습도</StatLabel>
              <StatValue>
                {weatherData ? weatherData.main.humidity : 65}%
              </StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>풍속</StatLabel>
              <StatValue>
                {weatherData ? weatherData.wind.speed : 2.1} m/s
              </StatValue>
            </StatItem>
          </WeatherStats>
        </CurrentWeatherSection>

        {/* 시간별 예보 섹션 */}
        <HourlyForecastSection>
          <SectionTitle>시간별 일기예보</SectionTitle>
          <HourlyGrid>
            {hourlyForecast.map((forecast, index) => (
              <HourlyItem key={index}>
                <HourlyTime>{forecast.time}</HourlyTime>
                <HourlyIcon>{getWeatherIcon(forecast.icon)}</HourlyIcon>
                <HourlyTemp>{forecast.temp}°</HourlyTemp>
              </HourlyItem>
            ))}
          </HourlyGrid>
        </HourlyForecastSection>

        {/* 주간 예보 섹션 */}
        <WeeklyForecastSection>
          <WeeklyHeader>
            <WeeklyTitle>주간예보</WeeklyTitle>
            <CalendarButton onClick={() => navigate('/schedule')}>
              달력보기
            </CalendarButton>
          </WeeklyHeader>

          <CalendarPreview>
            <CalendarMonth>5월</CalendarMonth>
            <CalendarDays>
              {[6, 7, 8, 16, 17].map((day, index) => (
                <CalendarDay key={index} hasSchedule>
                  {day}
                </CalendarDay>
              ))}
            </CalendarDays>
          </CalendarPreview>
        </WeeklyForecastSection>

        {/* 액션 버튼들 */}
        <ActionButtons>
          <ActionButton onClick={openWeatherLocationModal}>
            지역 변경
          </ActionButton>
          <ActionButton onClick={() => navigate('/schedule')}>
            일정으로 이동
          </ActionButton>
        </ActionButtons>
      </MainContent>

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

const CurrentWeatherSection = styled.section`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
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
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const WeatherInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const WeatherIcon = styled.div`
  font-size: 4rem;
`;

const WeatherTemp = styled.div`
  font-size: 3rem;
  font-weight: bold;
`;

const WeatherDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: right;
`;

const WeatherLocation = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
`;

const WeatherDate = styled.span`
  font-size: 1rem;
  opacity: 0.8;
`;

const WeatherDescription = styled.span`
  font-size: 1.1rem;
  text-transform: capitalize;
`;

const WeatherStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const StatLabel = styled.span`
  font-size: 0.8rem;
  opacity: 0.8;
`;

const StatValue = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => {
    if (props.high) return '#DD4245';
    if (props.low) return '#146FD6';
    return 'white';
  }};
`;

const HourlyForecastSection = styled.section`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 0 1.5rem 0;
  text-align: center;
  opacity: 0.8;
`;

const HourlyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 1rem;
  max-width: 100%;
  overflow-x: auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const HourlyItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const HourlyTime = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
`;

const HourlyIcon = styled.div`
  font-size: 1.5rem;
`;

const HourlyTemp = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;

const WeeklyForecastSection = styled.section`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const WeeklyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const WeeklyTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
`;

const CalendarButton = styled.button`
  background: #269962;
  border: 1px solid #FFFFFF;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  font-weight: bold;
  box-shadow: 0px 0px 5px rgba(18, 72, 46, 0.7);

  &:hover {
    background: #2C8C7D;
    transform: translateY(-2px);
  }
`;

const CalendarPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const CalendarMonth = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 0px 0px 4px rgba(18, 72, 46, 0.7);
`;

const CalendarDays = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const CalendarDay = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${props => props.hasSchedule ? '#FFFFFF' : 'transparent'};
  border: 2px solid ${props => props.hasSchedule ? '#2C8C7D' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.hasSchedule ? '#2C8C7D' : '#FFFFFF'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;

  @media (max-width: 480px) {
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

export default WeatherPage;