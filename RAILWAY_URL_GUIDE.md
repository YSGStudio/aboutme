# Railway 백엔드 URL 확인 방법

## 방법 1: Settings → Networking (가장 쉬움)

1. **Railway 대시보드 접속**
   - https://railway.app 접속
   - 로그인

2. **프로젝트 선택**
   - 배포한 프로젝트 클릭

3. **서비스 선택**
   - 백엔드 서비스 클릭 (backend 서비스)

4. **Settings 탭 클릭**
   - 상단 메뉴에서 "Settings" 클릭

5. **Networking 섹션 확인**
   - "Networking" 섹션으로 스크롤
   - "Generate Domain" 버튼이 있으면 클릭
   - 또는 이미 생성된 도메인 확인
   - 예: `https://planner-backend-production.up.railway.app`

---

## 방법 2: Deployments 탭

1. **서비스 페이지에서 "Deployments" 탭 클릭**
2. **최신 배포 클릭**
3. **배포 로그에서 URL 확인**
   - 로그에 도메인 정보가 표시될 수 있음

---

## 방법 3: Variables 탭 옆에 표시

1. **서비스 페이지에서 "Variables" 탭 클릭**
2. **상단에 공개 URL이 표시될 수 있음**

---

## URL 형식

Railway URL은 보통 다음과 같은 형식입니다:
- `https://[서비스이름]-[프로젝트이름].up.railway.app`
- 또는 `https://[랜덤문자열].up.railway.app`

---

## URL이 보이지 않는 경우

### 도메인이 생성되지 않은 경우
1. Settings → Networking
2. "Generate Domain" 버튼 클릭
3. 도메인 생성 대기 (몇 초 소요)

### Private 서비스인 경우
- Settings에서 Public으로 변경 필요할 수 있음

---

## 백엔드 URL 확인 후

백엔드 URL을 받았다면:
1. **헬스 체크**: `https://your-backend-url.railway.app/api/health`
   - 브라우저에서 접속하여 `{"status":"ok"}` 응답 확인

2. **Vercel 환경 변수 설정**:
   - `VITE_API_URL=https://your-backend-url.railway.app/api`
   - (끝에 `/api` 포함!)

---

## 예시

백엔드 URL이 `https://planner-backend-production.up.railway.app`인 경우:

- **API 엔드포인트**: `https://planner-backend-production.up.railway.app/api`
- **헬스 체크**: `https://planner-backend-production.up.railway.app/api/health`
- **Vercel 환경 변수**: `VITE_API_URL=https://planner-backend-production.up.railway.app/api`

