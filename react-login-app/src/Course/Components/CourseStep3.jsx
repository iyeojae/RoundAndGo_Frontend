import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Layout/Header';
import Footer from '../../Layout/Footer';
import './CourseStep3.css';

const CourseStep3 = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [selectedDay, setSelectedDay] = useState(() => {
    const step1Data = JSON.parse(sessionStorage.getItem('courseStep1') || '{}');
    const selectedPeriod = step1Data.selectedPeriod;
    
    if (selectedPeriod === 'day') {
      return 0; // 당일치기
    } else {
      return 1; // 1일차부터 시작
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  
  // 예시 데이터
  const [courseData, setCourseData] = useState({
    day0: [ // 당일치기
      {
        id: 1,
        name: "제주 골프클럽",
        type: "골프장",
        address: "제주특별자치도 제주시 애월읍",
        coordinates: { lat: 33.4615, lng: 126.3112 },
        imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=300&h=200&fit=crop",
        time: "09:00-12:00",
        description: "제주도의 아름다운 자연을 배경으로 한 프리미엄 골프장"
      },
      {
        id: 2,
        name: "성산일출봉",
        type: "관광지",
        address: "제주특별자치도 서귀포시 성산읍",
        coordinates: { lat: 33.4584, lng: 126.9422 },
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
        time: "14:00-16:00",
        description: "유네스코 세계자연유산으로 지정된 제주도의 대표 관광지"
      },
      {
        id: 3,
        name: "제주 흑돼지 맛집",
        type: "맛집",
        address: "제주특별자치도 제주시 연동",
        coordinates: { lat: 33.4996, lng: 126.5312 },
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=300&h=200&fit=crop",
        time: "18:00-20:00",
        description: "제주도 특산품 흑돼지를 맛볼 수 있는 대표 맛집"
      }
     ],
    day1: [ // 1일차
      {
        id: 4,
        name: "제주 골프리조트",
        type: "골프장",
        address: "제주특별자치도 서귀포시 중문동",
        coordinates: { lat: 33.2398, lng: 126.4132 },
        imageUrl: "https://images.unsplash.com/photo-1593111774240-d529f12cf4b8?w=300&h=200&fit=crop",
        time: "08:00-11:00",
        description: "중문 관광단지 내 위치한 고급 골프 리조트"
      },
      {
        id: 5,
        name: "천지연폭포",
        type: "관광지",
        address: "제주특별자치도 서귀포시 서귀동",
        coordinates: { lat: 33.2460, lng: 126.5600 },
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
        time: "13:00-15:00",
        description: "제주도 3대 폭포 중 하나로 아름다운 자연 경관"
      },
      {
        id: 6,
        name: "제주 한라봉 농장",
        type: "체험",
        address: "제주특별자치도 서귀포시 남원읍",
        coordinates: { lat: 33.2797, lng: 126.7000 },
        imageUrl: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=300&h=200&fit=crop",
        time: "16:00-18:00",
        description: "제주도 특산품 한라봉 따기 체험과 시식"
      }
     ],
    day2: [ // 2일차
      {
        id: 7,
        name: "제주 골프월드",
        type: "골프장",
        address: "제주특별자치도 제주시 조천읍",
        coordinates: { lat: 33.5347, lng: 126.6347 },
        imageUrl: "https://images.unsplash.com/photo-1587174486073-ae5e5cef1e30?w=300&h=200&fit=crop",
        time: "09:00-12:00",
        description: "제주도 동부 지역의 대표적인 골프장"
      },
      {
        id: 8,
        name: "성읍민속마을",
        type: "관광지",
        address: "제주특별자치도 서귀포시 표선면",
        coordinates: { lat: 33.3867, lng: 126.8000 },
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
        time: "14:00-16:00",
        description: "제주도 전통 가옥과 생활 문화를 체험할 수 있는 민속마을"
      },
      {
        id: 9,
        name: "제주 해녀촌",
        type: "체험",
        address: "제주특별자치도 제주시 구좌읍",
        coordinates: { lat: 33.5250, lng: 126.8500 },
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
        time: "17:00-19:00",
        description: "제주도 해녀 문화와 신선한 해산물을 체험"
      }
     ]
  });
  
  // 지도 관련
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // 현재 선택된 날짜의 데이터
    const currentDayData = selectedDay === 0 ? courseData.day0 : 
                          selectedDay === 1 ? courseData.day1 : courseData.day2;
    
  // 뒤로가기 핸들러
  const handleBack = () => {
    navigate('/course/step2');
  };

  // 편집 버튼 핸들러
  const handleEditClick = () => {
    console.log('편집 버튼 클릭');
  };

  // 다시 추천 버튼 핸들러
  const handleRerollClick = () => {
    console.log('다시 추천 버튼 클릭');
  };

  // 여행 시작 버튼 핸들러
  const handleTravelClick = () => {
    console.log('여행 시작 버튼 클릭');
    navigate('/main');
  };

  // 로딩 완료
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
        <div ref={mapRef} className="kakao-map" style={{ width: '100%', height: '100%' }}></div>
        </div>

      {/* 드래그 헤더 - 숨김 상태일 때만 보임 */}
      {!showDetails && (
        <div 
          className="course-details-header"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="drag-handle"></div>
        </div>
      )}

      {/* 코스 상세 정보 - 슬라이드 */}
      <div className={`course-details ${showDetails ? 'show' : ''}`}>
        {/* 드래그 헤더 - show 상태일 때만 보임 */}
        {showDetails && (
        <div 
          className="course-details-header"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="drag-handle"></div>
      </div>
        )}
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
            } else if (selectedPeriod === '1night') {
              // 1박 2일
                    for (let i = 1; i <= 2; i++) {
              tabs.push(
          <button 
                          key={i}
                          className={`day-tab ${selectedDay === i ? 'active' : ''}`}
                          onClick={() => setSelectedDay(i)}
                        >
                          {i}일차
          </button>
              );
                    }
            } else if (selectedPeriod === '2night') {
              // 2박 3일
              for (let i = 1; i <= 3; i++) {
                tabs.push(
                  <button 
                    key={i}
                    className={`day-tab ${selectedDay === i ? 'active' : ''}`}
                    onClick={() => setSelectedDay(i)}
                  >
                    {i}일차
                  </button>
                );
              }
            } else if (selectedPeriod === '3night') {
              // 3박 4일
              for (let i = 1; i <= 4; i++) {
                tabs.push(
                  <button 
                    key={i}
                    className={`day-tab ${selectedDay === i ? 'active' : ''}`}
                    onClick={() => setSelectedDay(i)}
                  >
                    {i}일차
                  </button>
                );
              }
            }
            
            return tabs;
          })()}
        </div>

        {/* 액션 버튼 */}
        <div className="action-buttons">
          <button className="action-btn edit-btn" onClick={handleEditClick}>
                  <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.75 8.41667L9.16667 2L12.375 5.20833L5.95833 11.625H2.75V8.41667Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M1 14.25H15" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
            편집
          </button>
          <button className="action-btn reroll-btn" onClick={handleRerollClick}>
                  <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.8022 0.63623C11.0726 0.69055 11.2476 0.953679 11.1938 1.22412L10.6753 3.81982C10.5961 4.21568 10.286 4.5258 9.89014 4.60498L7.29443 5.12354C7.02393 5.17744 6.76087 5.00234 6.70654 4.73193C6.65251 4.46122 6.8284 4.19721 7.09912 4.14307L8.896 3.78271C8.42319 3.41536 7.7383 3.00884 6.94482 2.77393C5.94425 2.47779 4.80993 2.4607 3.69092 3.08154C2.5721 3.70241 1.98677 4.6736 1.7085 5.6792C1.42585 6.7008 1.4737 7.72054 1.59814 8.31885C1.68222 8.72412 1.42231 9.1211 1.01709 9.20557C0.611701 9.2899 0.214918 9.02981 0.130371 8.62451C-0.0360755 7.82462 -0.0921687 6.56096 0.262207 5.27979C0.621105 3.98256 1.41367 2.62992 2.96338 1.77002C4.51321 0.910153 6.07997 0.954368 7.37061 1.33643C8.39961 1.64105 9.27622 2.16773 9.88721 2.65576L10.2134 1.02881C10.2676 0.758151 10.5315 0.582118 10.8022 0.63623Z" fill="white"/>
                    <path d="M1.81934 13.6382C1.54917 13.5837 1.37399 13.3206 1.42773 13.0503L1.94629 10.4546C2.02544 10.0588 2.33575 9.74872 2.73145 9.66943L5.32715 9.15088C5.59766 9.09697 5.86071 9.27207 5.91504 9.54248C5.96913 9.81322 5.79321 10.0772 5.52246 10.1313L3.72559 10.4917C4.19841 10.8591 4.88411 11.2655 5.67773 11.5005C6.67815 11.7965 7.81188 11.8135 8.93066 11.1929C10.0496 10.572 10.6358 9.60092 10.9141 8.59521C11.1967 7.57356 11.1479 6.55386 11.0234 5.95557C10.9393 5.5502 11.2001 5.1532 11.6055 5.06885C12.0107 4.98474 12.4066 5.24477 12.4912 5.6499C12.6577 6.44981 12.7138 7.71343 12.3594 8.99463C12.0005 10.2919 11.2079 11.6445 9.6582 12.5044C8.10839 13.3642 6.54158 13.3201 5.25098 12.938C4.22194 12.6333 3.34533 12.1067 2.73438 11.6187L2.4082 13.2456C2.35394 13.5163 2.09004 13.6923 1.81934 13.6382Z" fill="white"/>
                  </svg>
            다시 추천
          </button>
        </div>

        {/* 일정 목록 */}
        <div className="itinerary-list">
          {currentDayData.map((location, index) => (
                  <div key={location.id}>
                    {/* 장소 정보 */}
              <div className="itinerary-item">
              <div className="location-info">
                        <div className="location-icon">
                          <div className="icon-number">{index + 1}</div>
                          <div className="icon-symbol">
                            {location.type === '골프장' ? (
                              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="9" fill="#269962"/>
                                <mask id="path-2-inside-1_1007_659" fill="white">
                                  <path d="M18.4805 8C21.6142 8 24.3926 9.52041 26.1187 11.8638C26.2605 12.0562 26.2336 12.3221 26.0646 12.4911L21.2051 17.3515C21.0098 17.5468 21.0098 17.8633 21.2051 18.0586L25.8688 22.7224C26.0424 22.8959 26.0654 23.1706 25.913 23.363C24.1765 25.5543 21.4935 26.9609 18.4805 26.9609C13.2445 26.9607 9 22.7165 9 17.4805C9 12.2445 13.2445 8.00025 18.4805 8Z"/>
                                </mask>
                                <path d="M18.4805 8V6H18.4804L18.4805 8ZM18.4805 26.9609L18.4804 28.9609H18.4805V26.9609ZM9 17.4805H7H9ZM25.8688 22.7224L27.2831 21.3081L25.8688 22.7224ZM21.2051 17.3515L22.6194 18.7656V18.7656L21.2051 17.3515ZM26.1187 11.8638L24.5084 13.0499L26.1187 11.8638ZM26.0646 12.4911L24.6503 11.077L26.0646 12.4911ZM18.4805 8V10C20.9517 10 23.143 11.1962 24.5084 13.0499L26.1187 11.8638L27.729 10.6776C25.6422 7.8446 22.2767 6 18.4805 6V8ZM26.0646 12.4911L24.6503 11.077L19.7907 15.9374L21.2051 17.3515L22.6194 18.7656L27.479 13.9052L26.0646 12.4911ZM21.2051 18.0586L19.7909 19.4728L24.4546 24.1366L25.8688 22.7224L27.2831 21.3081L22.6193 16.6444L21.2051 18.0586ZM25.913 23.363L24.3455 22.1208C22.9715 23.8547 20.856 24.9609 18.4805 24.9609V26.9609V28.9609C22.131 28.9609 25.3816 27.2538 27.4805 24.6051L25.913 23.363ZM18.4805 26.9609L18.4806 24.9609C14.349 24.9607 11 21.6118 11 17.4805H9H7C7 23.8212 12.14 28.9606 18.4804 28.9609L18.4805 26.9609ZM9 17.4805H11C11 13.3491 14.349 10.0002 18.4806 10L18.4805 8L18.4804 6C12.14 6.0003 7 11.1398 7 17.4805H9ZM25.8688 22.7224L24.4546 24.1366C23.9498 23.6318 23.8328 22.7678 24.3455 22.1208L25.913 23.363L27.4805 24.6051C28.298 23.5735 28.1349 22.16 27.2831 21.3081L25.8688 22.7224ZM21.2051 17.3515L19.7907 15.9374C18.8145 16.9138 18.8146 18.4966 19.7909 19.4728L21.2051 18.0586L22.6193 16.6444C23.205 17.2301 23.2051 18.1798 22.6194 18.7656L21.2051 17.3515ZM26.1187 11.8638L24.5084 13.0499C24.0324 12.4038 24.1582 11.5691 24.6503 11.077L26.0646 12.4911L27.479 13.9052C28.3089 13.0751 28.4885 11.7086 27.729 10.6776L26.1187 11.8638Z" fill="white" mask="url(#path-2-inside-1_1007_659)"/>
                                <circle cx="17.3555" cy="13.4805" r="0.5" fill="#269962" stroke="white"/>
                              </svg>
                            ) : location.type === '맛집' ? (
                              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="36" height="36" rx="9" fill="#EA580C"/>
                                <path d="M26.0342 8.00146C26.0515 8.00206 26.0688 8.0029 26.0859 8.00439C26.1087 8.00633 26.131 8.00975 26.1533 8.01318C26.1624 8.0146 26.1716 8.01542 26.1807 8.01709C26.1875 8.01834 26.1944 8.0196 26.2012 8.021L26.2676 8.0376H26.2695C26.3244 8.05292 26.3771 8.07316 26.4277 8.09717C26.4396 8.10278 26.4513 8.10868 26.4629 8.11475C26.4762 8.12173 26.489 8.12965 26.502 8.13721C26.5147 8.14461 26.5276 8.1517 26.54 8.15967C26.5554 8.16956 26.5702 8.18022 26.585 8.19092C26.5984 8.20059 26.6121 8.20987 26.625 8.22021C26.6354 8.2286 26.6452 8.2378 26.6553 8.24658C26.6685 8.25805 26.6817 8.26955 26.6943 8.28174C26.7034 8.29054 26.7119 8.29994 26.7207 8.30908C26.7365 8.32551 26.7519 8.34229 26.7666 8.35986C26.7733 8.36786 26.7797 8.37607 26.7861 8.38428C26.7964 8.39742 26.8067 8.41059 26.8164 8.42432C26.8288 8.44179 26.8403 8.45975 26.8516 8.47803C26.8581 8.48872 26.8649 8.49926 26.8711 8.51025C26.9289 8.61271 26.9677 8.72637 26.9863 8.84717C26.9885 8.86091 26.9916 8.87445 26.9932 8.88818C26.9949 8.90337 26.9951 8.9187 26.9961 8.93408C26.9974 8.95336 26.9989 8.97251 26.999 8.9917C26.999 8.99463 27 8.99755 27 9.00049V26.5005C27 27.0528 26.5523 27.5005 26 27.5005C25.4477 27.5005 25 27.0528 25 26.5005V21.5005H24C22.8954 21.5005 22 20.6051 22 19.5005V16.0005C22 11.0509 24.0456 8.65641 25.6045 8.08057C25.6574 8.05778 25.7133 8.04127 25.7705 8.02783C25.7754 8.02667 25.7802 8.02501 25.7852 8.02393C25.8054 8.01949 25.826 8.01637 25.8467 8.01318C25.8604 8.01104 25.874 8.00791 25.8877 8.00635C25.9029 8.00465 25.9182 8.00443 25.9336 8.00342C25.9489 8.00239 25.9642 8.00081 25.9795 8.00049H26C26.0114 8.00049 26.0228 8.00108 26.0342 8.00146ZM25 11.3101C24.4734 12.2338 24 13.7122 24 16.0005V19.5005H25V11.3101Z" fill="white"/>
                                <path d="M17.8984 8C18.4507 8 18.8983 8.44781 18.8984 9V13.5879C18.8984 14.6925 18.003 15.5879 16.8984 15.5879H15.4492V26C15.4492 26.5523 15.0015 27 14.4492 27C13.8971 26.9998 13.4492 26.5521 13.4492 26V15.5879H12C10.8956 15.5877 10 14.6924 10 13.5879V9C10.0001 8.4479 10.4479 8.00015 11 8C11.5522 8 11.9999 8.44781 12 9V13.5879H13.4492V9C13.4494 8.44797 13.8972 8.00023 14.4492 8C15.0014 8 15.4491 8.44783 15.4492 9V13.5879H16.8984V9C16.8985 8.44801 17.3465 8.00032 17.8984 8Z" fill="white"/>
                              </svg>
                            ) : location.type === '숙소' ? (
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
                            ) : location.type === '관광지' ? (
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
                          <p className="location-type">{location.type}</p>
                  <p className="location-address">{location.address}</p>
                          <p className="location-time">{location.time}</p>
                  <div className="location-actions">
                            <button className="location-btn">
                              📍 위치보기
                    </button>
                            <button className="call-btn">
                              📞 전화걸기
                    </button>
                  </div>
                  </div>
                </div>
              </div>

                    {/* 다음 장소까지 교통수단 정보 (마지막 장소가 아닌 경우) */}
              {index < currentDayData.length - 1 && (
                <div className="transport-info-between">
                  <div className="transport-info-header">
                    <div className="transport-info-title">
                            <span className="transport-icon">🚗</span>
                      <span>다음 목적지까지</span>
                    </div>
                          <div className="transport-distance">2.3km</div>
                  </div>
                  
                  <div className="transport-modes">
                          <div className="transport-mode-card">
                            <div className="transport-mode-icon">🚗</div>
                            <div className="transport-mode-info">
                              <div className="transport-mode-label">자동차</div>
                              <div className="transport-mode-time">8분</div>
                            </div>
                          </div>
                          <div className="transport-mode-card">
                            <div className="transport-mode-icon">🚌</div>
                            <div className="transport-mode-info">
                              <div className="transport-mode-label">대중교통</div>
                              <div className="transport-mode-time">15분</div>
                            </div>
                          </div>
                          <div className="transport-mode-card">
                            <div className="transport-mode-icon">🚶</div>
                            <div className="transport-mode-info">
                              <div className="transport-mode-label">도보</div>
                              <div className="transport-mode-time">25분</div>
                        </div>
                      </div>
                  </div>
                  
                        <button className="transport-route-button">
                          경로 안내 받기
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
    </main>
  );
};

export default CourseStep3;