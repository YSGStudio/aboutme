# Vercel만으로 배포하기

GitHub와 Vercel만으로 전체 애플리케이션을 배포하는 방법입니다.

---

## 방법 1: 단일 Express 서버로 통합 배포 (추천) ⭐

이미 구현되어 있습니다! Express 서버에서 프론트엔드 정적 파일도 서빙하도록 설정되어 있어서, Vercel에 하나의 서비스로 배포할 수 있습니다.

### 배포 방법

1. **Vercel 접속**
   - https://vercel.com 접속
   - GitHub로 로그인

2. **프로젝트 생성**
   - "Add New" → "Project"
   - `YSGStudio/aboutme` 저장소 선택
   - "Import" 클릭

3. **프로젝트 설정**
   - **Framework Preset**: `Other` 선택
   - **Root Directory**: (비워두기 - 루트 사용)
   - **Build Command**: `npm run build`
   - **Output Directory**: `backend/dist` (또는 비워두기)
   - **Install Command**: `npm install`

4. **환경 변수 설정**
   - `NODE_ENV` = `production`
   - `PORT` = `3001` (또는 Vercel이 자동 할당)
   - `JWT_SECRET` = (랜덤 문자열)

5. **배포**
   - "Deploy" 클릭

### 주의사항

- Vercel은 Serverless Functions를 사용하므로 Express 앱을 그대로 배포하기 어려울 수 있습니다
- Vercel은 Node.js 런타임을 지원하지만, Express 앱을 배포하려면 추가 설정이 필요할 수 있습니다

---

## 방법 2: Vercel Serverless Functions로 변환

Express 라우트를 Vercel Serverless Functions로 변환하는 방법입니다.

### api 폴더 구조

```
frontend/
  api/
    auth/
      [...route].ts
    teacher/
      [...route].ts
    student/
      [...route].ts
```

이 방법은 상당한 코드 수정이 필요합니다.

---

## 방법 3: Vercel + 다른 무료 백엔드 호스팅

### 옵션 A: Render (무료 티어)
- https://render.com
- 무료 티어 제공
- 15분 비활성 시 슬리프 모드

### 옵션 B: Fly.io (무료 티어)
- https://fly.io
- 무료 티어 제공
- 전 세계 CDN

### 옵션 C: Railway (유료)
- https://railway.app
- 무료 티어 종료됨
- 유료 플랜 필요

---

## 추천: Render + Vercel 조합

가장 간단하고 무료로 사용할 수 있는 방법:

### 1. Render로 백엔드 배포
1. https://render.com 접속
2. "New" → "Web Service"
3. GitHub 저장소 선택
4. Root Directory: `backend`
5. Build Command: `npm install && npm run build`
6. Start Command: `npm start`
7. 환경 변수 설정

### 2. Vercel로 프론트엔드 배포
1. Vercel에서 프로젝트 생성
2. Root Directory: `frontend`
3. 환경 변수: `VITE_API_URL=https://your-render-backend.onrender.com/api`

---

## Vercel만 사용하는 경우의 제한사항

### 문제점
1. **Express 앱 배포 제한**
   - Vercel은 Serverless Functions에 최적화
   - Express 앱을 직접 배포하기 어려움

2. **데이터베이스 파일**
   - JSON 파일 기반 DB는 Vercel의 Serverless 환경에서 영구 저장 어려움
   - 각 함수 호출마다 파일 시스템이 초기화될 수 있음

3. **상태 관리**
   - Serverless Functions는 상태를 유지하지 않음
   - 데이터베이스 파일이 매번 초기화될 수 있음

---

## 결론

**가장 현실적인 방법:**
- **Render (백엔드) + Vercel (프론트엔드)** 조합
- 둘 다 무료 티어 제공
- 설정이 간단함

**Vercel만 사용하려면:**
- Express 앱을 Serverless Functions로 변환 필요
- 데이터베이스를 외부 서비스(PostgreSQL 등)로 변경 필요
- 상당한 코드 수정 필요

---

## 빠른 배포 가이드 (Render + Vercel)

### Render 백엔드 배포
1. Render.com → "New" → "Web Service"
2. 저장소 선택
3. Root Directory: `backend`
4. Build: `npm install && npm run build`
5. Start: `npm start`
6. 환경 변수: `NODE_ENV=production`, `JWT_SECRET=...`

### Vercel 프론트엔드 배포
1. Vercel.com → "Add New" → "Project"
2. 저장소 선택
3. Root Directory: `frontend`
4. 환경 변수: `VITE_API_URL=https://your-render-backend.onrender.com/api`

이 방법이 가장 간단하고 무료로 사용할 수 있습니다!

