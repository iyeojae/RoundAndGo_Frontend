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

// 🌐 백엔드 서버 URL 설정 - 도메인 통일
// 모든 환경에서 현재 도메인 사용하여 쿠키 공유 가능하게 함
// Netlify가 /oauth2/* 요청을 백엔드로 프록시 처리
const BACKEND_BASE_URL = ''; // 항상 현재 도메인 사용 (도메인 통일)

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
        
        // 🎯 개발/프로덕션 환경별 최적화된 리다이렉트
        console.log('🔄 카카오 로그인 페이지로 이동 시작...');
        
        if (process.env.NODE_ENV === 'development') {
            // 🏠 개발 환경: 프록시를 통한 간단한 이동
            console.log('🛠️ 개발 환경: 프록시를 통한 백엔드 연결');
            window.location.href = kakaoLoginUrl;
        } else {
            // 🌐 프로덕션 환경: React Router 강력 우회
            console.log('🚀 프로덕션 환경: React Router 강력 우회 시작');
            
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

            // 팝업 창이 닫힌 경우 처리
            const checkClosed = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', messageListener);
                    reject(new Error('팝업이 닫혔습니다.'));
                }
            }, 1000);
        });
    },

    /**
     * 카카오 로그아웃 처리
     * 
     * 저장된 모든 인증 정보를 삭제하고 로그아웃 상태로 만듭니다.
     * 에러가 발생하더라도 로컬 토큰은 반드시 제거됩니다.
     */
    logout: () => {
        try {
            // 🚪 로컬스토리지에서 모든 카카오 인증 정보 제거
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            
            // 🍪 쿠키에서도 카카오 인증 정보 제거
            document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            
            console.log('✅ OAuth2 로그아웃 완료');
        } catch (error) {
            console.error('❌ OAuth2 로그아웃 에러:', error);
            // 에러가 발생해도 로컬 토큰은 제거됨
        }
    }
};

/**
 * OAuth2 콜백 처리 함수
 * 
 * 카카오 로그인 성공 후 백엔드에서 리다이렉트된 페이지에서
 * URL 파라미터나 쿠키를 통해 전달된 인증 정보를 처리합니다.
 * 
 * 지원하는 인증 정보 전달 방식:
 * 1. URL 파라미터: ?accessToken=xxx&refreshToken=yyy
 * 2. 쿠키: authToken, JSESSIONID
 * 3. 세션 기반: JSESSIONID
 * 
 * @returns {Promise<Object>} 로그인 성공 시 사용자 정보
 * 
 * @example
 * handleOAuth2Callback().then(userInfo => {
 *   console.log('로그인 성공:', userInfo);
 * }).catch(error => {
 *   console.error('로그인 실패:', error);
 * });
 */
export const handleOAuth2Callback = () => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('🔧 OAuth2 콜백 처리 시작 - authorization_request_not_found 진단');
            
            // 🎯 1단계: URL 파라미터에서 토큰 확인
            const urlParams = new URLSearchParams(window.location.search);
            const accessToken = urlParams.get('accessToken');
            const refreshToken = urlParams.get('refreshToken');
            
            if (accessToken) {
                console.log('✅ URL 파라미터에서 액세스 토큰 발견');
                
                // 로컬스토리지에 토큰 저장
                localStorage.setItem('authToken', accessToken);
                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }
                
                // 사용자 정보 저장
                const userInfo = {
                    type: 'kakao',
                    loginTime: new Date().toISOString(),
                    isOAuth2: true
                };
                
                localStorage.setItem('user', JSON.stringify(userInfo));
                localStorage.setItem('isLoggedIn', 'true');
                
                console.log('✅ OAuth2 콜백 처리 완료 - URL 파라미터 방식');
                resolve(userInfo);
                return;
            }
            
            // 🎯 2단계: 쿠키에서 토큰 확인
            const cookieToken = document.cookie.split(';').find(cookie => 
                cookie.trim().startsWith('authToken=')
            );
            
            if (cookieToken) {
                const token = cookieToken.split('=')[1];
                console.log('✅ 쿠키에서 토큰 발견');
                
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify({
                    type: 'kakao',
                    loginTime: new Date().toISOString(),
                    isOAuth2: true
                }));
                localStorage.setItem('isLoggedIn', 'true');
                
                console.log('✅ OAuth2 콜백 처리 완료 - 쿠키 방식');
                resolve({
                    type: 'kakao',
                    loginTime: new Date().toISOString(),
                    isOAuth2: true
                });
                return;
            }
            
            // 🎯 3단계: 세션 기반 인증 확인
            const sessionId = document.cookie.split(';').find(cookie => 
                cookie.trim().startsWith('JSESSIONID=')
            );
            
            if (sessionId) {
                console.log('✅ 세션 쿠키 발견 - 백엔드 세션 확인 시도');
                
                try {
                    // 백엔드 API로 사용자 정보 요청
                    const response = await fetch('/api/user/me', {
                        credentials: 'include'
                    });
                    
                    if (response.ok) {
                        const userData = await response.json();
                        console.log('✅ 백엔드 세션에서 사용자 정보 확인:', userData);
                        
                        localStorage.setItem('user', JSON.stringify({
                            type: 'kakao',
                            loginTime: new Date().toISOString(),
                            isOAuth2: true,
                            userInfo: userData
                        }));
                        localStorage.setItem('isLoggedIn', 'true');
                        
                        console.log('✅ OAuth2 콜백 처리 완료 - 세션 방식');
                        resolve({
                            type: 'kakao',
                            loginTime: new Date().toISOString(),
                            isOAuth2: true,
                            userInfo: userData
                        });
                        return;
                    }
                } catch (error) {
                    console.log('⚠️ 백엔드 세션 확인 실패:', error);
                }
            }
            
            // 🚨 4단계: 인증 정보를 찾을 수 없는 경우
            console.log('🚨 OAuth2 콜백 페이지에 도달했지만 파라미터가 없음!');
            console.log('🔍 가능한 원인:');
            console.log('   1. React Router가 OAuth2 요청을 가로챘음');
            console.log('   2. 백엔드에서 인증 정보를 제대로 전달하지 않음');
            console.log('   3. 네트워크 오류로 인증 정보 전달 실패');
            
            reject(new Error('OAuth2 콜백에서 인증 정보를 찾을 수 없습니다.'));
            
        } catch (error) {
            console.error('❌ OAuth2 콜백 에러:', error);
            reject(error);
        }
    });
};

