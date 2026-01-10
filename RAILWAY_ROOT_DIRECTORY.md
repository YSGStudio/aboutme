# Railway Root Directory 설정 위치

## 방법 1: 서비스 Settings에서 설정 (가장 쉬움)

### 1단계: 서비스 선택
1. Railway 대시보드 접속 (https://railway.app)
2. 프로젝트 클릭
3. **백엔드 서비스** 클릭 (backend 서비스)

### 2단계: Settings 탭으로 이동
1. 서비스 페이지 상단 메뉴에서 **"Settings"** 탭 클릭
2. Settings 페이지로 이동

### 3단계: Root Directory 찾기
1. Settings 페이지에서 아래로 스크롤
2. **"Root Directory"** 섹션 찾기
   - "Service Settings" 또는 "Build Settings" 섹션에 있음
3. **"Edit"** 또는 **"Configure"** 버튼 클릭
4. `backend` 입력
5. **"Save"** 또는 **"Update"** 클릭

---

## 방법 2: 서비스 생성 시 설정

### 새 서비스를 추가하는 경우
1. 프로젝트에서 **"New"** 버튼 클릭
2. **"GitHub Repo"** 선택
3. 저장소 선택
4. 서비스 생성 화면에서:
   - **"Root Directory"** 필드 찾기
   - `backend` 입력
5. **"Add Service"** 클릭

---

## 방법 3: railway.json 파일 사용 (자동 설정)

프로젝트 루트에 `railway.json` 파일이 있으면 자동으로 설정됩니다.

현재 프로젝트에는 `backend/railway.json` 파일이 있습니다:
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

하지만 Root Directory는 이 파일에 명시되어 있지 않으므로, Settings에서 수동으로 설정해야 합니다.

---

## Root Directory를 찾을 수 없는 경우

### UI가 다른 경우
1. **"Variables"** 탭 옆에 있을 수 있음
2. **"Deployments"** 탭에서 설정 가능할 수 있음
3. 서비스 이름 옆 **"..."** 메뉴 → **"Settings"** 클릭

### Settings 페이지에서 찾기
Settings 페이지의 섹션들:
- **Service Settings**
- **Build Settings**
- **Deploy Settings**
- **Networking**

이 중 하나에 "Root Directory"가 있을 것입니다.

---

## 확인 방법

Root Directory가 올바르게 설정되었는지 확인:
1. Settings → Root Directory
2. 값이 `backend`인지 확인
3. 또는 배포 로그에서 확인:
   - Deployments 탭 → 최신 배포 클릭
   - 로그에서 `cd backend` 명령이 실행되는지 확인

---

## 중요 사항

- Root Directory는 **서비스별로** 설정됩니다
- 백엔드 서비스에만 `backend`로 설정
- 프론트엔드를 별도로 배포하는 경우 Root Directory 설정 불필요 (Vercel 사용)

---

## 문제 해결

### Root Directory 설정이 저장되지 않는 경우
1. 페이지 새로고침
2. 다시 시도
3. Railway 지원팀에 문의

### 배포가 실패하는 경우
1. Root Directory가 `backend`로 설정되었는지 확인
2. `backend/package.json` 파일이 있는지 확인
3. 배포 로그에서 에러 확인

