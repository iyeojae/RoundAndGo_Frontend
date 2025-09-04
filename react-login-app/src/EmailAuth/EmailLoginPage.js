import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmailLoginPage.css';

function EmailLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://roundandgo.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // 이메일 로그인용 로컬스토리지 키 사용
        localStorage.setItem('emailIsLoggedIn', 'true');
        localStorage.setItem('emailAccessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('emailRefreshToken', data.refreshToken);
        }
        
        // 사용자 정보 저장
        localStorage.setItem('emailUser', JSON.stringify({
          type: 'email',
          email: data.email,
          loginTime: new Date().toISOString()
        }));

        console.log('이메일 로그인 성공:', data);
        navigate('/first-main');
      } else {
        const errorData = await response.json();
        setError(errorData.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 에러:', error);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인은 별도 모듈에서 처리
    console.log('카카오 로그인으로 이동');
    // 여기서는 카카오 로그인 페이지로 이동하거나 처리
  };

  return (
    <div className="login-container">
      <div className="login-frame">
        {/* 아름다운 배경 도형들 */}
        <div className="background-shapes">
          <div className="shape1"></div>
          <div className="shape2"></div>
          <div className="shape3"></div>
        </div>
        
        {/* 오버레이 */}
        <div className="overlay"></div>

        {/* 로고 컨테이너 */}
        <div className="logo-container">
          <img 
            src="/images/logo-280a0a.png" 
            alt="RoundAndGo Logo" 
            className="logo"
          />
          <h1 className="title">RoundAndGo</h1>
        </div>

        {/* 폼 컨테이너 */}
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">이메일</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">비밀번호</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="divider">
            <span>또는</span>
          </div>

          <button 
            className="social-login-button"
            onClick={handleKakaoLogin}
            type="button"
          >
            <img 
              src="/images/kakao-icon-50a288.png" 
              alt="Kakao" 
              className="social-icon"
            />
            <span className="social-text">카카오로 로그인</span>
          </button>

          <div className="find-account-links">
            <a href="/find-account">아이디/비밀번호 찾기</a>
            <a href="/signup">회원가입</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailLoginPage;