import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupWithEmail } from '../Auth/authUtils';
import './EmailAuth.css';
import Toast from '../../Common/Community/Toast';
import logo from '../../assets/greenlogo.svg';

import HomePage from '../HomePage.jsx';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupCompleted, setSignupCompleted] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  // 입력 검증 함수들
  const validateNickname = (nickname) => {
    return nickname.length >= 2;
  };

  const validatePassword = (password) => {
    // 영문, 숫자, 특수문자가 모두 포함된 8자 이상
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasLetter && hasNumber && hasSpecial;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 실시간 검증
    const newErrors = { ...errors };
    if (field === 'nickname' && value) {
      if (!validateNickname(value)) {
        newErrors.nickname = '닉네임을 2자 이상 입력해주세요.';
      } else {
        delete newErrors.nickname;
      }
    }
    if (field === 'password' && value) {
      if (!validatePassword(value)) {
        newErrors.password = '영문, 숫자, 특수문자가 모두 들어간 8자 이상 입력해주세요.';
      } else {
        delete newErrors.password;
      }
    }
    if (field === 'confirmPassword' && value) {
      if (value !== formData.password) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않아요.';
      } else {
        delete newErrors.confirmPassword;
      }
    }
    if (field === 'email' && value) {
      if (!validateEmail(value)) {
        newErrors.email = '이메일 주소가 올바르지 않아요.';
      } else {
        delete newErrors.email;
      }
    }
    setErrors(newErrors);
  };

  const showToast = (message) => {
    setToastMessage(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 최종 검증
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.nickname) {
      showToast('모든 필수 항목을 입력해 주세요.');
      return;
    }

    if (!validateNickname(formData.nickname)) {
      showToast('닉네임은 2자 이상 입력해 주세요.');
      return;
    }

    if (!validatePassword(formData.password)) {
      showToast('비밀번호는 영문, 숫자, 특수문자 포함 8자 이상이어야 합니다.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
        showToast('비밀번호가 일치하지 않습니다.');
        return;
    }

    if (!validateEmail(formData.email)) {
      showToast('올바른 이메일 주소를 입력해 주세요.');
      return;
    }

    setLoading(true);

    try {
      const result = await signupWithEmail(formData);
      
      if (result.success) {
        setSignupCompleted(true);
        showToast('회원가입이 완료되었습니다!');
      } else {
        // 구체적인 오류 메시지 표시
        const errorMessage = result.message || result.error || '회원가입 중 알 수 없는 오류가 발생했습니다.';
        showToast(errorMessage);
      }
      
    } catch (error) {
      console.error('Signup Error:', error);
      
      // 네트워크 오류 구분
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showToast('네트워크 연결을 확인해주세요.');
      } else if (error.message.includes('timeout')) {
        showToast('요청 시간이 초과되었습니다. 다시 시도해주세요.');
      } else {
        showToast('서버 접속에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const clearField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: ''
    }));
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  if (signupCompleted) {
    return (
      // <div className="email-auth-container">
      //   <div className="email-auth-content">
      //     {/* 로고 및 서비스명 */}
      //     <div className="email-auth-logo-container">
      //       <img src="/images/logo-280a0a.png" alt="ROUND & GO Logo" className="email-auth-logo" />
      //       <h1 className="email-auth-title">ROUND & GO</h1>
      //     </div>
      //
      //     {/* 회원가입 완료 메시지 */}
      //     <div className="email-auth-result-container">
      //       <div className="email-auth-result-icon">✓</div>
      //       <h2 className="email-auth-result-title">회원가입 완료!</h2>
      //       <p className="email-auth-result-message">
      //         환영합니다! 이제 로그인하여 서비스를 이용하실 수 있습니다.
      //       </p>
      //       <button
      //         className="email-auth-submit-button"
      //         onClick={() => navigate('/email-login')}
      //       >
      //         로그인 하러가기
      //       </button>
      //     </div>
      //   </div>
      // </div>
        <HomePage/>
    );
  }

  return (
    <div className="email-auth-container">
      <div className="email-auth-content">
        {/* 뒤로가기 버튼 */}
        <button className="email-auth-back-button" onClick={handleBack} aria-label="뒤로가기">
          ←
        </button>
        
        {/* 로고 및 서비스명 */}
        <div className="email-auth-logo-container">
          <img src={logo} alt="ROUND & GO Logo" className="email-auth-logo" />
          <h1 className="email-auth-title">ROUND & GO</h1>
        </div>

        {/* 회원가입 폼 */}
        <div className="email-auth-form-container">
          <form onSubmit={handleSubmit} style={{width: '95%', margin: '15% auto 3% auto'}}>
            {/* 이메일 입력 */}
            <div className="email-auth-input-group" style={{marginBottom: '10%'}}>
              <label className="email-auth-label">아이디(이메일)</label>
              <div className="email-auth-password-input-container">
                <input
                  className="email-auth-input email-auth-password-input"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="사용하실 이메일을 입력해주세요"
                  style={{ borderColor: errors.email ? '#F62C2F' : '#269962', boxShadow: errors.email ? '0 0 4.8px rgba(246, 44, 47, 0.42)' : '0 0 4.8px rgba(16, 117, 54, 0.42)' }}
                />
                {formData.email && (
                  <button
                    type="button"
                    className="email-auth-password-toggle-button"
                    onClick={() => clearField('email')}
                  >
                    ✕
                  </button>
                )}
              </div>
              {errors.email && (
                <div className="email-auth-error-message">{errors.email}</div>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div className="email-auth-input-group">
              <label className="email-auth-label">비밀번호</label>
              <div className="email-auth-password-input-container">
                <input
                  className="email-auth-input email-auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  placeholder="영문, 숫자, 특수문자가 모두 들어간 8자 이상"
                  style={{ borderColor: errors.password ? '#F62C2F' : '#269962', boxShadow: errors.password ? '0 0 4.8px rgba(246, 44, 47, 0.42)' : '0 0 4.8px rgba(16, 117, 54, 0.42)' }}
                />
                                  <button
                    type="button"
                    className="email-auth-password-toggle-button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.50098 4L8.501 3.5H8.50098V4ZM16 8.5L16.4458 8.72648L16.5608 8.5L16.4458 8.27352L16 8.5ZM8.50098 13V13.5H8.501L8.50098 13ZM1 8.5L0.554224 8.27354L0.439181 8.5L0.554224 8.72646L16 8.5ZM8.50098 4L8.50095 4.5C11.6103 4.50016 14.2864 6.23117 15.5542 8.72648L16 8.5L16.4458 8.27352C15.0067 5.44127 11.9853 3.50018 8.501 3.5L8.50098 4ZM16 8.5L15.5542 8.27352C14.2864 10.7688 11.6103 12.4998 8.50095 12.5L8.50098 13L8.501 13.5C11.9853 13.4998 15.0067 11.5587 16.4458 8.72648L16 8.5ZM8.50098 13V12.5C5.39112 12.5 2.71352 10.7691 1.44578 8.27354L1 8.5L0.554224 8.72646C1.99328 11.5592 5.01641 13.5 8.50098 13.5V13ZM1 8.5L1.44578 8.72646C2.71352 6.23093 5.39112 4.5 8.50098 4.5V4V3.5C5.01641 3.5 1.99328 5.4408 0.554224 8.27354L1 8.5Z" fill="#7D7D7D"/>
                        <circle cx="8.5" cy="8.5" r="2.5" stroke="#7D7D7D"/>
                        <path d="M16 1L1 16" stroke="#7D7D7D" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.50098 4L8.501 3.5H8.50098V4ZM16 8.5L16.4458 8.72648L16.5608 8.5L16.4458 8.27352L16 8.5ZM8.50098 13V13.5H8.501L8.50098 13ZM1 8.5L0.554224 8.27354L0.439181 8.5L0.554224 8.72646L16 8.5ZM8.50098 4L8.50095 4.5C11.6103 4.50016 14.2864 6.23117 15.5542 8.72648L16 8.5L16.4458 8.27352C15.0067 5.44127 11.9853 3.50018 8.501 3.5L8.50098 4ZM16 8.5L15.5542 8.27352C14.2864 10.7688 11.6103 12.4998 8.50095 12.5L8.50098 13L8.501 13.5C11.9853 13.4998 15.0067 11.5587 16.4458 8.72648L16 8.5ZM8.50098 13V12.5C5.39112 12.5 2.71352 10.7691 1.44578 8.27354L1 8.5L0.554224 8.72646C1.99328 11.5592 5.01641 13.5 8.50098 13.5V13ZM1 8.5L1.44578 8.72646C2.71352 6.23093 5.39112 4.5 8.50098 4.5V4V3.5C5.01641 3.5 1.99328 5.4408 0.554224 8.27354L1 8.5Z" fill="#7D7D7D"/>
                        <circle cx="8.5" cy="8.5" r="2.5" stroke="#7D7D7D"/>
                      </svg>
                    )}
                  </button>
              </div>
              {errors.password && (
                <div className="email-auth-error-message">{errors.password}</div>
              )}
            </div>

            {/* 비밀번호 확인 입력 */}
            <div className="email-auth-input-group email-auth-password-confirm-group" style={{marginBottom: '10%'}}>
              <div className="email-auth-password-input-container">
                <input
                  className="email-auth-input email-auth-password-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  placeholder="비밀번호 재입력"
                  style={{ borderColor: errors.confirmPassword ? '#F62C2F' : '#269962', boxShadow: errors.confirmPassword ? '0 0 4.8px rgba(246, 44, 47, 0.42)' : '0 0 4.8px rgba(16, 117, 54, 0.42)' }}
                />
                                  <button
                    type="button"
                    className="email-auth-password-toggle-button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.50098 4L8.501 3.5H8.50098V4ZM16 8.5L16.4458 8.72648L16.5608 8.5L16.4458 8.27352L16 8.5ZM8.50098 13V13.5H8.501L8.50098 13ZM1 8.5L0.554224 8.27354L0.439181 8.5L0.554224 8.72646L16 8.5ZM8.50098 4L8.50095 4.5C11.6103 4.50016 14.2864 6.23117 15.5542 8.72648L16 8.5L16.4458 8.27352C15.0067 5.44127 11.9853 3.50018 8.501 3.5L8.50098 4ZM16 8.5L15.5542 8.27352C14.2864 10.7688 11.6103 12.4998 8.50095 12.5L8.50098 13L8.501 13.5C11.9853 13.4998 15.0067 11.5587 16.4458 8.72648L16 8.5ZM8.50098 13V12.5C5.39112 12.5 2.71352 10.7691 1.44578 8.27354L1 8.5L0.554224 8.72646C1.99328 11.5592 5.01641 13.5 8.50098 13.5V13ZM1 8.5L1.44578 8.72646C2.71352 6.23093 5.39112 4.5 8.50098 4.5V4V3.5C5.01641 3.5 1.99328 5.4408 0.554224 8.27354L1 8.5Z" fill="#7D7D7D"/>
                        <circle cx="8.5" cy="8.5" r="2.5" stroke="#7D7D7D"/>
                        <path d="M16 1L1 16" stroke="#7D7D7D" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.50098 4L8.501 3.5H8.50098V4ZM16 8.5L16.4458 8.72648L16.5608 8.5L16.4458 8.27352L16 8.5ZM8.50098 13V13.5H8.501L8.50098 13ZM1 8.5L0.554224 8.27354L0.439181 8.5L0.554224 8.72646L16 8.5ZM8.50098 4L8.50095 4.5C11.6103 4.50016 14.2864 6.23117 15.5542 8.72648L16 8.5L16.4458 8.27352C15.0067 5.44127 11.9853 3.50018 8.501 3.5L8.50098 4ZM16 8.5L15.5542 8.27352C14.2864 10.7688 11.6103 12.4998 8.50095 12.5L8.50098 13L8.501 13.5C11.9853 13.4998 15.0067 11.5587 16.4458 8.72648L16 8.5ZM8.50098 13V12.5C5.39112 12.5 2.71352 10.7691 1.44578 8.27354L1 8.5L0.554224 8.72646C1.99328 11.5592 5.01641 13.5 8.50098 13.5V13ZM1 8.5L1.44578 8.72646C2.71352 6.23093 5.39112 4.5 8.50098 4.5V4V3.5C5.01641 3.5 1.99328 5.4408 0.554224 8.27354L1 8.5Z" fill="#7D7D7D"/>
                        <circle cx="8.5" cy="8.5" r="2.5" stroke="#7D7D7D"/>
                      </svg>
                    )}
                  </button>
              </div>
              {errors.confirmPassword && (
                <div className="email-auth-error-message">{errors.confirmPassword}</div>
              )}
            </div>

            {/* 닉네임 입력 */}
            <div className="email-auth-input-group" style={{marginBottom: '10%'}}>
              <label className="email-auth-label">닉네임</label>
              <div className="email-auth-password-input-container">
                <input
                  className="email-auth-input email-auth-password-input"
                  type="text"
                  value={formData.nickname}
                  onChange={handleInputChange('nickname')}
                  placeholder="사용하실 닉네임을 입력해주세요"
                  style={{ borderColor: errors.nickname ? '#F62C2F' : '#269962', boxShadow: errors.nickname ? '0 0 4.8px rgba(246, 44, 47, 0.42)' : '0 0 4.8px rgba(16, 117, 54, 0.42)' }}
                />
                {formData.nickname && (
                  <button
                    type="button"
                    className="email-auth-password-toggle-button"
                    onClick={() => clearField('nickname')}
                  >
                    ✕
                  </button>
                )}
              </div>
              {errors.nickname && (
                <div className="email-auth-error-message">{errors.nickname}</div>
              )}
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              className="email-auth-submit-button"
              disabled={loading || Object.keys(errors).length > 0}
            >
              {loading ? '처리 중...' : '회원가입'}
            </button>
          </form>
        </div>
      </div>

      {toastMessage && (
          <Toast
              message={toastMessage}
              duration={3000} // 3초간 띄우기
              onClose={() => setToastMessage(null)} // 토스트가 닫힐 때 상태를 초기화
          />
      )}
    </div>
  );
}

export default SignupPage;
