import React, { useState, useEffect } from 'react';
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
    }
  ]);

  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showWeatherLocationModal, setShowWeatherLocationModal] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('제주도');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    time: '',
    date: '',
    category: '',
    location: '',
    attendees: '',
    reminder: '1시간 전'
  });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddSchedule = (schedule) => {
    const newId = Math.max(...schedules.map(s => s.id)) + 1;
    const newScheduleWithId = {
      ...schedule,
      id: newId,
      dayOfWeek: ['일', '월', '화', '수', '목', '금', '토'][new Date(schedule.date).getDay()]
    };
    setSchedules([...schedules, newScheduleWithId]);
    setShowAddScheduleModal(false);
  };

  const handleWeatherLocationChange = (location) => {
    setSelectedLocation(location);
    setShowWeatherLocationModal(false);
    fetchWeatherData(location);
  };

  const fetchWeatherData = async (location) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        setShowWeather(true);
      }
    } catch (error) {
      console.error('날씨 데이터 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      
      const daySchedules = schedules.filter(schedule => 
        schedule.date === date.toISOString().split('T')[0]
      );

      days.push(
        <div key={i} onClick={() => handleDateClick(date)}>
          <span>{date.getDate()}</span>
          {daySchedules.length > 0 && (
            <div>
              {daySchedules.slice(0, 3).map((schedule, index) => (
                <div key={index} style={{ backgroundColor: schedule.color }}></div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollHint(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <header>
        <div>
          <img src="/images/logo-280a0a.png" alt="RoundAndGo Logo" />
          <h1>RoundAndGo</h1>
        </div>
        <nav>
          <button onClick={() => navigate('/')}>홈</button>
          <button>일정관리</button>
          <button onClick={() => navigate('/weather')}>날씨</button>
        </nav>
      </header>

      <main>
        <section>
          <div>
            <button onClick={goToPreviousMonth}>‹</button>
            <h2>
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </h2>
            <button onClick={goToNextMonth}>›</button>
          </div>

          <div>
            <div>
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <div key={day}>
                  {day}
                </div>
              ))}
            </div>

            <div>
              {renderCalendarDays()}
            </div>
          </div>
        </section>

        {showWeather && (
          <section>
            <div>
              <h3>날씨 정보</h3>
              <p>{selectedLocation}</p>
            </div>

            {loading ? (
              <p>날씨 정보를 불러오는 중...</p>
            ) : weatherData ? (
              <div>
                <div>
                  {getWeatherIcon(weatherData.weather[0].icon)}
                </div>
                <div>
                  <p>{Math.round(weatherData.main.temp)}°C</p>
                  <p>{weatherData.weather[0].description}</p>
                  <p>습도: {weatherData.main.humidity}%</p>
                  <p>풍속: {weatherData.wind.speed}m/s</p>
                </div>
              </div>
            ) : (
              <p>날씨 정보를 불러올 수 없습니다.</p>
            )}
          </section>
        )}

        <section>
          <div>
            <h3>예정된 일정</h3>
            <p>{schedules.length}개의 일정</p>
          </div>

          <div>
            {schedules.map((schedule) => (
              <div key={schedule.id}>
                <p>{schedule.time}</p>
                <div>
                  <h4>{schedule.title}</h4>
                  <div>
                    <p>카테고리: {schedule.category}</p>
                    {schedule.location && (
                      <p>위치: {schedule.location}</p>
                    )}
                    {schedule.attendees && (
                      <p>참석자: {schedule.attendees}</p>
                    )}
                    <p>알림: {schedule.reminder}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {showScrollHint && (
          <div>
            <p>아래로 스크롤하여 더 많은 정보를 확인하세요</p>
            <span>↓</span>
          </div>
        )}
      </main>

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
    </div>
  );
};

export default SchedulePage;