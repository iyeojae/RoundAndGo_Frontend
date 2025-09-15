import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../Auth/authUtils';
import './EmailAuth.css';

function EmailLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자리 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await loginWithEmail(formData.email, formData.password);

      if (result.success) {
        alert('로그인 성공!');
        navigate('/first-main');
      } else {
        alert('로그인 실패: ' + result.error);
      }
    } catch (error) {
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleFindAccount = () => {
    navigate('/find-account');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

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
            <h1 className="email-auth-title">이메일 로그인</h1>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit} className="email-auth-form">
            <div className="email-auth-input-group">
              <label htmlFor="email" className="email-auth-label">이메일</label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요"
                  disabled={loading}
                  className="email-auth-input"
              />
              {errors.email && <span className="email-auth-error">{errors.email}</span>}
            </div>

            <div className="email-auth-input-group">
              <label htmlFor="password" className="email-auth-label">비밀번호</label>
              <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요"
                  disabled={loading}
                  className="email-auth-input"
              />
              {errors.password && <span className="email-auth-error">{errors.password}</span>}
            </div>

            <button
                type="submit"
                className="email-auth-submit-button"
                disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 추가 링크 */}
          <div className="email-auth-links">
            <button
                className="email-auth-link-button email-auth-link-left"
                onClick={handleFindAccount}
                type="button"
            >
              비밀번호 찾기
            </button>
            <button
                className="email-auth-link-button email-auth-link-right"
                onClick={handleSignup}
                type="button"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
  );
}

export default EmailLoginPage;
