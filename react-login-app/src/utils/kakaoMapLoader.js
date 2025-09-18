// 카카오맵 SDK 동적 로드 유틸리티
import { KAKAO_CONFIG } from '../config/kakaoConfig';

let isKakaoMapLoaded = false;
let isKakaoMapLoading = false;
let loadPromise = null;

// 카카오맵 SDK 로드 함수
export const loadKakaoMapSDK = () => {
  return new Promise((resolve, reject) => {
    // 이미 로드된 경우
    if (isKakaoMapLoaded && window.kakao && window.kakao.maps) {
      resolve(window.kakao);
      return;
    }

    // 이미 로딩 중인 경우
    if (isKakaoMapLoading && loadPromise) {
      loadPromise.then(resolve).catch(reject);
      return;
    }

    // 로딩 시작
    isKakaoMapLoading = true;
    loadPromise = new Promise((innerResolve, innerReject) => {
      // 기존 스크립트가 있는지 확인
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
      if (existingScript) {
        existingScript.remove();
      }

      // 새로운 스크립트 생성 (autoload=false 옵션 추가)
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = KAKAO_CONFIG.MAP_SDK_URL_AUTOLOAD_FALSE;
      script.async = true;
      script.defer = true;

      // 로드 성공 시
      script.onload = () => {
        // kakao.maps.load() 콜백에서 초기화
        window.kakao.maps.load(() => {
          isKakaoMapLoaded = true;
          isKakaoMapLoading = false;
          console.log('카카오맵 SDK 로드 완료');
          innerResolve(window.kakao);
        });
      };

      // 로드 실패 시
      script.onerror = (error) => {
        isKakaoMapLoading = false;
        console.error('카카오맵 SDK 로드 실패:', error);
        innerReject(error);
      };

      // 스크립트를 head에 추가
      document.head.appendChild(script);
    });

    loadPromise.then(resolve).catch(reject);
  });
};

// 카카오맵 로드 상태 확인
export const isKakaoMapReady = () => {
  return isKakaoMapLoaded && window.kakao && window.kakao.maps;
};

// 카카오맵 API 상태 확인
export const checkKakaoMapAPI = () => {
  const status = {
    window_kakao: !!window.kakao,
    window_kakao_maps: !!(window.kakao && window.kakao.maps),
    LatLng: !!(window.kakao && window.kakao.maps && window.kakao.maps.LatLng),
    Map: !!(window.kakao && window.kakao.maps && window.kakao.maps.Map)
  };
  
  console.log('카카오맵 API 상태 확인:', status);
  return status;
};
