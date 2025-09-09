import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../Auth/authUtils';
import './EmailAuth.css';

function EmailLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userId || !formData.password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Auth 폴더의 loginWithEmail 함수 사용
      const result = await loginWithEmail(formData.userId, formData.password);
      
      if (result.success) {
        alert('로그인 성공!');
        navigate('/');
      } else {
        alert('로그인 실패: ' + result.error);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleFindAccount = () => {
    navigate('/find-account');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  // 메인 로그인 페이지
  return (
    <div className="email-login-container">
      <div className="email-auth-content">
        {/* 뒤로가기 버튼 */}
        <button 
          className="email-auth-back-button" 
          onClick={() => navigate(-1)}
          type="button"
        >
          ←
        </button>

        {/* 로고 및 제목 */}
        <div className="email-auth-logo-container">
          <img 
            src="/images/logo-280a0a.png" 
            alt="ROUND & GO Logo" 
            className="email-auth-logo"
          />
          <h1 className="email-auth-title">로그인</h1>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit} className="email-auth-form">
            {/* 아이디 입력 */}
            <div className="email-auth-input-group">
              <label htmlFor="userId" className="email-auth-label">아이디</label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                className="email-auth-input"
                placeholder="아이디를 입력하세요"
                disabled={loading}
              />
              {errors.userId && <span className="email-auth-error">{errors.userId}</span>}
            </div>

            {/* 비밀번호 입력 */}
            <div className="email-auth-input-group">
              <label htmlFor="password" className="email-auth-label">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="email-auth-input"
                placeholder="비밀번호를 입력하세요"
                disabled={loading}
              />
              {errors.password && <span className="email-auth-error">{errors.password}</span>}
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="email-auth-submit-button"
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 하단 링크 */}
          <div className="email-auth-links">
            <button 
              type="button" 
              className="email-auth-link-button"
              onClick={handleFindAccount}
            >
              아이디/비밀번호 찾기
            </button>
            <span className="email-auth-divider">|</span>
            <button 
              type="button" 
              className="email-auth-link-button"
              onClick={handleSignup}
            >
              회원가입
            </button>
          </div>
        </div>
    </div>
  );
}

export default EmailLoginPage;