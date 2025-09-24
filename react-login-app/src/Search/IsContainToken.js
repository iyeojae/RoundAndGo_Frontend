import { getAuthToken, isLoggedIn, getCookie } from '../utils/cookieUtils';

export const checkAuth = () => {
    // 후보 키들
    const tokenKeys = [
        'kakaoAccessToken',
        'emailAccessToken',
        'accessToken',
        'authToken'
    ];

    // 유효한 토큰 찾기
    let accessToken = null;
    // 쿠키에서 토큰 확인
    accessToken = getAuthToken();
    const isLoggedInStatus = isLoggedIn();

    console.log('🔍 토큰 확인:', { accessToken, hasAccessToken: !!accessToken, isLoggedIn: isLoggedInStatus });
    console.log('IsContainToken : ', accessToken);

    // 사용자 정보 가져오기 (쿠키에서)
    const rawUser = getCookie('user') || getCookie('userInfo');
    let userInfo = null;
    try {
        userInfo = rawUser ? JSON.parse(rawUser) : null;
    } catch (error) {
        console.error('❌ 사용자 정보 파싱 에러:', error);
    }

    // 닉네임 또는 이메일 추출
    const nickname = userInfo?.userInfo?.nickname || userInfo?.userInfo?.userId || null;
    const email = userInfo?.userInfo?.email || null;

    return {
        isAuthenticated: !!accessToken || isLoggedInStatus,
        accessToken,
        isLoggedIn: isLoggedInStatus,
        nickname,
        email,
    };
};
