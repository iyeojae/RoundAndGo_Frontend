import React, { useState, useEffect } from 'react';
import { getAuthToken } from '../../utils/cookieUtils';
import './LocationSearchModal.css';

const LocationSearchModal = ({ isOpen, onClose, onSelectLocation, dayKey }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: '전체', label: '전체', icon: '🔍' },
    { id: '관광지', label: '관광지', icon: '🏛️' },
    { id: '맛집', label: '맛집', icon: '🍽️' },
    { id: '숙소', label: '숙소', icon: '🏨' }
  ];

  // 검색 실행
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const accessToken = getAuthToken();
      if (!accessToken) {
        throw new Error('로그인이 필요합니다.');
      }

      let apiUrl = '';
      let results = [];

      // 카테고리에 따른 API 엔드포인트 선택
      if (selectedCategory === '전체') {
        // 통합 검색 API 사용 (우선)
        try {
          const integratedUrl = searchQuery.trim() 
            ? `https://api.roundandgo.com/api/tour-infos/jeju/integrated-search?keyword=${encodeURIComponent(searchQuery)}`
            : 'https://api.roundandgo.com/api/tour-infos/jeju/integrated-search';
            
          const integratedRes = await fetch(integratedUrl, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (integratedRes.ok) {
            const integratedData = await integratedRes.json();
            const integratedResults = Array.isArray(integratedData.data) ? integratedData.data : Array.isArray(integratedData) ? integratedData : [];
            results = integratedResults.map(item => ({ ...item, type: item.type || '기타' }));
          } else {
            throw new Error('통합 검색 API 실패');
          }
        } catch (integratedError) {
          console.warn('통합 검색 실패, 개별 검색으로 대체:', integratedError);
          
          // 통합 검색 실패 시 개별 검색으로 대체
          const [attractionsRes, restaurantsRes, accommodationsRes] = await Promise.all([
            fetch(`https://api.roundandgo.com/api/tour-infos/jeju/search/attractions?keyword=${encodeURIComponent(searchQuery)}`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }).catch(() => null),
            fetch(`https://api.roundandgo.com/api/tour-infos/jeju/search/restaurants?keyword=${encodeURIComponent(searchQuery)}`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }).catch(() => null),
            fetch(`https://api.roundandgo.com/api/tour-infos/jeju/search/accommodations?keyword=${encodeURIComponent(searchQuery)}`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              }
            }).catch(() => null)
          ]);

          // 각 응답을 안전하게 처리
          const attractions = attractionsRes ? await attractionsRes.json().catch(() => ({ data: [] })) : { data: [] };
          const restaurants = restaurantsRes ? await restaurantsRes.json().catch(() => ({ data: [] })) : { data: [] };
          const accommodations = accommodationsRes ? await accommodationsRes.json().catch(() => ({ data: [] })) : { data: [] };

          // API 응답에서 data 배열 추출
          const attractionsData = Array.isArray(attractions.data) ? attractions.data : Array.isArray(attractions) ? attractions : [];
          const restaurantsData = Array.isArray(restaurants.data) ? restaurants.data : Array.isArray(restaurants) ? restaurants : [];
          const accommodationsData = Array.isArray(accommodations.data) ? accommodations.data : Array.isArray(accommodations) ? accommodations : [];

          results = [
            ...attractionsData.map(item => ({ ...item, type: '관광지' })),
            ...restaurantsData.map(item => ({ ...item, type: '맛집' })),
            ...accommodationsData.map(item => ({ ...item, type: '숙소' }))
          ];
        }
      } else {
        // 특정 카테고리 검색
        switch (selectedCategory) {
          case '관광지':
            apiUrl = `https://api.roundandgo.com/api/tour-infos/jeju/search/attractions?keyword=${encodeURIComponent(searchQuery)}`;
            break;
          case '맛집':
            apiUrl = `https://api.roundandgo.com/api/tour-infos/jeju/search/restaurants?keyword=${encodeURIComponent(searchQuery)}`;
            break;
          case '숙소':
            apiUrl = `https://api.roundandgo.com/api/tour-infos/jeju/search/accommodations?keyword=${encodeURIComponent(searchQuery)}`;
            break;
          default:
            throw new Error('잘못된 카테고리입니다.');
        }

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`);
        }

        const data = await response.json();
        console.log('API 응답:', data); // 디버깅용
        
        // API 응답 구조에 따라 데이터 추출
        const responseData = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        results = responseData.map(item => ({ ...item, type: selectedCategory }));
      }

      // API 응답을 모달에서 사용할 형태로 변환
      const transformedResults = results.map((item, index) => ({
        id: item.id || `search_${Date.now()}_${index}`,
        name: item.name || item.title || '이름 없음',
        type: item.type,
        address: item.address || item.addr1 || item.location || '주소 정보 없음',
        coordinates: item.coordinates || { 
          lat: parseFloat(item.mapy) || 33.5, 
          lng: parseFloat(item.mapx) || 126.5 
        },
        description: item.description || item.summary || `${item.type} 정보`,
        imageUrl: item.imageUrl || item.thumbnail || item.firstimage || null
      }));

      setSearchResults(transformedResults);
    } catch (error) {
      console.error('검색 오류:', error);
      setSearchResults([]);
      alert('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 장소 선택
  const handleSelectLocation = (location) => {
    onSelectLocation(dayKey, location);
    onClose();
  };

  // 모달 닫기
  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  // Enter 키로 검색
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 모달 외부 클릭으로 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="location-search-modal-overlay" onClick={handleOverlayClick}>
      <div className="location-search-modal">
        {/* 헤더 */}
        <div className="modal-header">
          <h2>장소추가</h2>
          <button className="close-btn" onClick={handleClose}>
            취소
          </button>
        </div>

        {/* 카테고리 선택 */}
        <div className="category-selector">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-label">{category.label}</span>
            </button>
          ))}
        </div>

        {/* 검색 입력 */}
        <div className="search-input-container">
          <div className="search-input-wrapper">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="장소를 입력해주세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
            />
          </div>
        </div>

        {/* 검색 결과 */}
        <div className="search-results">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>검색 중입니다...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="results-list">
              {searchResults.map((location) => (
                <div 
                  key={location.id}
                  className="result-item"
                >
                  <div className="result-image">
                    <img 
                      src={location.imageUrl || '/images/photo-placeholder.svg'} 
                      alt={location.name}
                      onError={(e) => {
                        e.target.src = '/images/photo-placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="result-info">
                    <h4 className="result-name">{location.name}</h4>
                    <p className="result-type">{location.description}</p>
                    <p className="result-address">{location.address}</p>
                  </div>
                  <div className="result-actions">
                    <button 
                      className="add-btn"
                      onClick={() => handleSelectLocation(location)}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      추가
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="no-results">
              <p>검색 결과가 없습니다.</p>
              <p>다른 키워드로 검색해보세요.</p>
            </div>
          ) : (
            <div className="search-prompt">
              <p>원하는 장소를 검색해보세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSearchModal;
