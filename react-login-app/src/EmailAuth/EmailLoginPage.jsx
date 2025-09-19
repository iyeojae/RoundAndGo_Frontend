import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../Auth/authUtils';
import './EmailAuth.css';
import bgIcon from "../Login/backIcon.svg";
import kakao from "../Login/kakao.svg";

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

  // <div style={{overflowY: 'hidden'}}>
  //   <img style={{
  //     margin: 0,
  //     width: '100%',
  //     background: 'linear-gradient(180deg, #269962 0%, #FFFFFF 100%)',
  //     overflowX: 'hidden'
  //   }}
  //        src={bgIcon} alt='배경 아이콘'/>
  //
  //   <div className='buttons' style={{position: 'absolute', zIndex: 3, bottom: '15%', width: '100%'}}>
  //     <div style={{width: '90%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px'}}>
  //       <button style={{
  //         width: '100%',
  //         border: 'none',
  //         borderRadius: '27px',
  //         backgroundColor: '#2d8779',
  //         padding: '12px',
  //         fontSize: '14px',
  //         color: '#fff'
  //       }} onClick={handleEmailLogin}>로그인
  //       </button>
  //       <button style={{
  //         width: '100%',
  //         border: 'none',
  //         borderRadius: '27px',
  //         backgroundColor: '#fee500',
  //         padding: '0 12px',
  //         display: 'flex',
  //         flexDirection: 'row',
  //         gap: '10px',
  //         fontSize: '14px',
  //         justifyContent: 'center',
  //         alignItems: 'center'
  //       }}>
  //         <img src={kakao} alt='카카오 로고'/>
  //         <p>카카오로 시작하기</p>
  //       </button>
  //       <p style={{width: '90%', color: '#2d8779', fontSize: '14px', textAlign: 'right', margin: '0 0 0 3%'}}>회원가입</p>
  //     </div>
  //   </div>
  // </div>
  /* 1-1) 로그인 */


  return (
      <div className="email-login-container" style={{background: 'linear-gradient(180deg, #269962 0%, #FFFFFF 100%)'}}>
        <div className="email-auth-content" style={{
          overflowY: 'hidden',
          overflowX: 'hidden',
          backgroundImage: `url(${bgIcon})`,
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          objectFit: 'cover',
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundPosition: 'left top, left bottom',
        }}>
          <div style={{position: 'absolute', top: '5%', left: '5%'}}>
            {/* 뒤로가기 버튼 */}
            <button
                className="email-auth-back-button"
                onClick={() => navigate(-1)}
                type="button"
            >
              <p>←</p>
            </button>
          </div>

          <div style={{position: 'absolute', margin: '0 auto', bottom: '10%', width: '100%'}}>

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
      </div>
  );
}

export default EmailLoginPage;
