/**
 * 쿠키 관리 유틸리티 함수들
 */

// 쿠키 설정
export const setCookie = (name, value, options = {}) => {
  const {
    expires = 7, // 기본 7일
    path = '/',
    domain = window.location.hostname,
    secure = window.location.protocol === 'https:',
    sameSite = 'strict'
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}`;
  
  if (expires) {
    const date = new Date();
    date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
    cookieString += `; expires=${date.toUTCString()}`;
  }
  
  cookieString += `; path=${path}`;
  cookieString += `; domain=${domain}`;
  
  if (secure) {
    cookieString += '; secure';
  }
  
  cookieString += `; samesite=${sameSite}`;
  
  document.cookie = cookieString;
};

// 쿠키 읽기
export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

// 쿠키 삭제
export const deleteCookie = (name, path = '/', domain = window.location.hostname) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain};`;
};

// 모든 쿠키 삭제
export const clearAllCookies = () => {
  const cookies = document.cookie.split(";");
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    deleteCookie(name);
  }
};

// 토큰 관련 쿠키 관리
export const setAuthToken = (token, expires = 7) => {
  setCookie('accessToken', token, { expires });
};

export const getAuthToken = () => {
  return getCookie('accessToken');
};

export const removeAuthToken = () => {
  deleteCookie('accessToken');
};

// 로그인 상태 확인
export const isLoggedIn = () => {
  return getAuthToken() !== null;
};

// 로그아웃
export const logout = () => {
  removeAuthToken();
  // 필요시 다른 쿠키도 삭제
  deleteCookie('refreshToken');
  deleteCookie('userInfo');
};
