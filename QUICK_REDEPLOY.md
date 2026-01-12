# 빠른 재배포 가이드

GitHub 저장소: `YSGStudio/aboutme`

---

## 🚀 Railway 백엔드 재배포

### 기존 서비스가 있는 경우
1. Railway 대시보드 접속
2. 기존 프로젝트/서비스 선택
3. **"Redeploy"** 클릭

### 처음 배포하는 경우
1. Railway 접속 → "New Project"
2. "Deploy from GitHub repo" → `YSGStudio/aboutme` 선택
3. 서비스 추가:
   - "New" → "GitHub Repo" → 같은 저장소 선택
4. Settings → Root Directory: `backend`
5. Variables → 환경 변수 추가:
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=랜덤문자열
   ```
6. 배포 완료 후 URL 확인

---

## 🎨 Vercel 프론트엔드 재배포

### 기존 프로젝트가 있는 경우
1. Vercel 대시보드 접속
2. 프로젝트 선택
3. **"Deployments"** 탭
4. 최신 배포 옆 **"..."** 메뉴 → **"Redeploy"** 클릭

### 처음 배포하는 경우
1. Vercel 접속 → "Add New" → "Project"
2. `YSGStudio/aboutme` 저장소 선택
3. 설정:
   - **Framework Preset**: `Vite` 선택
   - **Root Directory**: `frontend`
4. 환경 변수:
   ```
   VITE_API_URL=https://your-railway-backend-url.railway.app/api
   ```
5. "Deploy" 클릭

---

## ⚡ 빠른 재배포 (기존 배포가 있는 경우)

### Railway
- 프로젝트 → 서비스 → "Redeploy" 버튼 클릭

### Vercel
- 프로젝트 → Deployments → 최신 배포 → "Redeploy" 클릭

---

## 🔧 설정 확인

### Railway 백엔드
- Root Directory: `backend` ✅
- 환경 변수: `NODE_ENV`, `PORT`, `JWT_SECRET` ✅

### Vercel 프론트엔드
- Framework Preset: `Vite` ✅
- Root Directory: `frontend` ✅
- 환경 변수: `VITE_API_URL` (Railway URL) ✅

---

자세한 내용은 `DEPLOY_FROM_SCRATCH.md` 참고!

