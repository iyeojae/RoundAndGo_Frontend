import { getUserInfo } from '../Auth/authUtils.js';

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
    for (let key of tokenKeys) {
        const raw = localStorage.getItem(key);
        if (raw && raw !== 'undefined' && raw !== 'null') {
            accessToken = raw;
            break;
        }
    }

    // 토큰이 유효하면 공통 키들로 동기화
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('emailAccessToken', accessToken);
        // 가능하면 kakaoAccessToken도 동기화?
    }

    // 로그인 상태 플래그 (키 이름을 로그인 로직과 맞추기)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
        || localStorage.getItem('emailIsLoggedIn') === 'true';

    console.log('🔍 토큰 확인:', { accessToken, hasAccessToken: !!accessToken, isLoggedIn });
    console.log('IsContainToken : ', accessToken);

    // 사용자 정보 가져오기
    const rawUser = localStorage.getItem('emailUser') || localStorage.getItem('user');
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
        isAuthenticated: !!accessToken || isLoggedIn,
        accessToken,
        isLoggedIn,
        nickname,
        email,
    };
};
