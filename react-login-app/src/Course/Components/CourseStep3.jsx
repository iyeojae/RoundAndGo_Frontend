import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Layout/Header';
import Footer from '../../Layout/Footer';
import './CourseStep3.css';

const CourseStep3 = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [courseData, setCourseData] = useState({
    day1: [],
    day2: []
  });

  // 더미 데이터 (실제로는 API에서 가져올 데이터)
  const dummyCourseData = {
    day1: [
      {
        id: 1,
        name: '골프존카운티 오라',
        type: '골프장',
        address: '제주 제주시 도남로 130-16',
        icon: '🏌️',
        iconColor: '#4CAF50',
        image: '/images/golf-course.jpg',
        distance: '2.1 km',
        walkTime: '30분',
        carTime: '5분',
        transportTime: '12분',
        coordinates: { lat: 33.4996, lng: 126.5312 },
        phone: '064-123-4567'
      },
      {
        id: 2,
        name: '춘심이네 본점',
        type: '맛집',
        address: '제주 제주시 보리년 130-16',
        icon: '🍽️',
        iconColor: '#FF9800',
        image: '/images/restaurant.jpg',
        distance: '300 m',
        walkTime: '1분',
        carTime: '3분',
        transportTime: '정보없음',
        coordinates: { lat: 33.2400, lng: 126.5623 },
        phone: '064-234-5678'
      },
      {
        id: 3,
        name: '더마파크',
        type: '뭔가 재밌는 관광지',
        address: '제주 제주시 도남교 130-16',
        icon: '📸',
        iconColor: '#9C27B0',
        image: '/images/tourism.jpg',
        distance: '300 m',
        walkTime: '1분',
        carTime: '3분',
        transportTime: '정보없음',
        coordinates: { lat: 33.4584, lng: 126.9423 },
        phone: '064-783-0959'
      },
      {
        id: 4,
        name: '리조트',
        type: '뭔가 멋진 숙소',
        address: '제주 제주시 도르성로 133-16',
        icon: '🏨',
        iconColor: '#2196F3',
        image: '/images/resort.jpg',
        distance: '300 m',
        walkTime: '1분',
        carTime: '3분',
        transportTime: '정보없음',
        coordinates: { lat: 33.2394, lng: 126.4123 },
        phone: '064-345-6789'
      }
    ],
    day2: [
      {
        id: 5,
        name: '중문 골프클럽',
        type: '골프장',
        address: '제주 서귀포시 중문동',
        icon: '⛳',
        iconColor: '#4CAF50',
        image: '/images/golf-course2.jpg',
        distance: '3.2 km',
        walkTime: '40분',
        carTime: '8분',
        transportTime: '18분',
        coordinates: { lat: 33.2394, lng: 126.4123 },
        phone: '064-456-7890'
      },
      {
        id: 6,
        name: '천지연폭포',
        type: '관광지',
        address: '제주 서귀포시 서홍동',
        icon: '🌊',
        iconColor: '#00BCD4',
        image: '/images/waterfall.jpg',
        distance: '2.1 km',
        walkTime: '25분',
        carTime: '5분',
        transportTime: '12분',
        coordinates: { lat: 33.2456, lng: 126.5678 },
        phone: '064-567-8901'
      }
    ]
  };

  // 컴포넌트 마운트 시 이전 단계 데이터 확인 및 코스 데이터 로드
  useEffect(() => {
    const step1Data = sessionStorage.getItem('courseStep1');
    const step2Data = sessionStorage.getItem('courseStep2');
    
    if (!step1Data || !step2Data) {
      // 이전 단계 데이터가 없으면 1단계로 이동
      navigate('/course/step1');
      return;
    }

    // 코스 데이터 로드 시뮬레이션
    loadCourseData();
  }, [navigate]);

  // 코스 데이터 로드
  const loadCourseData = async () => {
    setLoading(true);
    
    // API 호출 시뮬레이션 (2초 대기)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCourseData(dummyCourseData);
    setLoading(false);
  };

  // 위치보기 클릭
  const handleLocationClick = (location) => {
    if (location.coordinates) {
      const { lat, lng } = location.coordinates;
      window.open(`https://map.naver.com/v5/directions/-/${lat},${lng}/transit`, '_blank');
    }
  };

  // 전화걸기 클릭
  const handleCallClick = (location) => {
    if (location.phone) {
      window.location.href = `tel:${location.phone}`;
    }
  };

  // 길찾기 클릭
  const handleDirectionsClick = (location) => {
    if (location.coordinates) {
      const { lat, lng } = location.coordinates;
      window.open(`https://map.naver.com/v5/directions/-/${lat},${lng}/car`, '_blank');
    }
  };

  // 편집 버튼 클릭
  const handleEditClick = () => {
    // 편집 모드로 이동하거나 모달 열기
    console.log('편집 모드');
  };

  // 다시 추천 버튼 클릭
  const handleRerollClick = () => {
    loadCourseData();
  };

  // 이 코스로 여행하기 클릭
  const handleTravelClick = () => {
    navigate('/schedule', { 
      state: { 
        courseData: courseData,
        fromCourseRecommendation: true
      } 
    });
  };

  // 뒤로가기
  const handleBack = () => {
    navigate('/course/step2');
  };

  const currentDayData = selectedDay === 1 ? courseData.day1 : courseData.day2;

  if (loading) {
    return (
      <div className="course-step3-page">
        <Header />
        
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>최적의 코스를 찾고 있어요</h2>
          <p>AI가 당신만의 맞춤 코스를 추천하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-step3-page">
      <Header />

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
          <div className="step-item completed">
            <div className="step-circle completed">1</div>
            <span className="step-label completed">기간 설정</span>
          </div>
          <div className="step-line completed"></div>
          <div className="step-item completed">
            <div className="step-circle completed">2</div>
            <span className="step-label completed">스타일 설정</span>
          </div>
          <div className="step-line completed"></div>
          <div className="step-item active">
            <div className="step-circle active">3</div>
            <span className="step-label active">코스 추천</span>
          </div>
        </div>
      </div>

      {/* 지도 섹션 */}
      <div className="map-section">
        <div className="map-placeholder">
          <div className="map-marker" style={{ top: '20%', left: '30%' }}>1</div>
          <div className="map-marker" style={{ top: '40%', left: '50%' }}>2</div>
          <div className="map-marker" style={{ top: '60%', left: '70%' }}>3</div>
          <div className="map-marker" style={{ top: '80%', left: '40%' }}>4</div>
          <div className="map-text">제주도 지도</div>
        </div>
      </div>

      {/* 코스 상세 정보 */}
      <div className="course-details">
        {/* 일차 탭 */}
        <div className="day-tabs">
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

        {/* 액션 버튼 */}
        <div className="action-buttons">
          <button className="action-btn edit-btn" onClick={handleEditClick}>
            <span className="btn-icon">✏️</span>
            편집
          </button>
          <button className="action-btn reroll-btn" onClick={handleRerollClick}>
            <span className="btn-icon">🔄</span>
            다시 추천
          </button>
        </div>

        {/* 일정 목록 */}
        <div className="itinerary-list">
          {currentDayData.map((location, index) => (
            <div key={location.id} className="itinerary-item">
              {/* 위치 정보 */}
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
                  <div className="image-placeholder">{location.icon}</div>
                </div>
              </div>

              {/* 다음 목적지까지 정보 (마지막 항목 제외) */}
              {index < currentDayData.length - 1 && (
                <div className="travel-info">
                  <div className="travel-distance">{location.distance}</div>
                  <div className="travel-times">
                    <span>도보 {location.walkTime}</span>
                    <span>자차 {location.carTime}</span>
                    <span>대중교통 {location.transportTime}</span>
                  </div>
                  <button 
                    className="directions-btn"
                    onClick={() => handleDirectionsClick(location)}
                  >
                    길찾기
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 여행 시작 버튼 */}
        <div className="travel-button-container">
          <button className="travel-btn" onClick={handleTravelClick}>
            이 코스로 여행하기
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseStep3;
