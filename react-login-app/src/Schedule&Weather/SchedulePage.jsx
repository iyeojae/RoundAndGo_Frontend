import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AddScheduleModal from './AddScheduleModal.js';
import WeatherLocationModal from '../WeatherLocationModal';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import ScheduleIcon from './schedule-icon.svg';
import './SchedulePage.css';

const SchedulePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜로 설정
  const [selectedDate, setSelectedDate] = useState(new Date()); // 현재 날짜를 기본 선택
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

    // 5줄만 표시 (35일)
    for (let i = 0; i < 35; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      
      const daySchedules = schedules.filter(schedule => 
        schedule.date === date.toISOString().split('T')[0]
      );

      days.push(
        <div 
          key={i} 
          className={`schedule-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          <span className="schedule-day-number">{date.getDate()}</span>
          {daySchedules.length > 0 && (
            <div className="schedule-day-events">
              {daySchedules.slice(0, 3).map((schedule, index) => (
                <div key={index} className="schedule-event-dot" style={{ backgroundColor: schedule.color }}></div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };


  return (
    <div className="schedule-page">
      <Header />
      
      <div className="schedule-content">
        <div className="schedule-weather-toggle-container">
          <h2 className="schedule-page-title">일정관리</h2>
          <button className="schedule-weather-toggle" onClick={() => setShowWeather(!showWeather)}>
            {showWeather ? '날씨 숨기기' : '날씨 보기'}
          </button>
        </div>

      <main>
        {showWeather && (
          <>
            {/* 현재 날씨 카드 */}
            <section className="schedule-weather-card">
              <div className="schedule-weather-header">
                <div className="schedule-weather-date">현재 08.27</div>
                <div className="schedule-weather-location">
                  📍 제주시 아라동
                </div>
              </div>
              
              <div className="schedule-weather-main">
                <div className="schedule-weather-left">
                  <div className="schedule-weather-icon">⛅</div>
                  <div>
                    <div className="schedule-weather-temp">20°</div>
                    <div className="schedule-weather-desc">구름</div>
                    <div className="schedule-weather-range">최고 20° 최저 17°</div>
                  </div>
                </div>
                
                <div className="schedule-weather-center">
                  <div className="schedule-weather-rain">
                    <div className="schedule-weather-rain-icon">☂️</div>
                    <div className="schedule-weather-rain-text">강수량</div>
                    <div className="schedule-weather-rain-percent">20%</div>
                  </div>
                </div>
                
                <div className="schedule-weather-right">
                  <div className="schedule-weather-dust">미세 좋음</div>
                  <div className="schedule-weather-dust">초미세 나쁨</div>
                  <div className="schedule-weather-wind">
                    💨 돌풍 2.1m/s
                  </div>
                </div>
              </div>
            </section>

            {/* 일별 날씨 예보 */}
            <section className="schedule-daily-weather">
              <div className="schedule-daily-list">
                <div className="schedule-daily-item">
                  <div className="schedule-daily-date">오늘</div>
                  <div className="schedule-daily-icon">⛅</div>
                  <div className="schedule-daily-temps">20°<br/>17°</div>
                </div>
                <div className="schedule-daily-item">
                  <div className="schedule-daily-date">내일</div>
                  <div className="schedule-daily-icon">🌤️</div>
                  <div className="schedule-daily-temps">21°<br/>18°</div>
                </div>
                <div className="schedule-daily-item">
                  <div className="schedule-daily-date">29일</div>
                  <div className="schedule-daily-icon">⛈️</div>
                  <div className="schedule-daily-temps">19°<br/>15°</div>
                </div>
                <div className="schedule-daily-item">
                  <div className="schedule-daily-date">30일</div>
                  <div className="schedule-daily-icon">🌧️</div>
                  <div className="schedule-daily-temps">20°<br/>15°</div>
                </div>
                <div className="schedule-daily-item">
                  <div className="schedule-daily-date">31일</div>
                  <div className="schedule-daily-icon">💨</div>
                  <div className="schedule-daily-temps">20°<br/>17°</div>
                </div>
              </div>
            </section>
          </>
        )}

        <section className="schedule-calendar-section">
          <div className="schedule-calendar-header">
            <button className="schedule-month-button" onClick={goToPreviousMonth}>‹</button>
            <h2 className="schedule-month-title">
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
            </h2>
            <button className="schedule-month-button" onClick={goToNextMonth}>›</button>
          </div>

          <div className="schedule-calendar-grid">
            <div className="schedule-weekday-header">
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <div key={day} className={`schedule-weekday ${index === 0 || index === 6 ? 'weekend' : ''}`}>
                  {day}
                </div>
              ))}
            </div>

            <div className="schedule-days-grid">
              {renderCalendarDays()}
            </div>
          </div>
        </section>


        <section className="schedule-section">
          <div className="schedule-section-header">
            <div>
              <h3 className="schedule-section-title">
                {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
              </h3>
              <p className="schedule-count">
                총 {schedules.filter(schedule => schedule.date === selectedDate.toISOString().split('T')[0]).length}개의 일정
              </p>
            </div>
            <button className="schedule-add-button" onClick={() => setShowAddScheduleModal(true)}>
              +
            </button>
          </div>

          <div className="schedule-list">
            {(() => {
              const selectedDateString = selectedDate.toISOString().split('T')[0];
              const daySchedules = schedules.filter(schedule => schedule.date === selectedDateString);
              
              return daySchedules.length === 0 ? (
                <div className="schedule-empty">
                  <div className="schedule-empty-icon">
                    <img src={ScheduleIcon} alt="일정 없음" />
                  </div>
                  <div className="schedule-empty-content">
                    <div className="schedule-empty-text">등록된 일정이 없습니다</div>
                    <div className="schedule-empty-hint">우측상단 + 버튼으로 일정을 추가해보세요</div>
                  </div>
                </div>
              ) : (
                daySchedules.map((schedule) => (
                  <div key={schedule.id} className="schedule-item" style={{ borderLeftColor: schedule.color }}>
                    <p className="schedule-item-time">{schedule.time}</p>
                    <div className="schedule-item-content">
                      <h4 className="schedule-item-title">{schedule.title}</h4>
                      <div className="schedule-item-details">
                        <p className="schedule-item-detail">카테고리: {schedule.category}</p>
                        {schedule.location && (
                          <p className="schedule-item-detail">위치: {schedule.location}</p>
                        )}
                        {schedule.attendees && (
                          <p className="schedule-item-detail">참석자: {schedule.attendees}</p>
                        )}
                        <p className="schedule-item-detail">알림: {schedule.reminder}</p>
                      </div>
                    </div>
                  </div>
                ))
              );
            })()}
          </div>
        </section>

      </main>
      </div>

      <Footer />

      {showAddScheduleModal && (
        <AddScheduleModal
          onClose={() => setShowAddScheduleModal(false)}
          onAdd={handleAddSchedule}
          schedule={newSchedule}
          setSchedule={setNewSchedule}
          selectedDate={selectedDate}
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