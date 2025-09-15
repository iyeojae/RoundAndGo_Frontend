/**
 * 아이디/비밀번호 찾기 API 서비스
 */

const API_BASE_URL = 'https://roundandgo.onrender.com/api';

/**
 * 1단계: 아이디 찾기 이메일 인증 요청
 * @param {string} email - 사용자 이메일
 * @returns {Promise} API 응답
 */
export const requestIdFindEmailVerification = async (email, retryCount = 0) => {
  const maxRetries = 2;
  console.log(`📤 아이디 찾기 이메일 인증 API 호출 시작 (시도 ${retryCount + 1}/${maxRetries + 1})`);
  console.log('🌐 API URL:', `${API_BASE_URL}/auth
    /find-id/request`);
  console.log('📧 요청 이메일:', email);
  
  try {
    const requestBody = { email };
    console.log('📦 요청 본문:', requestBody);
    
    const response = await fetch(`${API_BASE_URL}/auth/find-id/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 HTTP 응답 상태:', response.status);
    console.log('📡 HTTP 응답 헤더:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP 오류 응답 본문:', errorText);
      
      // 500 에러이고 재시도 횟수가 남아있다면 재시도
      if (response.status === 500 && retryCount < maxRetries) {
        console.log(`🔄 500 에러 발생, ${retryCount + 1}초 후 재시도...`);
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
        return requestIdFindEmailVerification(email, retryCount + 1);
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 아이디 찾기 이메일 인증 API 성공:', result);
    return result;
  } catch (error) {
    console.error('💥 아이디 찾기 이메일 인증 요청 실패:', error);
    console.error('🔍 에러 상세 정보:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // 네트워크 오류이고 재시도 횟수가 남아있다면 재시도
    if (error.name === 'TypeError' && retryCount < maxRetries) {
      console.log(`🔄 네트워크 오류 발생, ${retryCount + 1}초 후 재시도...`);
      await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
      return requestIdFindEmailVerification(email, retryCount + 1);
    }
    
    throw error;
  }
};

/**
 * 2단계: 이메일 인증 토큰 검증 (이메일 링크 클릭 시)
 * @param {string} token - 이메일 인증 토큰
 * @returns {Promise} API 응답
 */
export const verifyIdFindEmailToken = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/find-id/verify?token=${token}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('이메일 인증 토큰 검증 실패:', error);
    throw error;
  }
};

/**
 * 3단계: 인증 완료 후 아이디 조회
 * @param {string} email - 사용자 이메일
 * @returns {Promise} API 응답 (아이디 정보 포함)
 */
export const confirmIdFind = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/find-id/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('아이디 찾기 확인 실패:', error);
    throw error;
  }
};

/**
 * 비밀번호 재설정을 위한 이메일 인증코드 발송 (아이디 + 이메일)
 * @param {string} userId - 사용자 아이디
 * @param {string} email - 사용자 이메일
 * @returns {Promise} API 응답
 */
export const sendEmailVerificationForPassword = async (userId, email) => {
  console.log('📤 비밀번호 재설정 이메일 인증 API 호출 시작');
  console.log('🌐 API URL:', `${API_BASE_URL}/auth/find-password/send-email`);
  console.log('👤 요청 사용자 ID:', userId);
  console.log('📧 요청 이메일:', email);
  
  try {
    const requestBody = { userId, email };
    console.log('📦 요청 본문:', requestBody);
    
    const response = await fetch(`${API_BASE_URL}/auth/find-password/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📡 HTTP 응답 상태:', response.status);
    console.log('📡 HTTP 응답 헤더:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP 오류 응답 본문:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 비밀번호 재설정 이메일 인증 API 성공:', result);
    return result;
  } catch (error) {
    console.error('💥 이메일 인증코드 발송 실패:', error);
    console.error('🔍 에러 상세 정보:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
};

/**
 * 이메일과 인증코드로 아이디 찾기
 * @param {string} email - 사용자 이메일
 * @param {string} verificationCode - 인증코드
 * @returns {Promise} API 응답 (아이디 정보 포함)
 */
export const findUserIdByEmail = async (email, verificationCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/find-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        verificationCode 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('아이디 찾기 실패:', error);
    throw error;
  }
};

/**
 * 아이디, 이메일, 인증코드로 비밀번호 재설정
 * @param {string} userId - 사용자 아이디
 * @param {string} email - 사용자 이메일
 * @param {string} verificationCode - 인증코드
 * @param {string} newPassword - 새 비밀번호
 * @returns {Promise} API 응답
 */
export const resetPasswordByEmail = async (userId, email, verificationCode, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId,
        email, 
        verificationCode,
        newPassword 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('비밀번호 재설정 실패:', error);
    throw error;
  }
};

/**
 * 인증코드 검증
 * @param {string} type - 'email' 또는 'sms'
 * @param {string} target - 이메일 또는 전화번호
 * @param {string} verificationCode - 인증코드
 * @returns {Promise} API 응답
 */
export const verifyCode = async (type, target, verificationCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        type,
        target,
        verificationCode 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('인증코드 검증 실패:', error);
    throw error;
  }
};

/**
 * 에러 메시지 처리 헬퍼 함수
 * @param {Error} error - 에러 객체
 * @returns {string} 사용자 친화적인 에러 메시지
 */
export const getErrorMessage = (error) => {
  if (error.message.includes('404')) {
    return '해당 정보로 등록된 계정을 찾을 수 없습니다.';
  } else if (error.message.includes('400')) {
    return '잘못된 요청입니다. 입력 정보를 확인해주세요.';
  } else if (error.message.includes('429')) {
    return '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.';
  } else if (error.message.includes('500')) {
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  } else {
    return '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.';
  }
};
