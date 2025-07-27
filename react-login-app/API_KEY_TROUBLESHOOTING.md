# API 키 문제 해결 가이드

## 현재 상황
- API 키 `3e4972652ad8b596a707ef44ebb741bf`가 유효하지 않음
- 오류 메시지: "Invalid API key"

## 해결 방법

### 1. API 키 활성화 대기
- OpenWeatherMap에서 새로 생성된 API 키는 활성화까지 **2-4시간** 소요
- 이 시간 동안은 더미 데이터가 표시됩니다

### 2. API 키 확인
1. [OpenWeatherMap API Keys](https://home.openweathermap.org/api_keys) 페이지 방문
2. 로그인 후 API 키 목록 확인
3. 키가 "Active" 상태인지 확인

### 3. 새로운 API 키 생성
1. [OpenWeatherMap](https://openweathermap.org/) 가입
2. "API keys" 섹션에서 새 키 생성
3. 생성 후 2-4시간 대기

### 4. 현재 상태
- ✅ UI는 정상 작동
- ✅ 더미 데이터로 날씨 정보 표시
- ✅ 지역 변경 기능 작동
- ⏳ 실제 API 데이터는 키 활성화 후 사용 가능

### 5. 더미 데이터 정보
현재 표시되는 더미 데이터:
- 현재 온도: 22°C
- 최고/최저: 25°C / 18°C
- 습도: 65%
- 풍속: 3.2m/s
- 날씨: 맑음

### 6. API 키 활성화 확인 방법
브라우저에서 직접 테스트:
```
https://api.openweathermap.org/data/2.5/weather?lat=33.4996&lon=126.5312&appid=YOUR_API_KEY&units=metric&lang=kr
```

성공하면 JSON 데이터가 반환됩니다.

### 7. 대안 API
- WeatherAPI.com (무료 1000회/월)
- AccuWeather API
- 기상청 공공데이터 API (한국 전용) 