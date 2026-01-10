# 처음부터 배포하기 - 완전 가이드

GitHub, Railway, Vercel을 사용한 완전한 배포 가이드입니다.

---

## 📋 사전 준비

✅ GitHub 저장소: `YSGStudio/aboutme` (이미 완료)
✅ 코드가 GitHub에 푸시됨 (이미 완료)

---

## 1단계: Railway로 백엔드 배포

### 1-1. Railway 계정 생성
1. https://railway.app 접속
2. "Login" → GitHub로 로그인

### 1-2. 새 프로젝트 생성
1. 대시보드에서 **"New Project"** 클릭
2. **"Deploy from GitHub repo"** 선택
3. `YSGStudio/aboutme` 저장소 선택
4. **"Deploy Now"** 클릭

### 1-3. 백엔드 서비스 추가
1. 프로젝트 내에서 **"New"** 버튼 클릭
2. **"GitHub Repo"** 선택
3. 같은 저장소 (`YSGStudio/aboutme`) 선택
4. **"Add Service"** 클릭

### 1-4. 서비스 설정
생성된 서비스를 클릭하고:

1. **Settings 탭** 클릭
2. **Root Directory** 찾기:
   - Settings 페이지 아래로 스크롤
   - "Root Directory" 섹션 찾기
   - **"Edit"** 또는 **"Configure"** 클릭
   - `backend` 입력
   - 저장

3. **Build Command** 확인:
   - 자동으로 `npm install && npm run build`로 설정됨
   - 없으면 수동으로 입력

4. **Start Command** 확인:
   - `npm start`로 설정되어 있는지 확인

### 1-5. 환경 변수 설정
1. **Variables 탭** 클릭
2. 다음 변수들 추가:

   ```
   NODE_ENV = production
   PORT = 3001
   JWT_SECRET = [랜덤 문자열]
   ```

   **JWT_SECRET 생성 방법:**
   - 터미널: `openssl rand -hex 32`
   - 또는 온라인 랜덤 문자열 생성기 사용

### 1-6. 배포 확인
1. **Deployments 탭**에서 배포 진행 상황 확인
2. "Building..." → "Deploying..." → "Active" 상태가 되면 완료
3. **Settings → Networking**에서 URL 확인
   - 예: `https://planner-backend-production.up.railway.app`
4. 브라우저에서 `https://your-backend-url.railway.app/api/health` 접속
   - `{"status":"ok"}` 응답이 오면 성공!

---

## 2단계: Vercel로 프론트엔드 배포

### 2-1. Vercel 계정 생성
1. https://vercel.com 접속
2. "Sign Up" → GitHub로 로그인

### 2-2. 새 프로젝트 생성
1. 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. `YSGStudio/aboutme` 저장소 선택
3. **"Import"** 클릭

### 2-3. 프로젝트 설정

#### Framework Preset
- **"Vite"** 선택 (중요!)
- 이렇게 하면 자동으로 빌드 설정이 됨

#### Root Directory
1. **"Root Directory"** 섹션 찾기
2. **"Edit"** 클릭
3. `frontend` 입력
4. 저장

#### Build & Development Settings (자동 감지됨)
- Build Command: `npm run build` (자동)
- Output Directory: `dist` (자동)
- Install Command: `npm install` (자동)

### 2-4. 환경 변수 설정
1. **"Environment Variables"** 섹션 찾기
2. **"Add"** 버튼 클릭
3. 다음 정보 입력:

   **Key:**
   ```
   VITE_API_URL
   ```

   **Value:**
   ```
   https://your-railway-backend-url.railway.app/api
   ```
   - 위에서 받은 Railway 백엔드 URL 사용
   - **중요**: 끝에 `/api` 포함!

   **Environment:**
   - ✅ Production
   - ✅ Preview (선택사항)
   - ✅ Development (선택사항)

4. **"Save"** 클릭

### 2-5. 배포 시작
1. 설정 완료 후 **"Deploy"** 버튼 클릭
2. 배포 진행 상황 확인:
   - "Building..." → "Deploying..." → "Ready"

### 2-6. 배포 완료 확인
1. 배포 완료 후 URL 확인
   - 예: `https://aboutme.vercel.app`
2. URL로 접속하여 테스트
3. 로그인 페이지가 정상 표시되는지 확인

---

## 3단계: 최종 확인

### 체크리스트

#### Railway 백엔드
- [ ] Root Directory: `backend` 설정됨
- [ ] 환경 변수: `NODE_ENV`, `PORT`, `JWT_SECRET` 설정됨
- [ ] `/api/health` 엔드포인트 정상 작동
- [ ] 백엔드 URL 확인됨

#### Vercel 프론트엔드
- [ ] Framework Preset: `Vite` 선택됨
- [ ] Root Directory: `frontend` 설정됨
- [ ] 환경 변수: `VITE_API_URL` 설정됨 (Railway URL 포함)
- [ ] 배포 완료 및 URL 확인됨

### 테스트
1. 프론트엔드 URL로 접속
2. 교사 로그인 테스트
3. 로그인 후 대시보드로 이동 확인
4. 데이터가 정상적으로 로드되는지 확인

---

## 문제 해결

### Railway 빌드 실패
- Root Directory가 `backend`로 설정되었는지 확인
- 환경 변수가 올바른지 확인
- 배포 로그에서 에러 메시지 확인

### Vercel 빌드 실패
- Framework Preset이 `Vite`로 설정되었는지 확인
- Root Directory가 `frontend`로 설정되었는지 확인
- 환경 변수 `VITE_API_URL`이 올바른지 확인

### 로그인 후 데이터를 불러오지 못함
- 브라우저 콘솔(F12)에서 `API_URL` 확인
- `VITE_API_URL` 환경 변수가 올바른지 확인
- Railway 백엔드가 정상 작동하는지 확인 (`/api/health`)

---

## 중요 사항

### 환경 변수
- Railway: `NODE_ENV=production`, `PORT=3001`, `JWT_SECRET=...`
- Vercel: `VITE_API_URL=https://your-backend.railway.app/api`

### URL 형식
- Railway 백엔드: `https://your-backend.railway.app`
- Vercel 프론트엔드: `https://your-frontend.vercel.app`
- VITE_API_URL: `https://your-backend.railway.app/api` (끝에 `/api` 포함!)

---

## 완료!

이제 배포가 완료되었습니다!

- **백엔드**: Railway URL
- **프론트엔드**: Vercel URL

프론트엔드 URL로 접속하여 서비스를 사용할 수 있습니다! 🎉

