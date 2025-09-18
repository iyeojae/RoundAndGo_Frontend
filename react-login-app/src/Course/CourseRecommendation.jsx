import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CourseRecommendation.css';

const CourseRecommendation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 페이지 진입 시 이전 코스 선택 데이터 정리
  useEffect(() => {
    // 코스 추천 페이지는 독립적이므로 이전 선택 데이터 정리
    sessionStorage.removeItem('courseStep1');
    sessionStorage.removeItem('courseStep2');
    sessionStorage.removeItem('courseRecommendation');
  }, []);
  
  // 로컬 저장소에서 골프장 데이터 불러오기 (기본값 사용)
  const getLocalGolfCourseData = () => {
    try {
      // localStorage에서 selectedGolfCourseId 확인 (기본 골프장)
      const localGolfCourseId = localStorage.getItem('selectedGolfCourseId');
      if (localGolfCourseId) {
        // 기본 골프장 정보 반환
        return [{
          id: localGolfCourseId,
          name: '기본 골프장',
          address: '골프장 주소'
        }];
      }
    } catch (error) {
      console.error('로컬 골프장 데이터 불러오기 실패:', error);
    }
    return [];
  };

  // 골프장은 기본값, 나머지는 빈 값으로 설정
  const localGolfCourses = getLocalGolfCourseData();
  const golfCourseId = localGolfCourses.length > 0 ? localGolfCourses[0].id : '1';
  const teeOffTime = ''; // 빈 티오프 시간
  const courseType = ''; // 빈 코스 타입
  const travelDays = ''; // 빈 여행 기간
  const startDate = ''; // 빈 날짜
  const userPreferences = ''; // 빈 선호도

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [courseData, setCourseData] = useState({
    day1: [],
    day2: []
  });
  const [selectedDay, setSelectedDay] = useState(1);

  // 코스 타입에 따른 표시 정보
  const getCourseTypeDisplay = (type) => {
    const types = {
      'luxury': { title: '럭셔리', icon: '👑', color: '#FFD700' },
      'value': { title: '가성비', icon: '💰', color: '#20B2AA' },
      'resort': { title: '리조트', icon: '🏖️', color: '#FF69B4' },
      'theme': { title: '테마', icon: '🎭', color: '#9C27B0' }
    };
    return types[type] || types['luxury'];
  };

  const courseTypeDisplay = getCourseTypeDisplay(courseType);

  // 실제 API에서 데이터 가져오기
  const loadCourseRecommendation = async () => {
    try {
      setLoading(true);
      
      // 실제 API 호출
      const response = await fetch('/api/courses/recommendation', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('API 호출 실패');
      }
      
      const apiData = await response.json();
      
      // API 응답 데이터 설정
      setCourseData(apiData);
    } catch (err) {
      setError('코스 추천을 불러오는데 실패했습니다.');
      console.error('Error loading course recommendation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseRecommendation();
  }, [golfCourseId, teeOffTime, courseType, travelDays, startDate, userPreferences]);

  const handleLocationClick = (location) => {
    if (location.coordinates) {
      const { lat, lng } = location.coordinates;
      window.open(`https://map.naver.com/v5/directions/-/${lat},${lng}/transit`, '_blank');
    }
  };

  const handleCallClick = (location) => {
    if (location.phone) {
      window.location.href = `tel:${location.phone}`;
    }
  };

  const handleTravelWithCourse = () => {
    // 여행 시작 - 스케줄 페이지로 이동하거나 여행 모드 시작
    navigate('/schedule', { 
      state: { 
        courseData: courseData,
        startDate: startDate
      } 
    });
  };

  // 로딩 상태 렌더링
  if (loading) {
    return (
      <div className="course-recommendation-page">
        <div className="course-header">
          <div className="course-logo">
            <span className="logo-text">GROUND & GO</span>
          </div>
        </div>
        <div className="course-loading-container">
          <div className="course-loading">
            <div className="loading-spinner"></div>
            <h2>최적의 코스를 찾고 있어요</h2>
            <p>AI가 당신만의 맞춤 코스를 추천하고 있습니다...</p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 상태 렌더링
  if (error) {
    return (
      <div className="course-recommendation-page">
        <div className="course-header">
          <div className="course-logo">
            <span className="logo-text">GROUND & GO</span>
          </div>
        </div>
        <div className="course-error-container">
          <div className="course-error">
            <div className="error-icon">⚠️</div>
            <h2>오류가 발생했습니다</h2>
            <p>{error}</p>
            <button className="retry-btn" onClick={loadCourseRecommendation}>
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentDayData = selectedDay === 1 ? courseData.day1 : courseData.day2;

  return (
    <div className="course-recommendation-page">
      {/* 헤더 */}
      <div className="course-header">
        <div className="course-logo">
          <span className="logo-text">GROUND & GO</span>
        </div>
        <div className="course-type-badge">
          <span className="course-type-icon">{courseTypeDisplay.icon}</span>
          <span className="course-type-name">{courseTypeDisplay.title}</span>
        </div>
      </div>

      {/* 진행 단계 표시 */}
      <div className="course-steps">
        <div className="course-step-circle active">1</div>
        <div className="course-step-line"></div>
        <div className="course-step-circle active">2</div>
        <div className="course-step-line"></div>
        <div className="course-step-circle active">3</div>
        <div className="course-step-line"></div>
        <div className="course-step-circle active">4</div>
      </div>

      {/* 골프장 및 시간 정보 */}
      {courseData.day1.length > 0 && (
        <div className="golf-course-info">
          <div className="golf-course-header">
            <h3>🏌️ 골프 코스 정보</h3>
          </div>
          <div className="golf-course-details">
            <div className="golf-course-name">
              {localGolfCourses.length > 0 ? localGolfCourses[0].name : (courseData.day1[0].name || '골프장')}
            </div>
            <div className="golf-course-address">
              {localGolfCourses.length > 0 ? localGolfCourses[0].address : '골프장 주소'}
            </div>
            <div className="golf-course-time">
              <span className="tee-off-time">티오프: {teeOffTime}</span>
              <span className="end-time">종료: 18:00</span>
            </div>
            <div className="golf-course-type">
              {courseTypeDisplay.title}
            </div>
          </div>
        </div>
      )}

      {/* 일정 탭 */}
      <div className="course-day-tabs">
        <button 
          className={`day-tab ${selectedDay === 1 ? 'active' : ''}`}
          onClick={() => setSelectedDay(1)}
        >
          1일차
        </button>
        {courseData.day2.length > 0 && (
          <button 
            className={`day-tab ${selectedDay === 2 ? 'active' : ''}`}
            onClick={() => setSelectedDay(2)}
          >
            2일차
          </button>
        )}
      </div>

      {/* 에러 메시지 표시 */}
      {error && courseData.day1.length > 0 && (
        <div className="error-message">
          <span className="error-text">⚠️ {error}</span>
        </div>
      )}

      {/* 코스 추천 상세 목록 */}
      <div className="course-itinerary-list">
        {currentDayData.map((location, index) => (
          <div key={location.id} className="itinerary-item">
            {/* 위치 아이콘과 정보 */}
            <div className="location-info">
              <div 
                className="location-icon"
                style={{ backgroundColor: location.iconColor }}
              >
                <span className="icon-number">{index + 1}</span>
                <span className="icon-symbol">{location.icon}</span>
              </div>
              
              <div className="location-details">
                <h3 className="location-name">{location.name}</h3>
                <p className="location-type">{location.type}</p>
                <p className="location-address">{location.address}</p>
                
                <div className="location-actions">
                  <button 
                    className="action-btn location-btn"
                    onClick={() => handleLocationClick(location)}
                  >
                    <span className="action-icon">📍</span>
                    위치보기
                  </button>
                  <button 
                    className="action-btn call-btn"
                    onClick={() => handleCallClick(location)}
                  >
                    <span className="action-icon">📞</span>
                    전화
                  </button>
                </div>
              </div>
              
              <div className="location-image">
                <img src={location.image} alt={location.name} />
              </div>
            </div>

            {/* 거리 및 시간 정보 */}
            <div className="location-timing">
              <div className="timing-item">
                <span className="timing-label">거리</span>
                <span className="timing-value">{location.distance}</span>
              </div>
              <div className="timing-item">
                <span className="timing-label">도보</span>
                <span className="timing-value">{location.walkTime}</span>
              </div>
              <div className="timing-item">
                <span className="timing-label">자동차</span>
                <span className="timing-value">{location.carTime}</span>
              </div>
              <div className="timing-item">
                <span className="timing-label">대중교통</span>
                <span className="timing-value">{location.transportTime}</span>
              </div>
            </div>

            {/* 연결선 (마지막 항목 제외) */}
            {index < currentDayData.length - 1 && (
              <div className="connection-line"></div>
            )}
          </div>
        ))}
      </div>

      {/* 하단 여행 시작 버튼 */}
      <div className="course-bottom-action">
        <button className="travel-course-btn" onClick={handleTravelWithCourse}>
          이 코스로 여행하기
        </button>
      </div>
    </div>
  );
};

export default CourseRecommendation;
