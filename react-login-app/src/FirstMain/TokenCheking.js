import { useKakaoLoginDetector } from '../Login/Auth';
import { useEffect } from 'react';

import { getCookie } from '../Login/utils/cookieUtils';

export const TokenDebugging = () => {
    // 🎯 백그라운드에서 카카오 로그인 성공 자동 감지 (UI 영향 없음)
    useKakaoLoginDetector();

    // 🍪 쿠키 디버깅 추가
    useEffect(() => {
        const debugCookiesAndTokens = () => {
            // 쿠키 파싱
            const parseCookies = () => {
                const cookieObj = {};
                document.cookie.split(';').forEach(cookie => {
                    const [name, value] = cookie.trim().split('=');
                    if (name && value) {
                        cookieObj[name] = decodeURIComponent(value);
                    }
                });
                return cookieObj;
            };

            // URL 파라미터 파싱
            const parseUrlParams = () => {
                const params = new URLSearchParams(window.location.search);
                const paramObj = {};
                for (let [key, value] of params.entries()) {
                    paramObj[key] = value;
                }
                return paramObj;
            };

            const currentCookies = parseCookies();
            const currentParams = parseUrlParams();

            // 토큰 분석 시작

            // 🎯 우선순위 1: localStorage에서 이메일 로그인 토큰 확인 (가장 먼저!)
            const emailAccessToken = localStorage.getItem('emailAccessToken');
            if (emailAccessToken && emailAccessToken !== 'undefined') {
                // localStorage에서 이메일 로그인 토큰 발견

                // // 이메일 로그인 토큰을 카카오 로그인용 키로도 저장 (useKakaoLoginDetector에서 사용)
                // localStorage.setItem('accessToken', emailAccessToken);
                // const emailRefreshToken = localStorage.getItem('emailRefreshToken');
                // if (emailRefreshToken && emailRefreshToken !== 'undefined') {
                //     localStorage.setItem('refreshToken', emailRefreshToken);
                // }

                // 이메일 로그인 토큰을 카카오 로그인용 키로 복사 완료

                // 로그인 성공 처리 완료

            }
            // 🎯 우선순위 2: 백엔드에서 설정한 쿠키 확인 (카카오 로그인용)
            else if (currentCookies.accessToken) {
                // accessToken 쿠키 발견

                // localStorage로 이동
                localStorage.setItem('accessToken', currentCookies.accessToken);
                if (currentCookies.refreshToken) {
                    localStorage.setItem('refreshToken', currentCookies.refreshToken);
                }
                localStorage.setItem('user', JSON.stringify({
                    type: 'kakao',
                    loginTime: new Date().toISOString(),
                    isOAuth2: true,
                    source: 'cookie-from-backend',
                    domain: window.location.hostname
                }));

                // 쿠키에서 localStorage로 토큰 이동 완료

                // 쿠키에서 토큰을 가져왔으므로 성공 처리 완료

            }
            // 🎯 우선순위 3: URL 파라미터에서 토큰 찾기 (카카오 로그인용)
            else if (currentParams.token || currentParams.accessToken) {
                // URL 파라미터에서 토큰 발견
                const accessToken = currentParams.accessToken || currentParams.token;
                const refreshToken = currentParams.refreshToken;

                // 토큰을 localStorage에 안전하게 저장
                localStorage.setItem('accessToken', accessToken);
                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }
                localStorage.setItem('user', JSON.stringify({
                    type: 'kakao',
                    loginTime: new Date().toISOString(),
                    isOAuth2: true,
                    source: 'url-parameter'
                }));

                // URL 파라미터에서 localStorage로 토큰 저장 완료

                // 🔒 보안 강화: URL에서 토큰 파라미터 제거 후 리다이렉트
                // 깨끗한 URL로 브라우저 히스토리 업데이트 (새로고침 없이)
                const cleanUrl = window.location.origin + window.location.pathname;
                window.history.replaceState(null, '', cleanUrl);

                // URL 정리 완료 - 토큰이 더 이상 URL에 노출되지 않습니다

                // URL 파라미터에서 토큰 저장 완료
            }
            // 🎯 우선순위 4: 아무 토큰도 없는 경우
            else {
                // 모든 소스에서 토큰을 찾을 수 없습니다
            }


            // 쿠키 분석 완료
        };

        debugCookiesAndTokens();
    }, []);
};
