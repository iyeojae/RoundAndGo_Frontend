import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Layout/Header';
import Footer from '../../Layout/Footer';
import { loadKakaoMapSDK, isKakaoMapReady } from '../../utils/kakaoMapLoader';
import { API_ENDPOINTS } from '../../config/api';
import { getAuthToken } from '../../utils/cookieUtils';
import LocationSearchModal from './LocationSearchModal';
import './CourseStep3.css';

const CourseStep3 = () => {
  const navigate = useNavigate();
  
  // 로그인 인증 체크
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/email-login');
      return;
    }
  }, [navigate]);
  
  // 상태 관리
  const [selectedDay, setSelectedDay] = useState(() => {
    const step1Data = JSON.parse(sessionStorage.getItem('courseStep1') || '{}');
    const selectedPeriod = step1Data.selectedPeriod;
    
    if (selectedPeriod === 'day') {
      return 0; // 당일치기
    } else {
      return 0; // 다일차도 0일차부터 시작 (day0, day1, day2)
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  
  // 장소 검색 모달 상태
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchModalDayKey, setSearchModalDayKey] = useState('');
  
  // 코스 추천 데이터
  const [courseData, setCourseData] = useState(null);
  
  // 지도 관련
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // API 응답을 그대로 사용하는 함수 (변환하지 않음)
  const processApiResponseAsIs = (apiData) => {
    if (!apiData) return null;

    // API 응답 구조 확인

    // 다일차 API 응답 처리 (1박2일 이상) - data 배열 구조
    if (apiData.data && Array.isArray(apiData.data)) {
      const result = {
        day0: [],
        day1: [],
        day2: [],
        day3: [] // 3박4일을 위한 4일차 추가
      };

      // 각 날짜별 데이터를 그대로 사용
      apiData.data.forEach((dayData, dayIndex) => {
        const dayKey = `day${dayIndex}`;
        
        // Day 데이터 확인
        
        // 백엔드에서 준 데이터를 그대로 사용
        result[dayKey] = dayData.recommendedPlaces || [];
        
        // 원본 데이터 사용
      });

      // 최종 원본 코스 데이터
      return result;
    }

    // 당일치기 API 응답 처리 (data가 객체인 경우)
    if (apiData.data && !Array.isArray(apiData.data)) {
      const { data } = apiData;
      const { recommendedPlaces } = data;

      console.log('당일치기 원본 데이터:', data);

      // 당일치기 코스 구성 - 백엔드 데이터 그대로 사용
      const day0Data = recommendedPlaces || [];
    
    return {
        day0: day0Data,
        day1: [],
        day2: [],
        day3: []
      };
    }

    // 알 수 없는 응답 구조
    console.warn('알 수 없는 API 응답 구조:', apiData);
    return null;
  };

  // sessionStorage에서 코스 추천 데이터 가져오기
  useEffect(() => {
    const recommendationData = sessionStorage.getItem('courseRecommendation');
    if (recommendationData) {
      try {
        const parsedData = JSON.parse(recommendationData);
        console.log('원본 API 응답:', parsedData);
        
        const transformedData = processApiResponseAsIs(parsedData);
        console.log('변환된 코스 데이터:', transformedData);
        
        setCourseData(transformedData);
        setLoading(false);
      } catch (error) {
        console.error('코스 추천 데이터 파싱 오류:', error);
        setLoading(false);
      }
    } else {
      console.log('코스 추천 데이터가 없습니다.');
      setLoading(false);
      setError('코스 추천 데이터가 없습니다. 이전 단계로 돌아가서 다시 시도해주세요.');
    }
  }, []);

  // 현재 선택된 날짜의 키와 데이터
  const currentDayKey = `day${selectedDay}`;
  const currentDayData = courseData ? (
    selectedDay === 0 ? courseData.day0 : 
    selectedDay === 1 ? courseData.day1 : 
    selectedDay === 2 ? courseData.day2 : 
    selectedDay === 3 ? courseData.day3 : null
  ) : null;

  // 교통 정보 계산 함수 (실제 API 사용 가능)
  const calculateTransportInfo = useCallback((fromLocation, toLocation) => {
    // 실제로는 Kakao Maps API나 Google Maps API를 사용할 수 있습니다
    // 여기서는 거리 기반으로 대략적인 시간을 계산합니다
    
    const distance = calculateDistance(
      parseFloat(fromLocation.mapy), parseFloat(fromLocation.mapx),
      parseFloat(toLocation.mapy), parseFloat(toLocation.mapx)
    );

    return {
      distance: `${distance.toFixed(1)}km`,
      car: `${Math.floor(distance * 2 + Math.random() * 5)}분`, // 거리 기반 + 랜덤
      public: `${Math.floor(distance * 3 + Math.random() * 10)}분`, // 대중교통은 더 오래
      walk: `${Math.floor(distance * 12 + Math.random() * 10)}분` // 도보는 훨씬 오래
    };
  }, []);

  // 두 지점 간 거리 계산 (Haversine 공식)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // 지도 초기화 함수
  const initMap = useCallback(() => {
      try {
        // 카카오맵 API 완전 로드 확인
        if (!isKakaoMapReady()) {
          console.log('카카오맵 API가 완전히 로드되지 않았습니다.');
      return;
    }
    
        if (!currentDayData || currentDayData.length === 0) {
          console.log('현재 날짜 데이터가 없습니다.');
      return;
    }
    
      const container = mapRef.current;
        if (!container) {
          console.log('지도 컨테이너를 찾을 수 없습니다.');
          return;
        }

        console.log('지도 컨테이너 정보:', {
          container: container,
          width: container.offsetWidth,
          height: container.offsetHeight,
          style: container.style.cssText
        });

        // 첫 번째 장소의 좌표를 중심으로 지도 생성 (임시)
        const firstLocation = currentDayData[0];
        
        // LatLng 생성자 확인
        if (!window.kakao.maps.LatLng) {
          console.error('LatLng 생성자를 사용할 수 없습니다.');
          return;
        }
        
        const center = new window.kakao.maps.LatLng(
          parseFloat(firstLocation.mapy),
          parseFloat(firstLocation.mapx)
        );
      
      const options = {
          center: center,
          level: 8
      };
      
      // Map 생성자 확인
      if (!window.kakao.maps.Map) {
        console.error('Map 생성자를 사용할 수 없습니다.');
        return;
      }
      
      mapInstance.current = new window.kakao.maps.Map(container, options);

        // 로딩 메시지 제거
        const loadingDiv = container.querySelector('div');
        if (loadingDiv) {
          loadingDiv.remove();
        }

        // 마커와 경로 추가
        const markers = [];
        const pathPositions = [];

        currentDayData.forEach((location, index) => {
          const markerPosition = new window.kakao.maps.LatLng(
            parseFloat(location.mapy),
            parseFloat(location.mapx)
          );

          // 경로용 좌표 추가
          pathPositions.push(markerPosition);

          // 장소 타입에 따른 색상 설정 (백엔드 타입 기준)
          const getMarkerColor = (type) => {
            switch (type) {
              case 'golf':
                return '#269962'; // 초록
              case 'food':
                return '#EA580C'; // 주황
              case 'stay':
                return '#2563EB'; // 파랑
              case 'tour':
                return '#9333EA'; // 보라
              default:
                return '#6B7280'; // 회색 (기본값)
            }
          };

          // 커스텀 마커 생성 (번호가 표시된 원형)
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
        
        // 인포윈도우 추가
        const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px; font-size:12px;">${index + 1}. ${location.name}</div>`
          });

          // 커스텀 마커 클릭 시 인포윈도우 표시
          window.kakao.maps.event.addListener(marker, 'click', function() {
            infowindow.open(mapInstance.current, marker);
          });
        });

        // 마커들을 순서대로 연결하는 점선 경로 생성
        if (pathPositions.length > 1) {
      const polyline = new window.kakao.maps.Polyline({
            path: pathPositions,
        strokeWeight: 3,
            strokeColor: '#999999',
        strokeOpacity: 0.8,
            strokeStyle: 'shortdash'
      });
      
      polyline.setMap(mapInstance.current);
          console.log('경로 선이 그려졌습니다.');
        }

        // 모든 마커가 보이도록 지도 영역 조정
        if (pathPositions.length > 0) {
          const bounds = new window.kakao.maps.LatLngBounds();
          
          // 모든 좌표를 bounds에 추가
          pathPositions.forEach(position => {
            bounds.extend(position);
          });
          
          // 지도를 모든 마커가 보이도록 조정
          mapInstance.current.setBounds(bounds);
          
          // 여백 추가 (선택사항)
          const padding = 50; // 픽셀 단위 여백
      mapInstance.current.relayout();
      
          console.log('지도가 모든 마커를 포함하도록 조정되었습니다.');
        }

        console.log('지도 초기화 완료');
      } catch (error) {
        console.error('지도 초기화 중 오류 발생:', error);
      }
    }, [currentDayData]);

  // 카카오맵 API 로드 대기 및 지도 초기화
  useEffect(() => {
    const initializeKakaoMap = async () => {
      try {
        // 카카오맵 SDK 로드
        await loadKakaoMapSDK();
        
        console.log('카카오맵 API 로드 완료');
        initMap();
      } catch (error) {
        console.error('카카오맵 API 로드 실패:', error);
        
        // 카카오맵 로드 실패 시 대체 UI 표시
        const container = mapRef.current;
        if (container && currentDayData && currentDayData.length > 0) {
          container.innerHTML = `
            <div style="
              width: 100%;
              height: 100%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: white;
              border-radius: 12px;
              padding: 20px;
              box-sizing: border-box;
            ">
              <div style="font-size: 2rem; margin-bottom: 16px;">🗺️</div>
              <h3 style="margin: 0 0 8px 0; font-size: 1.2rem;">여행 코스 지도</h3>
              <p style="margin: 0; font-size: 0.9rem; text-align: center; opacity: 0.9;">
                ${currentDayData.length}개의 장소가 포함된 코스입니다
              </p>
              <div style="margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                ${currentDayData.map((location, index) => `
                  <div style="
                    background: rgba(255,255,255,0.2);
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    backdrop-filter: blur(10px);
                  ">
                    ${index + 1}. ${location.name}
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }
      }
    };

    initializeKakaoMap();
  }, [initMap]);

  // 교통 정보 계산 및 업데이트
  useEffect(() => {
    if (courseData && currentDayData && currentDayData.length > 1) {
      const updatedCourseData = { ...courseData };
      const dayKey = selectedDay === 0 ? 'day0' : selectedDay === 1 ? 'day1' : selectedDay === 2 ? 'day2' : 'day3';
      
      // 각 장소 간 교통 정보 계산
      for (let i = 0; i < currentDayData.length - 1; i++) {
        const fromLocation = currentDayData[i];
        const toLocation = currentDayData[i + 1];
        
        if (fromLocation && toLocation && fromLocation.mapx && fromLocation.mapy && toLocation.mapx && toLocation.mapy) {
          const transportInfo = calculateTransportInfo(fromLocation, toLocation);
          
          // 해당 장소의 교통 정보 업데이트
          const locationIndex = updatedCourseData[dayKey].findIndex(loc => loc.name === fromLocation.name);
          if (locationIndex !== -1) {
            updatedCourseData[dayKey][locationIndex].transportInfo = transportInfo;
          }
        }
      }
      
      // 상태 업데이트 (무한 루프 방지를 위해 조건부)
      if (JSON.stringify(updatedCourseData) !== JSON.stringify(courseData)) {
        setCourseData(updatedCourseData);
      }
    }
  }, [courseData, currentDayData, selectedDay, calculateTransportInfo]);
    
  // 뒤로가기 핸들러
  const handleBack = () => {
    navigate('/course/step2');
  };

  // 편집 버튼 핸들러
  const handleEditClick = () => {
    console.log('편집 버튼 클릭');
    setIsEditMode(!isEditMode);
  };

  // 드래그 앤 드롭 관련 상태
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);

  // 드래그 시작
  const handleDragStart = (e, dayKey, itemIndex) => {
    if (!isEditMode) return;
    setDraggedItem({ dayKey, itemIndex });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
  };

  // 드래그 오버
  const handleDragOver = (e, dayKey, itemIndex) => {
    if (!isEditMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOverItem({ dayKey, itemIndex });
  };

  // 드래그 리브
  const handleDragLeave = (e) => {
    if (!isEditMode) return;
    setDraggedOverItem(null);
  };

  // 드롭
  const handleDrop = (e, targetDayKey, targetItemIndex) => {
    if (!isEditMode || !draggedItem) return;
    e.preventDefault();
    
    const { dayKey: sourceDayKey, itemIndex: sourceItemIndex } = draggedItem;
    
    if (sourceDayKey === targetDayKey && sourceItemIndex === targetItemIndex) {
      setDraggedItem(null);
      setDraggedOverItem(null);
      return;
    }

    // 같은 날짜 내에서 순서 변경
    if (sourceDayKey === targetDayKey) {
      const newCourseData = { ...courseData };
      const dayItems = [...newCourseData[sourceDayKey]];
      const draggedItemData = dayItems[sourceItemIndex];
      
      // 아이템 제거
      dayItems.splice(sourceItemIndex, 1);
      // 새 위치에 삽입
      dayItems.splice(targetItemIndex, 0, draggedItemData);
      
      newCourseData[sourceDayKey] = dayItems;
      setCourseData(newCourseData);
    }
    
    setDraggedItem(null);
    setDraggedOverItem(null);
  };

  // 장소 추가 (검색 모달 열기)
  const handleAddLocation = (dayKey) => {
    setSearchModalDayKey(dayKey);
    setIsSearchModalOpen(true);
  };

  // 검색된 장소 선택
  const handleSelectLocation = (dayKey, location) => {
    const newCourseData = { ...courseData };
    if (!newCourseData[dayKey]) {
      newCourseData[dayKey] = [];
    }
    newCourseData[dayKey].push(location);
    setCourseData(newCourseData);
  };

  // 검색 모달 닫기
  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchModalDayKey('');
  };

  // 카카오지도 위치보기 함수
  const handleLocationView = (location) => {
    if (!location.mapx || !location.mapy) {
      alert('위치 정보가 없습니다.');
      return;
    }

    // 카카오지도 위치보기 URL 생성
    const kakaoMapUrl = `https://map.kakao.com/link/map/${location.name},${location.mapy},${location.mapx}`;
    
    // 새 탭에서 카카오지도 열기
    window.open(kakaoMapUrl, '_blank');
  };

  // 카카오지도 길찾기 함수
  const handleDirections = (location, index) => {
    if (!location.mapx || !location.mapy) {
      alert('위치 정보가 없습니다.');
      return;
    }

    const currentDayKey = selectedDay === 0 ? 'day0' : selectedDay === 1 ? 'day1' : selectedDay === 2 ? 'day2' : 'day3';
    const dayData = courseData[currentDayKey] || [];
    
    // 출발지와 도착지 설정
    let startLocation = null;
    let endLocation = location;
    
    if (index > 0) {
      // 이전 장소가 출발지 (예: 1번 → 2번)
      startLocation = dayData[index - 1];
    } else {
      // 첫 번째 장소인 경우, 첫 번째 장소 자체로 설정 (1번 장소로 이동)
      startLocation = { name: '현재 위치', mapx: '126.5', mapy: '33.5' }; // 제주도 중심 좌표
      endLocation = dayData[0]; // 첫 번째 장소가 도착지
    }
    
    if (!startLocation || !startLocation.mapx || !startLocation.mapy) {
      alert('출발지 정보가 없습니다.');
      return;
    }

    // 카카오지도 길찾기 URL 생성 (방법 1: 웹 길찾기 화면)
    const kakaoMapUrl = `https://map.kakao.com/?sName=${startLocation.name}&sX=${startLocation.mapx}&sY=${startLocation.mapy}&eName=${endLocation.name}&eX=${endLocation.mapx}&eY=${endLocation.mapy}`;
    
    // 새 탭에서 카카오지도 열기
    window.open(kakaoMapUrl, '_blank');
  };

  // 랜덤 장소 생성 (실제 API 호출)
  const handleRandomLocation = async (dayKey, itemIndex) => {
    try {
      const accessToken = getAuthToken();
      if (!accessToken) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 현재 장소의 타입을 확인하여 해당 카테고리에서 랜덤 검색
      const currentLocation = courseData[dayKey]?.[itemIndex];
      const locationType = currentLocation?.type || 'tour';

      let apiUrl = '';
      switch (locationType) {
        case 'tour':
          apiUrl = 'https://api.roundandgo.com/api/tour-infos/jeju/search/attractions';
          break;
        case 'food':
          apiUrl = 'https://api.roundandgo.com/api/tour-infos/jeju/search/restaurants';
          break;
        case 'stay':
          apiUrl = 'https://api.roundandgo.com/api/tour-infos/jeju/search/accommodations';
          break;
        default:
          apiUrl = 'https://api.roundandgo.com/api/tour-infos/jeju/integrated-search';
      }

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`랜덤 검색 API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      console.log('랜덤 검색 API 응답:', data);

      // API 응답에서 data 배열 추출
      const allResults = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      
      if (allResults.length === 0) {
        alert('랜덤 추천할 장소가 없습니다.');
        return;
      }

      // 랜덤으로 1개 선택
      const randomIndex = Math.floor(Math.random() * allResults.length);
      const randomItem = allResults[randomIndex];

      // API 응답을 코스 데이터 형태로 변환
      const randomLocation = {
        id: randomItem.id || `random_${Date.now()}`,
        name: randomItem.name || randomItem.title || '이름 없음',
        type: locationType,
        address: randomItem.address || randomItem.addr1 || randomItem.location || '주소 정보 없음',
        mapx: randomItem.mapx || '126.5',
        mapy: randomItem.mapy || '33.5',
        description: randomItem.description || randomItem.summary || `${locationType} 정보`,
        imageUrl: randomItem.imageUrl || randomItem.thumbnail || randomItem.firstimage || null
      };

      // 코스 데이터 업데이트
      const newCourseData = { ...courseData };
      if (newCourseData[dayKey] && newCourseData[dayKey][itemIndex]) {
        newCourseData[dayKey][itemIndex] = randomLocation;
        setCourseData(newCourseData);
      }

    } catch (error) {
      console.error('랜덤 검색 오류:', error);
      alert('랜덤 추천 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 장소 삭제
  const handleDeleteLocation = (dayKey, itemIndex) => {
    const newCourseData = { ...courseData };
    newCourseData[dayKey].splice(itemIndex, 1);
    setCourseData(newCourseData);
  };

  // 시간 변경 핸들러
  const handleTimeChange = (dayKey, itemIndex, timeType, timeValue) => {
    const newCourseData = { ...courseData };
    if (newCourseData[dayKey] && newCourseData[dayKey][itemIndex]) {
      newCourseData[dayKey][itemIndex] = {
        ...newCourseData[dayKey][itemIndex],
        [timeType]: timeValue
      };
      
      // time 문자열도 업데이트 (호환성을 위해)
      const location = newCourseData[dayKey][itemIndex];
      if (location.startTime && location.endTime) {
        location.time = `${location.startTime} - ${location.endTime}`;
      }
      
      setCourseData(newCourseData);
    }
  };

  // 사진 업로드 핸들러
  const handleImageUpload = (e, dayKey, itemIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      
      // 코스 데이터 업데이트
      const newCourseData = { ...courseData };
      newCourseData[dayKey][itemIndex].imageUrl = imageUrl;
      setCourseData(newCourseData);
      
      // 업로딩 상태 제거
      setUploadingImages(prev => {
        const newState = { ...prev };
        delete newState[`${dayKey}_${itemIndex}`];
        return newState;
      });
    };

    reader.onerror = () => {
      alert('이미지 업로드에 실패했습니다.');
      setUploadingImages(prev => {
        const newState = { ...prev };
        delete newState[`${dayKey}_${itemIndex}`];
        return newState;
      });
    };

    // 업로딩 상태 설정
    setUploadingImages(prev => ({
      ...prev,
      [`${dayKey}_${itemIndex}`]: true
    }));

    reader.readAsDataURL(file);
  };

  // 사진 삭제 핸들러
  const handleImageDelete = (dayKey, itemIndex) => {
    const newCourseData = { ...courseData };
    newCourseData[dayKey][itemIndex].imageUrl = '';
    setCourseData(newCourseData);
  };

  // 다시 추천 버튼 핸들러
  const handleRerollClick = async () => {
    console.log('다시 추천 버튼 클릭');
    
    try {
    setLoading(true);
    
      // Step1과 Step2 데이터 가져오기
      const step1Data = JSON.parse(sessionStorage.getItem('courseStep1') || '{}');
      const step2Data = JSON.parse(sessionStorage.getItem('courseStep2') || '{}');
      
      if (!step1Data || !step2Data) {
        console.error('Step1 또는 Step2 데이터가 없습니다.');
        return;
      }
      
      const isSameDay = step1Data.selectedPeriod === 'day';
      
      // API 엔드포인트 결정
      const baseUrl = 'https://api.roundandgo.com';
      
      const apiEndpoint = isSameDay 
        ? `${baseUrl}/api/courses/recommendation/ai`
        : `${baseUrl}/api/courses/recommendation/ai/multi-day`;
      
      let response;
      
      if (isSameDay) {
        // 당일치기: Query 파라미터로 전송
        const courseTypeMapping = {
          'premium': 'luxury',
          'value': 'value', 
          'resort': 'resort',
          'emotional': 'theme'
        };
        
        const queryParams = new URLSearchParams({
          golfCourseId: step1Data.golfCourseIds?.[0] || 1,
          teeOffTime: step1Data.golfTimes?.[0] || "09:00",
          courseType: courseTypeMapping[step2Data.selectedStyle] || 'luxury',
          userPreferences: "맛집 위주로, 바다 전망 좋은 숙소"
        });
        
        console.log('다시 추천 - 당일치기 API 요청:', {
          endpoint: `${apiEndpoint}?${queryParams}`,
          queryParams: Object.fromEntries(queryParams)
        });
        
        response = await fetch(`${apiEndpoint}?${queryParams}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        });
      } else {
        // 다일차: Body로 CourseRecommendationRequestDto 전송
        const courseTypeMapping = {
          'premium': 'luxury',
          'value': 'value', 
          'resort': 'resort',
          'emotional': 'theme'
        };
        
        // 여행 기간에 맞춰서 골프장 ID와 시간 배열 생성
        const travelDays = parseInt(step1Data.travelDays) || 1;
        const selectedGolfCourseIds = step1Data.golfCourseIds || [];
        const selectedGolfTimes = step1Data.golfTimes || [];
        
        // 여행 기간에 맞춰서 골프장 ID 배열 생성 (부족하면 반복)
        const golfCourseIds = [];
        for (let i = 0; i < travelDays; i++) {
          if (selectedGolfCourseIds[i]) {
            golfCourseIds.push(selectedGolfCourseIds[i]);
      } else {
            // 부족한 경우 첫 번째 골프장 ID로 채움
            golfCourseIds.push(selectedGolfCourseIds[0] || 1);
          }
        }
        
        // 여행 기간에 맞춰서 티오프 시간 배열 생성 (부족하면 반복)
        const teeOffTimes = [];
        for (let i = 0; i < travelDays; i++) {
          if (selectedGolfTimes[i]) {
            teeOffTimes.push(selectedGolfTimes[i]);
      } else {
            // 부족한 경우 첫 번째 시간으로 채움
            teeOffTimes.push(selectedGolfTimes[0] || "09:00");
          }
        }
        
        const requestData = {
          golfCourseIds: golfCourseIds, // 여행 기간에 맞춘 골프장 ID 목록
          startDate: step1Data.departureDate,
          travelDays: travelDays,
          teeOffTimes: teeOffTimes, // 여행 기간에 맞춘 티오프 시간 목록
          courseType: courseTypeMapping[step2Data.selectedStyle] || 'luxury'
        };
        
        const queryParams = new URLSearchParams({
          userPreferences: "전통 한식 위주, 온천 숙소 선호, 자연 경관 중시"
        });
        
        console.log('다시 추천 - 다일차 API 요청:', {
          endpoint: apiEndpoint,
          requestData: requestData
        });
        
        response = await fetch(`${apiEndpoint}?${queryParams}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(requestData)
        });
      }
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('다시 추천 API 응답:', result);
      
      // 새로운 결과를 sessionStorage에 저장
      sessionStorage.setItem('courseRecommendation', JSON.stringify(result));
      
      // 새로운 데이터로 상태 업데이트
      const transformedData = processApiResponseAsIs(result);
      setCourseData(transformedData);
      
      // 지도 다시 초기화
      if (mapInstance.current) {
        initMap();
      }
      
    } catch (error) {
      console.error('다시 추천 API 호출 중 오류:', error);
      alert('다시 추천 요청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
    setLoading(false);
    }
  };



  // 여행 시작 버튼 핸들러
  const handleTravelClick = async () => {
    console.log('🎯 이 코스로 여행하기 버튼 클릭 - 코스 저장 시작');
    
    try {
      // Step1 데이터에서 여행 정보 가져오기
      const step1Data = JSON.parse(sessionStorage.getItem('courseStep1') || '{}');
      const step2Data = JSON.parse(sessionStorage.getItem('courseStep2') || '{}');
      const startDate = step1Data.departureDate;
      const selectedPeriod = step1Data.selectedPeriod;
      const travelDays = parseInt(step1Data.travelDays) || 1;
      
      if (!courseData || !startDate) {
        alert('코스 데이터가 없습니다. 다시 시도해주세요.');
        return;
      }
      
      // 사용자 확인
      const confirmMessage = `선택한 코스를 저장하시겠습니까?\n\n여행 기간: ${selectedPeriod === 'day' ? '당일치기' : travelDays + '박 ' + (travelDays + 1) + '일'}\n출발일: ${startDate}`;
      
      if (!window.confirm(confirmMessage)) {
        console.log('사용자가 코스 저장을 취소했습니다.');
        return;
      }
      
      // 로딩 상태 표시
      setLoading(true);
      console.log('💾 코스 저장 중...');
      
      // 인증 토큰 확인
      const accessToken = getAuthToken();
      if (!accessToken) {
        alert('로그인이 필요합니다. 다시 로그인해주세요.');
        navigate('/email-login');
        return;
      }
      
      // 서버 API 명세에 맞는 데이터 구조로 변환
      const courseTypeMapping = {
        'premium': 'luxury',
        'value': 'value', 
        'resort': 'resort',
        'emotional': 'theme'
      };
      
      const courseName = `${selectedPeriod === 'day' ? '당일치기' : travelDays + '박 ' + (travelDays + 1) + '일'} 제주 골프 여행`;
      
      console.log('📅 여행 기간 계산:', {
        selectedPeriod: selectedPeriod,
        step1TravelDays: step1Data.travelDays,
        parsedTravelDays: travelDays,
        courseName: courseName,
        expectedResult: selectedPeriod === '3night' ? '3박 4일' : '기타'
      });
      const description = `${courseTypeMapping[step2Data.selectedStyle] || 'luxury'} 스타일의 제주도 골프 여행 코스`;
      
      // courseDays 배열 생성
      const courseDays = [];
      const maxDays = selectedPeriod === 'day' ? 1 : 
                     selectedPeriod === '1night' ? 2 : 
                     selectedPeriod === '2night' ? 3 : 
                     selectedPeriod === '3night' ? 4 : 1;
      
      for (let dayIndex = 0; dayIndex < maxDays; dayIndex++) {
        const dayKey = `day${dayIndex}`;
        const dayData = courseData[dayKey];
        
        if (dayData && dayData.length > 0) {
          // 해당 일차 날짜 계산
          const courseDate = new Date(startDate);
          courseDate.setDate(courseDate.getDate() + dayIndex);
          
          console.log(`📅 ${dayIndex + 1}일차 날짜 계산:`, {
            startDate: startDate,
            dayIndex: dayIndex,
            calculatedDate: courseDate.toISOString().split('T')[0],
            dayNumber: dayIndex + 1,
            dayKey: dayKey,
            expectedDate: `${startDate} + ${dayIndex}일 = ${courseDate.toISOString().split('T')[0]}`
          });
          
          // 골프장 정보 (첫 번째 골프장 타입 장소에서 추출)
          const golfPlace = dayData.find(place => place.type === 'golf');
          const golfCourseId = golfPlace ? 1 : 1; // 기본값 1
          const teeOffTime = step1Data.golfTimes?.[dayIndex] || step1Data.golfTimes?.[0] || "09:00";
          
          // places 배열 생성
          const places = dayData.map((place, placeIndex) => {
            // 장소 타입 매핑 (백엔드 데이터 그대로 사용)
            let placeType = place.type || 'tour'; // 백엔드에서 온 type 그대로 사용
            
            // 카테고리 매핑 (한국어 표시용)
            let category = '기타'; // 기본값
            if (placeType === 'food') category = '맛집';
            else if (placeType === 'stay') category = '숙소';
            else if (placeType === 'golf') category = '골프';
            else if (placeType === 'tour') category = '관광';
            
            console.log(`🏷️ ${dayIndex + 1}일차 ${placeIndex + 1}번째 장소 카테고리 매핑:`, {
              placeName: place.name,
              originalType: place.type,
              mappedType: placeType,
              category: category
            });
            
            return {
              type: placeType,
              name: place.name || '이름 없음',
              address: place.address || '주소 정보 없음',
              imageUrl: place.imageUrl || null,
              distanceKm: 0, // 거리 정보가 없으므로 0으로 설정
              mapx: place.mapx || '126.5219',
              mapy: place.mapy || '33.4996',
              visitOrder: placeIndex + 1,
              category: category, // 한국어 카테고리 (표시용)
              categoryType: placeType, // 영어 타입 (백엔드용)
              // 백엔드에서 스케줄 생성 시 사용할 수 있도록 추가 정보 제공
              scheduleCategory: category,
              scheduleType: placeType,
              // 스케줄 생성 시 필수 정보
              scheduleInfo: {
                title: `${dayIndex + 1}일차 - ${place.name}`,
                category: category,
                type: placeType,
                startTime: '09:00', // 기본 시작 시간
                endTime: '10:00',   // 기본 종료 시간
                location: place.address || place.name,
                isAllDay: false
              }
            };
          });
          
          courseDays.push({
            dayNumber: dayIndex + 1,
            courseDate: courseDate.toISOString().split('T')[0],
            teeOffTime: teeOffTime,
            golfCourseId: golfCourseId,
            places: places,
            // 백엔드에서 스케줄 생성 시 날짜 정보를 명확히 전달
            scheduleDate: courseDate.toISOString().split('T')[0],
            dayIndex: dayIndex,
            isFirstDay: dayIndex === 0,
            isLastDay: dayIndex === maxDays - 1
          });
        }
      }
      
      const courseSaveData = {
        courseName: courseName,
        description: description,
        courseType: courseTypeMapping[step2Data.selectedStyle] || 'luxury',
        startDate: startDate,
        travelDays: travelDays,
        isPublic: true,
        courseDays: courseDays,
        // 백엔드에서 스케줄 생성 시 카테고리 정보를 명확히 전달
        scheduleGenerationInfo: {
          includeCategories: true,
          categoryMapping: {
            'golf': '골프',
            'food': '맛집', 
            'tour': '관광',
            'stay': '숙소'
          },
          // 날짜 계산 정보 명확히 전달
          dateCalculation: {
            startDate: startDate,
            note: "dayIndex 0 = 출발일 (1일차), dayIndex 1 = 출발일+1일 (2일차)",
            example: "출발일이 2024-01-01이면: day0=2024-01-01(1일차), day1=2024-01-02(2일차)"
          },
          // 스케줄 생성 가이드
          scheduleCreationGuide: {
            instruction: "각 place의 scheduleInfo를 사용하여 스케줄을 생성하세요",
            requiredFields: ["title", "category", "startTime", "endTime", "location"],
            categoryUsage: "place.scheduleInfo.category를 스케줄의 category 필드에 사용하세요",
            example: "골프장 → category: '골프', 맛집 → category: '맛집', 관광지 → category: '관광', 숙소 → category: '숙소'"
          }
        }
      };
      
      console.log('📤 코스 저장 요청 데이터:', courseSaveData);
      console.log('📅 날짜 계산 요약:', {
        startDate: startDate,
        totalDays: courseDays.length,
        dateMapping: courseDays.map(day => ({
          dayNumber: day.dayNumber,
          dayIndex: day.dayIndex,
          courseDate: day.courseDate,
          scheduleDate: day.scheduleDate,
          isFirstDay: day.isFirstDay,
          isLastDay: day.isLastDay
        }))
      });
      console.log('🏷️ 카테고리 정보 요약:', {
        totalPlaces: courseDays.reduce((sum, day) => sum + day.places.length, 0),
        categoriesByDay: courseDays.map(day => ({
          dayNumber: day.dayNumber,
          categories: day.places.map(place => ({
            name: place.name,
            category: place.category,
            type: place.type,
            scheduleInfo: place.scheduleInfo
          }))
        }))
      });
      console.log('📋 스케줄 생성 가이드:', {
        instruction: "백엔드에서 각 place.scheduleInfo를 사용하여 스케줄 생성",
        examplePlaces: courseDays.flatMap(day => day.places).slice(0, 3).map(place => ({
          name: place.name,
          scheduleInfo: place.scheduleInfo
        }))
      });
      
      // POST /api/courses/saved로 코스 저장
      const response = await fetch(API_ENDPOINTS.COURSES_SAVED, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(courseSaveData)
      });
      
      if (!response.ok) {
        // 서버 오류 응답 상세 정보 확인
        let errorMessage = `코스 저장 실패: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error('서버 오류 상세:', errorData);
          errorMessage += ` - ${errorData.message || errorData.error || '알 수 없는 오류'}`;
        } catch (e) {
          const errorText = await response.text();
          console.error('서버 오류 텍스트:', errorText);
          errorMessage += ` - ${errorText}`;
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('✅ 코스 저장 성공:', result);
      
      // 코스 저장 성공 후 스케줄에도 저장
      // 코스 저장 완료 - 백엔드에서 스케줄을 자동으로 생성합니다
      console.log('✅ 코스 저장 완료 - 백엔드에서 관련 스케줄을 자동 생성합니다');
      
      const totalPlaces = Object.values(courseData).flat().length;
      const categorySummary = courseDays.map(day => 
        `${day.dayNumber}일차 (${day.scheduleDate}): ${day.places.map(p => p.category).join(', ')}`
      ).join('\n');
      
      alert(`✅ 코스가 성공적으로 저장되었습니다!\n\n🎯 저장된 정보:\n- 코스: ${courseName}\n- 여행 기간: ${selectedPeriod === 'day' ? '당일치기' : travelDays + '박 ' + (travelDays + 1) + '일'}\n- 출발일: ${startDate}\n- 총 장소 수: ${totalPlaces}개\n\n📅 일정 날짜 및 카테고리:\n${categorySummary}\n\n🏷️ 각 장소의 카테고리 정보가 백엔드로 전달되었습니다.\n백엔드에서 관련 스케줄이 자동으로 생성됩니다.\n스케줄 페이지에서 날짜와 카테고리 정보를 확인해주세요.`);
      
      console.log('🎉 코스 및 스케줄 저장 완료 - 스케줄 페이지로 이동');
      // 스케줄 페이지로 이동하여 새로 생성된 스케줄 확인 (새로고침 트리거 포함)
      navigate('/schedule?refresh=true');
      
    } catch (error) {
      console.error('코스 저장 중 오류:', error);
      
      // 500 오류인 경우 더 간단한 데이터로 재시도
      if (error.message.includes('500')) {
        console.log('🔄 500 오류 발생, 더 간단한 데이터로 재시도...');
        try {
          // 변수들을 다시 가져오기
          const retryStep1Data = JSON.parse(sessionStorage.getItem('courseStep1') || '{}');
          const retryStartDate = retryStep1Data.departureDate;
          const retryAccessToken = getAuthToken();
          
          // 최소한의 필수 데이터만 포함
          const simpleData = {
            courseName: '제주 골프 여행',
            description: '제주도 골프 여행 코스',
            courseType: 'luxury',
            startDate: retryStartDate,
            travelDays: 1,
            isPublic: true,
            courseDays: [{
              dayNumber: 1,
              courseDate: retryStartDate,
              teeOffTime: "09:00",
              golfCourseId: 1,
              places: [{
                type: 'tour',
                name: '골프장',
                address: '제주도',
                imageUrl: null,
                distanceKm: 0,
                mapx: '126.5219',
                mapy: '33.4996',
                visitOrder: 1,
                category: '골프'
              }]
            }]
          };
          
          console.log('📤 간단한 데이터로 재시도:', simpleData);
          
          const retryResponse = await fetch(API_ENDPOINTS.COURSES_SAVED, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${retryAccessToken}`
            },
            body: JSON.stringify(simpleData)
          });
          
          if (retryResponse.ok) {
            const retryResult = await retryResponse.json();
            console.log('✅ 간단한 데이터로 코스 저장 성공:', retryResult);
            
            // 코스 저장 완료 - 백엔드에서 스케줄을 자동으로 생성합니다
            console.log('✅ 간단한 데이터로 코스 저장 완료 - 백엔드에서 스케줄 자동 생성');
            alert('✅ 코스가 성공적으로 저장되었습니다!\n백엔드에서 관련 스케줄이 자동으로 생성됩니다.');
            
            navigate('/schedule?refresh=true');
            return;
          } else {
            console.error('간단한 데이터로도 실패:', retryResponse.status);
          }
        } catch (retryError) {
          console.error('재시도 중 오류:', retryError);
        }
      }
      
      alert(`코스 저장 중 오류가 발생했습니다.\n\n오류: ${error.message}\n\n다시 시도해주세요.`);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <main>
      <div className="course-step3-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>최적의 코스를 찾고 있어요</h2>
          <p>AI가 당신만의 맞춤 코스를 추천하고 있습니다...</p>
        </div>
      </div>
      </main>
    );
  }

  // 에러 상태일 때의 처리
  if (error) {
  return (
      <main>
        <div className="course-step3-page">
          <Header />
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>오류가 발생했습니다</h2>
            <p>{error}</p>
            <div className="error-actions">
              <button 
                className="back-button"
                onClick={() => navigate('/course/step2')}
              >
                이전 단계로 돌아가기
              </button>
              <button 
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 데이터가 없을 때의 처리
  if (!courseData || !currentDayData) {
  return (
      <main>
      <div className="course-step3-page">
        <Header />
        <div className="error-container">
          <h2>코스 추천 데이터를 불러올 수 없습니다</h2>
          <p>다시 시도해주세요.</p>
          <button className="retry-btn" onClick={() => navigate('/course/step2')}>
            다시 추천받기
          </button>
        </div>
      </div>
      </main>
    );
  }

  return (
    <main>
    <div className={`course-step3-page ${showDetails ? 'modal-open' : ''}`}>
      <Header />

      {/* 네비게이션 패널 */}
      <div className="navigation-panel">
        <div className="step-header-left">
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
              <span className="step-label completed">기간 선택</span>
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
      </div>

      {/* 지도 섹션 */}
      <div className={`map-section ${showDetails ? 'modal-open' : ''}`}>
        <div ref={mapRef} className="kakao-map" style={{ width: '100%', height: '100%' }}>
          {/* 지도 로딩 중 표시 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%', 
            backgroundColor: '#f5f5f5',
            color: '#666',
            fontSize: '14px'
          }}>
            지도를 불러오는 중...
          </div>
        </div>
        </div>

      {/* 드래그 헤더 - 항상 보임 */}
        <div 
        className={`course-details-header ${showDetails ? 'show' : ''}`}
          onClick={() => setShowDetails(!showDetails)}
        >
      </div>

      {/* 코스 상세 정보 - 슬라이드 */}
      <div className={`course-details ${showDetails ? 'show' : ''}`}>
        {/* 일차 탭 */}
        <div className="day-tabs">
          {(() => {
            const step1Data = JSON.parse(sessionStorage.getItem('courseStep1') || '{}');
            const selectedPeriod = step1Data.selectedPeriod;
            const tabs = [];
            
            if (selectedPeriod === 'day') {
              // 당일치기
              tabs.push(
                <button 
                  key={0}
                  className={`day-tab ${selectedDay === 0 ? 'active' : ''}`}
                  onClick={() => setSelectedDay(0)}
                >
                  당일치기
                </button>
              );
            } else {
              // 다일차: 실제 데이터가 있는 날짜만 버튼 생성
              const maxDays = selectedPeriod === '1night' ? 2 : 
                             selectedPeriod === '2night' ? 3 : 
                             selectedPeriod === '3night' ? 4 : 1;
              
              for (let i = 0; i < maxDays; i++) {
                // 해당 날짜에 데이터가 있는지 확인
                const dayKey = `day${i}`;
                const hasData = courseData && courseData[dayKey] && courseData[dayKey].length > 0;
                
                tabs.push(
                  <button 
                    key={i}
                    className={`day-tab ${selectedDay === i ? 'active' : ''} ${!hasData ? 'disabled' : ''}`}
                    onClick={() => hasData && setSelectedDay(i)}
                    disabled={!hasData}
                  >
                    {i + 1}일차
                  </button>
                );
              }
            }
            
            return tabs;
          })()}
        </div>

        {/* 액션 버튼 */}
        {!isEditMode && (
        <div className="action-buttons">
          <button className="action-btn edit-btn" onClick={handleEditClick}>
                    <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.75 8.41667L9.16667 2L12.375 5.20833L5.95833 11.625H2.75V8.41667Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M1 14.25H15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
            편집
          </button>
            <button className="action-btn reroll-btn" onClick={handleRerollClick} disabled={loading}>
                  <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8022 0.63623C11.0726 0.69055 11.2476 0.953679 11.1938 1.22412L10.6753 3.81982C10.5961 4.21568 10.286 4.5258 9.89014 4.60498L7.29443 5.12354C7.02393 5.17744 6.76087 5.00234 6.70654 4.73193C6.65251 4.46122 6.8284 4.19721 7.09912 4.14307L8.896 3.78271C8.42319 3.41536 7.7383 3.00884 6.94482 2.77393C5.94425 2.47779 4.80993 2.4607 3.69092 3.08154C2.5721 3.70241 1.98677 4.6736 1.7085 5.6792C1.42585 6.7008 1.4737 7.72054 1.59814 8.31885C1.68222 8.72412 1.42231 9.1211 1.01709 9.20557C0.611701 9.2899 0.214918 9.02981 0.130371 8.62451C-0.0360755 7.82462 -0.0921687 6.56096 0.262207 5.27979C0.621105 3.98256 1.41367 2.62992 2.96338 1.77002C4.51321 0.910153 6.07997 0.954368 7.37061 1.33643C8.39961 1.64105 9.27622 2.16773 9.88721 2.65576L10.2134 1.02881C10.2676 0.758151 10.5315 0.582118 10.8022 0.63623Z" fill="white"/>
                    <path d="M1.81934 13.6382C1.54917 13.5837 1.37399 13.3206 1.42773 13.0503L1.94629 10.4546C2.02544 10.0588 2.33575 9.74872 2.73145 9.66943L5.32715 9.15088C5.59766 9.09697 5.86071 9.27207 5.91504 9.54248C5.96913 9.81322 5.79321 10.0772 5.52246 10.1313L3.72559 10.4917C4.19841 10.8591 4.88411 11.2655 5.67773 11.5005C6.67815 11.7965 7.81188 11.8135 8.93066 11.1929C10.0496 10.572 10.6358 9.60092 10.9141 8.59521C11.1967 7.57356 11.1479 6.55386 11.0234 5.95557C10.9393 5.5502 11.2001 5.1532 11.6055 5.06885C12.0107 4.98474 12.4066 5.24477 12.4912 5.6499C12.6577 6.44981 12.7138 7.71343 12.3594 8.99463C12.0005 10.2919 11.2079 11.6445 9.6582 12.5044C8.10839 13.3642 6.54158 13.3201 5.25098 12.938C4.22194 12.6333 3.34533 12.1067 2.73438 11.6187L2.4082 13.2456C2.35394 13.5163 2.09004 13.6923 1.81934 13.6382Z" fill="white"/>
                  </svg>
            {loading ? '추천 중...' : '다시 추천'}
          </button>
        </div>
        )}


        {/* 일정 목록 */}
        <div className="itinerary-list">
          {/* 편집 모드 드래그 안내 메시지 */}
          {isEditMode && currentDayData.length > 0 && (
            <div className="drag-instruction-text">
              드래그해서 순서를 바꿀 수 있어요 (골프장은 삭제/랜덤 버튼만 제한)
            </div>
          )}
          
          {currentDayData.map((location, index) => (
                  <div key={`${location.name}-${index}`}>
                    {/* 장소 정보 */}
              <div 
                className={`itinerary-item ${isEditMode ? 'edit-mode' : ''} ${
                  draggedOverItem?.dayKey === currentDayKey && draggedOverItem?.itemIndex === index ? 'drag-over' : ''
                }`}
                draggable={isEditMode}
                onDragStart={(e) => isEditMode && handleDragStart(e, currentDayKey, index)}
                onDragOver={(e) => isEditMode && handleDragOver(e, currentDayKey, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => isEditMode && handleDrop(e, currentDayKey, index)}
              >
              <div className="location-info">
                        {/* 편집 모드 버튼들 - 왼쪽에 배치 */}
                        {isEditMode && (
                          <div className="edit-actions-left">
                            {location.type !== 'golf' && (
                              <>
                                <button 
                                  className="random-btn"
                                  onClick={() => handleRandomLocation(currentDayKey, index)}
                                >
                                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="16" cy="16" r="16" fill="#D7DDFF"/>
                                    <mask id="path-2-inside-1_1572_177" fill="white">
                                      <rect x="8" y="8" width="16" height="16" rx="1"/>
                                    </mask>
                                    <rect x="8" y="8" width="16" height="16" rx="1" stroke="#2C40F6" strokeWidth="4" mask="url(#path-2-inside-1_1572_177)"/>
                                    <circle cx="13.5" cy="13.5" r="1.5" fill="#2C40F6"/>
                                    <circle cx="18.5" cy="18.5" r="1.5" fill="#2C40F6"/>
                                  </svg>
                                </button>
                                <button 
                                  className="delete-btn"
                                  onClick={() => handleDeleteLocation(currentDayKey, index)}
                                >
                                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="16" cy="16" r="16" fill="#FFD7D8"/>
                                    <path d="M8 11H24" stroke="#F62C2F" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M10 12V23.5C10 23.7761 10.2239 24 10.5 24H21.5C21.7761 24 22 23.7761 22 23.5V12" stroke="#F62C2F" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M14 14L14 21" stroke="#F62C2F" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M18 14L18 21" stroke="#F62C2F" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M13 11V8.5C13 8.22386 13.2239 8 13.5 8H18.5C18.7761 8 19 8.22386 19 8.5V11" stroke="#F62C2F" strokeWidth="2" strokeLinecap="round"/>
                                  </svg>
                                </button>
                              </>
                            )}
                </div>
                        )}
                        <div className="location-icon">
                          <div className="icon-number">{index + 1}</div>
                          <div className="icon-symbol">
                            {location.type === 'golf' ? (
                              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="9" fill="#269962"/>
                                <mask id="path-2-inside-1_1007_659" fill="white">
                                  <path d="M18.4805 8C21.6142 8 24.3926 9.52041 26.1187 11.8638C26.2605 12.0562 26.2336 12.3221 26.0646 12.4911L21.2051 17.3515C21.0098 17.5468 21.0098 17.8633 21.2051 18.0586L25.8688 22.7224C26.0424 22.8959 26.0654 23.1706 25.913 23.363C24.1765 25.5543 21.4935 26.9609 18.4805 26.9609C13.2445 26.9607 9 22.7165 9 17.4805C9 12.2445 13.2445 8.00025 18.4805 8Z"/>
                                </mask>
                                <path d="M18.4805 8V6H18.4804L18.4805 8ZM18.4805 26.9609L18.4804 28.9609H18.4805V26.9609ZM9 17.4805H7H9ZM25.8688 22.7224L27.2831 21.3081L25.8688 22.7224ZM21.2051 17.3515L22.6194 18.7656V18.7656L21.2051 17.3515ZM26.1187 11.8638L24.5084 13.0499L26.1187 11.8638ZM26.0646 12.4911L24.6503 11.077L26.0646 12.4911ZM18.4805 8V10C20.9517 10 23.143 11.1962 24.5084 13.0499L26.1187 11.8638L27.729 10.6776C25.6422 7.8446 22.2767 6 18.4805 6V8ZM26.0646 12.4911L24.6503 11.077L19.7907 15.9374L21.2051 17.3515L22.6194 18.7656L27.479 13.9052L26.0646 12.4911ZM21.2051 18.0586L19.7909 19.4728L24.4546 24.1366L25.8688 22.7224L27.2831 21.3081L22.6193 16.6444L21.2051 18.0586ZM25.913 23.363L24.3455 22.1208C22.9715 23.8547 20.856 24.9609 18.4805 24.9609V26.9609V28.9609C22.131 28.9609 25.3816 27.2538 27.4805 24.6051L25.913 23.363ZM18.4805 26.9609L18.4806 24.9609C14.349 24.9607 11 21.6118 11 17.4805H9H7C7 23.8212 12.14 28.9606 18.4804 28.9609L18.4805 26.9609ZM9 17.4805H11C11 13.3491 14.349 10.0002 18.4806 10L18.4805 8L18.4804 6C12.14 6.0003 7 11.1398 7 17.4805H9ZM25.8688 22.7224L24.4546 24.1366C23.9498 23.6318 23.8328 22.7678 24.3455 22.1208L25.913 23.363L27.4805 24.6051C28.298 23.5735 28.1349 22.16 27.2831 21.3081L25.8688 22.7224ZM21.2051 17.3515L19.7907 15.9374C18.8145 16.9138 18.8146 18.4966 19.7909 19.4728L21.2051 18.0586L22.6193 16.6444C23.205 17.2301 23.2051 18.1798 22.6194 18.7656L21.2051 17.3515ZM26.1187 11.8638L24.5084 13.0499C24.0324 12.4038 24.1582 11.5691 24.6503 11.077L26.0646 12.4911L27.479 13.9052C28.3089 13.0751 28.4885 11.7086 27.729 10.6776L26.1187 11.8638Z" fill="white" mask="url(#path-2-inside-1_1007_659)"/>
                                <circle cx="17.3555" cy="13.4805" r="0.5" fill="#269962" stroke="white"/>
                              </svg>
                            ) : location.type === 'food' ? (
                              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="9" fill="#EA580C"/>
                                <path d="M26.0342 8.00146C26.0515 8.00206 26.0688 8.0029 26.0859 8.00439C26.1087 8.00633 26.131 8.00975 26.1533 8.01318C26.1624 8.0146 26.1716 8.01542 26.1807 8.01709C26.1875 8.01834 26.1944 8.0196 26.2012 8.021L26.2676 8.0376H26.2695C26.3244 8.05292 26.3771 8.07316 26.4277 8.09717C26.4396 8.10278 26.4513 8.10868 26.4629 8.11475C26.4762 8.12173 26.489 8.12965 26.502 8.13721C26.5147 8.14461 26.5276 8.1517 26.54 8.15967C26.5554 8.16956 26.5702 8.18022 26.585 8.19092C26.5984 8.20059 26.6121 8.20987 26.625 8.22021C26.6354 8.2286 26.6452 8.2378 26.6553 8.24658C26.6685 8.25805 26.6817 8.26955 26.6943 8.28174C26.7034 8.29054 26.7119 8.29994 26.7207 8.30908C26.7365 8.32551 26.7519 8.34229 26.7666 8.35986C26.7733 8.36786 26.7797 8.37607 26.7861 8.38428C26.7964 8.39742 26.8067 8.41059 26.8164 8.42432C26.8288 8.44179 26.8403 8.45975 26.8516 8.47803C26.8581 8.48872 26.8649 8.49926 26.8711 8.51025C26.9289 8.61271 26.9677 8.72637 26.9863 8.84717C26.9885 8.86091 26.9916 8.87445 26.9932 8.88818C26.9949 8.90337 26.9951 8.9187 26.9961 8.93408C26.9974 8.95336 26.9989 8.97251 26.999 8.9917C26.999 8.99463 27 8.99755 27 9.00049V26.5005C27 27.0528 26.5523 27.5005 26 27.5005C25.4477 27.5005 25 27.0528 25 26.5005V21.5005H24C22.8954 21.5005 22 20.6051 22 19.5005V16.0005C22 11.0509 24.0456 8.65641 25.6045 8.08057C25.6574 8.05778 25.7133 8.04127 25.7705 8.02783C25.7754 8.02667 25.7802 8.02501 25.7852 8.02393C25.8054 8.01949 25.826 8.01637 25.8467 8.01318C25.8604 8.01104 25.874 8.00791 25.8877 8.00635C25.9029 8.00465 25.9182 8.00443 25.9336 8.00342C25.9489 8.00239 25.9642 8.00081 25.9795 8.00049H26C26.0114 8.00049 26.0228 8.00108 26.0342 8.00146ZM25 11.3101C24.4734 12.2338 24 13.7122 24 16.0005V19.5005H25V11.3101Z" fill="white"/>
                                <path d="M17.8984 8C18.4507 8 18.8983 8.44781 18.8984 9V13.5879C18.8984 14.6925 18.003 15.5879 16.8984 15.5879H15.4492V26C15.4492 26.5523 15.0015 27 14.4492 27C13.8971 26.9998 13.4492 26.5521 13.4492 26V15.5879H12C10.8956 15.5877 10 14.6924 10 13.5879V9C10.0001 8.4479 10.4479 8.00015 11 8C11.5522 8 11.9999 8.44781 12 9V13.5879H13.4492V9C13.4494 8.44797 13.8972 8.00023 14.4492 8C15.0014 8 15.4491 8.44783 15.4492 9V13.5879H16.8984V9C16.8985 8.44801 17.3465 8.00032 17.8984 8Z" fill="white"/>
                              </svg>
                            ) : location.type === 'stay' ? (
                              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="9" fill="#2563EB"/>
                                <path d="M8 26.5H27.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                <path d="M10 26.5V10C10 9.44772 10.4477 9 11 9H21.5C22.0523 9 22.5 9.44772 22.5 10V14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                <rect x="17" y="16" width="10" height="11" rx="1" fill="white"/>
                                <rect x="13" y="12" width="2" height="2" fill="white"/>
                                <rect x="13" y="17" width="2" height="2" fill="white"/>
                                <rect x="13" y="22" width="2" height="2" fill="white"/>
                                <rect x="21" y="22" width="2" height="2" fill="#2563EB"/>
                                <rect x="21" y="18" width="2" height="2" fill="#2563EB"/>
                              </svg>
                            ) : location.type === 'tour' ? (
                              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="9" fill="#9333EA"/>
                                <mask id="path-2-inside-1_1007_656" fill="white">
                                  <path d="M24.2107 10.4707C24.2107 11.023 24.6584 11.4707 25.2107 11.4707H28.8113C29.3636 11.4707 29.8113 11.9184 29.8113 12.4707V25.4707C29.8113 26.023 29.3636 26.4707 28.8113 26.4707H8.41089C7.8586 26.4707 7.41089 26.023 7.41089 25.4707V12.4707C7.41089 11.9184 7.8586 11.4707 8.41089 11.4707H12.0115C12.5638 11.4707 13.0115 11.023 13.0115 10.4707V9.4707C13.0115 8.91842 13.4592 8.4707 14.0115 8.4707H23.2107C23.763 8.4707 24.2107 8.91842 24.2107 9.4707V10.4707Z"/>
                                </mask>
                                <path d="M25.2107 11.4707V13.4707H28.8113V11.4707V9.4707H25.2107V11.4707ZM29.8113 12.4707H27.8113V25.4707H29.8113H31.8113V12.4707H29.8113ZM28.8113 26.4707V24.4707H8.41089V26.4707V28.4707H28.8113V26.4707ZM7.41089 25.4707H9.41089V12.4707H7.41089H5.41089V25.4707H7.41089ZM8.41089 11.4707V13.4707H12.0115V11.4707V9.4707H8.41089V11.4707ZM13.0115 10.4707H15.0115V9.4707H13.0115H11.0115V10.4707H13.0115ZM14.0115 8.4707V10.4707H23.2107V8.4707V6.4707H14.0115V8.4707ZM24.2107 9.4707H22.2107V10.4707H24.2107H26.2107V9.4707H24.2107ZM23.2107 8.4707V10.4707C22.6584 10.4707 22.2107 10.023 22.2107 9.4707H24.2107H26.2107C26.2107 7.81385 24.8675 6.4707 23.2107 6.4707V8.4707ZM13.0115 9.4707H15.0115C15.0115 10.023 14.5638 10.4707 14.0115 10.4707V8.4707V6.4707C12.3546 6.4707 11.0115 7.81385 11.0115 9.4707H13.0115ZM12.0115 11.4707V13.4707C13.6683 13.4707 15.0115 12.1276 15.0115 10.4707H13.0115H11.0115C11.0115 9.91842 11.4592 9.4707 12.0115 9.4707V11.4707ZM7.41089 12.4707H9.41089C9.41089 13.023 8.96317 13.4707 8.41089 13.4707V11.4707V9.4707C6.75403 9.4707 5.41089 10.8138 5.41089 12.4707H7.41089ZM8.41089 26.4707V24.4707C8.96317 24.4707 9.41089 24.9184 9.41089 25.4707H7.41089H5.41089C5.41089 27.1276 6.75404 28.4707 8.41089 28.4707V26.4707ZM29.8113 25.4707H27.8113C27.8113 24.9184 28.259 24.4707 28.8113 24.4707V26.4707V28.4707C30.4681 28.4707 31.8113 27.1276 31.8113 25.4707H29.8113ZM28.8113 11.4707V13.4707C28.259 13.4707 27.8113 13.023 27.8113 12.4707H29.8113H31.8113C31.8113 10.8138 30.4681 9.4707 28.8113 9.4707V11.4707ZM25.2107 11.4707V9.4707C25.763 9.4707 26.2107 9.91842 26.2107 10.4707H24.2107H22.2107C22.2107 12.1276 23.5538 13.4707 25.2107 13.4707V11.4707Z" fill="white" mask="url(#path-2-inside-1_1007_656)"/>
                                <circle cx="18.5296" cy="18.0001" r="3.76471" stroke="white" strokeWidth="2"/>
                              </svg>
                            ) : location.type === '모임' ? (
                              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="9" fill="#EF4444"/>
                                <circle cx="5" cy="5" r="4" transform="matrix(-1 0 0 1 23 9)" stroke="white" strokeWidth="2"/>
                                <path d="M18 20C22.4183 20 26 23.5817 26 28H24C24 24.6863 21.3137 22 18 22C14.6863 22 12 24.6863 12 28H10C10 23.5817 13.5817 20 18 20Z" fill="white"/>
                              </svg>
                            ) : (
                              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="9" fill="#6B7280"/>
                                <circle cx="18" cy="18" r="8" fill="white"/>
                              </svg>
                            )}
                </div>
                </div>
                <div className="location-details">
                          <h4 className="location-name">{location.name}</h4>
                          <div className="location-type">
                            {location.type === 'food' ? '맛집' : 
                             location.type === 'tour' ? '관광지' : 
                             location.type === 'stay' ? '숙소' : 
                             location.type === 'golf' ? '골프장' : 
                             location.type}
                          </div>
                  <p className="location-address">{location.address}</p>
                          {isEditMode ? (
                            <div className="time-edit-container">
                              <div className="time-input-group">
                                <label>시작시간:</label>
                                <input
                                  type="time"
                                  value={location.startTime || location.time?.split('-')[0] || '09:00'}
                                  onChange={(e) => handleTimeChange(currentDayKey, index, 'startTime', e.target.value)}
                                  className="time-input"
                                />
                              </div>
                              <div className="time-input-group">
                                <label>종료시간:</label>
                                <input
                                  type="time"
                                  value={location.endTime || location.time?.split('-')[1] || '10:00'}
                                  onChange={(e) => handleTimeChange(currentDayKey, index, 'endTime', e.target.value)}
                                  className="time-input"
                                />
                              </div>
                            </div>
                          ) : (
                            <p className="location-time">
                              {(() => {
                                // 디버깅을 위한 로그
                                console.log('시간 표시 디버깅:', {
                                  name: location.name,
                                  startTime: location.startTime,
                                  endTime: location.endTime,
                                  time: location.time,
                                  hasStartEnd: !!(location.startTime && location.endTime)
                                });
                                
                                if (location.startTime && location.endTime) {
                                  return `${location.startTime} - ${location.endTime}`;
                                } else if (location.time) {
                                  return location.time;
                                } else {
                                  return '시간 미정';
                                }
                              })()}
                            </p>
                          )}
                  
                  <div className="location-actions">
                            {!isEditMode && (
                              <>
                    <button 
                                  className="location-btn"
                                  onClick={() => handleLocationView(location)}
                    >
                                  <svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.24121 0C7.42482 2.7832e-07 9.47038 3.38103 7.99316 6.20117L5.12402 11.6777C4.75066 12.3897 3.73174 12.3897 3.3584 11.6777L0.489258 6.20117C-0.987952 3.38104 1.05763 3.47573e-05 4.24121 0ZM4.24121 2.5459C3.18698 2.5459 2.33225 3.39992 2.33203 4.4541C2.33203 5.50846 3.18685 6.36328 4.24121 6.36328C5.29555 6.36326 6.15039 5.50845 6.15039 4.4541C6.15018 3.39994 5.29542 2.54592 4.24121 2.5459Z" fill="#2D8779"/>
                                  </svg>
                      위치보기
                    </button>
                                <button className="call-btn">
                                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.32313 10.8787L2.12132 6.67688C0.949748 5.5053 0.949747 3.60581 2.12132 2.43424L2.84845 1.70711C3.23897 1.31658 3.87214 1.31658 4.26266 1.70711L5.51512 2.95956C5.90564 3.35008 5.90564 3.98325 5.51512 4.37377L4.798 5.09089C4.60274 5.28615 4.60274 5.60274 4.798 5.798L7.202 8.202C7.39726 8.39726 7.71385 8.39726 7.90911 8.202L8.62623 7.48488C9.01675 7.09436 9.64992 7.09436 10.0404 7.48489L11.2929 8.73734C11.6834 9.12786 11.6834 9.76103 11.2929 10.1516L10.5658 10.8787C9.39419 12.0503 7.4947 12.0503 6.32313 10.8787Z" stroke="#2563EB"/>
                                  </svg>
                      전화
                    </button>
                              </>
                            )}
                  </div>
                </div>
                
                  {/* 장소 사진 - 오른쪽에 배치 */}
                <div className="location-image">
                    {location.imageUrl ? (
                      <img 
                        src={location.imageUrl} 
                        alt={location.name}
                        className="location-photo"
                      />
                    ) : (
                      <img 
                        src="/images/photo-placeholder.svg" 
                        alt="사진 정보가 없어요"
                        className="location-photo"
                      />
                    )}
                  </div>
                </div>
              </div>

                    {/* 다음 장소까지 교통수단 정보 (마지막 장소가 아닌 경우, 편집 모드가 아닐 때만) */}
              {index < currentDayData.length - 1 && !isEditMode && (
                <div className="transport-info-between">
                  <div className="transport-info-header">
                    <div className="transport-info-title">
                      <span className="transport-icon">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.1631 4.76856L6.45905 6.58329L6.30575 6.65925L6.22979 6.81254L4.41438 10.5173L0.965164 1.31866L10.1631 4.76856Z" stroke="#177DF6"/>
                        </svg>
                      </span>
                      <span>다음 목적지까지</span>
                    </div>
                          <div className="transport-distance">{location.transportInfo?.distance || '2.3km'}</div>
                  </div>
                  
                  <div className="transport-modes">
                          <div className="transport-mode-card">
                            <div className="transport-mode-icon">
            <svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="4.75" cy="2" r="1.5" stroke="#A228D7"/>
                                <path d="M5 4.86963C5 6.92845 3.29222 10.2226 1 11.8696" stroke="#A228D7" strokeLinecap="round"/>
                                <path d="M4 8.86963C4.4 9.15534 6 10.1553 6 11.8696" stroke="#A228D7" strokeLinecap="round"/>
                                <path d="M5 6.00443C5.42857 6.52121 6.97143 7.73004 8 5.86963" stroke="#A228D7" strokeLinecap="round"/>
                                <path d="M4.25 5.99991C3.25 5.49976 1.75 5.5 1.25 6.50001" stroke="#A228D7" strokeLinecap="round"/>
            </svg>
                            </div>
                            <div className="transport-mode-info">
                              <div className="transport-mode-label">도보</div>
                              <div className="transport-mode-time">{location.transportInfo?.walk || '25분'}</div>
                        </div>
                      </div>
                          <div className="transport-mode-card">
                            <div className="transport-mode-icon">
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.89575 9.66667V4.30359C2.89575 4.26848 2.90499 4.23399 2.92255 4.20359L4.71441 1.1C4.75013 1.03812 4.81616 1 4.88761 1H10.3636C10.4351 1 10.5011 1.03812 10.5368 1.1L12.3287 4.20359C12.3462 4.23399 12.3555 4.26848 12.3555 4.30359V9.66667" stroke="#0AC03B" strokeLinecap="round"/>
                                <path d="M3.40747 8.70361L12.0741 8.70361" stroke="#0AC03B" strokeLinecap="round"/>
                                <path d="M5.50073 6.77783H6.0424" stroke="#0AC03B" strokeLinecap="round"/>
                                <path d="M9.46924 6.77783H10.0109" stroke="#0AC03B" strokeLinecap="round"/>
                                <path d="M3.40747 4.85156H12.0741" stroke="#0AC03B" strokeLinecap="round"/>
                                <path d="M12.375 4.25H14" stroke="#0AC03B" strokeLinecap="round"/>
                                <path d="M1 4.25H2.625" stroke="#0AC03B" strokeLinecap="round"/>
            </svg>
                            </div>
                            <div className="transport-mode-info">
                              <div className="transport-mode-label">자동차</div>
                              <div className="transport-mode-time">{location.transportInfo?.car || '8분'}</div>
                          </div>
                        </div>
                          <div className="transport-mode-card">
                            <div className="transport-mode-icon">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.84619 0.5H8.15381C8.98224 0.5 9.65381 1.17157 9.65381 2V7.96191H1.34619V2C1.34619 1.17157 2.01777 0.5 2.84619 0.5Z" stroke="#4540DA"/>
              <rect x="0.846191" y="5.07715" width="9.30769" height="3.38462" fill="#4540DA"/>
              <rect x="1.69238" y="0.846191" width="7.61538" height="1.69231" fill="#4540DA"/>
              <rect x="0.846191" y="6.76953" width="1.69231" height="3.38462" rx="0.846154" fill="#4540DA"/>
              <rect x="8.46143" y="6.76953" width="1.69231" height="3.38462" rx="0.846154" fill="#4540DA"/>
              <rect x="1.69238" y="5.92334" width="1.69231" height="1.69231" rx="0.846154" fill="white"/>
              <rect x="7.61548" y="5.92334" width="1.69231" height="1.69231" rx="0.846154" fill="white"/>
              <path d="M10.1538 3.38477C10.6211 3.38477 11 3.7636 11 4.23092V5.92323C11 6.39054 10.6211 6.76938 10.1538 6.76938V3.38477Z" fill="#4540DA"/>
              <path d="M0 4.23092C0 3.7636 0.378836 3.38477 0.846154 3.38477V6.76938C0.378836 6.76938 0 6.39055 0 5.92323V4.23092Z" fill="#4540DA"/>
                                <path d="M3.80762 1.26953H7.19223" stroke="white" strokeLinecap="round"/>
            </svg>
                          </div>
                            <div className="transport-mode-info">
                              <div className="transport-mode-label">대중교통</div>
                              <div className="transport-mode-time">{location.transportInfo?.public || '15분'}</div>
                        </div>
                      </div>
                  </div>
                  
                  <button 
                    className="transport-route-button" 
                          onClick={() => handleDirections(location, index)}
                        >
                          경로 안내 받기
                  </button>
                </div>
              )}
                  </div>
          ))}
          
          {/* 편집 모드에서 장소 추가 버튼 */}
          {isEditMode && (
            <div className="add-location-container">
                  <button 
                className="add-location-btn"
                onClick={() => handleAddLocation(currentDayKey)}
              >
                <div className="add-location-content">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span className="add-location-text">장소 추가</span>
                </div>
                  </button>
                </div>
              )}
        </div>

        {/* 여행 시작 버튼 */}
        <div className="travel-button-container">
          <button className="travel-btn" onClick={isEditMode ? handleEditClick : handleTravelClick}>
            {isEditMode ? '완료' : '이 코스로 여행하기'}
          </button>
        </div>
        </div>

      {/* 장소 검색 모달 */}
      <LocationSearchModal
        isOpen={isSearchModalOpen}
        onClose={handleCloseSearchModal}
        onSelectLocation={handleSelectLocation}
        dayKey={searchModalDayKey}
      />
      </div>

      <Footer />
    </main>
  );
};

export default CourseStep3;

