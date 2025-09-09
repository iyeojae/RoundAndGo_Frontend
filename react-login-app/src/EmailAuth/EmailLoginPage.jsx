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
      
             // 백엔드 통합 로그인 엔드포인트 사용
       console.log('백엔드 통합 /api/auth/login 엔드포인트로 요청 시작');
       
       const response = await fetch('https://roundandgo.onrender.com/api/auth/login', {
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
        
                                    // 백엔드 응답 구조에 맞춰 토큰 추출 (백엔드 코드 확인됨)
              const accessToken = data.data.accessToken;
              const refreshToken = data.data.refreshToken;
        
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
          <h1 className="email-auth-title">ROUND & GO</h1>
        </div>

        {/* 로그인 폼 */}
        <div className="email-auth-form-container">
          <form onSubmit={handleSubmit}>
            {/* 아이디 입력 */}
            <div className="email-auth-input-group">
              <label className="email-auth-label">아이디</label>
              <input
                className="email-auth-input"
                type="text"
                value={formData.userId}
                onChange={handleInputChange('userId')}
                placeholder="아이디 또는 이메일을 입력해주세요"
              />
              {errors.userId && (
                <div className="email-auth-error-message">{errors.userId}</div>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div className="email-auth-input-group">
              <label className="email-auth-label">비밀번호</label>
              <input
                className="email-auth-input"
                type="password"
                value={formData.password}
                onChange={handleInputChange('password')}
                placeholder="비밀번호를 입력해주세요"
              />
              {errors.password && (
                <div className="email-auth-error-message">{errors.password}</div>
              )}
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              className="email-auth-submit-button"
              disabled={loading}
            >
              {loading ? '처리 중...' : '로그인'}
            </button>
          </form>

          {/* 하단 링크 */}
          <div className="email-auth-link-container">
            <button
              className="email-auth-link"
              onClick={handleFindAccount}
            >
              아이디/비밀번호 찾기
            </button>
            <button
              className="email-auth-link"
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


