# Vercel 프론트엔드 배포 상세 가이드

단계별로 Vercel에 프론트엔드를 배포하는 방법을 설명합니다.

---

## 📋 사전 준비

1. ✅ GitHub에 코드가 올라가 있어야 함 (`YSGStudio/aboutme`)
2. ✅ Railway 백엔드 URL 확인 (예: `https://your-backend.railway.app`)
3. ✅ Vercel 계정 (GitHub 계정으로 가입 가능)

---

## 1단계: Vercel 계정 생성 및 로그인

### 1-1. Vercel 접속
1. 브라우저에서 https://vercel.com 접속
2. 우측 상단 "Sign Up" 또는 "Log In" 클릭

### 1-2. GitHub로 로그인
1. "Continue with GitHub" 클릭
2. GitHub 인증 화면에서 "Authorize Vercel" 클릭
3. 필요한 권한 승인 (저장소 접근 권한)

---

## 2단계: 새 프로젝트 생성

### 2-1. 프로젝트 추가
1. Vercel 대시보드 접속
2. 우측 상단 또는 중앙에 있는 **"Add New..."** 버튼 클릭
3. 드롭다운에서 **"Project"** 선택

### 2-2. GitHub 저장소 선택
1. **"Import Git Repository"** 화면이 표시됨
2. GitHub 저장소 목록에서 **`YSGStudio/aboutme`** 찾기
   - 검색창에 "aboutme" 입력하면 빠르게 찾을 수 있음
3. **"Import"** 버튼 클릭

---

## 3단계: 프로젝트 설정

### 3-1. 기본 정보 입력
프로젝트 설정 화면이 나타납니다:

#### Project Name
- 기본값: `aboutme` (그대로 사용 가능)
- 원하는 이름으로 변경 가능

#### Framework Preset
- **자동 감지됨**: `Vite` 또는 `Other`
- Vite가 감지되지 않으면 수동으로 선택:
  - 드롭다운에서 "Vite" 선택

### 3-2. Root Directory 설정 (중요!)
1. **"Root Directory"** 섹션 찾기
2. **"Edit"** 버튼 클릭** (또는 "Configure" 버튼)
3. `frontend` 입력
4. **"Continue"** 또는 **"Save"** 클릭

**중요**: Root Directory를 `frontend`로 설정하지 않으면 빌드가 실패합니다!

### 3-3. Build and Output Settings
다음 설정들이 자동으로 입력되어 있어야 합니다:

#### Build Command
- 기본값: `npm run build`
- 확인: `npm run build`가 입력되어 있는지 확인

#### Output Directory
- 기본값: `dist`
- 확인: `dist`가 입력되어 있는지 확인

#### Install Command
- 기본값: `npm install`
- 확인: `npm install`이 입력되어 있는지 확인

**만약 자동으로 입력되지 않았다면:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

## 4단계: 환경 변수 설정 (매우 중요!)

### 4-1. Environment Variables 섹션 찾기
1. 프로젝트 설정 화면에서 **"Environment Variables"** 섹션 찾기
2. 또는 설정 화면 하단에 있을 수 있음

### 4-2. 환경 변수 추가
1. **"Add"** 또는 **"Add New"** 버튼 클릭
2. 다음 정보 입력:

   **Key (변수 이름)**:
   ```
   VITE_API_URL
   ```

   **Value (변수 값)**:
   ```
   https://your-backend-url.railway.app/api
   ```
   - `your-backend-url.railway.app`을 실제 Railway 백엔드 URL로 변경
   - **중요**: 끝에 `/api`를 반드시 포함!

   **Environment (환경)**:
   - ✅ **Production** 체크
   - ✅ **Preview** 체크 (선택사항, 추천)
   - ✅ **Development** 체크 (선택사항)

3. **"Save"** 또는 **"Add"** 버튼 클릭

### 4-3. 환경 변수 확인
- 추가된 환경 변수가 목록에 표시되는지 확인
- Key: `VITE_API_URL`
- Value: `https://your-backend-url.railway.app/api` (실제 URL)

---

## 5단계: 배포 시작

### 5-1. 배포 버튼 클릭
1. 설정 완료 후 화면 하단으로 스크롤
2. **"Deploy"** 버튼 클릭 (큰 파란색 버튼)

### 5-2. 배포 진행 상황 확인
1. 배포가 시작되면 진행 상황이 표시됨
2. 단계별 진행:
   - **"Building"** - 빌드 중
   - **"Deploying"** - 배포 중
   - **"Ready"** - 완료

3. 배포 로그 확인:
   - "View Function Logs" 클릭하여 로그 확인 가능
   - 에러가 있으면 로그에서 확인

---

## 6단계: 배포 완료 확인

### 6-1. 배포 완료 알림
- 배포가 완료되면 "Ready" 상태로 변경
- 성공 메시지 표시

### 6-2. 배포 URL 확인
1. 배포 완료 후 **배포 URL**이 표시됨
2. 예: `https://aboutme.vercel.app` 또는 `https://aboutme-xxxxx.vercel.app`
3. 이 URL을 복사하거나 클릭하여 접속

### 6-3. 사이트 테스트
1. 배포된 URL로 접속
2. 로그인 페이지가 정상적으로 표시되는지 확인
3. 브라우저 개발자 도구 (F12) → Console 탭에서 에러 확인

---

## 7단계: 문제 해결 (필요시)

### 빌드 실패

**에러**: "Build failed"
- **해결**:
  1. "View Function Logs"에서 에러 확인
  2. Root Directory가 `frontend`로 설정되었는지 확인
  3. Build Command가 `npm run build`인지 확인
  4. Output Directory가 `dist`인지 확인

### API 호출 실패

**에러**: "Network Error" 또는 CORS 에러
- **해결**:
  1. 환경 변수 `VITE_API_URL`이 올바르게 설정되었는지 확인
  2. URL 끝에 `/api`가 포함되어 있는지 확인
  3. Railway 백엔드가 정상 작동하는지 확인 (`/api/health` 엔드포인트 테스트)

### 환경 변수가 적용되지 않음

**문제**: 환경 변수를 추가했지만 적용되지 않음
- **해결**:
  1. 환경 변수 추가 후 **"Redeploy"** 필요
  2. 프로젝트 페이지에서 "Deployments" 탭 클릭
  3. 최신 배포 옆 "..." 메뉴 → "Redeploy" 클릭

---

## 8단계: 추가 설정 (선택사항)

### 8-1. 커스텀 도메인 설정
1. 프로젝트 → **"Settings"** → **"Domains"**
2. 원하는 도메인 입력
3. DNS 설정 안내에 따라 설정

### 8-2. 환경별 설정
1. **"Settings"** → **"Environment Variables"**
2. Production, Preview, Development 환경별로 다른 값 설정 가능

### 8-3. 자동 배포 설정
- 기본적으로 GitHub에 푸시하면 자동으로 재배포됨
- **"Settings"** → **"Git"**에서 설정 확인 가능

---

## 📝 체크리스트

배포 전 확인사항:
- [ ] GitHub 저장소가 연결됨 (`YSGStudio/aboutme`)
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] 환경 변수 `VITE_API_URL` 설정됨
- [ ] Railway 백엔드 URL이 올바름 (끝에 `/api` 포함)

---

## 🎯 요약

1. Vercel 접속 → GitHub로 로그인
2. "Add New" → "Project" → 저장소 선택
3. Root Directory: `frontend` 설정
4. 환경 변수 `VITE_API_URL` 추가 (Railway 백엔드 URL)
5. "Deploy" 클릭
6. 배포 완료 후 URL 확인

---

## 🔗 유용한 링크

- Vercel 대시보드: https://vercel.com/dashboard
- Vercel 문서: https://vercel.com/docs

문제가 발생하면 배포 로그를 확인하거나 위의 문제 해결 섹션을 참고하세요!

