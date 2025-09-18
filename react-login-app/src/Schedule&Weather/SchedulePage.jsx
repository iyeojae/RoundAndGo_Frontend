import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AddScheduleModal from './AddScheduleModal.js';
import EditScheduleModal from './EditScheduleModal.js';
import ScheduleIcon from './schedule-icon.svg';
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
  // getWeatherIcon
} from '../services/weatherAPI';
import { 
  isApiKeyValid, 
  getApiKeyMessage 
} from '../config/weather';
import WeatherLocationModal from '../WeatherLocationModal';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import './SchedulePage.css';


import sun from '../services/img/sun.svg';
import snow from '../services/img/snow.svg';
import suncloud from '../services/img/sunandcloud.svg';
import cloud from '../services/img/cloud.svg';
import rain from '../services/img/rain.svg';
import thunder from '../services/img/thunder.svg';
import wind from '../services/img/wind.svg';
import moon from '../services/img/moon.svg';
import umbrella from '../services/img/umbrella.svg';

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
        
        console.log('📊 스케줄 로드 완료 - 카테고리 정보 확인:', {
          totalSchedules: transformedSchedules.length,
          categories: transformedSchedules.map(s => ({
            id: s.id,
            title: s.title,
            category: s.category,
            type: s.type
          }))
        });
        
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

  // URL 파라미터로 새로고침 트리거 (코스 저장 후 스케줄 페이지 이동 시)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const refresh = urlParams.get('refresh');
    if (refresh === 'true') {
      console.log('🔄 코스 저장 후 스케줄 새로고침');
      loadSchedules();
      // URL에서 refresh 파라미터 제거
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.search]);

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

  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      '01d': sun,
      '01n': moon,
      '02d': suncloud,
      '02n': cloud,
      '03d': cloud,
      '03n': cloud,
      '04d': cloud,
      '04n': cloud,
      '09d': rain,
      '09n': rain,
      '10d': rain,
      '10n': rain,
      '11d': thunder,
      '11n': thunder,
      '13d': snow,
      '13n': snow,
      '50d': wind,
      '50n': wind,
    };
    return iconMap[iconCode] || cloud;
  };


  return (
    <div>
      <Header />
      <div className="schedule-page">
        <div className="schedule-content">
          <div className="schedule-weather-toggle-container">
            <div style={{width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <h2 className="schedule-page-title">일정 관리</h2>
              <button className="schedule-weather-toggle" onClick={() => setShowWeather(!showWeather)}>
                {showWeather ? '날씨 숨기기' : '날씨 보기'}
              </button>
            </div>
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

                  <div className='weather-entire-container'>
                    {/* 현재 날씨 카드 */}
                    {isApiKeyValid() && weatherData && !weatherLoading && !weatherError && (
                        <section className="schedule-weather-card">
                          <div className="schedule-weather-header">
                            <div className="schedule-weather-date">현재 {new Date().toLocaleDateString('ko-KR', {
                              month: '2-digit',
                              day: '2-digit'
                            })}</div>
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
                              <LocationIcon/>
                              <p>{selectedLocation}</p>
                            </div>
                          </div>

                          <div className="schedule-weather-main">
                            <div className="schedule-weather-left">
                              <div id='wlrow'>
                                <div className="schedule-weather-icon"><img
                                    src={getWeatherIcon(weatherData.weather?.[0]?.icon || '01d')}
                                    alt="날씨 아이콘"
                                    style={{width: '48px', height: '48px'}}
                                /></div>
                                <div style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}>
                                  <div className="schedule-weather-temp">{Math.round(weatherData.main?.temp || 0)}°
                                  </div>
                                  <div
                                      className="schedule-weather-desc">{weatherData.weather?.[0]?.description || '날씨 정보 없음'}</div>
                                </div>
                              </div>
                              <div className="schedule-weather-range">최고 <span style={{
                                fontSize: '12px',
                                fontWeight: 'bolder',
                                color: '#DD4245',
                                letterSpacing: '1px'
                              }}>{Math.round(weatherData.main?.temp_max || 0)}°</span> 최저 <span style={{
                                fontSize: '12px',
                                fontWeight: 'bolder',
                                color: '#146FD6',
                                letterSpacing: '1px'
                              }}>{Math.round(weatherData.main?.temp_min || 0)}°</span></div>
                            </div>

                            <div className="schedule-weather-center">
                              <div className="schedule-weather-rain">
                                <div className="schedule-weather-rain-icon"><img src={umbrella} alt='강수량'/></div>
                                <div className="schedule-weather-rain-text">강수량</div>
                                <div className="schedule-weather-rain-percent">{weatherData.rain?.['1h'] || 0}%</div>
                              </div>
                            </div>

                            <div className="schedule-weather-right">
                              <div className="schedule-weather-dust">미세 <p style={{
                                color: '#146FD6',
                                fontWeight: 'bold',
                                margin: 0
                              }}>{weatherData.main?.humidity || 0}%</p></div>
                              <div className="schedule-weather-dust">습도 <p style={{
                                color: '#DD4245',
                                fontWeight: 'bold',
                                margin: 0
                              }}>{weatherData.main?.humidity || 0}%</p></div>
                              <span></span>
                              <div className="schedule-weather-wind">
                                <p>돌풍</p>
                                <h6><p style={{
                                  fontSize: '18px',
                                  fontWeight: 'bolder'
                                }}>{weatherData.wind?.speed || 0} </p> m/s
                                </h6>
                              </div>
                            </div>
                          </div>
                        </section>
                    )}

                    <span className='weather-line'></span>

                    {/* 일별 날씨 예보 - 실제 데이터가 있을 때만 표시 */}
                    {isApiKeyValid() && forecastData && !weatherLoading && !weatherError && (
                        <section className="schedule-daily-weather">
                          <p style={{
                            margin: 0,
                            padding: 0,
                            textAlign: 'center',
                            color: 'rgba(255, 255, 255, 0.7)',
                            textShadow: '0 0 5px rgba(18, 72, 46, 0.7)',
                            fontSize: '0.75rem',
                            fontWeight: '400'
                          }}>날짜별 일기예보</p>
                          <div className="schedule-daily-list">
                            {forecastData.slice(0, 5).map((day, index) => {
                              const date = new Date(day.date);
                              const dayNames = ['오늘', '내일', '모레', '4일 후', '5일 후'];
                              const dayName = dayNames[index] || date.toLocaleDateString('ko-KR', {
                                month: '2-digit',
                                day: '2-digit'
                              });

                              return (
                                  <div key={index} className="schedule-daily-item">
                                    <div className="schedule-daily-date">{dayName}</div>
                                    <div className="schedule-daily-icon"><img
                                        src={getWeatherIcon(day.weather?.icon || '01d')}
                                        alt="날씨 아이콘"
                                        style={{width: '20px', height: '20px'}}
                                    /></div>
                                    <div className="schedule-daily-temps">
                                      <span style={{fontWeight: 'bold'}}>{Math.round(day.temp_max || 0)}°</span><br/>
                                      <span style={{fontWeight: '300'}}>{Math.round(day.temp_min || 0)}°</span>
                                    </div>
                                  </div>
                              );
                            })}
                          </div>
                        </section>
                    )}
                  </div>
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
                    총 {schedules.filter(schedule => schedule.date === selectedDate.toISOString().split('T')[0]).length}개의
                    일정
                  </p>
                </div>
                <button className="schedule-add-button" onClick={() => setShowAddScheduleModal(true)}>
                  <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15.5" cy="15.5" r="15.5" fill="#2D8779" fillOpacity="0.5"/>
                    <path
                        d="M9.34556 16.272V13.776H14.1936V8.664H16.8096V13.776H21.6576V16.272H16.8096V21.384H14.1936V16.272H9.34556Z"
                        fill="white"/>
                  </svg>
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
                          <img src={ScheduleIcon} alt="일정 없음"/>
                        </div>
                        <div className="schedule-empty-content">
                          <div className="schedule-empty-text">등록된 일정이 없습니다</div>
                          <div className="schedule-empty-hint">우측상단 + 버튼으로 일정을 추가해보세요</div>
                        </div>
                      </div>
                  ) : (
                      daySchedules.map((schedule) => {
                        // 기존 데이터의 type을 한국어 카테고리로 변환
                        const getDisplayCategory = (schedule) => {
                          console.log('🔍 스케줄 카테고리 디버깅:', {
                            scheduleId: schedule.id,
                            scheduleTitle: schedule.title,
                            scheduleCategory: schedule.category,
                            scheduleType: schedule.type,
                            allScheduleKeys: Object.keys(schedule)
                          });

                          // 이미 한국어 카테고리가 있으면 그대로 사용
                          if (schedule.category && ['골프', '관광', '맛집', '숙소', '모임', '기타'].includes(schedule.category)) {
                            console.log('✅ 한국어 카테고리 사용:', schedule.category);
                            return schedule.category;
                          }

                          // type이 영어로 되어 있으면 한국어로 변환
                          if (schedule.type) {
                            const convertedCategory = (() => {
                              switch (schedule.type) {
                                case 'golf':
                                  return '골프';
                                case 'tour':
                                  return '관광';
                                case 'food':
                                  return '맛집';
                                case 'stay':
                                  return '숙소';
                                default:
                                  return '기타';
                              }
                            })();
                            console.log('🔄 영어 타입을 한국어로 변환:', schedule.type, '→', convertedCategory);
                            return convertedCategory;
                          }

                          // 기본값
                          console.log('⚠️ 기본값 사용: 기타');
                          return '기타';
                        };

                        const displayCategory = getDisplayCategory(schedule);
                        console.log('📋 최종 displayCategory:', displayCategory);

                        // 카테고리가 없거나 잘못된 경우 사용자에게 알림
                        if (!displayCategory || displayCategory === '기타') {
                          console.warn('⚠️ 카테고리 정보가 없거나 기본값입니다:', {
                            scheduleId: schedule.id,
                            scheduleTitle: schedule.title,
                            displayCategory: displayCategory
                          });
                        }

                        return (
                            <div key={schedule.id} className="schedule-item" style={{
                              backgroundColor: displayCategory === '골프' ? 'rgba(38, 153, 98, 0.1)' :
                                  displayCategory === '관광' ? 'rgba(147, 51, 234, 0.1)' :
                                      displayCategory === '모임' ? 'rgba(239, 68, 68, 0.1)' :
                                          displayCategory === '맛집' ? 'rgba(234, 88, 12, 0.1)' :
                                              displayCategory === '숙소' ? 'rgba(37, 99, 235, 0.1)' :
                                                  'rgba(107, 114, 128, 0.1)',
                              borderColor: displayCategory === '골프' ? '#269962' :
                                  displayCategory === '관광' ? '#9333EA' :
                                      displayCategory === '모임' ? '#EF4444' :
                                          displayCategory === '맛집' ? '#EA580C' :
                                              displayCategory === '숙소' ? '#2563EB' :
                                                  '#6B7280'
                            }}>
                              <div className="schedule-item-icon">
                                {displayCategory === '골프' && (
                                    <svg width="18" height="19" viewBox="0 0 18 19" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                      <mask id="path-1-inside-1_988_3015" fill="white">
                                        <path
                                            d="M9.48047 0C12.6142 0 15.3926 1.52041 17.1187 3.86377C17.2605 4.0562 17.2336 4.32209 17.0646 4.4911L12.2051 9.35153C12.0098 9.54679 12.0098 9.86335 12.2051 10.0586L16.8688 14.7224C17.0424 14.8959 17.0654 15.1706 16.913 15.363C15.1765 17.5543 12.4935 18.9609 9.48047 18.9609C4.24451 18.9607 0 14.7165 0 9.48047C9.66358e-08 4.24445 4.24451 0.000248432 9.48047 0Z"/>
                                      </mask>
                                      <path
                                          d="M9.48047 0V-2H9.48037L9.48047 0ZM9.48047 18.9609L9.48037 20.9609H9.48047V18.9609ZM0 9.48047H-2H0ZM16.8688 14.7224L18.2831 13.3081L16.8688 14.7224ZM12.2051 9.35153L13.6194 10.7656V10.7656L12.2051 9.35153ZM17.1187 3.86377L15.5084 5.04992L17.1187 3.86377ZM17.0646 4.4911L15.6503 3.07702L17.0646 4.4911ZM9.48047 0V2C11.9517 2 14.143 3.19621 15.5084 5.04992L17.1187 3.86377L18.729 2.67762C16.6422 -0.155395 13.2767 -2 9.48047 -2V0ZM17.0646 4.4911L15.6503 3.07702L10.7907 7.93744L12.2051 9.35153L13.6194 10.7656L18.479 5.90519L17.0646 4.4911ZM12.2051 10.0586L10.7909 11.4728L15.4546 16.1366L16.8688 14.7224L18.2831 13.3081L13.6193 8.64439L12.2051 10.0586ZM16.913 15.363L15.3455 14.1208C13.9715 15.8547 11.856 16.9609 9.48047 16.9609V18.9609V20.9609C13.131 20.9609 16.3816 19.2538 18.4805 16.6051L16.913 15.363ZM9.48047 18.9609L9.48056 16.9609C5.349 16.9607 2 13.6118 2 9.48047H0H-2C-2 15.8212 3.14001 20.9606 9.48037 20.9609L9.48047 18.9609ZM0 9.48047H2C2 5.34911 5.349 2.0002 9.48056 2L9.48047 0L9.48037 -2C3.14001 -1.9997 -2 3.13979 -2 9.48047H0ZM16.8688 14.7224L15.4546 16.1366C14.9498 15.6318 14.8328 14.7678 15.3455 14.1208L16.913 15.363L18.4805 16.6051C19.298 15.5735 19.1349 14.16 18.2831 13.3081L16.8688 14.7224ZM12.2051 9.35153L10.7907 7.93744C9.81455 8.91377 9.81462 10.4966 10.7909 11.4728L12.2051 10.0586L13.6193 8.64439C14.205 9.23013 14.2051 10.1798 13.6194 10.7656L12.2051 9.35153ZM17.1187 3.86377L15.5084 5.04992C15.0324 4.40375 15.1582 3.56913 15.6503 3.07702L17.0646 4.4911L18.479 5.90519C19.3089 5.07506 19.4885 3.70865 18.729 2.67762L17.1187 3.86377Z"
                                          fill="#269962" mask="url(#path-1-inside-1_988_3015)"/>
                                      <circle cx="9.35547" cy="5.48047" r="1" fill="#269962"/>
                                    </svg>
                                )}
                                {displayCategory === '관광' && (
                                    <svg width="22" height="17" viewBox="0 0 22 17" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                      <mask id="path-1-inside-1_988_3045" fill="white">
                                        <path
                                            d="M15.8662 1.83301C15.8662 2.38529 16.3139 2.83301 16.8662 2.83301H20.1553C20.7076 2.83301 21.1553 3.28072 21.1553 3.83301V16C21.1553 16.5523 20.7076 17 20.1553 17H1C0.447715 17 0 16.5523 0 16V3.83301C0 3.28072 0.447715 2.83301 1 2.83301H4.28809C4.84037 2.83301 5.28809 2.38529 5.28809 1.83301V1C5.28809 0.447715 5.7358 0 6.28809 0H14.8662C15.4185 0 15.8662 0.447715 15.8662 1V1.83301Z"/>
                                      </mask>
                                      <path
                                          d="M16.8662 2.83301V4.83301H20.1553V2.83301V0.833008H16.8662V2.83301ZM21.1553 3.83301H19.1553V16H21.1553H23.1553V3.83301H21.1553ZM20.1553 17V15H1V17V19H20.1553V17ZM0 16H2V3.83301H0H-2V16H0ZM1 2.83301V4.83301H4.28809V2.83301V0.833008H1V2.83301ZM5.28809 1.83301H7.28809V1H5.28809H3.28809V1.83301H5.28809ZM6.28809 0V2H14.8662V0V-2H6.28809V0ZM15.8662 1H13.8662V1.83301H15.8662H17.8662V1H15.8662ZM14.8662 0V2C14.3139 2 13.8662 1.55228 13.8662 1H15.8662H17.8662C17.8662 -0.656854 16.5231 -2 14.8662 -2V0ZM5.28809 1H7.28809C7.28809 1.55228 6.84037 2 6.28809 2V0V-2C4.63123 -2 3.28809 -0.656854 3.28809 1H5.28809ZM4.28809 2.83301V4.83301C5.94494 4.83301 7.28809 3.48986 7.28809 1.83301H5.28809H3.28809C3.28809 1.28072 3.7358 0.833008 4.28809 0.833008V2.83301ZM0 3.83301H2C2 4.38529 1.55229 4.83301 1 4.83301V2.83301V0.833008C-0.656855 0.833008 -2 2.17615 -2 3.83301H0ZM1 17V15C1.55229 15 2 15.4477 2 16H0H-2C-2 17.6569 -0.656855 19 1 19V17ZM21.1553 16H19.1553C19.1553 15.4477 19.603 15 20.1553 15V17V19C21.8121 19 23.1553 17.6569 23.1553 16H21.1553ZM20.1553 2.83301V4.83301C19.603 4.83301 19.1553 4.38529 19.1553 3.83301H21.1553H23.1553C23.1553 2.17615 21.8121 0.833008 20.1553 0.833008V2.83301ZM16.8662 2.83301V0.833008C17.4185 0.833008 17.8662 1.28072 17.8662 1.83301H15.8662H13.8662C13.8662 3.48986 15.2094 4.83301 16.8662 4.83301V2.83301Z"
                                          fill="#9333EA" mask="url(#path-1-inside-1_988_3045)"/>
                                      <circle cx="10.5" cy="9" r="3.5" stroke="#9333EA" strokeWidth="2"/>
                                    </svg>
                                )}
                                {displayCategory === '모임' && (
                                    <svg width="16" height="19" viewBox="0 0 16 19" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                      <circle cx="5" cy="5" r="4" transform="matrix(-1 0 0 1 13 0)" stroke="#EF4444"
                                              strokeWidth="2"/>
                                      <path
                                          d="M8 11C12.4183 11 16 14.5817 16 19H14C14 15.6863 11.3137 13 8 13C4.68629 13 2 15.6863 2 19H0C0 14.5817 3.58172 11 8 11Z"
                                          fill="#EF4444"/>
                                    </svg>
                                )}
                                {displayCategory === '맛집' && (
                                    <svg width="17" height="20" viewBox="0 0 17 20" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                      <path
                                          d="M16.0342 0.00134277C16.0515 0.00193704 16.0688 0.0027826 16.0859 0.00427246C16.1087 0.00620759 16.131 0.00963133 16.1533 0.0130615C16.1624 0.0144823 16.1716 0.0152983 16.1807 0.0169678C16.1875 0.0182197 16.1944 0.0194829 16.2012 0.020874L16.2676 0.0374756H16.2695C16.3244 0.0527997 16.3771 0.0730347 16.4277 0.0970459C16.4396 0.102655 16.4513 0.108556 16.4629 0.114624C16.4762 0.121609 16.489 0.129524 16.502 0.137085C16.5147 0.14449 16.5276 0.151581 16.54 0.159546C16.5554 0.169439 16.5702 0.180098 16.585 0.190796C16.5984 0.200465 16.6121 0.209752 16.625 0.220093C16.6354 0.228473 16.6452 0.237675 16.6553 0.24646C16.6685 0.257932 16.6817 0.269427 16.6943 0.281616C16.7034 0.290422 16.7119 0.299816 16.7207 0.30896C16.7365 0.325389 16.7519 0.342164 16.7666 0.359741C16.7733 0.367741 16.7797 0.375946 16.7861 0.384155C16.7964 0.397301 16.8067 0.410468 16.8164 0.424194C16.8288 0.441665 16.8403 0.459632 16.8516 0.477905C16.8581 0.488594 16.8649 0.499142 16.8711 0.510132C16.9289 0.612586 16.9677 0.726249 16.9863 0.847046C16.9885 0.860792 16.9916 0.874326 16.9932 0.888062C16.9949 0.903245 16.9951 0.918579 16.9961 0.93396C16.9974 0.95324 16.9989 0.972389 16.999 0.991577C16.999 0.994507 17 0.997431 17 1.00037V18.5004C17 19.0527 16.5523 19.5004 16 19.5004C15.4477 19.5004 15 19.0527 15 18.5004V13.5004H14C12.8954 13.5004 12 12.6049 12 11.5004V8.00037C12 3.05082 14.0456 0.656291 15.6045 0.0804443C15.6574 0.0576595 15.7133 0.041149 15.7705 0.02771C15.7754 0.0265438 15.7802 0.0248924 15.7852 0.0238037C15.8054 0.019368 15.826 0.0162489 15.8467 0.0130615C15.8604 0.0109138 15.874 0.00778843 15.8877 0.00622559C15.9029 0.00453097 15.9182 0.00430409 15.9336 0.0032959C15.9489 0.00226443 15.9642 0.000684237 15.9795 0.000366211H16C16.0114 0.000366211 16.0228 0.00096138 16.0342 0.00134277ZM15 3.30994C14.4734 4.23372 14 5.71212 14 8.00037V11.5004H15V3.30994Z"
                                          fill="#EA580C"/>
                                      <path
                                          d="M7.89844 0C8.45065 0 8.89833 0.44781 8.89844 1V5.58789C8.89844 6.69246 8.00301 7.58789 6.89844 7.58789H5.44922V18C5.44922 18.5523 5.0015 19 4.44922 19C3.89713 18.9998 3.44922 18.5521 3.44922 18V7.58789H2C0.895557 7.58774 0 6.69237 0 5.58789V1C0.000111199 0.4479 0.447908 0.000146363 1 0C1.55222 0 1.99989 0.44781 2 1V5.58789H3.44922V1C3.44935 0.44797 3.89721 0.00023074 4.44922 0C5.00142 2.41376e-08 5.44909 0.447828 5.44922 1V5.58789H6.89844V1C6.89855 0.44801 7.3465 0.000324362 7.89844 0Z"
                                          fill="#EA580C"/>
                                    </svg>
                                )}
                                {displayCategory === '숙소' && (
                                    <svg width="22" height="20" viewBox="0 0 22 20" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                      <path d="M1 18.5H20.5" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
                                      <path d="M3 18.5V2C3 1.44772 3.44772 1 4 1H14.5C15.0523 1 15.5 1.44772 15.5 2V6"
                                            stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
                                      <rect x="10" y="8" width="10" height="11" rx="1" fill="#2563EB"/>
                                      <rect x="6" y="4" width="2" height="2" fill="#2563EB"/>
                                      <rect x="6" y="9" width="2" height="2" fill="#2563EB"/>
                                      <rect x="6" y="14" width="2" height="2" fill="#2563EB"/>
                                      <rect x="14" y="14" width="2" height="2" fill="white"/>
                                      <rect x="14" y="10" width="2" height="2" fill="white"/>
                                    </svg>
                                )}
                                {displayCategory === '기타' && (
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                      <path
                                          d="M1 16.8V1.2C1 1.08954 1.08954 1 1.2 1H16.8C16.9105 1 17 1.08954 17 1.2V16.8C17 16.9105 16.9105 17 16.8 17H1.2C1.08954 17 1 16.9105 1 16.8Z"
                                          stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                                      <path d="M4.20001 5H7.40001" stroke="#6B7280" strokeWidth="2"
                                            strokeLinecap="round"/>
                                      <path d="M4.20001 9H7.40001" stroke="#6B7280" strokeWidth="2"
                                            strokeLinecap="round"/>
                                      <path d="M4.20001 13H7.40001" stroke="#6B7280" strokeWidth="2"
                                            strokeLinecap="round"/>
                                      <path d="M10.6 5H13.8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                                      <path d="M10.6 9H13.8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                                      <path d="M10.6 13H13.8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                )}
                              </div>
                              <div className="schedule-item-content">
                                <div className="schedule-item-header">
                                  <h4 className="schedule-item-title" style={{
                                    color: displayCategory === '골프' ? '#269962' :
                                        displayCategory === '관광' ? '#9333EA' :
                                            displayCategory === '모임' ? '#EF4444' :
                                                displayCategory === '맛집' ? '#EA580C' :
                                                    displayCategory === '숙소' ? '#2563EB' :
                                                        '#6B7280'
                                  }}>{schedule.title}</h4>
                                  <button
                                      className="schedule-edit-button"
                                      onClick={() => handleEditSchedule(schedule)}
                                      title="일정 편집"
                                  >
                                    ⋯
                                  </button>
                                </div>
                                <p className="schedule-item-time">{schedule.time}</p>
                                {schedule.location && (
                                    <div className="schedule-item-location">
                                      <svg width="11" height="15" viewBox="0 0 11 15" fill="none"
                                           xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5.52169" cy="5.52163" r="1.76089" stroke="#8F8F8F"/>
                                        <path
                                            d="M5.56735 1V0.5H5.56733L5.56735 1ZM10.1347 5.56738H10.6347V5.56736L10.1347 5.56738ZM9.77927 7.33691L9.31837 7.14306L9.30988 7.16325L9.30319 7.18411L9.77927 7.33691ZM5.56735 14L5.279 14.4085L5.5452 14.5964L5.8246 14.4287L5.56735 14ZM1.35544 7.33594L1.83174 7.18384L1.82499 7.16268L1.81638 7.14219L1.35544 7.33594ZM0.999969 5.56738L0.499969 5.56736V5.56738H0.999969ZM5.56735 1V1.5C7.81373 1.5 9.63463 3.32099 9.63474 5.56741L10.1347 5.56738L10.6347 5.56736C10.6346 2.76874 8.36606 0.5 5.56735 0.5V1ZM10.1347 5.56738H9.63474C9.63474 6.12701 9.52193 6.65908 9.31837 7.14306L9.77927 7.33691L10.2402 7.53076C10.4944 6.92632 10.6347 6.2626 10.6347 5.56738H10.1347ZM9.77927 7.33691L9.30319 7.18411C8.75766 8.88379 7.94812 10.3741 7.16883 11.502C6.77945 12.0655 6.40064 12.5342 6.07065 12.89C5.73352 13.2536 5.46891 13.476 5.3101 13.5713L5.56735 14L5.8246 14.4287C6.10444 14.2608 6.44495 13.9571 6.80392 13.57C7.17003 13.1751 7.57831 12.6685 7.99154 12.0704C8.81748 10.8751 9.67525 9.29709 10.2553 7.48972L9.77927 7.33691ZM5.56735 14L5.8557 13.5915C4.75667 12.8157 3.85195 11.5526 3.16303 10.2858C2.47856 9.0271 2.0324 7.81221 1.83174 7.18384L1.35544 7.33594L0.879133 7.48803C1.09331 8.15875 1.5622 9.43522 2.28452 10.7635C3.0024 12.0836 3.99622 13.503 5.279 14.4085L5.56735 14ZM1.35544 7.33594L1.81638 7.14219C1.61296 6.65824 1.49997 6.12645 1.49997 5.56738H0.999969H0.499969C0.499969 6.26241 0.640647 6.92573 0.8945 7.52968L1.35544 7.33594ZM0.999969 5.56738L1.49997 5.56741C1.50008 3.32108 3.32105 1.5001 5.56737 1.5L5.56735 1L5.56733 0.5C2.76875 0.500122 0.500105 2.76879 0.499969 5.56736L0.999969 5.56738Z"
                                            fill="#8F8F8F"/>
                                      </svg>
                                      <span>{schedule.location}</span>
                                    </div>
                                )}
                              </div>
                            </div>
                        );
                      })
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
        <Footer/>
      </div>
    </div>
  );
};

export default SchedulePage;