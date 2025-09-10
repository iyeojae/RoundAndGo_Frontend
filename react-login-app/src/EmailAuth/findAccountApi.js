/**
 * 아이디/비밀번호 찾기 API 서비스
 */

const API_BASE_URL = 'https://roundandgo.shop/api';

/**
 * 1단계: 아이디 찾기 이메일 인증 요청
 * @param {string} email - 사용자 이메일
 * @returns {Promise} API 응답
 */
export const requestIdFindEmailVerification = async (email, retryCount = 0) => {
  const maxRetries = 2;
  
  try {
    const requestBody = { email };
    
    const response = await fetch(`${API_BASE_URL}/auth/find-id/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // 500 에러이고 재시도 횟수가 남아있다면 재시도
      if (response.status === 500 && retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
        return requestIdFindEmailVerification(email, retryCount + 1);
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    // 네트워크 오류이고 재시도 횟수가 남아있다면 재시도
    if (error.name === 'TypeError' && retryCount < maxRetries) {
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
    console.error('[ID 찾기] 토큰 검증 실패:', error.message);
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
    console.error('[ID 찾기] 아이디 조회 실패:', error.message);
    throw error;
  }
};

/**
 * 비밀번호 재설정을 위한 이메일 인증코드 발송 (이메일만)
 * @param {string} email - 사용자 이메일
 * @returns {Promise} API 응답
 */
export const sendEmailVerificationForPassword = async (email) => {
  try {
    const requestBody = { email };
    
    const response = await fetch(`${API_BASE_URL}/auth/password-reset/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * 이메일과 인증코드로 아이디 찾기
 * @param {string} email - 사용자 이메일
 * @param {string} verificationCode - 인증코드
 * @returns {Promise} API 응답 (아이디 정보 포함)
 */
export const findUserIdByEmail = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/find-id/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * 이메일과 새 비밀번호로 비밀번호 재설정
 * @param {string} email - 사용자 이메일
 * @param {string} newPassword - 새 비밀번호
 * @returns {Promise} API 응답
 */
export const resetPasswordByEmail = async (email, newPassword) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/password-reset/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email,
        newPassword 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
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
