import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmailAuth.css';
import { 
  sendEmailVerificationForPassword,
  resetPasswordByEmail,
  getErrorMessage 
} from './findAccountApi';

function FindAccountPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('input');
  
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false
  });
  
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const validatePassword = (password) => {
    return password.length >= 8;
  };

  React.useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(180);
  };

  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    const newErrors = { ...errors };
    if (field === 'email' && value) {
      if (!validateEmail(value)) {
        newErrors.email = '올바른 이메일 형식을 입력해주세요.';
      } else {
        delete newErrors.email;
      }
    }
    if (field === 'newPassword' && value) {
      if (!validatePassword(value)) {
        newErrors.newPassword = '영문, 숫자, 특수문자가 모두 들어간 8자 이상 입력해주세요.';
      } else {
        delete newErrors.newPassword;
      }
    }
    if (field === 'confirmPassword' && value) {
      if (value !== formData.newPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않아요.';
      } else {
        delete newErrors.confirmPassword;
      }
    }
    setErrors(newErrors);
  };

  const handleSendVerification = async () => {
    try {
      if (!formData.email) {
        alert('이메일 주소를 입력해주세요.');
        return;
      }
      if (!validateEmail(formData.email)) {
        alert('올바른 이메일 주소 형식을 입력해주세요.');
        return;
      }
      const result = await sendEmailVerificationForPassword(formData.email);
      alert(`${formData.email}로 인증메일이 발송되었습니다.`);
      setStep('emailSent');
    } catch (error) {
      let errorMessage = '이메일 인증 요청에 실패했습니다.';
      
      if (error.message.includes('500')) {
        errorMessage = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.message.includes('404')) {
        errorMessage = '요청한 서비스를 찾을 수 없습니다.';
      } else if (error.message.includes('403')) {
        errorMessage = '접근이 거부되었습니다.';
      } else if (error.message.includes('401')) {
        errorMessage = '인증이 필요합니다.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    await handleSendVerification();
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!validatePassword(formData.newPassword)) {
      alert('비밀번호는 영문, 숫자, 특수문자가 모두 포함된 8자 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordByEmail(formData.email, formData.newPassword);
      alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/email-login');
    } catch (error) {
      // 백엔드에서 인증 상태를 검증하므로, 인증되지 않은 경우 에러 메시지 표시
      if (error.message.includes('401') || error.message.includes('403')) {
        alert('이메일 인증이 완료되지 않았습니다.\n\n메일함에서 인증 링크를 클릭하여 인증을 완료해주세요.');
        // 인증되지 않은 경우 입력 단계로 돌아가기
        setStep('input');
      } else if (error.message.includes('404')) {
        alert('인증 정보를 찾을 수 없습니다.\n\n다시 이메일 인증을 요청해주세요.');
        setStep('input');
      } else {
        alert(getErrorMessage(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('input');
    setFormData({
      email: '',
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false
    });
  };


  const renderInputStep = () => (
    <>
      <div style={{width: '100%', height: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'}}>
        <div className="email-auth-input-group">
          <label className="email-auth-label">이메일</label>
          <input
              className="email-auth-input"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleInputChange('email')}
              style={{
                borderColor: errors.email ? '#F62C2F' : '#269962',
                boxShadow: errors.email ? '0 0 4.8px rgba(246, 44, 47, 0.42)' : '0 0 4.8px rgba(16, 117, 54, 0.42)'
              }}
          />
          {errors.email && (
              <div className="email-auth-error-message">{errors.email}</div>
          )}
        </div>

        <button
            className="email-auth-submit-button"
            onClick={handleSubmit}
            disabled={loading || !formData.email}
            style={{position: 'absolute', bottom: 0, margin: 'auto 0'}}
        >
          {loading ? '처리 중...' : '인증메일 발송'}
        </button>
      </div>
    </>
  );

  const renderEmailSentStep = () => (
      <div className="email-auth-email-sent-container">
        <div className="email-auth-email-icon">
          <img src="/mail-img.png" alt="Email Icon" width="55" height="47"/>
        </div>

        <h2 className="email-auth-email-sent-title">
          인증메일이 발송되었습니다
        </h2>

        <p className="email-auth-email-sent-message">
          메일함에서 인증메일을 확인하시기 바랍니다.<br/>
          이메일의 인증 버튼을 선택하면 인증이 완료됩니다.
        </p>

        <button className="email-auth-resend-button" onClick={handleSendVerification}>
          재발송
        </button>

        <button className="email-auth-confirm-button" onClick={() => {
          // 백엔드에서 비밀번호 재설정 API 호출 시 인증 상태를 검증하므로
          // 프론트엔드에서는 바로 비밀번호 변경 단계로 이동
          // 실제 인증 검증은 백엔드에서 수행됨
          setStep('passwordChange');
        }}>
          확인
        </button>
      </div>
  );


  const renderPasswordChangeStep = () => (
      <>
        <div className="email-auth-input-group">
          <label className="email-auth-label">비밀번호</label>
          <div className="email-auth-password-input-container">
            <input
                className="email-auth-input email-auth-password-input"
                type={formData.showPassword ? 'text' : 'password'}
                placeholder="새로 설정할 비밀번호를 입력해주세요."
                value={formData.newPassword}
                onChange={handleInputChange('newPassword')}
                style={{borderColor: errors.newPassword ? '#F62C2F' : '#269962',  boxShadow: errors.newPassword ? '0 0 4.8px rgba(246, 44, 47, 0.42)' : '0 0 4.8px rgba(16, 117, 54, 0.42)'}}
            />
            <button
                className="email-auth-password-toggle-button"
                type="button"
                onClick={() => setFormData(prev => ({...prev, showPassword: !prev.showPassword}))}
            >
              {formData.showPassword ?
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.50098 4L8.501 3.5H8.50098V4ZM16 8.5L16.4458 8.72648L16.5608 8.5L16.4458 8.27352L16 8.5ZM8.50098 13V13.5H8.501L8.50098 13ZM1 8.5L0.554224 8.27354L0.439181 8.5L0.554224 8.72646L16 8.5ZM8.50098 4L8.50095 4.5C11.6103 4.50016 14.2864 6.23117 15.5542 8.72648L16 8.5L16.4458 8.27352C15.0067 5.44127 11.9853 3.50018 8.501 3.5L8.50098 4ZM16 8.5L15.5542 8.27352C14.2864 10.7688 11.6103 12.4998 8.50095 12.5L8.50098 13L8.501 13.5C11.9853 13.4998 15.0067 11.5587 16.4458 8.72648L16 8.5ZM8.50098 13V12.5C5.39112 12.5 2.71352 10.7691 1.44578 8.27354L1 8.5L0.554224 8.72646C1.99328 11.5592 5.01641 13.5 8.50098 13.5V13ZM1 8.5L1.44578 8.72646C2.71352 6.23093 5.39112 4.5 8.50098 4.5V4V3.5C5.01641 3.5 1.99328 5.4408 0.554224 8.27354L1 8.5Z"
                        fill="#7D7D7D"/>
                    <circle cx="8.5" cy="8.5" r="2.5" stroke="#7D7D7D"/>
                    <path d="M16 1L1 16" stroke="#7D7D7D" strokeLinecap="round"/>
                  </svg> :
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.50098 4L8.501 3.5H8.50098V4ZM16 8.5L16.4458 8.72648L16.5608 8.5L16.4458 8.27352L16 8.5ZM8.50098 13V13.5H8.501L8.50098 13ZM1 8.5L0.554224 8.27354L0.439181 8.5L0.554224 8.72646L16 8.5ZM8.50098 4L8.50095 4.5C11.6103 4.50016 14.2864 6.23117 15.5542 8.72648L16 8.5L16.4458 8.27352C15.0067 5.44127 11.9853 3.50018 8.501 3.5L8.50098 4ZM16 8.5L15.5542 8.27352C14.2864 10.7688 11.6103 12.4998 8.50095 12.5L8.50098 13L8.501 13.5C11.9853 13.4998 15.0067 11.5587 16.4458 8.72648L16 8.5ZM8.50098 13V12.5C5.39112 12.5 2.71352 10.7691 1.44578 8.27354L1 8.5L0.554224 8.72646C1.99328 11.5592 5.01641 13.5 8.50098 13.5V13ZM1 8.5L1.44578 8.72646C2.71352 6.23093 5.39112 4.5 8.50098 4.5V4V3.5C5.01641 3.5 1.99328 5.4408 0.554224 8.27354L1 8.5Z"
                        fill="#7D7D7D"/>
                    <circle cx="8.5" cy="8.5" r="2.5" stroke="#7D7D7D"/>
                  </svg>
              }
            </button>
          </div>
          {errors.newPassword && (
              <div className="email-auth-error-message">{errors.newPassword}</div>
          )}
        </div>

        <div className="email-auth-input-group">
          <label className="email-auth-label">비밀번호 확인</label>
          <div className="email-auth-password-input-container">
            <input
                className="email-auth-input email-auth-password-input"
                type={formData.showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호를 한번 더 입력해주세요."
                value={formData.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                style={{borderColor: errors.confirmPassword ? '#F62C2F' : '#269962',  boxShadow: errors.confirmPassword ? '0 0 4.8px rgba(246, 44, 47, 0.42)' : '0 0 4.8px rgba(16, 117, 54, 0.42)'}}
            />
            <button
                className="email-auth-password-toggle-button"
                type="button"
                onClick={() => setFormData(prev => ({...prev, showConfirmPassword: !prev.showConfirmPassword}))}
            >
              {formData.showConfirmPassword ?
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.50098 4L8.501 3.5H8.50098V4ZM16 8.5L16.4458 8.72648L16.5608 8.5L16.4458 8.27352L16 8.5ZM8.50098 13V13.5H8.501L8.50098 13ZM1 8.5L0.554224 8.27354L0.439181 8.5L0.554224 8.72646L16 8.5ZM8.50098 4L8.50095 4.5C11.6103 4.50016 14.2864 6.23117 15.5542 8.72648L16 8.5L16.4458 8.27352C15.0067 5.44127 11.9853 3.50018 8.501 3.5L8.50098 4ZM16 8.5L15.5542 8.27352C14.2864 10.7688 11.6103 12.4998 8.50095 12.5L8.50098 13L8.501 13.5C11.9853 13.4998 15.0067 11.5587 16.4458 8.72648L16 8.5ZM8.50098 13V12.5C5.39112 12.5 2.71352 10.7691 1.44578 8.27354L1 8.5L0.554224 8.72646C1.99328 11.5592 5.01641 13.5 8.50098 13.5V13ZM1 8.5L1.44578 8.72646C2.71352 6.23093 5.39112 4.5 8.50098 4.5V4V3.5C5.01641 3.5 1.99328 5.4408 0.554224 8.27354L1 8.5Z"
                        fill="#7D7D7D"/>
                    <circle cx="8.5" cy="8.5" r="2.5" stroke="#7D7D7D"/>
                    <path d="M16 1L1 16" stroke="#7D7D7D" strokeLinecap="round"/>
                  </svg> :
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M8.50098 4L8.501 3.5H8.50098V4ZM16 8.5L16.4458 8.72648L16.5608 8.5L16.4458 8.27352L16 8.5ZM8.50098 13V13.5H8.501L8.50098 13ZM1 8.5L0.554224 8.27354L0.439181 8.5L0.554224 8.72646L16 8.5ZM8.50098 4L8.50095 4.5C11.6103 4.50016 14.2864 6.23117 15.5542 8.72648L16 8.5L16.4458 8.27352C15.0067 5.44127 11.9853 3.50018 8.501 3.5L8.50098 4ZM16 8.5L15.5542 8.27352C14.2864 10.7688 11.6103 12.4998 8.50095 12.5L8.50098 13L8.501 13.5C11.9853 13.4998 15.0067 11.5587 16.4458 8.72648L16 8.5ZM8.50098 13V12.5C5.39112 12.5 2.71352 10.7691 1.44578 8.27354L1 8.5L0.554224 8.72646C1.99328 11.5592 5.01641 13.5 8.50098 13.5V13ZM1 8.5L1.44578 8.72646C2.71352 6.23093 5.39112 4.5 8.50098 4.5V4V3.5C5.01641 3.5 1.99328 5.4408 0.554224 8.27354L1 8.5Z"
                        fill="#7D7D7D"/>
                    <circle cx="8.5" cy="8.5" r="2.5" stroke="#7D7D7D"/>
                  </svg>
              }
            </button>
          </div>
          {errors.confirmPassword && (
              <div className="email-auth-error-message">{errors.confirmPassword}</div>
          )}
        </div>

        <button
            className="email-auth-submit-button"
            onClick={handlePasswordChange}
            disabled={loading || !formData.newPassword || !formData.confirmPassword ||
                formData.newPassword !== formData.confirmPassword ||
                Object.keys(errors).length > 0}
        >
          {loading ? '처리 중...' : '확인'}
        </button>
      </>
  );

  return (
      <div className="email-auth-container">
        <div className="email-auth-content">
          <button
              className="email-auth-back-button"
              onClick={() => navigate(-1)}
              type="button"
          >
            ←
          </button>

          <div className="email-auth-logo-container">
            <img
                src="/images/logo-280a0a.png"
                alt="RoundAndGo Logo"
                className="email-auth-logo"
            />
            <h1 className="email-auth-title">ROUND & GO</h1>
          </div>

          <div className="email-auth-tab-container">
            <button
                className="email-auth-tab active"
                disabled={step !== 'input'}
            >
              비밀번호 변경
            </button>
          </div>

          <div className="email-auth-form-container">
            {step === 'input' && renderInputStep()}
            {step === 'emailSent' && renderEmailSentStep()}
            {step === 'passwordChange' && renderPasswordChangeStep()}
          </div>
        </div>
      </div>
  );
}

export default FindAccountPage;
