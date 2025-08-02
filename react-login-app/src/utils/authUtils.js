/**
 * 인증 관련 유틸리티 함수들
 * 이메일 로그인, 카카오 로그인, 로그아웃 등의 기능을 제공
 */

// API 기본 URL (백엔드 서버 주소로 변경)
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * API 요청 헬퍼 함수 (인증 토큰 포함)
 * @param {string} url - API 엔드포인트
 * @param {Object} options - fetch 옵션
 * @returns {Promise} API 응답
 */
export const apiRequest = async (url, options = {}) => {
  const token = getToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, defaultOptions);
    
    if (response.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      logout();
      throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
    }
    
    return response;
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
};

/**
 * 토큰 저장
 * @param {string} token - JWT 토큰
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * 토큰 가져오기
 * @returns {string|null} JWT 토큰
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * 토큰 삭제
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * 이메일 유효성 검사
 * @param {string} email - 검사할 이메일 주소
 * @returns {boolean} 유효한 이메일인지 여부
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 비밀번호 유효성 검사
 * @param {string} password - 검사할 비밀번호
 * @returns {Object} 검사 결과와 메시지
 */
export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return { isValid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
  }
  if (!hasUpperCase) {
    return { isValid: false, message: '대문자를 포함해야 합니다.' };
  }
  if (!hasLowerCase) {
    return { isValid: false, message: '소문자를 포함해야 합니다.' };
  }
  if (!hasNumbers) {
    return { isValid: false, message: '숫자를 포함해야 합니다.' };
  }
  if (!hasSpecialChar) {
    return { isValid: false, message: '특수문자를 포함해야 합니다.' };
  }

  return { isValid: true, message: '유효한 비밀번호입니다.' };
};

/**
 * 이메일 로그인 처리 (JWT 백엔드 API 사용)
 * @param {string} email - 이메일 주소
 * @param {string} password - 비밀번호
 * @returns {Promise<Object>} 로그인 결과
 */
export const handleEmailLogin = async (email, password) => {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    
    if (result.success && result.token) {
      // 토큰 저장
      setToken(result.token);
      
      // 사용자 정보 저장
      const userData = {
        id: result.user.id,
        email: result.user.email,
        nickname: result.user.nickname,
        loginMethod: 'email',
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      return { success: true, user: userData };
    } else {
      return { success: false, message: result.message || '로그인에 실패했습니다.' };
    }
  } catch (error) {
    console.error('이메일 로그인 오류:', error);
    return { success: false, message: '로그인 중 오류가 발생했습니다.' };
  }
};

/**
 * 이메일 회원가입 처리 (JWT 백엔드 API 사용)
 * @param {Object} userData - 회원가입 데이터
 * @returns {Promise<Object>} 회원가입 결과
 */
export const handleEmailSignup = async (userData) => {
  try {
    const { email, password, nickname } = userData;
    
    // 이메일 유효성 검사
    if (!validateEmail(email)) {
      return { success: false, message: '유효한 이메일 주소를 입력해주세요.' };
    }
    
    // 비밀번호 유효성 검사
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return { success: false, message: passwordValidation.message };
    }
    
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, nickname }),
    });

    const result = await response.json();
    
    if (result.success) {
      return { success: true, message: '회원가입이 완료되었습니다.' };
    } else {
      return { success: false, message: result.message || '회원가입에 실패했습니다.' };
    }
  } catch (error) {
    console.error('회원가입 오류:', error);
    return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
  }
};

/**
 * 카카오 로그인 처리 (JWT 백엔드 API 사용)
 * @param {Object} userInfo - 카카오 사용자 정보
 * @returns {Promise<Object>} 로그인 결과
 */
export const handleKakaoLogin = async (userInfo) => {
  try {
    const response = await apiRequest('/auth/kakao', {
      method: 'POST',
      body: JSON.stringify({
        kakaoId: userInfo.id,
        nickname: userInfo.properties?.nickname,
        profileImage: userInfo.properties?.profile_image,
        email: userInfo.kakao_account?.email,
      }),
    });

    const result = await response.json();
    
    if (result.success && result.token) {
      // 토큰 저장
      setToken(result.token);
      
      // 사용자 정보 저장
      const userData = {
        id: result.user.id,
        nickname: result.user.nickname,
        profileImage: result.user.profileImage,
        email: result.user.email,
        loginMethod: 'kakao',
        loginTime: new Date().toISOString()
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      return { success: true, user: userData };
    } else {
      return { success: false, message: result.message || '카카오 로그인에 실패했습니다.' };
    }
  } catch (error) {
    console.error('카카오 로그인 오류:', error);
    return { success: false, message: '카카오 로그인 중 오류가 발생했습니다.' };
  }
};

/**
 * 로그아웃 처리
 */
export const logout = () => {
  // 토큰 삭제
  removeToken();
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  
  // 카카오 로그아웃 (카카오 SDK가 로드된 경우)
  if (window.Kakao && window.Kakao.Auth) {
    window.Kakao.Auth.logout(() => {
      console.log('카카오 로그아웃 완료');
      // 페이지 새로고침하여 완전히 초기화
      window.location.href = '/';
    });
  } else {
    // 카카오 SDK가 없는 경우 바로 홈으로 이동
    window.location.href = '/';
  }
};

/**
 * 현재 로그인 상태 확인 (JWT 토큰 기반)
 * @returns {boolean} 로그인 상태
 */
export const isLoggedIn = () => {
  const token = getToken();
  return token !== null;
};

/**
 * 현재 사용자 정보 가져오기
 * @returns {Object|null} 사용자 정보
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * 인증이 필요한 페이지 보호
 * @param {Function} navigate - React Router의 navigate 함수
 * @returns {boolean} 인증 상태
 */
export const requireAuth = (navigate) => {
  if (!isLoggedIn()) {
    navigate('/');
    return false;
  }
  return true;
};

/**
 * 토큰 유효성 검증 (백엔드 API 호출)
 * @returns {Promise<boolean>} 토큰 유효성
 */
export const validateToken = async () => {
  try {
    const response = await apiRequest('/auth/validate');
    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('토큰 검증 오류:', error);
    return false;
  }
}; 