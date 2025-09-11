import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AddScheduleModal from './AddScheduleModal.js';
import EditScheduleModal from './EditScheduleModal.js';
import { 
  getSchedules, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule,
  getCategoryCSSColor,
  transformScheduleForAPI,
  transformScheduleForAPIAlternative,
  transformScheduleFromAPI
} from './ScheduleAPI';
import { 
  getCachedWeather, 
  getWeatherIcon 
} from '../services/weatherAPI';
import { 
  isApiKeyValid, 
  getApiKeyMessage 
} from '../config/weather';
import WeatherLocationModal from '../WeatherLocationModal';
import Header from '../Layout/Header';
import ScheduleIcon from './schedule-icon.svg';
import './SchedulePage.css';

// 위치 아이콘 SVG 컴포넌트
const LocationIcon = () => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
    <circle cx="4.49997" cy="4.5" r="4.1" stroke="white" strokeWidth="0.8"/>
    <path d="M4.49997 0.5V2" stroke="white" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M4.49997 7V8.5" stroke="white" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M8.50497 4.49512L7.00497 4.49512" stroke="white" strokeWidth="0.8" strokeLinecap="round"/>
    <path d="M2.00497 4.49512L0.504974 4.49512" stroke="white" strokeWidth="0.8" strokeLinecap="round"/>
  </svg>
);

const SchedulePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜로 설정
  const [selectedDate, setSelectedDate] = useState(new Date()); // 현재 날짜를 기본 선택
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showWeatherLocationModal, setShowWeatherLocationModal] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('제주시');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    isAllDay: false,
    color: '#E70012',
    category: '',
    location: '',
    // 기존 UI 호환성을 위한 필드들
    time: '',
    date: '',
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

  // 날씨 데이터 로드
  const loadWeatherData = async (location) => {
    if (!isApiKeyValid()) {
      setWeatherError('API 키가 설정되지 않았습니다.');
      return;
    }

    setWeatherLoading(true);
    setWeatherError(null);

    try {
      // 현재 날씨와 예보를 동시에 가져오기
      const [currentWeather, forecast] = await Promise.all([
        getCachedWeather(location, 'current'),
        getCachedWeather(location, 'forecast')
      ]);

      if (currentWeather.success) {
        setWeatherData(currentWeather.data);
      } else {
        setWeatherError(currentWeather.error);
      }

      if (forecast.success) {
        setForecastData(forecast.data);
      } else {
        console.warn('예보 데이터 로드 실패:', forecast.error);
      }
    } catch (error) {
      console.error('날씨 데이터 로드 오류:', error);
      setWeatherError(error.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  // 스케줄 목록 로드
  const loadSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSchedules();
      console.log('📊 스케줄 조회 응답:', response);
      
      // CommonResponse 형식에 따라 응답 처리
      if (response.success !== false) {
        // 성공 응답인 경우
        const schedulesData = response.data || response;
        const transformedSchedules = Array.isArray(schedulesData) 
          ? schedulesData.map(transformScheduleFromAPI)
          : [transformScheduleFromAPI(schedulesData)];
        setSchedules(transformedSchedules);
      } else {
        setError(response.message || '스케줄을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('스케줄 로드 실패:', error);
      setError('일정을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // 스케줄 추가
  const handleAddSchedule = async (schedule) => {
    setLoading(true);
    setError(null);
    try {
      const apiSchedule = transformScheduleForAPI(schedule);
      const response = await createSchedule(apiSchedule);
      console.log('📝 스케줄 생성 응답:', response);
      
      if (response.success !== false) {
        const newSchedule = transformScheduleFromAPI(response.data || response);
        setSchedules(prev => [...prev, newSchedule]);
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
      } else {
        setError(response.message || '스케줄 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('스케줄 추가 실패:', error);
      setError('스케줄 추가에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 스케줄 수정
  const handleUpdateSchedule = async (updatedSchedule) => {
    if (!editingSchedule) return;
    
    setLoading(true);
    setError(null);
    try {
      const apiSchedule = transformScheduleForAPI(updatedSchedule);
      const response = await updateSchedule(editingSchedule.id, apiSchedule);
      console.log('✏️ 스케줄 수정 응답:', response);
      
      if (response.success !== false) {
        const updatedScheduleData = transformScheduleFromAPI(response.data || response);
        setSchedules(prev => prev.map(schedule => 
          schedule.id === editingSchedule.id ? updatedScheduleData : schedule
        ));
        setShowEditScheduleModal(false);
        setEditingSchedule(null);
      } else {
        setError(response.message || '스케줄 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('스케줄 수정 실패:', error);
      setError('스케줄 수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 스케줄 삭제
  const handleDeleteSchedule = async () => {
    if (!editingSchedule) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await deleteSchedule(editingSchedule.id);
      console.log('🗑️ 스케줄 삭제 응답:', response);
      
      if (response.success !== false) {
        setSchedules(prev => prev.filter(schedule => schedule.id !== editingSchedule.id));
        setShowEditScheduleModal(false);
        setEditingSchedule(null);
      } else {
        setError(response.message || '스케줄 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('스케줄 삭제 실패:', error);
      setError('스케줄 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 스케줄 편집 모달 열기
  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setShowEditScheduleModal(true);
  };

  const handleWeatherLocationChange = (location) => {
    setSelectedLocation(location);
    setShowWeatherLocationModal(false);
    loadWeatherData(location);
  };

  // 컴포넌트 마운트 시 스케줄과 날씨 데이터 로드
  useEffect(() => {
    loadSchedules();
    loadWeatherData(selectedLocation);
  }, []);

  // 위치 변경 시 날씨 데이터 다시 로드
  useEffect(() => {
    if (selectedLocation) {
      loadWeatherData(selectedLocation);
    }
  }, [selectedLocation]);

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

        {/* 에러 메시지 표시 */}
        {error && (
          <div className="error-message" style={{
            backgroundColor: '#ffebee',
            color: '#c62828',
            padding: '10px 15px',
            margin: '10px 20px',
            borderRadius: '8px',
            border: '1px solid #ffcdd2',
            fontSize: '14px'
          }}>
            {error}
            <button 
              onClick={() => setError(null)}
              style={{
                float: 'right',
                background: 'none',
                border: 'none',
                color: '#c62828',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* 로딩 표시 */}
        {loading && (
          <div className="loading-message" style={{
            textAlign: 'center',
            padding: '20px',
            color: '#666',
            fontSize: '14px'
          }}>
            로딩 중...
          </div>
        )}

      <main>
        {showWeather && (
          <>
            {/* API 키 설정 안내 */}
            {!isApiKeyValid() && (
              <section className="schedule-weather-card">
                <div className="schedule-weather-header">
                  <div className="schedule-weather-date">⚠️ API 키 설정 필요</div>
                  <div 
                    className="schedule-weather-location" 
                    onClick={() => setShowWeatherLocationModal(true)}
                    style={{ 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center',
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    <LocationIcon />
                    {selectedLocation}
                  </div>
                </div>
                <div className="schedule-weather-main">
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔑</div>
                    <div>OpenWeatherMap API 키를 설정해주세요</div>
                    <div style={{ fontSize: '12px', marginTop: '5px' }}>
                      src/config/weather.js 파일에서 API_KEY 값을 확인하세요
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 로딩 상태 */}
            {isApiKeyValid() && weatherLoading && (
              <section className="schedule-weather-card">
                <div className="schedule-weather-header">
                  <div className="schedule-weather-date">날씨 로딩 중...</div>
                  <div 
                    className="schedule-weather-location" 
                    onClick={() => setShowWeatherLocationModal(true)}
                    style={{ 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center',
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    <LocationIcon />
                    {selectedLocation}
                  </div>
                </div>
                <div className="schedule-weather-main">
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
                    <div>날씨 정보를 가져오는 중...</div>
                  </div>
                </div>
              </section>
            )}

            {/* 에러 상태 */}
            {isApiKeyValid() && weatherError && !weatherLoading && (
              <section className="schedule-weather-card">
                <div className="schedule-weather-header">
                  <div className="schedule-weather-date">❌ 날씨 오류</div>
                  <div 
                    className="schedule-weather-location" 
                    onClick={() => setShowWeatherLocationModal(true)}
                    style={{ 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center',
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    <LocationIcon />
                    {selectedLocation}
                  </div>
                </div>
                <div className="schedule-weather-main">
                  <div style={{ textAlign: 'center', padding: '20px', color: '#e74c3c' }}>
                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
                    <div>{weatherError}</div>
                    <button 
                      onClick={() => loadWeatherData(selectedLocation)}
                      style={{ 
                        marginTop: '10px', 
                        padding: '5px 10px', 
                        backgroundColor: '#3498db', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      다시 시도
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* 현재 날씨 카드 */}
            {isApiKeyValid() && weatherData && !weatherLoading && !weatherError && (
              <section className="schedule-weather-card">
                <div className="schedule-weather-header">
                  <div className="schedule-weather-date">현재 {new Date().toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}</div>
                  <div 
                    className="schedule-weather-location" 
                    onClick={() => setShowWeatherLocationModal(true)}
                    style={{ 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center',
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    <LocationIcon />
                    {selectedLocation}
                  </div>
                </div>
                
                <div className="schedule-weather-main">
                  <div className="schedule-weather-left">
                    <div className="schedule-weather-icon">{getWeatherIcon(weatherData.weather?.[0]?.icon || '01d')}</div>
                    <div>
                      <div className="schedule-weather-temp">{Math.round(weatherData.main?.temp || 0)}°</div>
                      <div className="schedule-weather-desc">{weatherData.weather?.[0]?.description || '날씨 정보 없음'}</div>
                      <div className="schedule-weather-range">최고 {Math.round(weatherData.main?.temp_max || 0)}° 최저 {Math.round(weatherData.main?.temp_min || 0)}°</div>
                    </div>
                  </div>
                  
                  <div className="schedule-weather-center">
                    <div className="schedule-weather-rain">
                      <div className="schedule-weather-rain-icon">☂️</div>
                      <div className="schedule-weather-rain-text">강수량</div>
                      <div className="schedule-weather-rain-percent">{weatherData.rain?.['1h'] || 0}%</div>
                    </div>
                  </div>
                  
                  <div className="schedule-weather-right">
                    <div className="schedule-weather-dust">미세 {weatherData.main?.humidity || 0}%</div>
                    <div className="schedule-weather-dust">습도 {weatherData.main?.humidity || 0}%</div>
                    <div className="schedule-weather-wind">
                      💨 {weatherData.wind?.speed || 0}m/s
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 일별 날씨 예보 - 실제 데이터가 있을 때만 표시 */}
            {isApiKeyValid() && forecastData && !weatherLoading && !weatherError && (
              <section className="schedule-daily-weather">
                <div className="schedule-daily-list">
                  {forecastData.slice(0, 5).map((day, index) => {
                    const date = new Date(day.date);
                    const dayNames = ['오늘', '내일', '모레', '4일 후', '5일 후'];
                    const dayName = dayNames[index] || date.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
                    
                    return (
                      <div key={index} className="schedule-daily-item">
                        <div className="schedule-daily-date">{dayName}</div>
                        <div className="schedule-daily-icon">{getWeatherIcon(day.weather?.icon || '01d')}</div>
                        <div className="schedule-daily-temps">
                          {Math.round(day.temp_max || 0)}°<br/>
                          {Math.round(day.temp_min || 0)}°
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
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
              
              console.log('📅 일정 필터링 정보:', {
                selectedDateString,
                allSchedules: schedules,
                daySchedules,
                schedulesCount: schedules.length,
                daySchedulesCount: daySchedules.length
              });
              
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
                    <button 
                      className="schedule-edit-button"
                      onClick={() => handleEditSchedule(schedule)}
                      title="일정 편집"
                    >
                      ✏️
                    </button>
                  </div>
                ))
              );
            })()}
          </div>
        </section>

      </main>
      </div>


      {showAddScheduleModal && (
        <AddScheduleModal
          onClose={() => setShowAddScheduleModal(false)}
          onAdd={handleAddSchedule}
          schedule={{
            ...newSchedule,
            startDate: newSchedule.startDate || selectedDate.toISOString().split('T')[0],
            endDate: newSchedule.endDate || selectedDate.toISOString().split('T')[0]
          }}
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

      {showEditScheduleModal && editingSchedule && (
        <EditScheduleModal
          onClose={() => {
            setShowEditScheduleModal(false);
            setEditingSchedule(null);
          }}
          onUpdate={handleUpdateSchedule}
          onDelete={handleDeleteSchedule}
          schedule={editingSchedule}
        />
      )}
    </div>
  );
};

export default SchedulePage;