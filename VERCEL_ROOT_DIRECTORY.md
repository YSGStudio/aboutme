# Vercel Root Directory 설정 위치

## 방법 1: 프로젝트 Import 시 설정

### 1단계: 저장소 Import
1. Vercel 대시보드 → "Add New..." → "Project"
2. GitHub 저장소 선택 (`YSGStudio/aboutme`)
3. "Import" 클릭

### 2단계: Configure Project 화면
저장소를 Import하면 "Configure Project" 화면이 나타납니다.

#### Root Directory 찾기
1. **"Configure Project"** 화면에서 아래로 스크롤
2. **"Root Directory"** 섹션 찾기
   - "Project Name" 아래에 있을 수 있음
   - 또는 "Build and Output Settings" 위에 있을 수 있음
3. **"Edit"** 또는 **"Configure"** 버튼 클릭
4. `frontend` 입력
5. 저장

---

## 방법 2: 프로젝트 Settings에서 설정

프로젝트를 이미 생성했다면:

### 1단계: 프로젝트 Settings로 이동
1. Vercel 대시보드에서 프로젝트 클릭
2. 상단 메뉴에서 **"Settings"** 탭 클릭

### 2단계: General 섹션
1. Settings 페이지에서 **"General"** 섹션 찾기
2. **"Root Directory"** 항목 찾기
3. **"Edit"** 버튼 클릭
4. `frontend` 입력
5. 저장

---

## 방법 3: vercel.json 파일 사용 (대안)

Root Directory 설정이 보이지 않으면, 프로젝트 루트에 `vercel.json` 파일을 만들어 설정할 수 있습니다.

### vercel.json 파일 생성
프로젝트 루트 (`/Users/yangseung-geun/planner/`)에 `vercel.json` 파일이 이미 있습니다.

내용 확인:
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install"
}
```

이 파일이 있으면 Root Directory 설정 없이도 작동합니다!

---

## Root Directory를 찾을 수 없는 경우

### UI가 다른 경우
Vercel UI가 업데이트되어 위치가 다를 수 있습니다:

1. **프로젝트 Import 화면에서:**
   - "Advanced" 또는 "Show More" 버튼 클릭
   - "Root Directory" 옵션이 숨겨져 있을 수 있음

2. **프로젝트 Settings에서:**
   - "General" → "Root Directory"
   - 또는 "Build & Development Settings" 섹션 확인

### vercel.json 파일 사용 (추천)
Root Directory 설정이 어렵다면, `vercel.json` 파일을 사용하는 것이 더 확실합니다.

현재 프로젝트에 이미 `vercel.json` 파일이 있으므로:
1. GitHub에 푸시되어 있는지 확인
2. Vercel이 자동으로 인식함
3. 별도 Root Directory 설정 불필요

---

## 확인 방법

### vercel.json이 작동하는지 확인
1. Vercel 프로젝트 → Settings → General
2. "Root Directory"가 비어있어도 됨
3. Build Command와 Output Directory가 올바르게 설정되어 있는지 확인

### 빌드 로그 확인
1. 배포 후 "Deployments" 탭 클릭
2. 최신 배포 클릭
3. 빌드 로그에서:
   - `cd frontend` 명령이 실행되는지 확인
   - `frontend/dist`에서 파일을 찾는지 확인

---

## 요약

**가장 쉬운 방법:**
1. 프로젝트 루트의 `vercel.json` 파일이 이미 설정되어 있음
2. GitHub에 푸시되어 있으면 Vercel이 자동으로 인식
3. Root Directory를 수동으로 설정할 필요 없음!

**수동 설정이 필요한 경우:**
- 프로젝트 Import 시: Configure Project 화면에서 "Root Directory" → "Edit" → `frontend`
- 프로젝트 Settings: Settings → General → Root Directory → `frontend`

