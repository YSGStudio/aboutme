# 배포 가이드

이 프로젝트는 프론트엔드와 백엔드를 분리하여 배포합니다.

## 배포 구조

- **프론트엔드**: Vercel (무료, 자동 배포)
- **백엔드**: Railway 또는 Render (무료 티어 제공)

---

## 1단계: 백엔드 배포 (Railway)

### Railway 배포 방법

1. **Railway 계정 생성**
   - https://railway.app 접속
   - GitHub 계정으로 로그인

2. **프로젝트 생성**
   - "New Project" 클릭
   - "Deploy from GitHub repo" 선택
   - 이 저장소 선택

3. **백엔드 서비스 추가**
   - "New" → "Service" 선택
   - GitHub 저장소 선택
   - Root Directory를 `backend`로 설정

4. **환경 변수 설정**
   - Service → Variables 탭
   - 다음 변수 추가:
     ```
     PORT=3001
     NODE_ENV=production
     JWT_SECRET=your-secret-key-here (랜덤 문자열)
     ```

5. **배포 확인**
   - 배포가 완료되면 "Settings" → "Networking"에서 공개 URL 확인
   - 예: `https://your-backend.railway.app`
   - `/api/health` 엔드포인트로 테스트: `https://your-backend.railway.app/api/health`

---

## 2단계: 프론트엔드 배포 (Vercel)

### Vercel 배포 방법

1. **Vercel 계정 생성**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **프로젝트 생성**
   - "Add New" → "Project" 클릭
   - GitHub 저장소 선택
   - Root Directory를 `frontend`로 설정

3. **빌드 설정**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **환경 변수 설정**
   - Settings → Environment Variables
   - 다음 변수 추가:
     ```
     VITE_API_URL=https://your-backend.railway.app/api
     ```
   - (위에서 Railway에서 받은 백엔드 URL 사용)

5. **배포**
   - "Deploy" 클릭
   - 배포 완료 후 프론트엔드 URL 확인

---

## 3단계: CORS 설정 확인

백엔드가 프론트엔드 요청을 허용하도록 CORS 설정이 되어 있는지 확인합니다.

`backend/src/index.ts`에서 이미 CORS가 설정되어 있습니다:
```typescript
app.use(cors());
```

프로덕션 환경에서는 특정 도메인만 허용하도록 설정할 수도 있습니다:
```typescript
app.use(cors({
  origin: ['https://your-frontend.vercel.app']
}));
```

---

## 대안: Render 사용하기

Railway 대신 Render를 사용할 수도 있습니다.

### Render 배포 방법

1. **Render 계정 생성**
   - https://render.com 접속
   - GitHub 계정으로 로그인

2. **Web Service 생성**
   - "New" → "Web Service" 선택
   - GitHub 저장소 선택
   - 설정:
     - Name: `planner-backend`
     - Root Directory: `backend`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
     - Environment: `Node`

3. **환경 변수 설정**
   - Environment Variables 탭에서 추가:
     ```
     PORT=3001
     NODE_ENV=production
     JWT_SECRET=your-secret-key-here
     ```

4. **배포 확인**
   - 배포 완료 후 URL 확인
   - 프론트엔드의 `VITE_API_URL`에 이 URL 설정

---

## 데이터베이스 파일

현재 프로젝트는 JSON 파일 기반 데이터베이스를 사용합니다.
- 파일 위치: `backend/data/planner.json`
- Railway/Render에서는 이 파일이 영구 저장소에 저장됩니다.
- 데이터 손실을 방지하려면 정기적으로 백업을 권장합니다.

---

## 문제 해결

### 백엔드가 시작되지 않는 경우
- `backend/package.json`의 `start` 스크립트 확인
- 빌드가 완료되었는지 확인 (`npm run build`)
- 포트가 환경 변수로 설정되어 있는지 확인

### 프론트엔드에서 API 호출 실패
- `VITE_API_URL` 환경 변수가 올바르게 설정되었는지 확인
- 백엔드 URL이 올바른지 확인 (끝에 `/api` 포함)
- CORS 설정 확인

### 데이터베이스 파일이 초기화되는 경우
- Railway/Render의 영구 저장소 사용 확인
- 파일 시스템 경로 확인

---

## 무료 티어 제한

- **Vercel**: 무제한 배포, 대역폭 제한 있음
- **Railway**: 월 $5 크레딧 제공 (무료 티어 종료됨)
- **Render**: 무료 티어 제공 (15분 비활성 시 슬리프 모드)

---

## 추가 최적화

1. **환경별 설정 분리**
   - 개발/프로덕션 환경 변수 분리
   - `.env.development`, `.env.production` 파일 사용

2. **데이터베이스 마이그레이션**
   - JSON 파일 대신 PostgreSQL 등 사용 고려
   - Railway/Render에서 PostgreSQL 추가 가능

3. **로깅 및 모니터링**
   - Railway/Render의 로그 기능 활용
   - 에러 추적 도구 추가 고려

