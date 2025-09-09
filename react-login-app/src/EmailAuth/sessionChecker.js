/**
 * 이메일 로그인 세션 체크 및 자동 로그인 동기화
 * 카카오 로그인과 완전히 분리된 독립적인 모듈
 * 
 * 이 스크립트를 콘솔에서 실행하면
 * 현재 이메일 로그인 세션을 확인하고
 * 로그인 상태를 프론트엔드와 동기화합니다
 */

// 콘솔에서 실행할 함수
window.checkAndSyncEmailSession = async function() {
  console.log('🔄 이메일 세션 기반 로그인 상태 확인 및 동기화 시작...');
  
  try {
    // 1. 현재 쿠키 상태 확인
    console.log('🍪 현재 쿠키:', document.cookie);
    
    // 2. 백엔드 API로 사용자 정보 요청
    console.log('📡 백엔드에 이메일 사용자 정보 요청 중...');
    
    const response = await fetch('https://roundandgo.onrender.com/api/user/me', {
      method: 'GET',
      credentials: 'include', // JSESSIONID 쿠키 포함
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 이메일 API 응답 상태:', response.status);
    
    if (response.ok) {
      const userInfo = await response.json();
      console.log('✅ 백엔드에서 이메일 사용자 정보 확인:', userInfo);
      
      // 3. 로컬스토리지에 이메일 사용자 정보 저장
      localStorage.setItem('emailUser', JSON.stringify({
        type: 'email',
        loginTime: new Date().toISOString(),
        userInfo: userInfo
      }));
      
      console.log('✅ 로컬스토리지에 이메일 사용자 정보 저장 완료!');
      console.log('💾 저장된 정보:', localStorage.getItem('emailUser'));
      
      alert('✅ 이메일 로그인 동기화 완료! 페이지를 새로고침합니다.');
      window.location.reload();
      
      return true;
    } else if (response.status === 401) {
      console.log('❌ 이메일 세션 만료 또는 로그인되지 않음');
      alert('❌ 백엔드 이메일 세션이 없습니다. 다시 로그인해주세요.');
      return false;
    } else {
      console.log('❌ 이메일 API 응답 실패:', response.status, response.statusText);
      alert('❌ 이메일 API 호출 실패: ' + response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ 이메일 동기화 에러:', error);
    alert('❌ 오류 발생: ' + error.message);
    return false;
  }
};

// 자동 실행
console.log('🎯 이메일 세션 체크 함수 준비 완료!');
console.log('💡 실행하려면 콘솔에서 checkAndSyncEmailSession() 입력하세요!');

