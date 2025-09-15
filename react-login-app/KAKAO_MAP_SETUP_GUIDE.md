# 카카오지도 API 설정 가이드

카카오지도를 사용하기 위해서는 카카오 개발자 콘솔에서 지도 API를 활성화하고 API 키를 설정해야 합니다.

## 1단계: 카카오 개발자 콘솔에서 지도 API 활성화

### 1.1 카카오 개발자 콘솔 접속
- [카카오 개발자 콘솔](https://developers.kakao.com/console/app)에 접속
- 기존 앱이 있다면 해당 앱 선택, 없다면 새 앱 생성

### 1.2 지도 API 활성화
1. **"제품 설정" > "카카오맵"** 메뉴로 이동
2. **"Web 플랫폼"** 탭에서 **"활성화 설정"** 토글을 ON으로 설정
3. **"저장"** 클릭

## 2단계: API 키 확인

### 2.1 JavaScript 키 복사
1. **"앱 설정" > "요약 정보"** 메뉴로 이동
2. **"앱 키"** 섹션에서 **"JavaScript 키"** 복사

## 3단계: 프로젝트에 API 키 설정

### 3.1 HTML 파일 수정
`public/index.html` 파일에서 API 키를 실제 키로 변경:

```html
<!-- 기존 -->
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_MAP_API_KEY"></script>

<!-- 수정 후 -->
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=실제_복사한_JavaScript_키"></script>
```

### 3.2 예시
```html
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"></script>
```

## 4단계: 테스트

### 4.1 개발 서버 실행
```bash
npm start
```

### 4.2 지도 확인
1. 브라우저에서 `http://localhost:3000` 접속
2. 코스 추천 페이지로 이동
3. 지도가 정상적으로 표시되는지 확인
4. 마커 클릭 시 인포윈도우가 나타나는지 확인

## 주의사항

### 보안
- **JavaScript 키는 클라이언트에서 노출되므로** 도메인 제한이 중요합니다
- 실제 서비스에서는 **HTTPS**를 사용하는 것을 권장합니다

### 도메인 설정
- 개발환경: `http://localhost:3000`
- 배포환경: 실제 도메인 주소
- 도메인이 일치하지 않으면 지도가 작동하지 않습니다

### 문제 해결
- 지도가 표시되지 않는 경우:
  1. 브라우저 개발자 도구의 콘솔 확인
  2. API 키가 올바르게 설정되었는지 확인
  3. 도메인이 등록되었는지 확인
  4. 네트워크 탭에서 API 호출이 성공했는지 확인

## 추가 설정 (선택사항)

### 지도 스타일 커스터마이징
```javascript
// 지도 스타일 변경 예시
const mapStyle = new window.kakao.maps.Styles([
  {
    featureType: 'all',
    elementType: 'all',
    stylers: [
      { color: '#2C8C7D' },
      { saturation: -50 }
    ]
  }
]);

mapInstance.current.setStyles(mapStyle);
```

### 마커 이미지 커스터마이징
```javascript
// 커스텀 마커 이미지 설정
const imageSrc = '/images/custom-marker.png';
const imageSize = new window.kakao.maps.Size(24, 35);
const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize);

const marker = new window.kakao.maps.Marker({
  position: new window.kakao.maps.LatLng(lat, lng),
  image: markerImage
});
```

---

더 자세한 내용은 [카카오맵 API 문서](https://apis.map.kakao.com/web/guide/)를 참고하세요.

