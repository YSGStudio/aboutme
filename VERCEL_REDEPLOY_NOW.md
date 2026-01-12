# Vercel 재배포 - 지금 바로 하기

Railway 백엔드 URL: `planner-production-f166.up.railway.app`

---

## 🚀 빠른 재배포 단계

### 1단계: Vercel 환경 변수 설정

1. **Vercel 대시보드 접속**
   - https://vercel.com 접속
   - 로그인

2. **프로젝트 선택**
   - `aboutme` 또는 배포한 프로젝트 선택

3. **Settings 탭 클릭**
   - 프로젝트 페이지에서 **"Settings"** 탭 클릭

4. **Environment Variables 클릭**
   - 좌측 메뉴 또는 페이지에서 **"Environment Variables"** 섹션 클릭

5. **기존 변수 확인 또는 새로 추가**

   **기존 `VITE_API_URL`이 있는 경우:**
   - 변수 옆 **"Edit"** 또는 **"..."** 메뉴 클릭
   - Value 수정:
     ```
     https://planner-production-f166.up.railway.app/api
     ```
   - **"Save"** 클릭

   **기존 변수가 없는 경우:**
   - **"Add"** 또는 **"Add New"** 버튼 클릭
   - 다음 정보 입력:
     - **Key:** `VITE_API_URL`
     - **Value:** `https://planner-production-f166.up.railway.app/api`
     - **Environment:** ✅ Production 체크 (Preview, Development도 선택 가능)
   - **"Save"** 클릭

---

### 2단계: 재배포

1. **Deployments 탭 클릭**
   - 프로젝트 페이지에서 **"Deployments"** 탭 클릭

2. **최신 배포 찾기**
   - 목록에서 가장 최근 배포 확인

3. **재배포 실행**
   - 최신 배포 옆 **"..."** (점 3개) 메뉴 클릭
   - **"Redeploy"** 선택
   - **"Redeploy"** 버튼 클릭

4. **배포 완료 대기**
   - "Building..." → "Deploying..." → "Ready" 상태로 변경
   - 약 2-5분 소요

---

### 3단계: 테스트

1. **배포 완료 후 URL 확인**
   - Deployments 탭에서 배포 완료 확인
   - 배포 URL 클릭하여 접속

2. **브라우저 콘솔 확인 (F12)**
   - 개발자 도구 열기 (F12)
   - Console 탭에서 다음 확인:
     ```
     API_URL: https://planner-production-f166.up.railway.app/api
     ```
   - 에러가 없으면 성공!

3. **로그인 테스트**
   - 로그인 페이지 접속
   - 로그인 시도
   - 대시보드로 이동되는지 확인

---

## ✅ 확인 체크리스트

배포 전:
- [ ] Railway 백엔드 URL 확인: `planner-production-f166.up.railway.app`
- [ ] Railway 백엔드가 "Active" 상태인지 확인
- [ ] `/api/health` 엔드포인트 테스트: `https://planner-production-f166.up.railway.app/api/health`

배포 중:
- [ ] Vercel 환경 변수 `VITE_API_URL` 설정 완료
- [ ] Value: `https://planner-production-f166.up.railway.app/api` (끝에 `/api` 포함)
- [ ] Environment: Production 체크

배포 후:
- [ ] 배포 상태: "Ready"
- [ ] 브라우저 콘솔에서 `API_URL` 확인
- [ ] 로그인 테스트 성공
- [ ] 대시보드 데이터 로드 확인

---

## 🔍 문제 해결

### 환경 변수가 적용되지 않음

1. **환경 변수 확인**
   - Settings → Environment Variables
   - `VITE_API_URL` 값이 올바른지 확인
   - Production 환경에 체크되어 있는지 확인

2. **재배포 필수**
   - 환경 변수는 재배포 후에만 적용됩니다
   - Deployments → Redeploy 실행

### API 호출 실패

1. **Railway 백엔드 확인**
   - `https://planner-production-f166.up.railway.app/api/health` 접속
   - `{"status":"ok"}` 응답 확인

2. **브라우저 콘솔 확인**
   - F12 → Console 탭
   - 에러 메시지 확인
   - `API_URL` 값 확인

3. **Network 탭 확인**
   - F12 → Network 탭
   - API 요청이 올바른 URL로 가는지 확인

---

## 📝 환경 변수 설정 예시

### Vercel Environment Variables:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_URL` | `https://planner-production-f166.up.railway.app/api` | Production ✅ |

**중요:**
- Value 끝에 `/api` 포함 필수!
- Production 환경에 체크 필수!

---

## 🎯 다음 단계

1. ✅ Vercel 환경 변수 설정
2. ✅ 재배포 실행
3. ✅ 배포 완료 대기
4. ✅ URL 접속하여 테스트
5. ✅ 로그인 및 기능 테스트

---

## 💡 팁

- **환경 변수는 재배포 후에만 적용됩니다**
- **브라우저 캐시 문제**일 수 있으니 시크릿 모드로 테스트
- **Railway 백엔드가 "Active" 상태여야** 정상 작동합니다

---

완료되면 알려주세요! 🚀

