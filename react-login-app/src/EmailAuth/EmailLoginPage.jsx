import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmailAuth.css';

function EmailLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'idFind', 'passwordFind', 'result'

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 에러 메시지 제거
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
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

    try {
      // 실제 로그인 API 호출
      console.log('로그인 요청 시작:', formData);
      
      // 백엔드 코드에 맞춘 이메일 로그인
      console.log('백엔드 /api/auth/login 엔드포인트로 요청 시작');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.userId,
          password: formData.password
        })
      });

      console.log('백엔드 응답:', response);

      console.log('로그인 응답:', response);

      if (response.ok) {
        const data = await response.json();
        console.log('백엔드 응답 데이터:', data);
        
        // 백엔드 응답 형식에 맞춘 처리 (실제 응답 구조 확인)
        console.log('백엔드 응답 구조:', data);
        console.log('data.access_token 존재 여부:', !!data.access_token);
        console.log('data.refresh_token 존재 여부:', !!data.refresh_token);
        console.log('data.access_token 값:', data.access_token);
        console.log('data.refresh_token 값:', data.refresh_token);
        
                                    // 백엔드 응답 구조에 맞춰 토큰 추출 (실제 응답 구조 확인됨)
              const accessToken = data.data.access_token;
              const refreshToken = data.data.refresh_token;
        
              console.log('🔑 추출된 토큰:', { 
                accessToken: !!accessToken, 
                refreshToken: !!refreshToken,
                accessTokenValue: accessToken ? accessToken.substring(0, 20) + '...' : 'undefined'
              });
              
              // 🚨 토큰 추출 디버깅 추가
              console.log('🚨 토큰 추출 상세 분석:', {
                'data.data': !!data.data,
                'data.data.access_token': !!data.data?.access_token,
                'data.data.refresh_token': !!data.data?.refresh_token,
                'accessToken 타입': typeof accessToken,
                'accessToken 길이': accessToken ? accessToken.length : 0,
                'refreshToken 타입': typeof refreshToken,
                'refreshToken 길이': refreshToken ? refreshToken.length : 0
              });
        
        if (accessToken && refreshToken) {
          // 토큰을 쿠키와 localStorage에 모두 저장
          try {
            // 방법 1: 기본 쿠키 설정 (백엔드 응답 변수명과 일치)
            document.cookie = `access_token=${accessToken}; path=/; max-age=3600`;
            document.cookie = `refresh_token=${refreshToken}; path=/; max-age=86400`;
            
            console.log('기본 쿠키 설정 완료:', document.cookie);
            
            // 방법 2: 도메인별 쿠키 설정 (백엔드 응답 변수명과 일치)
            if (window.location.hostname !== 'localhost') {
              document.cookie = `access_token=${accessToken}; path=/; domain=.roundandgo.com; secure; samesite=strict; max-age=3600`;
              document.cookie = `refresh_token=${refreshToken}; path=/; domain=.roundandgo.com; secure; samesite=strict; max-age=86400`;
              console.log('도메인별 쿠키 설정 완료:', document.cookie);
            }
            
            // 방법 3: localStorage에도 저장 (이메일 로그인용 키 이름 사용)
            localStorage.setItem('emailAccessToken', accessToken);
            localStorage.setItem('emailRefreshToken', refreshToken);
            localStorage.setItem('emailUser', JSON.stringify({
              type: 'email',
              loginTime: new Date().toISOString(),
              isOAuth2: false,
              source: 'email-login'
            }));
            localStorage.setItem('emailIsLoggedIn', 'true');
            
            console.log('localStorage 토큰 저장 완료');
            
            alert(data.msg || '로그인 성공!');
            navigate('/main');
          } catch (cookieError) {
            console.error('쿠키 설정 오류:', cookieError);
            alert('쿠키 설정에 실패했습니다. 다시 시도해주세요.');
          }
        } else {
          alert('토큰 정보를 받지 못했습니다. 다시 시도해주세요.');
        }
      } else {
        const errorData = await response.json();
        alert(errorData.msg || '로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentPage === 'login') {
      navigate(-1);
    } else {
      setCurrentPage('login');
    }
  };

  const handleFindAccount = () => {
    navigate('/find-account');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleIdFind = () => {
    setCurrentPage('idFind');
  };

  const handlePasswordFind = () => {
    setCurrentPage('passwordFind');
  };

  const handleShowResult = () => {
    setCurrentPage('result');
  };

  const handleBackToLogin = () => {
    setCurrentPage('login');
  };

  // 아이디 찾기 페이지
  if (currentPage === 'idFind') {
    return (
      <div className="mobile-login-page">
        <div className="mobile-login-bg">
          <div className="mobile-login-curve-1"></div>
          <div className="mobile-login-curve-2"></div>
          <div className="mobile-login-curve-3"></div>
          
          <div className="mobile-login-logo-container">
            <img src="/images/logo-280a0a.png" alt="ROUND & GO Logo" className="mobile-login-logo" />
            <h1 className="mobile-login-title">아이디 찾기</h1>
          </div>

          <div className="mobile-login-form-container">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
                가입하신 이메일 주소를 입력해주세요.<br />
                해당 이메일로 아이디를 발송해드립니다.
              </p>
            </div>

            <div className="mobile-login-input-group">
              <label className="mobile-login-label">이메일 주소</label>
              <input
                className="mobile-login-input"
                type="email"
                placeholder="이메일을 입력해주세요"
              />
            </div>

            <button
              className="mobile-login-submit-button"
              onClick={handleShowResult}
            >
              아이디 찾기
            </button>

            <button
              className="mobile-login-footer-link"
              onClick={handleBack}
              style={{ marginTop: '20px' }}
            >
              ← 로그인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 비밀번호 찾기 페이지
  if (currentPage === 'passwordFind') {
    return (
      <div className="mobile-login-page">
        <div className="mobile-login-bg">
          <div className="mobile-login-curve-1"></div>
          <div className="mobile-login-curve-2"></div>
          <div className="mobile-login-curve-3"></div>
          
          <div className="mobile-login-logo-container">
            <img src="/images/logo-280a0a.png" alt="ROUND & GO Logo" className="mobile-login-logo" />
            <h1 className="mobile-login-title">비밀번호 찾기</h1>
          </div>

          <div className="mobile-login-form-container">
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
                가입하신 아이디와 이메일 주소를 입력해주세요.<br />
                해당 이메일로 비밀번호 재설정 링크를 발송해드립니다.
              </p>
            </div>

            <div className="mobile-login-input-group">
              <label className="mobile-login-label">아이디</label>
              <input
                className="mobile-login-input"
                type="text"
                placeholder="아이디를 입력해주세요"
              />
            </div>

            <div className="mobile-login-input-group">
              <label className="mobile-login-label">이메일 주소</label>
              <input
                className="mobile-login-input"
                type="email"
                placeholder="이메일을 입력해주세요"
              />
            </div>

            <button
              className="mobile-login-submit-button"
              onClick={handleShowResult}
            >
              비밀번호 찾기
            </button>

            <button
              className="mobile-login-footer-link"
              onClick={handleBack}
              style={{ marginTop: '20px' }}
            >
              ← 로그인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 결과 페이지
  if (currentPage === 'result') {
    return (
      <div className="mobile-login-page">
        <div className="mobile-login-bg">
          <div className="mobile-login-curve-1"></div>
          <div className="mobile-login-curve-2"></div>
          <div className="mobile-login-curve-3"></div>
          
          <div className="mobile-login-logo-container">
            <img src="/images/logo-280a0a.png" alt="ROUND & GO Logo" className="mobile-login-logo" />
            <h1 className="mobile-login-title">처리 완료</h1>
          </div>

          <div className="mobile-login-form-container">
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#2D8779',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '40px',
                color: 'white'
              }}>
                ✓
              </div>
              <h2 style={{ color: '#333', fontSize: '20px', marginBottom: '10px' }}>
                이메일이 발송되었습니다
              </h2>
              <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
                입력하신 이메일 주소로<br />
                관련 정보를 발송해드렸습니다.<br />
                이메일을 확인해주세요.
              </p>
            </div>

            <button
              className="mobile-login-submit-button"
              onClick={handleBackToLogin}
            >
              로그인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 메인 로그인 페이지
  return (
    <div className="mobile-login-page">
      {/* 민트 그린 배경 */}
      <div className="mobile-login-bg">
        {/* 곡선 흰색 도형들 */}
        <div className="mobile-login-curve-1"></div>
        <div className="mobile-login-curve-2"></div>
        <div className="mobile-login-curve-3"></div>
        
        {/* 로고 및 제목 */}
        <div className="mobile-login-logo-container">
          <img 
            src="/images/logo-280a0a.png" 
            alt="ROUND & GO Logo" 
            className="mobile-login-logo"
          />
          <h1 className="mobile-login-title">ROUND & GO</h1>
        </div>

        {/* 로그인 폼 */}
        <div className="mobile-login-form-container">
          <form onSubmit={handleSubmit}>
            {/* 아이디 입력 */}
            <div className="mobile-login-input-group">
              <label className="mobile-login-label">아이디</label>
              <input
                className="mobile-login-input"
                type="text"
                value={formData.userId}
                onChange={handleInputChange('userId')}
                placeholder="아이디 또는 이메일을 입력해주세요"
              />
              {errors.userId && (
                <div className="mobile-login-error-message">{errors.userId}</div>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div className="mobile-login-input-group">
              <label className="mobile-login-label">비밀번호</label>
              <input
                className="mobile-login-input"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="비밀번호를 입력해주세요"
              />
              {errors.password && (
                <div className="mobile-login-error-message">{errors.password}</div>
              )}
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="mobile-login-submit-button"
              disabled={loading || !formData.userId || !formData.password}
            >
              {loading ? '처리 중...' : '로그인'}
            </button>
          </form>

          {/* 임시 테스트 버튼들 */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px', 
            marginBottom: '20px',
            width: '100%'
          }}>
            <button
              className="mobile-login-submit-button"
              onClick={handleIdFind}
              style={{ background: '#4CAF50', marginBottom: '10px' }}
            >
              🧪 아이디 찾기 테스트
            </button>
            <button
              className="mobile-login-submit-button"
              onClick={handlePasswordFind}
              style={{ background: '#FF9800', marginBottom: '10px' }}
            >
              🧪 비밀번호 찾기 테스트
            </button>
          </div>

          {/* 하단 링크 */}
          <div className="mobile-login-footer-links">
            <button
              className="mobile-login-footer-link"
              onClick={handleFindAccount}
            >
              아이디/비밀번호 찾기
            </button>
            <button
              className="mobile-login-footer-link"
              onClick={handleSignup}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailLoginPage;


