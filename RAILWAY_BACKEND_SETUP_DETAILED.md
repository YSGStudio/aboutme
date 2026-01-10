# Railway 백엔드 설정 완전 가이드

Railway에서 백엔드를 배포하는 모든 단계를 상세히 설명합니다.

---

## 🎯 전체 흐름

1. Railway 로그인
2. 새 프로젝트 생성
3. 백엔드 서비스 추가
4. **Root Directory 설정** ← 여기가 중요!
5. 환경 변수 설정
6. 배포 확인

---

## 1단계: Railway 접속 및 로그인

1. https://railway.app 접속
2. 우측 상단 **"Login"** 클릭
3. **"Login with GitHub"** 선택
4. GitHub 계정으로 로그인

---

## 2단계: 새 프로젝트 생성

### 방법 A: 처음부터 시작

1. Railway 대시보드에서 **"New Project"** 버튼 클릭
   - 보통 화면 중앙 또는 상단에 있음
2. **"Deploy from GitHub repo"** 선택
3. GitHub 저장소 선택 화면에서:
   - `YSGStudio/aboutme` 찾기
   - 클릭하여 선택
4. **"Deploy Now"** 또는 **"Add Service"** 클릭

### 방법 B: 빈 프로젝트 생성

1. **"New Project"** 클릭
2. **"Empty Project"** 선택
3. 프로젝트 이름 입력 (예: "planner-backend")
4. **"Create Project"** 클릭

---

## 3단계: 백엔드 서비스 추가

### 프로젝트가 비어있는 경우

1. 프로젝트 대시보드에서 **"New"** 버튼 클릭
   - 보통 좌측 상단 또는 중앙에 있음
2. 드롭다운 메뉴에서 **"GitHub Repo"** 선택
3. 저장소 선택:
   - `YSGStudio/aboutme` 선택
4. **"Add Service"** 클릭

### 이미 서비스가 있는 경우

- 기존 서비스를 사용하거나
- 새로 추가할 수 있습니다

---

## 4단계: Root Directory 설정 ⭐ (가장 중요!)

### 방법 1: 서비스 생성 시 설정 (권장)

서비스를 추가할 때:

1. **"GitHub Repo"** 선택 후 저장소 선택
2. 서비스 추가 화면에서:
   - **"Configure"** 또는 **"Settings"** 버튼 클릭
   - 또는 바로 아래에 **"Root Directory"** 필드가 보일 수 있음
3. **"Root Directory"** 필드 찾기:
   - "Service Settings" 섹션
   - "Build Settings" 섹션
   - 또는 화면 하단의 "Advanced Options"
4. **"Root Directory"** 입력란에 `backend` 입력
5. **"Add Service"** 또는 **"Deploy"** 클릭

### 방법 2: 서비스 Settings에서 설정

서비스가 이미 생성된 경우:

1. 프로젝트 대시보드에서 **백엔드 서비스 카드** 클릭
   - 서비스 이름이 보이는 카드/박스
2. 서비스 페이지 상단 메뉴에서 **"Settings"** 탭 클릭
   - 탭 메뉴: Overview | Deployments | Metrics | Logs | **Settings** | Variables
3. Settings 페이지에서 아래로 스크롤
4. **"Root Directory"** 섹션 찾기:
   - 위치 1: **"Service Settings"** 섹션
   - 위치 2: **"Build Settings"** 섹션
   - 위치 3: **"Deploy Settings"** 섹션
5. **"Root Directory"** 옆에 **"Edit"** 또는 **"Configure"** 버튼 클릭
6. 입력란에 `backend` 입력
7. **"Save"** 또는 **"Update"** 클릭

### 방법 3: 서비스 메뉴에서 접근

1. 프로젝트 대시보드에서 서비스 카드 우측 상단 **"..."** (점 3개) 메뉴 클릭
2. **"Settings"** 선택
3. 위의 "방법 2" 3번부터 동일하게 진행

---

## 5단계: 환경 변수 설정

1. 서비스 페이지에서 **"Variables"** 탭 클릭
   - 또는 Settings 페이지에서 **"Variables"** 섹션 찾기
2. **"New Variable"** 또는 **"Add Variable"** 버튼 클릭
3. 다음 변수들을 하나씩 추가:

   **변수 1:**
   - Key: `NODE_ENV`
   - Value: `production`
   - **"Add"** 클릭

   **변수 2:**
   - Key: `PORT`
   - Value: `3001`
   - **"Add"** 클릭

   **변수 3:**
   - Key: `JWT_SECRET`
   - Value: `[랜덤 문자열]`
     - 생성 방법: 터미널에서 `openssl rand -hex 32` 실행
     - 또는 온라인 랜덤 문자열 생성기 사용
   - **"Add"** 클릭

4. 모든 변수가 추가되었는지 확인

---

## 6단계: 배포 확인

1. **"Deployments"** 탭 클릭
2. 배포 진행 상황 확인:
   - **"Building..."** → 빌드 중
   - **"Deploying..."** → 배포 중
   - **"Active"** → 배포 완료 ✅
3. 배포가 실패하면:
   - 로그 확인 (Deployments 탭에서 배포 클릭)
   - Root Directory가 `backend`로 설정되었는지 확인
   - 환경 변수가 올바른지 확인

---

## 7단계: 백엔드 URL 확인

1. **"Settings"** 탭 클릭
2. **"Networking"** 섹션 찾기
3. **"Generate Domain"** 버튼 클릭 (자동 생성됨)
4. 또는 이미 생성된 도메인 확인:
   - 예: `https://planner-backend-production.up.railway.app`
5. 브라우저에서 다음 URL 접속하여 테스트:
   ```
   https://your-backend-url.railway.app/api/health
   ```
   - `{"status":"ok"}` 응답이 오면 성공! ✅

---

## 🔍 Root Directory를 찾을 수 없는 경우

### UI가 다른 경우 대처법

1. **서비스 이름 옆 설정 아이콘** 클릭
2. **"Edit Service"** 또는 **"Service Settings"** 클릭
3. **"Advanced"** 또는 **"More Options"** 펼치기
4. **"Build"** 섹션에서 찾기
5. **"Deploy"** 섹션에서 찾기

### Railway UI 업데이트로 인한 변경

Railway는 UI를 자주 업데이트합니다. 다음을 시도해보세요:

1. **프로젝트 루트에 `railway.json` 파일 생성** (자동 인식)
2. **서비스 생성 시 "Configure" 버튼 클릭**
3. **Railway CLI 사용** (고급)

---

## 📝 railway.json 파일로 자동 설정

프로젝트 루트에 `railway.json` 파일을 만들면 자동으로 인식됩니다:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

하지만 **Root Directory는 이 파일에 명시할 수 없으므로**, Settings에서 수동 설정이 필요합니다.

---

## ✅ 최종 확인 체크리스트

배포 전 확인사항:

- [ ] 프로젝트 생성 완료
- [ ] 백엔드 서비스 추가 완료
- [ ] **Root Directory: `backend` 설정 완료** ⭐
- [ ] 환경 변수 3개 모두 추가 완료:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3001`
  - [ ] `JWT_SECRET=...`
- [ ] 배포 상태: "Active"
- [ ] `/api/health` 엔드포인트 정상 작동
- [ ] 백엔드 URL 확인 및 저장

---

## 🆘 문제 해결

### Root Directory 설정이 보이지 않음

1. **서비스를 삭제하고 다시 생성**:
   - 서비스 → "..." 메뉴 → "Delete"
   - 새로 서비스 추가 시 "Configure" 클릭

2. **Railway 지원팀에 문의**:
   - Settings 페이지 하단 "Support" 링크

3. **Railway 문서 확인**:
   - https://docs.railway.app

### 배포가 실패함

1. **Deployments 탭**에서 로그 확인
2. 에러 메시지 확인:
   - `package.json not found` → Root Directory 확인
   - `npm install failed` → Node.js 버전 확인
   - `Port already in use` → PORT 환경 변수 확인

### 환경 변수가 적용되지 않음

1. Variables 탭에서 변수 확인
2. 서비스 재배포 (Redeploy)
3. 배포 로그에서 환경 변수 로드 확인

---

## 💡 팁

- **Root Directory는 서비스별로 설정됩니다**
- 백엔드 서비스에만 `backend`로 설정
- 프론트엔드는 Vercel에서 배포하므로 Railway에서 설정 불필요
- 배포 후 첫 빌드는 시간이 걸릴 수 있습니다 (5-10분)

---

## 다음 단계

백엔드 배포가 완료되면:

1. 백엔드 URL 저장 (예: `https://xxx.railway.app`)
2. Vercel에서 프론트엔드 배포
3. Vercel 환경 변수에 `VITE_API_URL` 설정 (백엔드 URL 포함)

자세한 내용은 `DEPLOY_FROM_SCRATCH.md` 참고!

