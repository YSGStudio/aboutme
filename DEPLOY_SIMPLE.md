# 가장 간단한 배포 방법 (단일 서버)

이제 프론트엔드와 백엔드를 하나의 서버에서 실행할 수 있습니다!

## 🚀 Render로 한 번에 배포하기

### 1단계: Render 계정 생성
- https://render.com 접속
- GitHub 계정으로 로그인

### 2단계: 프로젝트 배포
1. "New" → "Web Service" 클릭
2. GitHub 저장소 선택
3. **설정 입력**:
   - **Name**: `planner` (원하는 이름)
   - **Root Directory**: (비워두기 - 루트 디렉토리 사용)
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (무료)

4. **환경 변수 추가**:
   - `NODE_ENV` = `production`
   - `PORT` = `3001`
   - `JWT_SECRET` = (랜덤 문자열 생성, 예: `openssl rand -hex 32`)

5. **디스크 추가** (데이터 저장용):
   - "Disks" 탭 클릭
   - "Add Disk" 클릭
   - Name: `planner-data`
   - Mount Path: `/app/backend/data`
   - Size: 1GB

6. **배포 시작**
   - "Create Web Service" 클릭
   - 배포 완료 대기 (약 5-10분)

### 3단계: 확인
- 배포 완료 후 제공되는 URL로 접속
- 예: `https://planner.onrender.com`
- 모든 기능이 하나의 URL에서 작동합니다!

---

## 🎯 다른 플랫폼 사용하기

### Railway
1. "New Project" → "Deploy from GitHub repo"
2. 저장소 선택
3. Root Directory: (비워두기)
4. Build Command: `npm run build`
5. Start Command: `npm start`
6. 환경 변수 설정 (위와 동일)

### Fly.io
```bash
# Fly CLI 설치 후
fly launch
# 설정 선택
```

---

## 📝 로컬에서 프로덕션 모드 테스트

```bash
# 빌드
npm run build

# 프로덕션 모드 실행
NODE_ENV=production npm start
```

브라우저에서 http://localhost:3001 접속

---

## ⚠️ 주의사항

1. **데이터 백업**: Render 무료 티어는 디스크가 영구 저장되지만, 정기 백업 권장
2. **슬리프 모드**: Render 무료 티어는 15분 비활성 시 슬리프 모드 (첫 요청 시 깨어남)
3. **환경 변수**: `JWT_SECRET`은 반드시 강력한 랜덤 문자열 사용

---

## 🔧 문제 해결

### 빌드 실패
- `npm run install:all`을 먼저 로컬에서 실행하여 의존성 확인

### 정적 파일이 안 보임
- `NODE_ENV=production` 환경 변수 확인
- 빌드가 완료되었는지 확인 (`frontend/dist` 폴더 존재 확인)

### API 호출 실패
- CORS 설정 확인 (현재 모든 도메인 허용)
- 프론트엔드에서 `/api` 경로로 요청하는지 확인

---

이제 하나의 URL로 모든 기능을 사용할 수 있습니다! 🎉

