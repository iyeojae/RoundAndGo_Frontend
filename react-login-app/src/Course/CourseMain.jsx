import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import CourseStep1 from './Components/CourseStep1';
import CourseStep2 from './Components/CourseStep2';
import CourseStep3 from './Components/CourseStep3';
import { getAuthToken } from '../utils/cookieUtils';
import './CourseMain.css';

const CourseMain = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 로그인 인증 체크
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      alert('로그인이 필요한 서비스입니다.');
      navigate('/email-login');
      return;
    }
  }, [navigate]);

  // 현재 단계 추적
  const [currentStep, setCurrentStep] = useState(1);

  // URL에 따른 단계 설정
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/step1')) setCurrentStep(1);
    else if (path.includes('/step2')) setCurrentStep(2);
    else if (path.includes('/step3')) setCurrentStep(3);
  }, [location.pathname]);

  // 데이터 초기화 함수
  const clearCourseData = () => {
    sessionStorage.removeItem('courseStep1');
    sessionStorage.removeItem('courseStep2');
    sessionStorage.removeItem('courseStep3');
  };

  // 컴포넌트 마운트 시 데이터 초기화 (선택사항)
  useEffect(() => {
    // 필요시 데이터 초기화
    // clearCourseData();
  }, []);

  return (
    <Routes>
      <Route path="/step1" element={<CourseStep1 />} />
      <Route path="/step2" element={<CourseStep2 />} />
      <Route path="/step3" element={<CourseStep3 />} />
      {/* 기본 경로는 1단계로 리다이렉트 */}
      <Route path="/" element={<CourseStep1 />} />
    </Routes>
  );
};

export default CourseMain;
