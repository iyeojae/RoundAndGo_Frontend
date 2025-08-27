/**
 * 백엔드 카카오 로그인 API 연결 테스트 스크립트
 * 
 * 브라우저 개발자 도구 콘솔에서 실행하여
 * 백엔드 API 엔드포인트들이 구현되어 있는지 확인할 수 있습니다.
 * 
 * 사용법:
 * 1. 브라우저에서 F12 누르고 Console 탭 열기
 * 2. 이 파일의 함수들을 복사해서 붙여넣기
 * 3. testAllApis() 함수 실행
 */

const API_BASE_URL = 'https://roundandgo.onrender.com';

/**
 * 카카오 로그인 URL 생성 API 테스트
 */
async function testGetLoginUrl() {
    console.log('🧪 카카오 로그인 URL 생성 API 테스트...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/kakao/login-url`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        console.log(`📡 응답 상태: ${response.status}`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ GET /api/auth/kakao/login-url - 성공');
            console.log('📄 응답 데이터:', data);
            return true;
        } else {
            const errorText = await response.text();
            console.log('❌ GET /api/auth/kakao/login-url - 실패');
            console.log('📄 에러 응답:', errorText);
            return false;
        }
    } catch (error) {
        console.log('❌ GET /api/auth/kakao/login-url - 네트워크 에러');
        console.log('📄 에러 내용:', error.message);
        return false;
    }
}

/**
 * 카카오 콜백 API 테스트 (더미 코드 사용)
 */
async function testKakaoCallback() {
    console.log('🧪 카카오 콜백 API 테스트...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/kakao/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: 'test_dummy_code' })
        });

        console.log(`📡 응답 상태: ${response.status}`);
        
        if (response.status === 404) {
            console.log('❌ POST /api/auth/kakao/callback - 엔드포인트 없음');
            return false;
        } else {
            // 400, 401, 500 등은 엔드포인트는 존재한다는 의미
            console.log('✅ POST /api/auth/kakao/callback - 엔드포인트 존재');
            console.log('ℹ️  (더미 코드로 인한 에러는 정상)');
            return true;
        }
    } catch (error) {
        console.log('❌ POST /api/auth/kakao/callback - 네트워크 에러');
        console.log('📄 에러 내용:', error.message);
        return false;
    }
}

/**
 * 사용자 정보 조회 API 테스트
 */
async function testGetUserInfo() {
    console.log('🧪 사용자 정보 조회 API 테스트...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test_dummy_token'
            }
        });

        console.log(`📡 응답 상태: ${response.status}`);
        
        if (response.status === 404) {
            console.log('❌ GET /api/auth/me - 엔드포인트 없음');
            return false;
        } else {
            console.log('✅ GET /api/auth/me - 엔드포인트 존재');
            console.log('ℹ️  (더미 토큰으로 인한 에러는 정상)');
            return true;
        }
    } catch (error) {
        console.log('❌ GET /api/auth/me - 네트워크 에러');
        console.log('📄 에러 내용:', error.message);
        return false;
    }
}

/**
 * 로그아웃 API 테스트
 */
async function testLogout() {
    console.log('🧪 로그아웃 API 테스트...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test_dummy_token'
            }
        });

        console.log(`📡 응답 상태: ${response.status}`);
        
        if (response.status === 404) {
            console.log('❌ POST /api/auth/logout - 엔드포인트 없음');
            return false;
        } else {
            console.log('✅ POST /api/auth/logout - 엔드포인트 존재');
            return true;
        }
    } catch (error) {
        console.log('❌ POST /api/auth/logout - 네트워크 에러');
        console.log('📄 에러 내용:', error.message);
        return false;
    }
}

/**
 * 토큰 갱신 API 테스트
 */
async function testRefreshToken() {
    console.log('🧪 토큰 갱신 API 테스트...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: 'test_dummy_refresh_token' })
        });

        console.log(`📡 응답 상태: ${response.status}`);
        
        if (response.status === 404) {
            console.log('❌ POST /api/auth/refresh - 엔드포인트 없음');
            return false;
        } else {
            console.log('✅ POST /api/auth/refresh - 엔드포인트 존재');
            return true;
        }
    } catch (error) {
        console.log('❌ POST /api/auth/refresh - 네트워크 에러');
        console.log('📄 에러 내용:', error.message);
        return false;
    }
}

/**
 * 모든 API 엔드포인트 테스트 실행
 */
async function testAllApis() {
    console.log('🚀 백엔드 카카오 로그인 API 연결 테스트 시작');
    console.log('=' .repeat(50));
    
    const results = {
        getLoginUrl: await testGetLoginUrl(),
        kakaoCallback: await testKakaoCallback(),
        getUserInfo: await testGetUserInfo(),
        logout: await testLogout(),
        refreshToken: await testRefreshToken()
    };
    
    console.log('=' .repeat(50));
    console.log('📊 테스트 결과 요약:');
    
    const successful = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;
    
    console.log(`✅ 성공: ${successful}/${total} API`);
    console.log(`❌ 실패: ${total - successful}/${total} API`);
    
    if (successful === total) {
        console.log('🎉 모든 API 엔드포인트가 구현되어 있습니다!');
        console.log('💡 이제 실제 카카오 로그인 테스트를 진행할 수 있습니다.');
    } else {
        console.log('⚠️  일부 API 엔드포인트가 구현되지 않았습니다.');
        console.log('👨‍💻 백엔드 개발자에게 다음 API 구현을 요청하세요:');
        
        Object.entries(results).forEach(([api, success]) => {
            if (!success) {
                console.log(`   - ${api}`);
            }
        });
    }
    
    return results;
}

// 즉시 실행 (선택사항)
// testAllApis();

console.log('📋 사용 가능한 테스트 함수들:');
console.log('  - testAllApis()        : 모든 API 테스트');
console.log('  - testGetLoginUrl()    : 로그인 URL 생성 API');
console.log('  - testKakaoCallback()  : 카카오 콜백 API');
console.log('  - testGetUserInfo()    : 사용자 정보 조회 API');
console.log('  - testLogout()         : 로그아웃 API');
console.log('  - testRefreshToken()   : 토큰 갱신 API');
console.log('');
console.log('💡 testAllApis()를 실행하여 모든 API를 한번에 테스트하세요!');
