import React from 'react';
import './LoadingPage.css';

const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <div className="wave-loader">
          <svg viewBox="0 0 300 100" className="wave-logo">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2C8C7D" />
                <stop offset="50%" stopColor="#4CAF50" />
                <stop offset="100%" stopColor="#66BB6A" />
              </linearGradient>
              <clipPath id="logo-clip">
                <text x="50%" y="60%" textAnchor="middle" fontSize="50" fontWeight="bold" fontFamily="Arial, sans-serif">
                  RoundAndGo
                </text>
              </clipPath>
            </defs>
            
            {/* 배경 */}
            <rect className="wave-bg" width="100%" height="100%" />
            
            {/* 파도 채우기 영역 */}
            <g clipPath="url(#logo-clip)">
              <rect className="wave-fill" width="100%" height="100%" />
              <path className="wave wave-1" d="M0 60 Q 30 40, 60 60 T 120 60 T 180 60 T 240 60 T 300 60 V100 H0 Z" fill="url(#waveGradient)" />
              <path className="wave wave-2" d="M0 70 Q 25 50, 50 70 T 100 70 T 150 70 T 200 70 T 250 70 T 300 70 V100 H0 Z" fill="url(#waveGradient)" opacity="0.7" />
              <path className="wave wave-3" d="M0 80 Q 20 60, 40 80 T 80 80 T 120 80 T 160 80 T 200 80 T 240 80 T 280 80 T 300 80 V100 H0 Z" fill="url(#waveGradient)" opacity="0.5" />
            </g>
          </svg>
        </div>

        <div className="loading-text">
          {message}
        </div>

        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;