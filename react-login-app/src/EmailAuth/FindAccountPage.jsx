import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmailAuth.css';
import { 
  requestIdFindEmailVerification, 
  sendEmailVerificationForPassword,
  findUserIdByEmail,
  resetPasswordByEmail,
  getErrorMessage 
} from './findAccountApi';

function FindAccountPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('id');
  const [step, setStep] = useState('input');
  
  const [formData, setFormData] = useState({
    email: '',
    userId: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
    showPassword: false,
    showConfirmPassword: false
  });
  
  const [foundId, setFoundId] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUserId = (userId) => {
    return userId.length >= 4 && userId.length <= 20;
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
    if (field === 'userId' && value) {
      if (!validateUserId(value)) {
        newErrors.userId = '아이디는 4자 이상 20자 이하로 입력해주세요.';
      } else {
        delete newErrors.userId;
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
      if (activeTab === 'id') {
        if (!formData.email) {
          alert('이메일 주소를 입력해주세요.');
          return;
        }
        if (!validateEmail(formData.email)) {
          alert('올바른 이메일 주소 형식을 입력해주세요.');
          return;
        }
        
        // 1단계: 이메일 입력 및 인증 메일 발송
        try {
          const response = await fetch('https://roundandgo.shop/api/auth/find-id/request', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email })
          });
          
          if (response.ok) {
            // 성공 시 이메일을 로컬 스토리지에 저장
            localStorage.setItem('findIdEmail', formData.email);
            alert(`${formData.email}로 인증메일이 발송되었습니다.`);
            setStep('emailSent');
          } else {
            // 응답을 먼저 텍스트로 받아서 확인
            const responseText = await response.text();
            console.log('API 응답 원문:', responseText);
            
            try {
              const errorData = JSON.parse(responseText);
              alert(errorData.message || '인증메일 발송에 실패했습니다.');
            } catch (jsonError) {
              // JSON 파싱 실패 시 (예: Proxy error 등)
              console.error('JSON 파싱 오류:', jsonError);
              console.error('응답 원문:', responseText);
              
              if (responseText.includes('Proxy error')) {
                alert('백엔드 서버 연결에 실패했습니다.\n\n1. 백엔드 서버가 실행 중인지 확인해주세요\n2. 프록시 설정을 확인해주세요');
              } else {
                alert(`서버 응답을 처리할 수 없습니다.\n응답: ${responseText.substring(0, 100)}...`);
              }
            }
          }
        } catch (error) {
          console.error('API 호출 오류:', error);
          
          // 백엔드 서버 연결 실패 시 더 명확한 메시지
          if (error.message.includes('Proxy error') || error.message.includes('ECONNREFUSED')) {
            alert('백엔드 서버에 연결할 수 없습니다.\n\n1. 백엔드 서버가 실행 중인지 확인해주세요\n2. 프록시 설정을 확인해주세요');
          } else if (error.message.includes('SyntaxError')) {
            alert('서버 응답을 처리할 수 없습니다.\n백엔드 서버 상태를 확인해주세요.');
          } else {
            alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
          }
        }
      } else {
        if (!formData.userId) {
          alert('아이디를 입력해주세요.');
          return;
        }
        if (!formData.email) {
          alert('이메일 주소를 입력해주세요.');
          return;
        }
        if (!validateUserId(formData.userId)) {
          alert('아이디는 4자 이상 20자 이하로 입력해주세요.');
          return;
        }
        if (!validateEmail(formData.email)) {
          alert('올바른 이메일 주소 형식을 입력해주세요.');
          return;
        }
        const result = await sendEmailVerificationForPassword(formData.userId, formData.email);
        alert(`${formData.email}로 인증메일이 발송되었습니다.`);
        setStep('emailSent');
      }
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
      await resetPasswordByEmail(formData.userId, formData.email, '', formData.newPassword);
      alert('비밀번호가 성공적으로 변경되었습니다.');
      navigate('/email-login');
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('input');
    setFormData({
      email: '',
      userId: '',
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false
    });
    setFoundId('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const renderInputStep = () => (
    <>
      {activeTab === 'password' && (
        <div className="email-auth-input-group">
          <label className="email-auth-label">아이디</label>
          <input
            className="email-auth-input"
            type="text"
            placeholder="아이디를 입력하세요"
            value={formData.userId}
            onChange={handleInputChange('userId')}
            style={{ 
              borderColor: errors.userId ? '#e74c3c' : '#E5E5E5' 
            }}
          />
          {errors.userId && (
            <div className="email-auth-error-message">{errors.userId}</div>
          )}
        </div>
      )}

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
        disabled={loading || !formData.email || (activeTab === 'password' && !formData.userId)}
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
        {activeTab === 'id' ? '아이디 찾기' : '비밀번호 찾기'} 인증메일이 발송되었습니다
      </h2>
      
      <p className="email-auth-email-sent-message">메일함에서 인증메일을 확인하시기 바랍니다.</p>
      <p className="email-auth-email-sent-message">이메일의 인증 버튼을 선택하면 인증이 완료됩니다.</p>
      
      <button className="email-auth-resend-button" onClick={handleSendVerification}>
        재발송
      </button>
      
      <button className="email-auth-confirm-button" onClick={async () => {
        if (activeTab === 'id') {
          // 3단계: 사이트에서 확인버튼 클릭으로 아이디 조회
          try {
            const savedEmail = localStorage.getItem('findIdEmail');
            if (!savedEmail) {
              alert('이메일 정보를 찾을 수 없습니다. 다시 시도해주세요.');
              return;
            }
            
            console.log('🔍 아이디 찾기 확인 API 호출 시작');
            console.log('📤 전송할 데이터:', { email: savedEmail });
            
            const response = await fetch('https://roundandgo.shop/api/auth/find-id/confirm', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: savedEmail })
            });
            
            console.log('📡 API 응답 상태:', response.status, response.statusText);
            
            if (response.ok) {
              const data = await response.json();
              // 아이디 조회 성공 시 결과 페이지로 이동
              setFoundId(data.userId || savedEmail); // 백엔드에서 userId 반환하거나 이메일 사용
              setStep('result');
            } else {
              console.log('❌ API 호출 실패:', response.status);
              try {
                const errorData = await response.json();
                console.log('❌ 에러 응답 데이터:', errorData);
                if (errorData.message && errorData.message.includes('인증')) {
                  alert('이메일 인증이 완료되지 않았습니다. 메일함에서 인증을 완료해주세요.');
                } else {
                  alert(errorData.message || '아이디 조회에 실패했습니다.');
                }
              } catch (jsonError) {
                console.error('❌ JSON 파싱 오류:', jsonError);
                const responseText = await response.text();
                console.log('❌ 응답 원문:', responseText);
                alert('서버 응답을 처리할 수 없습니다.\n백엔드 서버 상태를 확인해주세요.');
              }
            }
          } catch (error) {
            console.error('아이디 조회 API 호출 오류:', error);
            alert('서버 연결에 실패했습니다. 다시 시도해주세요.');
          }
        } else {
          setStep('passwordChange');
        }
      }}>
        확인
      </button>
    </div>
  );

  const renderVerifyStep = () => (
    <>
      <div className="email-auth-input-group">
        <label className="email-auth-label">인증코드</label>
        <div className="email-auth-verification-container">
          <input
            className="email-auth-input email-auth-verification-input"
            type="text"
            placeholder="6자리 인증코드"
            value={formData.verificationCode}
            onChange={handleInputChange('verificationCode')}
            maxLength={6}
          />
          <button 
            className="email-auth-verification-button"
            onClick={handleSendVerification}
            disabled={loading || countdown > 0}
          >
            {countdown > 0 ? `${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}` : '재발송'}
          </button>
        </div>
      </div>

      {activeTab === 'password' && (
        <>
          <div className="email-auth-input-group">
            <label className="email-auth-label">새 비밀번호</label>
            <div className="email-auth-password-input-container">
              <input
                className="email-auth-input email-auth-password-input"
                type={formData.showPassword ? 'text' : 'password'}
                placeholder="8자 이상의 새 비밀번호"
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
            {errors.newPassword && <div className="email-auth-error-message">{errors.newPassword}</div>}
          </div>

          <div className="email-auth-input-group">
            <label className="email-auth-label">비밀번호 확인</label>
            <div className="email-auth-password-input-container">
              <input
                className="email-auth-input email-auth-password-input"
                type={formData.showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호를 다시 입력하세요"
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
            {errors.confirmPassword && <div className="email-auth-error-message">{errors.confirmPassword}</div>}
          </div>
        </>
      )}

      <button 
        className="email-auth-submit-button"
        onClick={handleSubmit}
        disabled={loading || !formData.verificationCode || 
                 (activeTab === 'password' && (!formData.newPassword || !formData.confirmPassword || 
                  formData.newPassword !== formData.confirmPassword))}
      >
        {loading ? '처리 중...' : (activeTab === 'id' ? '아이디 찾기' : '비밀번호 재설정')}
      </button>
    </>
  );

  const renderResultStep = () => (
    <div className="email-auth-result-container">
      <p className="email-auth-result-message">
        입력하신 정보와 일치하는 아이디입니다.
      </p>
      
      <div className="email-auth-result-info-box">
        <div className="email-auth-result-info-line">아이디: {foundId || '찾을 수 없음'}</div>
        <div className="email-auth-result-info-line">이메일: {formData.email}</div>
      </div>

      <button className="email-auth-action-button" onClick={() => navigate('/email-login')}>
        로그인 하러가기
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
            className={`email-auth-tab ${activeTab === 'id' ? 'active' : ''}`}
            onClick={() => handleTabChange('id')}
            disabled={step !== 'input'}
          >
            아이디 찾기
          </button>
          <button
            className={`email-auth-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => handleTabChange('password')}
            disabled={step !== 'input'}
          >
            비밀번호 변경
          </button>
        </div>

        <div className="email-auth-form-container">
          {step === 'input' && renderInputStep()}
          {step === 'verify' && renderVerifyStep()}
          {step === 'emailSent' && renderEmailSentStep()}
          {step === 'result' && renderResultStep()}
          {step === 'passwordChange' && renderPasswordChangeStep()}
        </div>
      </div>
    </div>
  );
}

export default FindAccountPage;
