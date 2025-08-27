/**
 * FirstMainPage.jsx
 * 
 * 제주도 지역별 골프장 선택 페이지
 * 사용자가 지도에서 원하는 지역을 클릭하면 해당 지역의 골프장 목록을 보여주는 페이지입니다.
 * 
 * 주요 기능:
 * 1. 제주도 지역별 골프장 선택
 * 2. 선택된 지역의 골프장 목록 표시 (최대 3개)
 * 3. 골프장 이미지 슬라이더 (중앙 강조 효과)
 * 4. 골프장 검색 기능
 * 5. 메인 페이지로 이동
 */

import React, { useState, useEffect } from 'react';
import './FirstMainPage.css';
import { useKakaoLoginDetector } from '../useKakaoLoginDetector';
import map_jeju from './map_jeju.svg';

function FirstMainPage() {
  // 🎯 백그라운드에서 카카오 로그인 성공 자동 감지 (UI 영향 없음)
  useKakaoLoginDetector();

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [golfCourses, setGolfCourses] = useState([]);
  const [selectedRegionInfo, setSelectedRegionInfo] = useState(null);

  // 제주도 지역 정보
  const regions = {
    jeju: { name: '제주시', coordinates: { x: 350, y: 300 } },
    seogwipo: { name: '서귀포시', coordinates: { x: 350, y: 400 } },
    hallim: { name: '한림읍', coordinates: { x: 200, y: 250 } },
    aewol: { name: '애월읍', coordinates: { x: 250, y: 200 } },
    jocheon: { name: '조천읍', coordinates: { x: 400, y: 250 } },
    gujwa: { name: '구좌읍', coordinates: { x: 500, y: 300 } },
    seongsan: { name: '성산읍', coordinates: { x: 550, y: 350 } },
    pyoseon: { name: '표선면', coordinates: { x: 500, y: 400 } },
    namwon: { name: '남원읍', coordinates: { x: 400, y: 450 } },
    daejeong: { name: '대정읍', coordinates: { x: 150, y: 400 } }
  };

  // 지역 클릭 핸들러
  const handleRegionClick = async (regionKey) => {
    const regionInfo = regions[regionKey];
    setSelectedRegion(regionKey);
    setSelectedRegionInfo(regionInfo);

    try {
      // 백엔드 API 호출로 해당 지역의 골프장 정보 가져오기
      const res = await fetch(`https://roundandgo.onrender.com/api/golf-courses/search-by-address?address=${selectedRegionInfo.name}`);
      const data = await res.json();
      setGolfCourses(data.slice(0, 3)); // 최대 3개만 표시
    } catch (error) {
      console.error('골프장 정보를 가져오는데 실패했습니다:', error);
      setGolfCourses([]);
    }
  };

  return (
    <div className="first-main-container">
      <div className="header">
        <h1>아래 지도에서 원하는골프장을 선택해주세요</h1>
      </div>
      
      <div className="map-container">
        <img src={map_jeju} alt="제주도 지도" className="jeju-map" />
        
        {/* 지역 선택 버튼들 */}
        {Object.entries(regions).map(([key, region]) => (
          <button
            key={key}
            className={`region-button ${selectedRegion === key ? 'selected' : ''}`}
            style={{
              position: 'absolute',
              left: region.coordinates.x,
              top: region.coordinates.y,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => handleRegionClick(key)}
          >
            {region.name}
          </button>
        ))}
      </div>

      {/* 선택된 지역의 골프장 목록 */}
      {selectedRegionInfo && (
        <div className="golf-courses-section">
          <h2>{selectedRegionInfo.name} 골프장</h2>
          <div className="golf-courses-grid">
            {golfCourses.length > 0 ? (
              golfCourses.map((course, index) => (
                <div key={index} className="golf-course-card">
                  <img 
                    src={course.imageUrl || '/images/default-golf.jpg'} 
                    alt={course.name}
                    className="golf-course-image"
                  />
                  <div className="golf-course-info">
                    <h3>{course.name}</h3>
                    <p>{course.address}</p>
                    <p className="phone">{course.phone}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>해당 지역에 골프장 정보가 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FirstMainPage;
