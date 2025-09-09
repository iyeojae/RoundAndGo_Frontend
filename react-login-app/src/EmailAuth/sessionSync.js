/**
 * 이메일 로그인 세션 기반 사용자 정보 동기화
 * 카카오 로그인과 완전히 분리된 독립적인 모듈
 * 
 * 이메일 로그인 성공 후
 * 프론트엔드에서 세션 정보를 가져와 로컬스토리지에 저장
 */

/**
 * API를 통한 현재 이메일 로그인 상태 확인 및 사용자 정보 동기화
 */
export const syncEmailUserFromSession = async () => {
  try {
    console.log('🔄 이메일 세션 기반 사용자 정보 동기화 시도...');
    
    // 백엔드 API로 현재 사용자 정보 요청
    const response = await fetch('https://roundandgo.onrender.com/api/user/me', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const userInfo = await response.json();
      console.log('✅ 이메일 세션에서 사용자 정보 확인:', userInfo);
      
      // 로컬스토리지에 이메일 사용자 정보 저장
      localStorage.setItem('emailUser', JSON.stringify({
        type: 'email',
        loginTime: new Date().toISOString(),
        userInfo: userInfo
      }));
      
      return true;
    } else if (response.status === 401) {
      console.log('❌ 이메일 세션 만료 또는 로그인되지 않음');
      return false;
    } else {
      console.log('❌ 이메일 API 응답 실패:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.log('❌ 이메일 사용자 정보 동기화 에러:', error);
    return false;
  }
};

/**
 * 페이지 로드 시 자동으로 이메일 세션 동기화 실행
 */
export const autoSyncEmailOnLoad = async () => {
  // 이미 이메일 사용자 정보가 있으면 스킵
  if (localStorage.getItem('emailUser')) {
    console.log('✅ 이미 이메일 로그인 상태입니다');
    return;
  }
  
  // 세션 쿠키가 있으면 동기화 시도
  const sessionCookie = document.cookie.split(';').find(cookie => 
    cookie.trim().startsWith('JSESSIONID=')
  );
  
  if (sessionCookie) {
    console.log('🎯 이메일 세션 쿠키 발견 - 자동 동기화 실행');
    const success = await syncEmailUserFromSession();
    
    if (success) {
      console.log('✅ 이메일 자동 로그인 동기화 완료!');
      // 페이지 새로고침으로 UI 업데이트
      window.location.reload();
    }
  }
};

