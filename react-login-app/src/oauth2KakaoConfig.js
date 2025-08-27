/**
 * OAuth2 방식 카카오 로그인 설정
 * 
 * Spring Security OAuth2와 연동하는 간단한 방식
 * REST API 호출 없이 직접 백엔드 OAuth2 엔드포인트로 리다이렉트
 */

// 백엔드 서버 URL
const BACKEND_BASE_URL = 'https://roundandgo.onrender.com';

/**
 * OAuth2 카카오 로그인 관련 함수들
 */
export const oauth2KakaoApi = {
    /**
     * 카카오 로그인 시작
     * 백엔드의 Spring Security OAuth2 엔드포인트로 직접 리다이렉트
     */
    startLogin: () => {
        // Spring Security OAuth2 카카오 로그인 엔드포인트로 이동
        const kakaoLoginUrl = `${BACKEND_BASE_URL}/oauth2/authorization/kakao`;
        
        console.log('🚀 OAuth2 카카오 로그인 시작');
        console.log('리다이렉트 URL:', kakaoLoginUrl);
        
        // 현재 창에서 바로 이동
        window.location.href = kakaoLoginUrl;
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

/**
 * OAuth2 콜백 처리 함수
 * 백엔드에서 리다이렉트된 후 토큰을 추출하여 저장
 */
export const handleOAuth2Callback = () => {
    try {
        // URL 파라미터에서 토큰 추출
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');
        const error = urlParams.get('error');

        if (error) {
            console.error('❌ OAuth2 콜백 에러:', error);
            throw new Error(error);
        }

        if (accessToken && refreshToken) {
            console.log('✅ OAuth2 토큰 수신 성공');
            
            // JWT 토큰 저장
            localStorage.setItem('authToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
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

            // 일반 모드에서는 메인 페이지로 이동
            window.location.href = '/main';
            
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
};
