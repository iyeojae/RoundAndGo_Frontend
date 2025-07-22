# OpenWeatherMap API 설정 완료 가이드

## 🚀 현재 상태
- ✅ UI 완전 구현
- ✅ 지역별 맞춤 더미 데이터
- ✅ 실제 API 연동 준비 완료
- ⏳ API 키만 설정하면 실제 데이터 사용 가능

## 📋 API 키 설정 방법

### 1. OpenWeatherMap 가입
1. [OpenWeatherMap](https://openweathermap.org/) 방문
2. "Sign Up" 클릭하여 무료 계정 생성
3. 이메일 인증 완료

### 2. API 키 발급
1. 로그인 후 [API Keys](https://home.openweathermap.org/api_keys) 페이지 방문
2. "Generate" 버튼 클릭
3. 새 API 키 생성 (기본 이름: "My API key")

### 3. 코드에 API 키 적용
`SchedulePage.js` 파일에서 다음 부분을 수정:

```javascript
// 현재:
const API_KEY = '1b0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c';

// 수정:
const API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
```

### 4. API 키 활성화 대기
- 새로 생성된 API 키는 **2-4시간** 후 활성화
- 활성화 전까지는 더미 데이터 사용

## 🌤️ 현재 구현된 기능

### 지역별 더미 데이터
- **제주시 아라동**: 맑음, 24°C
- **제주시 애월읍**: 구름 조금, 22°C  
- **제주시 노형동**: 흐림, 21°C
- **서귀포시 중문동**: 비, 19°C
- **서귀포시 안덕면**: 맑음, 23°C

### 표시되는 정보
- 현재 온도 및 최고/최저 온도
- 날씨 상태 (맑음, 구름, 비 등)
- 습도, 풍속, 기압
- 체감온도, 가시거리
- 6시간 시간별 예보

## 🔧 API 테스트 방법

### 브라우저에서 직접 테스트
```
https://api.openweathermap.org/data/2.5/weather?lat=33.4996&lon=126.5312&appid=YOUR_API_KEY&units=metric&lang=kr
```

### 성공 응답 예시
```json
{
  "weather": [{"id": 800, "main": "Clear", "description": "맑음", "icon": "01d"}],
  "main": {
    "temp": 24.5,
    "feels_like": 25.2,
    "temp_min": 20.1,
    "temp_max": 27.8,
    "pressure": 1012,
    "humidity": 68
  },
  "wind": {"speed": 4.1},
  "visibility": 10000
}
```

## 🎯 사용 방법

### 1. 앱 실행
```bash
cd react-login-app
npm start
```

### 2. 날씨 확인
1. "날씨보기" 버튼 클릭
2. 현재 지역의 날씨 정보 확인
3. ⚙️ 버튼으로 지역 변경

### 3. API 키 활성화 확인
- 콘솔에서 "실제 API 데이터 성공" 메시지 확인
- 더미 데이터 대신 실제 날씨 정보 표시

## 🔄 API 키 교체 시

### 환경변수 사용 (권장)
1. 프로젝트 루트에 `.env` 파일 생성
2. 내용 추가: `REACT_APP_OPENWEATHER_API_KEY=your_api_key`
3. 코드 수정:
```javascript
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || 'fallback_key';
```

### 직접 교체
`SchedulePage.js`에서 `API_KEY` 값만 변경

## 📊 API 사용량
- **무료 계정**: 하루 1,000회 호출
- **분당 제한**: 60회
- **지원 기능**: 현재 날씨, 5일 예보

## 🆘 문제 해결

### API 키 오류
- 키가 활성화될 때까지 대기 (2-4시간)
- 키가 올바른지 확인
- 계정 상태 확인

### CORS 오류
- OpenWeatherMap은 CORS 지원
- 로컬 개발 환경에서 문제 없음

### 네트워크 오류
- 인터넷 연결 확인
- 방화벽 설정 확인

## 🎉 완료!
API 키만 설정하면 완전히 작동하는 날씨 앱이 완성됩니다! 