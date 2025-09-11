// OpenWeatherMap API 설정
export const WEATHER_CONFIG = {
  API_KEY: process.env.REACT_APP_OPENWEATHER_API_KEY || '3e4972652ad8b596a707ef44ebb741bf',
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  UNITS: 'metric',
  LANG: 'kr',
};

// API 키 유효성 검사
export const isApiKeyValid = () => {
  const key = WEATHER_CONFIG.API_KEY;
  return key && key !== 'your_api_key_here' && key !== 'demo_key';
};

// API 키 설정 안내 메시지
export const getApiKeyMessage = () => {
  if (!isApiKeyValid()) {
    return {
      title: 'OpenWeatherMap API 키 설정 필요',
      message: '실제 날씨 데이터를 보려면 API 키를 설정해야 합니다.',
      steps: [
        '1. OpenWeatherMap (https://openweathermap.org/api) 에 가입하고 API 키를 발급받으세요.',
        '2. 프로젝트 루트에 .env 파일을 생성하고 REACT_APP_OPENWEATHER_API_KEY=YOUR_API_KEY 를 추가하세요.',
        '3. 또는 src/config/weather.js 파일에서 API_KEY 값을 직접 교체하세요.',
        '4. API 키 활성화까지 2-4시간이 소요될 수 있습니다.'
      ]
    };
  }
  return null;
};