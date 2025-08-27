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

  // 제주도 지역 정보 (CSS 좌표에 맞게 조정)
  const regions = {
    jeju: { name: '제주시', coordinates: { x: 200, y: 150 } },
    seogwipo: { name: '서귀포시', coordinates: { x: 200, y: 220 } },
    hallim: { name: '한림읍', coordinates: { x: 120, y: 130 } },
    aewol: { name: '애월읍', coordinates: { x: 150, y: 100 } },
    jocheon: { name: '조천읍', coordinates: { x: 230, y: 120 } },
    gujwa: { name: '구좌읍', coordinates: { x: 280, y: 140 } },
    seongsan: { name: '성산읍', coordinates: { x: 310, y: 170 } },
    pyoseon: { name: '표선면', coordinates: { x: 280, y: 200 } },
    namwon: { name: '남원읍', coordinates: { x: 230, y: 230 } },
    daejeong: { name: '대정읍', coordinates: { x: 100, y: 200 } }
  };

  // 지역 클릭 핸들러
  const handleRegionClick = async (regionKey) => {
    const regionInfo = regions[regionKey];
    setSelectedRegion(regionKey);
    setSelectedRegionInfo(regionInfo);

    try {
      // 백엔드 API 호출로 해당 지역의 골프장 정보 가져오기
      const res = await fetch(`https://roundandgo.onrender.com/api/golf-courses/search-by-address?address=${regionInfo.name}`);
      const data = await res.json();
      setGolfCourses(data.slice(0, 3)); // 최대 3개만 표시
    } catch (error) {
      console.error('골프장 정보를 가져오는데 실패했습니다:', error);
      setGolfCourses([]);
    }
  };

  return (
    <div className="FirstMainPage">
      <div className="content">
        <div className="First">
          <p>아래 지도에서 원하는<br />골프장을 선택해주세요</p>
        </div>
        
        <div className="Map">
          <img src={map_jeju} alt="제주도 지도" />
          
          {/* 지역 선택 버튼들 */}
          {Object.entries(regions).map(([key, region]) => (
            <button
              key={key}
              className={`map-region-button ${selectedRegion === key ? 'selected' : ''}`}
              style={{
                left: region.coordinates.x,
                top: region.coordinates.y,
              }}
              onClick={() => handleRegionClick(key)}
            >
              {region.name}
            </button>
          ))}
        </div>

        {/* 선택된 지역의 골프장 목록 */}
        {selectedRegionInfo && (
          <div className="Top3ForRegion">
            <p>{selectedRegionInfo.name} 인기 골프장 Top 3</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FirstMainPage;
