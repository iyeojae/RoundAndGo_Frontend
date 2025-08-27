# 백엔드 카카오 로그인 API 구현 가이드

카카오 로그인이 백엔드 API 방식으로 변경되었습니다. 백엔드 서버(`https://roundandgo.onrender.com`)에 다음 API 엔드포인트들을 구현해야 합니다.

## 필요한 백엔드 API 엔드포인트

### 1. 카카오 로그인 URL 생성
```
GET /api/auth/kakao/login-url
```

**응답 예시:**
```json
{
  "loginUrl": "https://kauth.kakao.com/oauth/authorize?client_id=YOUR_APP_KEY&redirect_uri=https://yourdomain.com/auth/kakao/callback&response_type=code&scope=profile_nickname,profile_image"
}
```

### 2. 카카오 로그인 콜백 처리
```
POST /api/auth/kakao/callback
```

**요청 본문:**
```json
{
  "code": "카카오에서_받은_인가코드"
}
```

**응답 예시:**
```json
{
  "accessToken": "JWT_ACCESS_TOKEN",
  "refreshToken": "JWT_REFRESH_TOKEN",
  "user": {
    "id": "user_id",
    "nickname": "사용자닉네임",
    "profileImage": "https://profile-image-url",
    "email": "user@example.com",
    "provider": "kakao"
  }
}
```

### 3. 사용자 정보 조회
```
GET /api/auth/me
Authorization: Bearer JWT_ACCESS_TOKEN
```

**응답 예시:**
```json
{
  "user": {
    "id": "user_id",
    "nickname": "사용자닉네임",
    "profileImage": "https://profile-image-url",
    "email": "user@example.com",
    "provider": "kakao"
  }
}
```

### 4. 로그아웃
```
POST /api/auth/logout
Authorization: Bearer JWT_ACCESS_TOKEN
```

**응답 예시:**
```json
{
  "message": "로그아웃 성공"
}
```

### 5. 토큰 갱신
```
POST /api/auth/refresh
```

**요청 본문:**
```json
{
  "refreshToken": "JWT_REFRESH_TOKEN"
}
```

**응답 예시:**
```json
{
  "accessToken": "NEW_JWT_ACCESS_TOKEN",
  "refreshToken": "NEW_JWT_REFRESH_TOKEN" // 선택사항
}
```

## 백엔드 구현 시 고려사항

### 1. 카카오 API 키 관리
- 카카오 JavaScript 키와 REST API 키를 환경변수로 관리
- 클라이언트에는 API 키를 노출하지 않음

### 2. 카카오 OAuth2 플로우
1. 프론트엔드에서 `/api/auth/kakao/login-url` 호출
2. 백엔드에서 카카오 인증 URL 생성하여 반환
3. 프론트엔드에서 팝업으로 카카오 로그인 페이지 오픈
4. 사용자 로그인 후 `/auth/kakao/callback`으로 리다이렉트
5. 콜백 페이지에서 인가 코드를 추출하여 부모 창에 전송
6. 프론트엔드에서 인가 코드로 `/api/auth/kakao/callback` 호출
7. 백엔드에서 카카오 토큰 교환 및 사용자 정보 조회
8. JWT 토큰 생성하여 프론트엔드에 반환

### 3. JWT 토큰 관리
- 액세스 토큰: 짧은 만료시간 (예: 1시간)
- 리프레시 토큰: 긴 만료시간 (예: 7일)
- 토큰에 사용자 ID, 역할 등 필요한 정보 포함

### 4. 보안 고려사항
- CORS 설정 확인
- HTTPS 사용
- 토큰 검증 미들웨어 구현
- Rate limiting 적용

## 환경 변수 설정

백엔드 서버에 다음 환경변수들을 설정해야 합니다:

```env
# 카카오 API 설정
KAKAO_CLIENT_ID=카카오_REST_API_키
KAKAO_CLIENT_SECRET=카카오_보안키_또는_시크릿키
KAKAO_REDIRECT_URI=https://yourdomain.com/auth/kakao/callback

# JWT 설정
JWT_SECRET=JWT_서명용_비밀키
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# 데이터베이스 설정
DATABASE_URL=데이터베이스_연결_URL
```

## 데이터베이스 스키마 예시

```sql
-- 사용자 테이블
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  nickname VARCHAR(255),
  profile_image VARCHAR(500),
  provider VARCHAR(50), -- 'kakao', 'email' 등
  provider_id VARCHAR(255), -- 카카오 사용자 ID
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 리프레시 토큰 테이블
CREATE TABLE refresh_tokens (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  token VARCHAR(500),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 프론트엔드 변경사항

### 변경된 파일들:
- `src/kakaoApiConfig.js` (새로 생성)
- `src/HomePage.jsx` (수정)
- `src/authUtils.js` (수정)
- `src/Layout/Header.jsx` (수정)
- `src/KakaoCallback.jsx` (새로 생성)
- `src/App.js` (라우팅 추가)
- `public/index.html` (카카오 SDK 스크립트 제거)

### 주요 변경점:
1. 카카오 JavaScript SDK 제거
2. 백엔드 API 호출 방식으로 변경
3. JWT 토큰 기반 인증으로 변경
4. 팝업 기반 로그인 플로우 구현
5. 자동 토큰 갱신 기능 추가

이제 카카오 API 키가 백엔드에서만 관리되어 보안이 강화되었고, 다른 API들과 일관된 방식으로 통합되었습니다.
