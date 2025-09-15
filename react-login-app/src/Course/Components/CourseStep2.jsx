import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Layout/Header';
import Footer from '../../Layout/Footer';
import './CourseStep2.css';

const CourseStep2 = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [selectedStyle, setSelectedStyle] = useState('');

  // 스타일 옵션
  const styleOptions = [
    {
      id: 'premium',
      title: '프리미엄',
      description: '최고급 호텔과 특별한 경험',
      icon: (
        <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="40" fill="#FFC559"/>
          <path d="M24 32.9549L24 33.1947M24 33.1947L24 47.8242C24 48.1003 24.2239 48.3242 24.5 48.3242H55.4847C55.7609 48.3242 55.9847 48.1003 55.9847 47.8242V33.8209C55.9847 33.436 55.5681 33.1954 55.2347 33.3879L47.2792 37.981C47.0401 38.1191 46.7343 38.0371 46.5962 37.798L40.2177 26.75C40.0252 26.4167 39.5441 26.4167 39.3517 26.75L32.9731 37.798C32.835 38.0371 32.5292 38.1191 32.2901 37.981L24 33.1947Z" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <path d="M24 53H55.9847" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      selectedIcon: (
        <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="40" fill="#269962"/>
          <path d="M24 32.9549L24 33.1947M24 33.1947L24 47.8242C24 48.1003 24.2239 48.3242 24.5 48.3242H55.4847C55.7609 48.3242 55.9847 48.1003 55.9847 47.8242V33.8209C55.9847 33.436 55.5681 33.1954 55.2347 33.3879L47.2792 37.981C47.0401 38.1191 46.7343 38.0371 46.5962 37.798L40.2177 26.75C40.0252 26.4167 39.5441 26.4167 39.3517 26.75L32.9731 37.798C32.835 38.0371 32.5292 38.1191 32.2901 37.981L24 33.1947Z" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <path d="M24 53H55.9847" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      iconColor: '#FFC559'
    },
    {
      id: 'value',
      title: '가성비',
      description: '합리적인 가격의 알찬 코스',
      icon: (
        <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="40" fill="#66CEB0"/>
          <path d="M40 27.5C43.5131 27.5 46.8686 29.6336 49.4131 32.9795C51.9499 36.3153 53.5 40.6391 53.5 44.5459C53.4998 52.2951 47.4138 58.5 40 58.5C32.5862 58.5 26.5002 52.2951 26.5 44.5459C26.5 40.6391 28.0501 36.3153 30.5869 32.9795C33.1314 29.6336 36.4869 27.5 40 27.5Z" stroke="white" strokeWidth="3"/>
          <path d="M35.5 27.5302L32.2781 20.6262C32.1694 20.3931 32.3873 20.1318 32.6399 20.1805C33.9808 20.4392 36.1461 20.5455 37.5 19.5302C38.4892 18.7883 40.9462 18.8658 41.9671 19.509C41.9894 19.5231 42.0124 19.5344 42.0375 19.5427C43.3993 19.9926 45.1653 20.3562 46.9676 20.1183C47.2008 20.0875 47.3931 20.3152 47.3105 20.5355L44.5 28.0302" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <path d="M35 41L36.6962 47.3303C36.8103 47.756 37.3792 47.8367 37.6071 47.4595L39.5963 44.168C39.7849 43.8559 40.2334 43.8442 40.438 44.146L42.7523 47.559C42.9926 47.9134 43.5382 47.8214 43.6491 47.4078L45.366 41" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <path d="M45 44H46" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <path d="M34 44H35" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      selectedIcon: (
        <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="40" fill="#269962"/>
          <path d="M40 27.5C43.5131 27.5 46.8686 29.6336 49.4131 32.9795C51.9499 36.3153 53.5 40.6391 53.5 44.5459C53.4998 52.2951 47.4138 58.5 40 58.5C32.5862 58.5 26.5002 52.2951 26.5 44.5459C26.5 40.6391 28.0501 36.3153 30.5869 32.9795C33.1314 29.6336 36.4869 27.5 40 27.5Z" stroke="white" strokeWidth="3"/>
          <path d="M35.5 27.5302L32.2781 20.6262C32.1694 20.3931 32.3873 20.1318 32.6399 20.1805C33.9808 20.4392 36.1461 20.5455 37.5 19.5302C38.4892 18.7883 40.9462 18.8658 41.9671 19.509C41.9894 19.5231 42.0124 19.5344 42.0375 19.5427C43.3993 19.9926 45.1653 20.3562 46.9676 20.1183C47.2008 20.0875 47.3931 20.3152 47.3105 20.5355L44.5 28.0302" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <path d="M35 41L36.6962 47.3303C36.8103 47.756 37.3792 47.8367 37.6071 47.4595L39.5963 44.168C39.7849 43.8559 40.2334 43.8442 40.438 44.146L42.7523 47.559C42.9926 47.9134 43.5382 47.8214 43.6491 47.4078L45.366 41" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <path d="M45 44H46" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <path d="M34 44H35" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      iconColor: '#66CEB0'
    },
    {
      id: 'resort',
      title: '리조트',
      description: '편안한 휴식과 여유',
      icon: (
        <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="40" fill="#668ECE"/>
          <path d="M20 57H59" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <path d="M24 57V23C24 22.4477 24.4477 22 25 22H48C48.5523 22 49 22.4477 49 23V32" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <rect x="30" y="28" width="4" height="4" fill="white"/>
          <rect x="30" y="38" width="4" height="4" fill="white"/>
          <rect x="30" y="48" width="4" height="4" fill="white"/>
          <path d="M57 36C57.5523 36 58 36.4477 58 37V57C58 57.5523 57.5523 58 57 58H39C38.4477 58 38 57.5523 38 57V37C38 36.4477 38.4477 36 39 36H57ZM46 52H50V48H46V52ZM46 40V44H50V40H46Z" fill="white"/>
        </svg>
      ),
      selectedIcon: (
        <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="40" fill="#269962"/>
          <path d="M20 57H59" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <path d="M24 57V23C24 22.4477 24.4477 22 25 22H48C48.5523 22 49 22.4477 49 23V32" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <rect x="30" y="28" width="4" height="4" fill="white"/>
          <rect x="30" y="38" width="4" height="4" fill="white"/>
          <rect x="30" y="48" width="4" height="4" fill="white"/>
          <path d="M57 36C57.5523 36 58 36.4477 58 37V57C58 57.5523 57.5523 58 57 58H39C38.4477 58 38 57.5523 38 57V37C38 36.4477 38.4477 36 39 36H57ZM46 52H50V48H46V52ZM46 40V44H50V40H46Z" fill="white"/>
        </svg>
      ),
      iconColor: '#668ECE'
    },
    {
      id: 'emotional',
      title: '감성',
      description: '아름다운 경치와 낭만',
      icon: (
        <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="40" fill="#CE668C"/>
          <path d="M40.1018 54.9911C36.608 53.2442 28.7627 47.8446 25.3323 40.2216C24.2206 37.0454 21.8067 29.9304 28.6673 26.8812C35.528 23.832 39.7842 29.4224 40.1018 32.5986" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <path d="M40.1018 54.9911C43.5956 53.2442 51.4409 47.8446 54.8713 40.2216C55.983 37.0454 58.3969 29.9304 51.5363 26.8812C44.6756 23.832 40.4194 29.4224 40.1018 32.5986" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      selectedIcon: (
        <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="40" fill="#269962"/>
          <path d="M40.1018 54.9911C36.608 53.2442 28.7627 47.8446 25.3323 40.2216C24.2206 37.0454 21.8067 29.9304 28.6673 26.8812C35.528 23.832 39.7842 29.4224 40.1018 32.5986" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <path d="M40.1018 54.9911C43.5956 53.2442 51.4409 47.8446 54.8713 40.2216C55.983 37.0454 58.3969 29.9304 51.5363 26.8812C44.6756 23.832 40.4194 29.4224 40.1018 32.5986" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      ),
      iconColor: '#CE668C'
    }
  ];

  // 컴포넌트 마운트 시 이전 단계 데이터 확인
  useEffect(() => {
    const step1Data = sessionStorage.getItem('courseStep1');
    if (!step1Data) {
      // 1단계 데이터가 없으면 1단계로 이동
      navigate('/course/step1');
    }
  }, [navigate]);

  // 다음 단계로 이동
  const handleNext = async () => {
    if (!selectedStyle) return;
    
    // 1단계 데이터 가져오기
    const step1Data = JSON.parse(sessionStorage.getItem('courseStep1') || '{}');
    
    // 2단계 데이터 저장
    const step2Data = {
      selectedStyle
    };
    
    sessionStorage.setItem('courseStep2', JSON.stringify(step2Data));
    
    try {
      // 당일치기 여부 확인
      const isSameDay = step1Data.selectedPeriod === 'day';
      
      // API 엔드포인트 결정 (직접 호출)
      const apiEndpoint = isSameDay 
        ? 'https://roundandgo.com/api/courses/recommendation/ai'
        : 'https://roundandgo.com/api/courses/recommendation/ai/multi-day';
      
      // API 요청 데이터 구성 (백엔드 엔티티 구조에 맞춤)
      const requestData = {
        // 코스 기본 정보
        courseName: `${step1Data.selectedPeriod === 'day' ? '당일치기' : step1Data.travelDays + '일'} ${step2Data.selectedStyle} 코스`,
        description: `${step1Data.selectedPeriod === 'day' ? '당일치기' : step1Data.travelDays + '일'} ${step2Data.selectedStyle} 여행 코스`,
        courseType: step2Data.selectedStyle, // 'premium', 'value', 'resort', 'emotional'
        
        // 여행 기간 정보
        startDate: step1Data.departureDate,
        travelDays: step1Data.travelDays, // 1, 2, 3, 4
        
        // 골프 시간 정보
        golfTimes: step1Data.golfTimes, // 골프 시간 배열
        
        // 추가 메타데이터
        isSameDay: isSameDay,
        period: step1Data.selectedPeriod, // 'day', '1night', '2night', '3night'
        arrivalDate: step1Data.arrivalDate
      };
      
      console.log('API 요청 데이터:', {
        endpoint: apiEndpoint,
        requestData: requestData,
        isSameDay: isSameDay,
        step1Data: step1Data,
        step2Data: step2Data
      });
      
      // API 호출
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API 응답:', result);
      
      // 결과를 sessionStorage에 저장
      sessionStorage.setItem('courseRecommendation', JSON.stringify(result));
      
      // 3단계로 이동
      navigate('/course/step3');
      
    } catch (error) {
      console.error('API 호출 중 오류:', error);
      // 오류가 발생해도 3단계로 이동 (개발 중이므로)
      navigate('/course/step3');
    }
  };

  // 이전 단계로 이동
  const handleBack = () => {
    navigate('/course/step1');
  };

  return (
    <div className="course-step2-page">
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
          <div className="step-item active">
            <div className="step-circle active">2</div>
            <span className="step-label active">스타일 설정</span>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            <div className="step-circle">3</div>
            <span className="step-label">코스 추천</span>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="step-content">
        {/* 안내 섹션 */}
        <div className="instruction-section">
          <div className="instruction-icon">
            <svg width="60" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="40" fill="url(#paint0_linear_0_1)"/>
              <path d="M50.5789 21.25C55.1207 21.25 58.8025 24.9318 58.8025 29.4736C58.8025 34.0154 55.1207 37.6973 50.5789 37.6973H42.3552V29.4736C42.3553 24.9319 46.0371 21.25 50.5789 21.25Z" stroke="white" strokeWidth="2.5"/>
              <path d="M28.4736 58.75C23.9318 58.75 20.25 55.0682 20.25 50.5264C20.25 45.9846 23.9318 42.3027 28.4736 42.3027L36.6973 42.3027L36.6973 50.5264C36.6972 55.0681 33.0154 58.75 28.4736 58.75Z" stroke="white" strokeWidth="2.5"/>
              <path d="M20.25 29.4736C20.25 24.9318 23.9318 21.25 28.4736 21.25C33.0154 21.25 36.6973 24.9318 36.6973 29.4736L36.6973 37.6973L28.4736 37.6973C23.9319 37.6972 20.25 34.0154 20.25 29.4736Z" stroke="white" strokeWidth="2.5"/>
              <path d="M58.8027 50.5264C58.8027 55.0682 55.1209 58.75 50.5791 58.75C46.0373 58.75 42.3555 55.0682 42.3555 50.5264L42.3555 42.3027L50.5791 42.3027C55.1209 42.3028 58.8027 45.9846 58.8027 50.5264Z" stroke="white" strokeWidth="2.5"/>
              <defs>
                <linearGradient id="paint0_linear_0_1" x1="14.4444" y1="11.1111" x2="64.4444" y2="71.1111" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#269962"/>
                  <stop offset="1" stopColor="#2C8C7D"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="instruction-title">여행 카테고리를 선택해주세요.</h2>
          <p className="instruction-subtitle">어떤 스타일의 여행을 원하시나요?</p>
        </div>

        {/* 스타일 선택 섹션 */}
        <div className="style-selection-section">
          <div className="style-grid">
            {styleOptions.map((style) => (
              <button
                key={style.id}
                className={`style-card ${selectedStyle === style.id ? 'selected' : ''}`}
                onClick={() => setSelectedStyle(style.id)}
              >
                <div 
                  className="style-icon-container"
                  style={{ backgroundColor: selectedStyle === style.id ? '#269962' : style.iconColor }}
                >
                  <span className="style-icon-text">
                    {selectedStyle === style.id && style.selectedIcon ? style.selectedIcon : style.icon}
                  </span>
                </div>
                <div className="style-content">
                  <h3 className="style-title">{style.title}</h3>
                  <p className="style-description">{style.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 다음 버튼 */}
        <div className="next-button-container">
          <button 
            className={`next-btn ${selectedStyle ? 'active' : ''}`}
            onClick={handleNext}
            disabled={!selectedStyle}
          >
            다음
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseStep2;
