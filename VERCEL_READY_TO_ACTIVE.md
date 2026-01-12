# Vercel "Ready" → 정상 작동 가이드

Vercel에서 배포 상태가 "Ready"인데 정상 작동하지 않는 경우 해결 방법입니다.

---

## 🔍 상태 확인

### "Ready" 상태란?
- Vercel에서 배포가 완료된 상태
- 하지만 실제로 접속했을 때 작동하지 않을 수 있음

### 정상 작동 상태란?
- 배포 완료 후 URL로 접속했을 때 정상적으로 페이지가 표시되는 상태

---

## ✅ 해결 방법

### 방법 1: 재배포 (Redeploy) - 가장 빠른 방법

1. Vercel 대시보드 접속
2. 프로젝트 선택
3. **"Deployments"** 탭 클릭
4. 최신 배포 옆 **"..."** (점 3개) 메뉴 클릭
5. **"Redeploy"** 선택
6. **"Redeploy"** 버튼 클릭
7. 배포 완료 대기 (2-5분)
8. URL로 접속하여 테스트

---

### 방법 2: 환경 변수 확인

1. 프로젝트 → **"Settings"** 탭 클릭
2. **"Environment Variables"** 섹션 클릭
3. 다음 변수가 있는지 확인:
   ```
   VITE_API_URL = https://your-railway-backend-url.railway.app/api
   ```
4. **중요 확인사항:**
   - Railway 백엔드 URL이 올바른지 확인
   - 끝에 `/api`가 포함되어 있는지 확인
   - **Environment**가 **Production**에 체크되어 있는지 확인
5. 누락되었거나 잘못되었다면:
   - **"Add"** 버튼 클릭
   - Key: `VITE_API_URL`
   - Value: `https://your-railway-backend-url.railway.app/api`
   - Environment: ✅ Production 체크
   - **"Save"** 클릭
6. 재배포

---

### 방법 3: 빌드 로그 확인

1. 프로젝트 → **"Deployments"** 탭 클릭
2. 최신 배포 클릭
3. **"Build Logs"** 또는 **"Runtime Logs"** 확인
4. 에러 메시지 확인:
   - `Cannot find module` → 의존성 문제
   - `VITE_API_URL is not defined` → 환경 변수 문제
   - `Build failed` → 빌드 설정 문제
5. 에러에 따라 수정 후 재배포

---

### 방법 4: 프로젝트 설정 확인

1. 프로젝트 → **"Settings"** 탭 클릭
2. **"General"** 섹션 확인:

   **Framework Preset:**
   - `Vite`로 설정되어 있는지 확인
   - 아니면 수정

   **Root Directory:**
   - `frontend`로 설정되어 있는지 확인
   - 아니면 수정

   **Build & Development Settings:**
   - Build Command: `npm run build` (자동)
   - Output Directory: `dist` (자동)
   - Install Command: `npm install --include=dev` (권장)

3. 수정 후 저장
4. 재배포

---

### 방법 5: 브라우저 콘솔 확인

1. Vercel 배포 URL로 접속
2. 브라우저 개발자 도구 열기 (F12)
3. **"Console"** 탭 클릭
4. 에러 메시지 확인:
   - `API_URL is undefined` → 환경 변수 문제
   - `Failed to fetch` → CORS 또는 백엔드 URL 문제
   - `404 Not Found` → 라우팅 문제
5. 에러에 따라 수정

---

## 🚀 빠른 해결 (권장 순서)

### 1단계: 환경 변수 확인 및 설정

1. Vercel → 프로젝트 → Settings → Environment Variables
2. `VITE_API_URL` 확인:
   ```
   VITE_API_URL = https://your-railway-backend-url.railway.app/api
   ```
3. 없으면 추가 (Production 환경에 체크)

### 2단계: 재배포

1. Deployments 탭
2. 최신 배포 → "..." → "Redeploy"
3. 배포 완료 대기

### 3단계: 테스트

1. 배포 완료 후 URL 접속
2. 로그인 페이지가 정상 표시되는지 확인
3. 브라우저 콘솔(F12)에서 에러 확인

---

## 🔧 일반적인 문제

### 문제 1: 환경 변수 미설정

**증상:**
- 페이지는 로드되지만 API 호출 실패
- 브라우저 콘솔: `API_URL is undefined`

**해결:**
- Settings → Environment Variables → `VITE_API_URL` 추가
- Railway 백엔드 URL 포함 (끝에 `/api`)
- Production 환경에 체크
- 재배포

### 문제 2: 백엔드 URL 오류

**증상:**
- API 호출 실패
- 브라우저 콘솔: `Failed to fetch` 또는 `CORS error`

**해결:**
- `VITE_API_URL` 값 확인
- Railway 백엔드가 "Active" 상태인지 확인
- Railway 백엔드 URL이 올바른지 확인
- `/api/health` 엔드포인트 테스트

### 문제 3: 빌드 실패

**증상:**
- Deployments에서 "Build Failed" 상태

**해결:**
- Build Logs 확인
- Root Directory: `frontend` 확인
- Framework Preset: `Vite` 확인
- `frontend/package.json` 파일 확인

### 문제 4: 라우팅 문제

**증상:**
- 메인 페이지는 로드되지만 다른 페이지에서 404

**해결:**
- `vercel.json`에 rewrites 설정 확인
- 또는 Vercel Settings → General → "Clean URLs" 확인

---

## 📝 확인 체크리스트

배포 전 확인:

- [ ] Framework Preset: `Vite` 설정됨
- [ ] Root Directory: `frontend` 설정됨
- [ ] 환경 변수 `VITE_API_URL` 설정됨 (Production 환경)
- [ ] Railway 백엔드 URL이 올바름 (끝에 `/api` 포함)
- [ ] Railway 백엔드가 "Active" 상태
- [ ] `frontend/package.json`에 `build` 스크립트 있음
- [ ] `frontend/dist` 폴더가 빌드됨

---

## 💡 팁

- **"Ready" 상태는 정상입니다** - Vercel에서 배포가 완료된 상태
- **환경 변수는 재배포 후에만 적용됩니다**
- **브라우저 캐시 문제**일 수 있으니 시크릿 모드로 테스트해보세요
- **Railway 백엔드가 "Active" 상태여야** 프론트엔드가 정상 작동합니다

---

## 🔍 디버깅 단계

### 1. Vercel 배포 URL 접속
- 로그인 페이지가 보이는지 확인

### 2. 브라우저 콘솔 확인 (F12)
- 에러 메시지 확인
- `API_URL` 값 확인

### 3. Network 탭 확인
- API 요청이 올바른 URL로 가는지 확인
- 응답 상태 코드 확인 (200, 404, 500 등)

### 4. Vercel Build Logs 확인
- 빌드 과정에서 에러가 있었는지 확인

### 5. Railway 백엔드 확인
- `/api/health` 엔드포인트 테스트
- 백엔드가 "Active" 상태인지 확인

---

## 다음 단계

정상 작동 확인 후:

1. 로그인 테스트
2. 대시보드 데이터 로드 테스트
3. 모든 기능 테스트

---

## 문제가 계속되면

1. **Vercel Build Logs** 전체 확인
2. **브라우저 콘솔** 에러 메시지 확인
3. **Railway 백엔드** 상태 확인
4. **환경 변수** 다시 확인

자세한 내용은 `VERCEL_DEPLOY_DETAILED.md` 참고!

