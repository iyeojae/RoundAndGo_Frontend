# 날씨 API 설정 가이드

## OpenWeatherMap API 설정

### 1. API 키 발급
1. [OpenWeatherMap](https://openweathermap.org/) 웹사이트에 가입
2. 로그인 후 "API keys" 섹션으로 이동
3. 무료 API 키 생성 (하루 1000회 호출 가능)

### 2. 환경변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가:

```env
REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
```

### 3. 코드 수정
`SchedulePage.js` 파일에서 API 키 부분을 수정:

```javascript
// 이 부분을:
const API_KEY = 'YOUR_API_KEY_HERE';

// 이렇게 변경:
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
```

### 4. 지원하는 지역
현재 지원하는 제주도 지역들:
- 제주시 아라동
- 제주시 애월읍
- 제주시 노형동
- 서귀포시 중문동
- 서귀포시 안덕면

### 5. API 기능
- 현재 날씨 정보 (온도, 습도, 풍속 등)
- 5일 예보 (3시간 간격)
- 한국어 날씨 설명
- 섭씨 온도 단위

### 6. 주의사항
- 무료 API는 분당 60회 호출 제한
- API 키는 클라이언트에 노출되므로 프로덕션에서는 서버 사이드에서 처리 권장
- HTTPS 환경에서만 작동 (로컬 개발 환경 제외)

### 7. 대안 API
- WeatherAPI.com
- AccuWeather API
- Tomorrow.io
- 기상청 공공데이터 API (한국 전용) 