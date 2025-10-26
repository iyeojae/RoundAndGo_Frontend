import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../Auth/authUtils';
import './EmailAuth.css';
import bgIcon from "../../assets/backIcon.svg";

function EmailLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const newErrors = {};

  const validateInputs = () => {
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
        navigate('/first-main');
      } else {
        // 구체적인 오류 메시지 처리
        let errorMessage = '이메일 또는 비밀번호를 확인해주세요';
        
        if (result.error) {
          if (result.error.includes('존재하지') || result.error.includes('없는')) {
            errorMessage = '가입되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.';
          } else if (result.error.includes('비밀번호') || result.error.includes('틀렸')) {
            errorMessage = '비밀번호가 올바르지 않습니다. 다시 확인해주세요.';
          } else if (result.error.includes('계정') && result.error.includes('잠금')) {
            errorMessage = '계정이 잠겼습니다. 관리자에게 문의해주세요.';
          } else if (result.error.includes('만료')) {
            errorMessage = '계정이 만료되었습니다. 관리자에게 문의해주세요.';
          } else {
            errorMessage = result.error;
          }
        }
        
        newErrors.password = errorMessage;
        setErrors(newErrors);
        console.log('로그인 실패: ' + result.error);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      
      // 네트워크 오류 구분
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        newErrors.password = '네트워크 연결을 확인해주세요.';
      } else if (error.message.includes('timeout')) {
        newErrors.password = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
      } else {
        newErrors.password = '서버 접속에 실패했습니다. 잠시 후 다시 시도해주세요.';
      }
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
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
      <div className="LoginPageEntireContainer" style={{position: 'relative'}}>
        <div className='OverlayOfLogain' style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          zIndex: 3,
          pointerEvents: 'none',
        }}>
        </div>

        <div className="email-login-container"
             style={{background: 'linear-gradient(180deg, #269962 0%, #FFFFFF 100%)'}}>
          <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${bgIcon})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'left top, left bottom',
                backgroundSize: 'cover',
                zIndex: 1,
                pointerEvents: 'none',
              }}
          />
        </div>

        <div style={{position: 'absolute', top: '5%', left: '5%', zIndex: 4}}>
          {/* 뒤로가기 버튼 */}
          <button
              className="email-auth-back-button"
              onClick={() => navigate(-1)}
              type="button"
          >
            <p>←</p>
          </button>
        </div>

        <div style={{position: 'absolute', margin: '0 auto', bottom: '10%', width: '100%', zIndex: 4}}>

          <div style={{width: '90%', margin: '0 auto'}}>
            {/* 로그인 폼 */}
            <form onSubmit={handleSubmit} className="email-auth-form">
              <div className="email-auth-input-group">
                <label htmlFor="email" className="email-auth-label">아이디(이메일)</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력해주세요"
                    disabled={loading}
                    className="email-auth-input"
                    noValidate
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
                    placeholder="비밀번호를 입력해주세요"
                    disabled={loading}
                    className="email-auth-input"
                    noValidate
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
      </div>
)
  ;
}

export default EmailLoginPage;
