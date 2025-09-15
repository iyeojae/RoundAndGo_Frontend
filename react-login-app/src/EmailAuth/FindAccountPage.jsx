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
        newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
      } else {
        delete newErrors.newPassword;
      }
    }
    if (field === 'confirmPassword' && value) {
      if (value !== formData.newPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
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
      <div className="email-auth-input-group">
        <label className="email-auth-label">이메일</label>
        <input
          className="email-auth-input"
          type="email"
          placeholder="example@email.com"
          value={formData.email}
          onChange={handleInputChange('email')}
          style={{ 
            borderColor: errors.email ? '#e74c3c' : '#E5E5E5' 
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
      >
        {loading ? '처리 중...' : '인증메일 받기'}
      </button>
    </>
  );

  const renderEmailSentStep = () => (
    <div className="email-auth-email-sent-container">
      <div className="email-auth-email-icon">
        <img src="/mail-img.png" alt="Email Icon" width="40" height="40" />
      </div>
      
      <h2 className="email-auth-email-sent-title">
        비밀번호 찾기 인증메일이 발송되었습니다
      </h2>
      
      <p className="email-auth-email-sent-message">메일함에서 인증메일을 확인하시기 바랍니다.</p>
      <p className="email-auth-email-sent-message">이메일의 인증 버튼을 선택하면 인증이 완료됩니다.</p>
      
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
        <label className="email-auth-label">새로 설정할 비밀번호를 입력해주세요.</label>
        <div className="email-auth-password-input-container">
          <input
            className="email-auth-input email-auth-password-input"
            type={formData.showPassword ? 'text' : 'password'}
            placeholder="새로 설정할 비밀번호를 입력해주세요."
            value={formData.newPassword}
            onChange={handleInputChange('newPassword')}
            style={{ borderColor: errors.newPassword ? '#e74c3c' : '#E5E5E5' }}
          />
          <button 
            className="email-auth-password-toggle-button"
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
          >
            {formData.showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {errors.newPassword && (
          <div className="email-auth-error-message">{errors.newPassword}</div>
        )}
      </div>

      <div className="email-auth-input-group">
        <label className="email-auth-label">비밀번호를 한번 더 입력해주세요.</label>
        <div className="email-auth-password-input-container">
          <input
            className="email-auth-input email-auth-password-input"
            type={formData.showConfirmPassword ? 'text' : 'password'}
            placeholder="비밀번호를 한번 더 입력해주세요."
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            style={{ borderColor: errors.confirmPassword ? '#e74c3c' : '#E5E5E5' }}
          />
          <button 
            className="email-auth-password-toggle-button"
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, showConfirmPassword: !prev.showConfirmPassword }))}
          >
            {formData.showConfirmPassword ? '👁️' : '👁️‍🗨️'}
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
            비밀번호 찾기
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
