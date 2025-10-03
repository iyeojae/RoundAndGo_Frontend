import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../LayoutNBanner/Header';
import Footer from '../../LayoutNBanner/Footer';
import { getAuthToken, isLoggedIn } from '../../Login/utils/cookieUtils';
import './MyCourseView.css';
import { loadKakaoMapSDK } from '../../Login/utils/kakaoMapLoader';

const MyCourseView = ({ courseData, courseInfo }) => {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentDayData, setCurrentDayData] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 지도 관련
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // 토큰 확인 및 자동 리다이렉트
  useEffect(() => {
    const accessToken = getAuthToken();
    console.log('🔑 MyCourseView 토큰 확인:', {
      accessToken: accessToken ? '토큰 존재' : '토큰 없음',
      isLoggedIn: isLoggedIn()
    });
    
    if (!accessToken) {
      console.log('❌ 토큰이 없어서 로그인 페이지로 이동');
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      navigate('/email-login');
      return;
    }
  }, [navigate]);

  // 실제 데이터만 사용
  const dataToUse = courseData;
  const infoToUse = courseInfo;

  // 일차 변경 핸들러
  const handleDayChange = (dayIndex) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setSelectedDay(dayIndex);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // 현재 선택된 일차 데이터 업데이트
  useEffect(() => {
    const dayKey = selectedDay === 0 ? 'day0' : selectedDay === 1 ? 'day1' : selectedDay === 2 ? 'day2' : 'day3';
    const dayData = dataToUse[dayKey] || [];
    setCurrentDayData(dayData);
  }, [selectedDay, dataToUse]);

  // 타입 표시명 매핑
  const getTypeDisplayName = (type) => {
    const typeMapping = {
      'golf': '골프장',
      'food': '맛집',
      'tour': '관광',
      'stay': '숙박'
    };
    return typeMapping[type] || type;
  };

  // 카카오맵 초기화
  const initializeKakaoMap = async () => {
    try {
      await loadKakaoMapSDK();
      
      if (!mapRef.current || currentDayData.length === 0) {
        console.log('지도 컨테이너 또는 데이터가 없습니다.');
        return;
      }

      const container = mapRef.current;
      
      // 모든 마커가 보이도록 지도 범위 계산 (selected day only)
      let minLat = Infinity, maxLat = -Infinity;
      let minLng = Infinity, maxLng = -Infinity;
      
      currentDayData.forEach(location => {
        const lat = parseFloat(location.mapy);
        const lng = parseFloat(location.mapx);
        
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      });
      
      const centerLat = (minLat + maxLat) / 2;
      const centerLng = (minLng + maxLng) / 2;
      
      if (!window.kakao.maps.LatLng) {
        console.error('LatLng 생성자를 사용할 수 없습니다.');
        return;
      }
      
      const center = new window.kakao.maps.LatLng(centerLat, centerLng);
    
      const options = {
        center: center,
        level: 6
      };
      
      if (!window.kakao.maps.Map) {
        console.error('Map 생성자를 사용할 수 없습니다.');
        return;
      }
      
      mapInstance.current = new window.kakao.maps.Map(container, options);

      const loadingDiv = container.querySelector('div');
      if (loadingDiv) {
        loadingDiv.remove();
      }

      const markers = [];
      const pathPositions = [];

      currentDayData.forEach((location, index) => {
        const markerPosition = new window.kakao.maps.LatLng(
          parseFloat(location.mapy),
          parseFloat(location.mapx)
        );

        pathPositions.push(markerPosition);

        const getMarkerColor = (type) => {
          switch (type) {
            case 'golf': return '#269962';
            case 'food': return '#EA580C';
            case 'stay': return '#2563EB';
            case 'tour': return '#9333EA';
            default: return '#6B7280';
          }
        };

        const markerContent = `
          <div style="
            width: 30px;
            height: 30px;
            background-color: ${getMarkerColor(location.type)};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            ${index + 1}
          </div>
        `;
        
        const marker = new window.kakao.maps.CustomOverlay({
          position: markerPosition,
          content: markerContent,
          yAnchor: 0.5,
          xAnchor: 0.5
        });
        
        marker.setMap(mapInstance.current);
        markers.push(marker);
      });

      if (pathPositions.length > 1) {
        const polyline = new window.kakao.maps.Polyline({
          path: pathPositions,
          strokeWeight: 3,
          strokeColor: '#999999', // Gray
          strokeOpacity: 0.8,
          strokeStyle: 'shortdash' // Dashed line
        });
        
        polyline.setMap(mapInstance.current);
      }

      console.log('카카오맵 API 로드 완료');
    } catch (error) {
      console.error('지도 초기화 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    if (currentDayData.length > 0) {
      initializeKakaoMap();
    }
  }, [currentDayData]);

  // Step1, Step2 데이터 가져오기 및 여행 정보 계산
  const step1Data = JSON.parse(sessionStorage.getItem('courseStep1') || '{}');
  const step2Data = JSON.parse(sessionStorage.getItem('courseStep2') || '{}');
  
  const getTravelInfo = () => {
    const periodOptions = {
      'day': { title: '당일 치기', days: 1 },
      '1night': { title: '1박 2일', days: 2 },
      '2night': { title: '2박 3일', days: 3 },
      '3night': { title: '3박 4일', days: 4 }
    };
    
    const courseTypeMapping = {
      'premium': '프리미엄',
      'value': '가성비',
      'resort': '리조트',
      'emotional': '테마'
    };
    
    const period = periodOptions[step1Data.selectedPeriod] || { title: '당일 치기', days: 1 };
    const courseType = courseTypeMapping[step2Data.selectedStyle] || '프리미엄';
    
    let totalPlaces = 0;
    if (dataToUse && typeof dataToUse === 'object' && dataToUse !== null) {
      try {
        Object.values(dataToUse).forEach(dayData => {
          if (Array.isArray(dayData)) {
            totalPlaces += dayData.length;
          }
        });
      } catch (error) {
        console.error('Error processing dataToUse:', error);
        totalPlaces = 0;
      }
    }
    
    return {
      title: `${period.title} 여행`,
      days: period.days,
      totalPlaces,
      courseType,
      departureDate: step1Data.departureDate
    };
  };
  
  const travelInfo = getTravelInfo();

  return (
    <main>
      <div className="my-course-page">
        <Header />
        
        {/* 지도 섹션 - 전체 화면 */}
        <div className="map-section-full">
          <div 
            ref={mapRef}
            className="kakao-map-full"
            style={{ width: '100%', height: '100vh' }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              color: '#666',
              fontSize: '16px'
            }}>
              지도를 불러오는 중...
            </div>
          </div>
        </div>
        
        <div className="my-course-view">
          <main className="my-course-main">
        {/* 코스 정보 헤더 */}
        <div className="course-info-header">
          <h2 className="course-title">{travelInfo.title}</h2>
          {travelInfo.departureDate && (
            <p className="course-date">{travelInfo.departureDate}</p>
          )}
          
          <div className="course-stats">
            <div className="stat-item">
              <div className="stat-label">총 일정</div>
              <div className="stat-value">{travelInfo.days}일</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">방문 장소</div>
              <div className="stat-value">{travelInfo.totalPlaces}개</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">카테고리</div>
              <div className="stat-value">{travelInfo.courseType}</div>
            </div>
          </div>
        </div>

      {/* 일차 탭 */}
      <div className="day-tabs">
        {[0, 1, 2, 3].map((dayIndex) => {
          const dayKey = dayIndex === 0 ? 'day0' : dayIndex === 1 ? 'day1' : dayIndex === 2 ? 'day2' : 'day3';
          const hasData = dataToUse[dayKey] && dataToUse[dayKey].length > 0;
          
          return (
            <button
              key={dayIndex}
              className={`day-tab ${selectedDay === dayIndex ? 'active' : ''} ${!hasData ? 'disabled' : ''}`}
              onClick={() => hasData && handleDayChange(dayIndex)}
              disabled={!hasData}
            >
              {dayIndex + 1}일차
            </button>
          );
        })}
      </div>

      {/* 일정 목록 */}
      <div className={`itinerary-list ${isAnimating ? (selectedDay > 0 ? 'slide-left' : 'slide-right') : ''}`}>
        {currentDayData.length > 0 ? (
          currentDayData.map((location, index) => (
            <div key={`${location.name}-${index}`} className="itinerary-item">
              <div className="location-info">
                <div className="location-icon">
                  <span className="icon-text">{getTypeDisplayName(location.type)}</span>
                </div>
                
                <div className="location-details">
                  <h3 className="location-name">{location.name}</h3>
                  {location.address && (
                    <p className="location-address">{location.address}</p>
                  )}
                  {location.startTime && location.endTime && (
                    <p className="location-time">
                      {location.startTime} - {location.endTime}
                    </p>
                  )}
                  
                  <div className="location-actions">
                    <button className="location-btn">
                      <span className="action-icon">📍</span>
                      위치보기
                    </button>
                    <button className="call-btn">
                      <span className="action-icon">📞</span>
                      전화걸기
                    </button>
                  </div>
                </div>
                
                <div className="location-image">
                  {location.imageUrl ? (
                    <img 
                      src={location.imageUrl} 
                      alt={location.name}
                      className="location-photo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="location-placeholder"
                    style={{ display: location.imageUrl ? 'none' : 'flex' }}
                  >
                    <span className="placeholder-icon">📷</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data-message">
            <p>해당 일차에 등록된 장소가 없습니다.</p>
          </div>
        )}
      </div>
          </main>
        </div>
      </div>
      
      <Footer />
    </main>
  );
};

export default MyCourseView;
