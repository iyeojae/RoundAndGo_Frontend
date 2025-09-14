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
      icon: '👑',
      iconColor: '#FF9500'
    },
    {
      id: 'value',
      title: '가성비',
      description: '합리적인 가격의 알찬 코스',
      icon: '💰',
      iconColor: '#20B2AA'
    },
    {
      id: 'resort',
      title: '리조트',
      description: '편안한 휴식과 여유',
      icon: '🏖️',
      iconColor: '#2196F3'
    },
    {
      id: 'emotional',
      title: '감성',
      description: '아름다운 경치와 낭만',
      icon: '💖',
      iconColor: '#FF69B4'
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
  const handleNext = () => {
    if (!selectedStyle) return;
    
    // 1단계 데이터 가져오기
    const step1Data = JSON.parse(sessionStorage.getItem('courseStep1') || '{}');
    
    // 2단계 데이터 저장
    const step2Data = {
      selectedStyle
    };
    
    sessionStorage.setItem('courseStep2', JSON.stringify(step2Data));
    
    // 3단계로 이동
    navigate('/course/step3');
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
            <div className="style-icon">🎨</div>
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
                  style={{ backgroundColor: style.iconColor }}
                >
                  <span className="style-icon-text">{style.icon}</span>
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
