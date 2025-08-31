/**
 * OAuth2 방식 카카오 로그인 설정 및 API
 * 
 * Spring Security OAuth2와 연동하는 카카오 로그인 시스템입니다.
 * REST API 호출 없이 직접 백엔드 OAuth2 엔드포인트로 리다이렉트하는 방식을 사용합니다.
 * 
 * 주요 특징:
 * 1. React Router 완전 우회 - 브라우저 네이티브 리다이렉트 사용
 * 2. 다중 인증 방식 지원 (JWT 토큰, 쿠키, 세션)
 * 3. 팝업/현재창 로그인 모드 지원
 * 4. 상세한 디버깅 및 에러 처리
 * 5. 자동 토큰 만료 감지 및 로그아웃
 * 
 * 지원하는 토큰 저장 방식:
 * - URL 파라미터: ?accessToken=xxx&refreshToken=yyy
 * - 쿠키: authToken, accessToken, JWT, JSESSIONID
 * - 로컬스토리지: authToken, refreshToken, user
 * 
 * @author RoundAndGo Team
 * @version 2.0.0
 * @since 2025-01-27
 */

// 🌐 백엔드 서버 URL 설정
// 개발 환경: 배포된 서버 사용
// 프로덕션: https://roundandgo.onrender.com (실제 백엔드 서버)
const BACKEND_BASE_URL = 'https://roundandgo.onrender.com';

/**
 * OAuth2 카카오 로그인 API 객체
 * 
 * 카카오 로그인과 관련된 모든 기능을 제공하는 API 집합입니다.
 * 현재창 로그인, 팝업 로그인, 로그아웃 기능을 포함합니다.
 */
export const oauth2KakaoApi = {
    /**
     * 현재 창에서 카카오 로그인 시작
     * 
     * 백엔드의 Spring Security OAuth2 엔드포인트로 직접 리다이렉트합니다.
     * React Router의 간섭을 완전히 우회하여 브라우저 네이티브 이동을 강제 실행합니다.
     * 
     * 특징:
     * - React Router 완전 우회
     * - 이중 안전장치 (assign + replace)
     * - 백엔드 OAuth2 엔드포인트로 직접 이동
     * 
     * 처리 과정:
     * 1. 카카오 로그인 URL 생성
     * 2. React Router 우회 준비
     * 3. 즉시 페이지 이동 (assign)
     * 4. 백업 페이지 이동 (replace, 100ms 후)
     * 
     * @example
     * oauth2KakaoApi.startLogin();
     * // 사용자가 카카오 로그인 페이지로 이동됨
     */
    startLogin: () => {
        // 🎯 Spring Security OAuth2 카카오 로그인 엔드포인트 URL 생성
        const kakaoLoginUrl = `${BACKEND_BASE_URL}/oauth2/authorization/kakao`;
        
        console.log('🚀 OAuth2 카카오 로그인 시작');
        console.log('🔗 리다이렉트 URL:', kakaoLoginUrl);
        
        // 🔄 카카오 로그인 페이지로 이동
        console.log('🚀 카카오 로그인 페이지로 이동 시작...');
        
        // 🚨 방법 1: 즉시 페이지 완전 교체
        console.log('💥 즉시 페이지 완전 교체');
        window.location.href = kakaoLoginUrl;
        
        // 🚨 방법 2: 강제 페이지 새로고침 (백업)
        setTimeout(() => {
            console.log('🔄 강제 새로고침 백업');
            window.location.replace(kakaoLoginUrl);
        }, 100);
        
        // 🚨 방법 3: document.location 사용 (최종 백업)
        setTimeout(() => {
            console.log('🔄 document.location 최종 백업');
            document.location.href = kakaoLoginUrl;
        }, 200);
        
        // 🚨 방법 4: top.location 사용 (프레임 환경 대응)
        try {
            if (window.top) {
                setTimeout(() => {
                    console.log('🔄 top.location 프레임 우회');
                    window.top.location.href = kakaoLoginUrl;
                }, 300);
            }
        } catch (e) {
            console.log('⚠️ top.location 접근 불가 (보안 제한)');
        }
    },

    /**
     * 팝업 방식 카카오 로그인
     * 메인 페이지를 유지하면서 팝업으로 로그인 처리
     */
    startLoginPopup: () => {
        return new Promise((resolve, reject) => {
            const kakaoLoginUrl = `${BACKEND_BASE_URL}/oauth2/authorization/kakao`;
            
            console.log('🚀 OAuth2 카카오 로그인 팝업 시작');
            
            // 팝업 창 열기
            const popup = window.open(
                kakaoLoginUrl,
                'kakaoLogin',
                'width=500,height=600,scrollbars=yes,resizable=yes'
            );

            // 팝업 창 메시지 리스너
            const messageListener = (event) => {
                // 보안을 위해 origin 확인
                if (event.origin !== window.location.origin) {
                    return;
                }

                if (event.data.type === 'OAUTH2_LOGIN_SUCCESS') {
                    console.log('✅ OAuth2 로그인 성공:', event.data);
                    
                    // JWT 토큰 저장
                    localStorage.setItem('authToken', event.data.accessToken);
                    localStorage.setItem('refreshToken', event.data.refreshToken);
                    localStorage.setItem('user', JSON.stringify({
                        type: 'kakao',
                        loginTime: new Date().toISOString(),
                        isOAuth2: true
                    }));

                    popup.close();
                    window.removeEventListener('message', messageListener);
                    resolve(event.data);
                    
                } else if (event.data.type === 'OAUTH2_LOGIN_ERROR') {
                    console.error('❌ OAuth2 로그인 실패:', event.data.error);
                    popup.close();
                    window.removeEventListener('message', messageListener);
                    reject(new Error(event.data.error || 'OAuth2 로그인 실패'));
                }
            };

            window.addEventListener('message', messageListener);

            // 팝업이 닫혔는지 주기적으로 확인
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', messageListener);
                    reject(new Error('사용자가 로그인을 취소했습니다'));
                }
            }, 1000);
        });
    },

    /**
     * 로그아웃
     * 로컬 스토리지 정리만 수행
     */
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        console.log('✅ OAuth2 로그아웃 완료');
    }
};

// 🍪 쿠키에서 특정 값 가져오기
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

/**
 * OAuth2 콜백 처리 함수
 * 백엔드에서 리다이렉트된 후 토큰을 추출하여 저장
 * URL 파라미터 또는 쿠키에서 토큰을 찾습니다
 */
export const handleOAuth2Callback = () => {
    try {
        console.log('🔧 OAuth2 콜백 처리 시작 - authorization_request_not_found 진단');
        
        // 📋 현재 상황 체크
        console.log('📋 콜백 페이지 도달 상황:');
        console.log(`  현재 URL: ${window.location.href}`);
        console.log(`  Referrer: ${document.referrer}`);
        console.log(`  타임스탬프: ${new Date().toISOString()}`);
        
        // 1️⃣ URL 파라미터에서 토큰 추출
        const urlParams = new URLSearchParams(window.location.search);
        let accessToken = urlParams.get('accessToken');
        let refreshToken = urlParams.get('refreshToken');
        const error = urlParams.get('error');
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        console.log('🔍 URL 파라미터 상세 분석:');
        console.log(`  accessToken: ${accessToken ? '존재 (' + accessToken.substring(0, 10) + '...)' : '없음'}`);
        console.log(`  refreshToken: ${refreshToken ? '존재' : '없음'}`);
        console.log(`  error: ${error || '없음'}`);
        console.log(`  code: ${code ? '존재 (' + code.substring(0, 10) + '...)' : '❌ 없음 - 카카오 인증 실패'}`);
        console.log(`  state: ${state || '없음'}`);
        
        // ⚠️ authorization_request_not_found 특별 진단
        if (!code && !accessToken && !error) {
            console.log('🚨 OAuth2 콜백 페이지에 도달했지만 파라미터가 없음!');
            console.log('🚨 이는 다음 중 하나의 문제일 가능성:');
            console.log('   1. React Router가 OAuth2 요청을 가로챘음');
            console.log('   2. 세션 쿠키가 없어서 Spring Security가 요청을 거부함');
            console.log('   3. 카카오 → Spring Security 리다이렉트 체인이 끊어짐');
            console.log('   4. SameSite/Secure 쿠키 정책 문제');
        }

        // 2️⃣ URL 파라미터에 없으면 쿠키에서 확인
        if (!accessToken) {
            accessToken = getCookie('authToken') || getCookie('accessToken') || getCookie('JWT');
            console.log('🍪 쿠키에서 토큰 확인:', accessToken ? '발견' : '없음');
        }
        
        if (!refreshToken) {
            refreshToken = getCookie('refreshToken');
            console.log('🍪 쿠키에서 리프레시 토큰 확인:', refreshToken ? '발견' : '없음');
        }

        // 3️⃣ 백엔드가 쿠키로만 관리하는 경우 체크
        if (!accessToken && !refreshToken) {
            console.log('📋 전체 쿠키 상태 확인:', document.cookie);
            // 만약 JSESSIONID나 다른 세션 쿠키가 있다면
            const sessionId = getCookie('JSESSIONID');
            if (sessionId) {
                console.log('🎯 세션 기반 인증 감지:', sessionId);
                // 세션 기반인 경우 사용자 정보만 저장
                localStorage.setItem('user', JSON.stringify({
                    type: 'kakao',
                    loginTime: new Date().toISOString(),
                    isOAuth2: true,
                    isSessionBased: true
                }));
                
                // 메인 페이지로 이동
                console.log('✅ 세션 기반 로그인 완료');
                window.location.href = '/first-main';
                return;
            }
        }

        if (error) {
            console.error('❌ OAuth2 콜백 에러:', error);
            throw new Error(error);
        }

        if (accessToken) {
            console.log('✅ OAuth2 토큰 수신 성공');
            
            // JWT 토큰 저장
            localStorage.setItem('authToken', accessToken);
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
            localStorage.setItem('user', JSON.stringify({
                type: 'kakao',
                loginTime: new Date().toISOString(),
                isOAuth2: true
            }));

            // 부모 창이 있으면 (팝업 모드) 메시지 전송
            if (window.opener) {
                window.opener.postMessage({
                    type: 'OAUTH2_LOGIN_SUCCESS',
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }, window.location.origin);
                window.close();
                return;
            }

            // 일반 모드에서는 first-main 페이지로 이동
            window.location.href = '/first-main';
            
        } else {
            throw new Error('토큰을 받지 못했습니다');
        }

    } catch (error) {
        console.error('❌ OAuth2 콜백 처리 실패:', error);
        
        // 부모 창이 있으면 에러 메시지 전송
        if (window.opener) {
            window.opener.postMessage({
                type: 'OAUTH2_LOGIN_ERROR',
                error: error.message
            }, window.location.origin);
            window.close();
            return;
        }

        // 일반 모드에서는 홈페이지로 이동
        alert('로그인에 실패했습니다: ' + error.message);
        window.location.href = '/';
    }
}
