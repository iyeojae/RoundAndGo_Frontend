import { WEATHER_CONFIG, isApiKeyValid } from '../../config/weather';

// 도시명을 좌표로 변환하는 함수 (제주도 내 지역 중심)
const getCityCoordinates = (cityName) => {
  const cityMap = {
    // 제주시 지역들
    '제주시': { lat: 33.4996, lon: 126.5312 },
    '제주시 아라동': { lat: 33.4800, lon: 126.5500 },
    '제주시 연동': { lat: 33.4900, lon: 126.5200 },
    '제주시 노형동': { lat: 33.4800, lon: 126.4800 },
    '제주시 이도동': { lat: 33.5100, lon: 126.5300 },
    '제주시 삼도동': { lat: 33.5000, lon: 126.5200 },
    '제주시 용담동': { lat: 33.5200, lon: 126.5100 },
    '제주시 건입동': { lat: 33.5100, lon: 126.5400 },
    
    // 서귀포시 지역들
    '서귀포시': { lat: 33.2541, lon: 126.5600 },
    '서귀포시 중문동': { lat: 33.2400, lon: 126.4200 },
    '서귀포시 대정읍': { lat: 33.2200, lon: 126.2500 },
    '서귀포시 남원읍': { lat: 33.2800, lon: 126.7000 },
    '서귀포시 성산읍': { lat: 33.3800, lon: 126.8800 },
    '서귀포시 표선면': { lat: 33.3200, lon: 126.8300 },
    '서귀포시 안덕면': { lat: 33.2500, lon: 126.3000 },
    '서귀포시 대천동': { lat: 33.2600, lon: 126.5700 },
    '서귀포시 동홍동': { lat: 33.2500, lon: 126.5700 },
    
    // 기타 주요 도시 (백업용)
    '서울': { lat: 37.5665, lon: 126.9780 },
    '부산': { lat: 35.1796, lon: 129.0756 },
    '대구': { lat: 35.8714, lon: 128.6014 },
    '인천': { lat: 37.4563, lon: 126.7052 },
    '광주': { lat: 35.1595, lon: 126.8526 },
    '대전': { lat: 36.3504, lon: 127.3845 },
    '울산': { lat: 35.5384, lon: 129.3114 },
    '세종': { lat: 36.4800, lon: 127.2890 },
    '춘천': { lat: 37.8813, lon: 127.7298 },
    '강릉': { lat: 37.7519, lon: 128.8761 },
    '청주': { lat: 36.6424, lon: 127.4890 },
    '전주': { lat: 35.8242, lon: 127.1480 },
    '포항': { lat: 36.0190, lon: 129.3435 },
    '창원': { lat: 35.2281, lon: 128.6811 },
  };
  return cityMap[cityName] || { lat: 33.4996, lon: 126.5312 }; // 기본값: 제주시
};

// 현재 날씨 조회
export const getCurrentWeather = async (cityName) => {
  if (!isApiKeyValid()) {
    throw new Error('API 키가 설정되지 않았습니다.');
  }

  const coords = getCityCoordinates(cityName);
  const url = `${WEATHER_CONFIG.BASE_URL}/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${WEATHER_CONFIG.API_KEY}&units=${WEATHER_CONFIG.UNITS}&lang=${WEATHER_CONFIG.LANG}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`날씨 API 오류: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      data: {
        main: data.main,
        weather: data.weather,
        wind: data.wind,
        rain: data.rain,
        clouds: data.clouds,
        visibility: data.visibility,
        name: data.name,
        country: data.sys.country,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('날씨 API 호출 오류:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 5일간 날씨 예보 조회
export const getWeatherForecast = async (cityName) => {
  if (!isApiKeyValid()) {
    throw new Error('API 키가 설정되지 않았습니다.');
  }

  const coords = getCityCoordinates(cityName);
  const url = `${WEATHER_CONFIG.BASE_URL}/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${WEATHER_CONFIG.API_KEY}&units=${WEATHER_CONFIG.UNITS}&lang=${WEATHER_CONFIG.LANG}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`날씨 예보 API 오류: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // 5일간의 일별 데이터로 그룹화
    const dailyForecast = {};
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyForecast[date]) {
        dailyForecast[date] = {
          date: date,
          temps: [],
          weather: item.weather[0],
          humidity: item.main.humidity,
          wind: item.wind.speed
        };
      }
      dailyForecast[date].temps.push(item.main.temp);
    });

    // 각 날짜별 최고/최저 온도 계산
    const forecastData = Object.values(dailyForecast).map(day => ({
      date: day.date,
      weather: day.weather,
      temp_max: Math.max(...day.temps),
      temp_min: Math.min(...day.temps),
      humidity: day.humidity,
      wind: day.wind
    }));

    return {
      success: true,
      data: forecastData.slice(0, 5) // 5일만 반환
    };
  } catch (error) {
    console.error('날씨 예보 API 호출 오류:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 날씨 데이터 캐싱 (5분간 유효)
const weatherCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5분

export const getCachedWeather = async (cityName, type = 'current') => {
  const cacheKey = `${cityName}_${type}`;
  const cached = weatherCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const result = type === 'forecast' 
    ? await getWeatherForecast(cityName)
    : await getCurrentWeather(cityName);

  if (result.success) {
    weatherCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
  }

  return result;
};
