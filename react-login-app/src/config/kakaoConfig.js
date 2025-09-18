/**
 * 카카오 API 설정
 * 환경변수와 기본값을 통합 관리
 */

// 환경변수에서 API 키 가져오기 (없으면 기본값 사용)
const KAKAO_MAP_API_KEY = process.env.REACT_APP_KAKAO_MAP_API_KEY || 'ad66696f1e438be81ff958f80c7ced41';

// 개발 환경에서 설정 확인
if (process.env.NODE_ENV === 'development') {
  if (process.env.REACT_APP_KAKAO_MAP_API_KEY) {
    console.log('✅ 환경변수에서 카카오맵 API 키를 사용합니다.');
  } else {
    console.log('⚠️ 기본값 카카오맵 API 키를 사용합니다. 프로덕션에서는 환경변수를 설정하세요.');
  }
}

export const KAKAO_CONFIG = {
  // 카카오맵 API 키
  MAP_API_KEY: KAKAO_MAP_API_KEY,
  
  // 카카오맵 SDK URL
  MAP_SDK_URL: `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}`,
  
  // 카카오맵 SDK URL (autoload=false)
  MAP_SDK_URL_AUTOLOAD_FALSE: `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_API_KEY}&autoload=false`,
};

// 개발 환경에서 설정 확인
if (process.env.NODE_ENV === 'development') {
  console.log('🗺️ 카카오맵 API 키:', KAKAO_MAP_API_KEY);
  console.log('🔗 카카오맵 SDK URL:', KAKAO_CONFIG.MAP_SDK_URL);
}
