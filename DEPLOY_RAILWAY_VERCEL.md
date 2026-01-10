# Railway + Vercel 배포 가이드

Railway로 백엔드를, Vercel로 프론트엔드를 배포하는 방법입니다.

---

## 📋 사전 준비

1. GitHub에 코드가 푸시되어 있어야 합니다
2. Railway 계정 (https://railway.app)
3. Vercel 계정 (https://vercel.com)

---

## 1단계: Railway로 백엔드 배포

### 1-1. Railway 계정 생성 및 프로젝트 생성

1. **Railway 접속**
   - https://railway.app 접속
   - "Login" 클릭 → GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - 대시보드에서 "New Project" 클릭
   - "Deploy from GitHub repo" 선택
   - GitHub 저장소 선택
   - "Deploy Now" 클릭

### 1-2. 백엔드 서비스 설정

1. **서비스 추가**
   - 프로젝트 내에서 "New" 버튼 클릭
   - "GitHub Repo" 선택
   - 같은 저장소 선택
   - "Add Service" 클릭

2. **서비스 설정**
   - 생성된 서비스 클릭
   - "Settings" 탭으로 이동
   - **Root Directory** 설정:
     - "Root Directory" 섹션에서
     - `backend` 입력
   - **Build Command** (자동 감지되지만 확인):
     - `npm install && npm run build`
   - **Start Command**:
     - `npm start`

### 1-3. 환경 변수 설정

1. **Variables 탭으로 이동**
   - 서비스 페이지에서 "Variables" 탭 클릭

2. **환경 변수 추가**
   - "New Variable" 클릭하여 다음 변수들 추가:

   ```
   PORT = 3001
   NODE_ENV = production
   JWT_SECRET = [랜덤 문자열 생성]
   ```

   **JWT_SECRET 생성 방법**:
   - 터미널에서 실행:
     ```bash
     openssl rand -hex 32
     ```
   - 또는 온라인 랜덤 문자열 생성기 사용
   - 생성된 문자열을 복사하여 `JWT_SECRET` 값으로 입력

3. **변수 저장**
   - 각 변수 입력 후 "Add" 클릭

### 1-4. 배포 확인

1. **배포 상태 확인**
   - "Deployments" 탭에서 배포 진행 상황 확인
   - "Building..." → "Deploying..." → "Active" 상태가 되면 완료

2. **서비스 URL 확인**
   - "Settings" → "Networking" 섹션
   - "Generate Domain" 클릭 (또는 자동 생성됨)
   - 생성된 URL 확인 (예: `https://planner-backend-production.up.railway.app`)

3. **헬스 체크**
   - 브라우저에서 `https://your-backend-url.railway.app/api/health` 접속
   - `{"status":"ok"}` 응답이 오면 성공!

---

## 2단계: Vercel로 프론트엔드 배포

### 2-1. Vercel 계정 생성

1. **Vercel 접속**
   - https://vercel.com 접속
   - "Sign Up" 클릭 → GitHub 계정으로 로그인

### 2-2. 프로젝트 생성

1. **새 프로젝트 추가**
   - 대시보드에서 "Add New..." → "Project" 클릭
   - GitHub 저장소 선택
   - "Import" 클릭

2. **프로젝트 설정**
   - **Framework Preset**: `Vite` 선택 (자동 감지될 수 있음)
   - **Root Directory**: 
     - "Edit" 클릭
     - `frontend` 입력
   - **Build Command**: 
     - `npm run build` (자동 입력됨)
   - **Output Directory**: 
     - `dist` (자동 입력됨)
   - **Install Command**: 
     - `npm install` (자동 입력됨)

### 2-3. 환경 변수 설정

1. **Environment Variables 섹션**
   - 프로젝트 설정 페이지에서 "Environment Variables" 섹션 찾기

2. **API URL 변수 추가**
   - "Add New" 클릭
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.railway.app/api`
     - (1단계에서 받은 Railway 백엔드 URL 사용)
   - **Environment**: `Production`, `Preview`, `Development` 모두 선택
   - "Save" 클릭

   **중요**: URL 끝에 `/api`를 반드시 포함해야 합니다!

### 2-4. 배포

1. **배포 시작**
   - 설정 완료 후 "Deploy" 버튼 클릭
   - 빌드 진행 상황 확인

2. **배포 완료**
   - "Building..." → "Ready" 상태가 되면 완료
   - 제공되는 URL 확인 (예: `https://planner.vercel.app`)

3. **테스트**
   - 브라우저에서 Vercel URL 접속
   - 로그인 페이지가 정상적으로 보이면 성공!

---

## 3단계: CORS 설정 (필요시)

백엔드에서 특정 프론트엔드 도메인만 허용하도록 설정할 수 있습니다.

### 3-1. 백엔드 CORS 설정 수정

`backend/src/index.ts` 파일 수정:

```typescript
import cors from 'cors';

// 개발 환경
if (process.env.NODE_ENV === 'development') {
  app.use(cors());
} else {
  // 프로덕션 환경: Vercel 도메인만 허용
  app.use(cors({
    origin: [
      'https://your-frontend.vercel.app',
      'https://your-frontend-*.vercel.app' // 프리뷰 배포 포함
    ],
    credentials: true
  }));
}
```

수정 후 Railway에 다시 배포:
- Railway에서 "Redeploy" 클릭

---

## 4단계: 최종 확인

### 체크리스트

- [ ] Railway 백엔드가 정상 작동 (`/api/health` 확인)
- [ ] Vercel 프론트엔드가 정상 작동 (로그인 페이지 표시)
- [ ] 프론트엔드에서 백엔드 API 호출 성공 (로그인 테스트)
- [ ] 환경 변수가 올바르게 설정됨

### 테스트 방법

1. **프론트엔드 접속**
   - Vercel URL로 접속
   - 교사 로그인 페이지 확인

2. **회원가입 테스트**
   - 교사 계정 생성
   - 로그인 성공 확인

3. **API 연결 확인**
   - 브라우저 개발자 도구 (F12) → Network 탭
   - 로그인 시 `/api/auth/login` 요청 확인
   - 200 응답이면 성공!

---

## 🔧 문제 해결

### 백엔드 배포 실패

**문제**: Railway에서 빌드 실패
- **해결**: 
  - Root Directory가 `backend`로 설정되었는지 확인
  - `backend/package.json`의 `build` 스크립트 확인
  - 로그에서 에러 메시지 확인

**문제**: 포트 에러
- **해결**: 
  - 환경 변수 `PORT`가 설정되었는지 확인
  - Railway는 자동으로 포트를 할당하므로 `PORT` 변수는 선택사항일 수 있음

### 프론트엔드 배포 실패

**문제**: Vercel 빌드 실패
- **해결**: 
  - Root Directory가 `frontend`로 설정되었는지 확인
  - `frontend/package.json` 확인
  - 빌드 로그에서 에러 확인

**문제**: API 호출 실패 (CORS 에러)
- **해결**: 
  - `VITE_API_URL` 환경 변수가 올바른지 확인
  - URL 끝에 `/api` 포함 확인
  - 백엔드 CORS 설정 확인

**문제**: API 호출 실패 (404 에러)
- **해결**: 
  - `VITE_API_URL`이 Railway 백엔드 URL을 가리키는지 확인
  - 백엔드가 정상 작동하는지 `/api/health`로 확인

### 환경 변수 문제

**문제**: 환경 변수가 적용되지 않음
- **해결**: 
  - Vercel: 환경 변수 추가 후 "Redeploy" 필요
  - Railway: 환경 변수 추가 후 자동 재배포됨

---

## 📝 중요 사항

### Railway 무료 티어
- Railway는 무료 티어를 제공하지만 제한이 있을 수 있습니다
- 사용량에 따라 요금이 발생할 수 있으니 주의

### Vercel 무료 티어
- 무료 티어에서 충분히 사용 가능
- 자동 배포, 프리뷰 배포 지원

### 데이터베이스
- 현재 JSON 파일 기반 데이터베이스 사용
- Railway의 영구 저장소에 데이터 저장됨
- 정기적인 백업 권장

### 환경 변수 보안
- `JWT_SECRET`은 절대 공개하지 마세요
- GitHub에 `.env` 파일을 커밋하지 마세요

---

## 🎉 완료!

이제 Railway와 Vercel에서 각각 배포가 완료되었습니다!

- **백엔드 URL**: `https://your-backend.railway.app`
- **프론트엔드 URL**: `https://your-frontend.vercel.app`

프론트엔드 URL로 접속하여 서비스를 사용할 수 있습니다!

---

## 추가 팁

### 커스텀 도메인 설정

**Vercel**:
- 프로젝트 → Settings → Domains
- 원하는 도메인 추가

**Railway**:
- Settings → Networking
- Custom Domain 추가

### 자동 배포

- GitHub에 푸시하면 자동으로 재배포됩니다
- Railway와 Vercel 모두 자동 배포 지원

### 환경별 설정

- Vercel에서 Production, Preview, Development 환경별로 다른 환경 변수 설정 가능
- Railway에서도 환경별 변수 설정 가능

---

문제가 발생하면 각 플랫폼의 로그를 확인하거나, 위의 문제 해결 섹션을 참고하세요!

