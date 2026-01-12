# Railway "Ready" → "Active" 상태 변경 가이드

Railway에서 배포 상태가 "Ready"인데 "Active"로 바뀌지 않는 경우 해결 방법입니다.

---

## 🔍 상태 확인

### "Ready" 상태란?
- 배포는 완료되었지만 서비스가 시작되지 않았거나
- Health check를 통과하지 못한 상태

### "Active" 상태란?
- 서비스가 정상적으로 실행 중인 상태

---

## ✅ 해결 방법

### 방법 1: 서비스 재배포 (Redeploy)

1. Railway 대시보드 접속
2. 프로젝트 선택
3. 백엔드 서비스 클릭
4. **"Deployments"** 탭 클릭
5. 최신 배포 옆 **"..."** (점 3개) 메뉴 클릭
6. **"Redeploy"** 선택
7. 배포가 다시 시작되면 "Building..." → "Deploying..." → "Active" 순서로 진행

---

### 방법 2: Start Command 확인

1. 서비스 → **"Settings"** 탭 클릭
2. **"Deploy"** 섹션 또는 **"Start Command"** 찾기
3. Start Command가 올바른지 확인:
   ```
   npm start
   ```
   또는
   ```
   cd backend && npm start
   ```
4. 잘못되었다면 수정 후 저장
5. 재배포

---

### 방법 3: 환경 변수 확인

1. 서비스 → **"Variables"** 탭 클릭
2. 다음 변수들이 모두 있는지 확인:
   - `NODE_ENV=production`
   - `PORT=3001`
   - `JWT_SECRET=...`
3. 누락된 변수가 있으면 추가
4. 재배포

---

### 방법 4: 로그 확인

1. 서비스 → **"Logs"** 탭 클릭
2. 에러 메시지 확인:
   - `Error: Cannot find module` → 의존성 문제
   - `Port already in use` → PORT 환경 변수 확인
   - `EADDRINUSE` → 포트 충돌
3. 에러에 따라 수정 후 재배포

---

### 방법 5: Health Check 설정

1. 서비스 → **"Settings"** 탭 클릭
2. **"Healthcheck"** 섹션 찾기
3. Health Check Path 설정:
   ```
   /api/health
   ```
4. 저장 후 재배포

---

## 🚀 빠른 해결 (권장)

가장 빠른 방법:

1. **서비스 → Deployments 탭**
2. **최신 배포 → "..." 메뉴 → "Redeploy"**
3. 배포 완료 대기 (5-10분)
4. "Active" 상태 확인

---

## 🔧 일반적인 문제

### 문제 1: Start Command 오류

**증상:**
- 로그에 `npm: command not found` 또는 `node: command not found`

**해결:**
- Settings → Start Command 확인
- `npm start` 또는 `node dist/index.js` 확인

### 문제 2: 포트 오류

**증상:**
- 로그에 `EADDRINUSE` 또는 `Port already in use`

**해결:**
- Variables → `PORT=3001` 확인
- 또는 코드에서 `process.env.PORT || 3001` 사용 확인

### 문제 3: 의존성 오류

**증상:**
- 로그에 `Cannot find module`

**해결:**
- Root Directory가 `backend`로 설정되었는지 확인
- `backend/package.json` 파일이 있는지 확인
- 재배포

---

## 📝 확인 체크리스트

배포 전 확인:

- [ ] Root Directory: `backend` 설정됨
- [ ] Start Command: `npm start` 설정됨
- [ ] 환경 변수 3개 모두 설정됨
- [ ] `backend/package.json`에 `start` 스크립트 있음
- [ ] `backend/src/index.ts` 파일 존재

---

## 💡 팁

- **"Ready" 상태는 정상일 수 있습니다** - Railway가 자동으로 "Active"로 전환할 때까지 기다려보세요 (1-2분)
- **로그를 확인**하면 정확한 원인을 알 수 있습니다
- **재배포**는 가장 확실한 해결 방법입니다

---

## 다음 단계

"Active" 상태가 되면:

1. Settings → Networking에서 URL 확인
2. `https://your-backend.railway.app/api/health` 접속 테스트
3. `{"status":"ok"}` 응답 확인
4. Vercel 프론트엔드 배포 진행

