# Railway 백엔드 URL 찾기 - 완전 가이드

Railway에서 백엔드 URL을 정확히 어디서 확인하는지 단계별로 설명합니다.

---

## 🎯 Railway 백엔드 URL 확인 위치

### 방법 1: Settings → Networking (가장 쉬움) ⭐

1. **Railway 대시보드 접속**
   - https://railway.app
   - 로그인

2. **프로젝트 선택**
   - 대시보드에서 백엔드가 있는 프로젝트 클릭

3. **백엔드 서비스 클릭**
   - 프로젝트 내에서 백엔드 서비스 카드/박스 클릭

4. **Settings 탭 클릭**
   - 서비스 페이지 상단 메뉴에서 **"Settings"** 탭 클릭
   - 탭 메뉴: Overview | Deployments | Metrics | Logs | **Settings** | Variables

5. **Networking 섹션 찾기**
   - Settings 페이지에서 아래로 스크롤
   - **"Networking"** 또는 **"Domains"** 섹션 찾기
   - 위치:
     - Settings 페이지 중간 또는 하단
     - "Service Settings" 섹션 아래
     - "Deploy Settings" 섹션 아래

6. **도메인 확인**
   - **"Public Domain"** 또는 **"Generated Domain"** 확인
   - 예시:
     ```
     https://planner-backend-production.up.railway.app
     ```
   - 또는 **"Generate Domain"** 버튼이 있으면 클릭하여 생성

7. **URL 복사**
   - 도메인 옆 **복사 아이콘** 클릭
   - 또는 도메인을 직접 복사

---

### 방법 2: 서비스 Overview 페이지

1. **백엔드 서비스 클릭**
2. **Overview 탭** (기본 탭)
3. **"Public Domain"** 또는 **"URL"** 섹션 확인
4. URL 복사

---

### 방법 3: 프로젝트 대시보드

1. **프로젝트 대시보드**에서
2. **백엔드 서비스 카드** 확인
3. 서비스 카드에 **URL이 표시**될 수 있음
4. 클릭하여 상세 페이지로 이동

---

## 📋 URL 형식

Railway 백엔드 URL은 다음과 같은 형식입니다:

```
https://[서비스이름]-[프로젝트이름].up.railway.app
```

예시:
```
https://planner-backend-production.up.railway.app
https://backend-main.up.railway.app
https://web-production-xxxx.up.railway.app
```

---

## ✅ Vercel 환경 변수에 설정하기

Railway에서 URL을 확인한 후:

1. **Vercel 대시보드 접속**
2. **프로젝트 선택**
3. **Settings 탭** → **Environment Variables** 클릭
4. **"Add"** 버튼 클릭
5. 다음 정보 입력:

   **Key:**
   ```
   VITE_API_URL
   ```

   **Value:**
   ```
   https://your-railway-backend-url.railway.app/api
   ```
   - 위에서 복사한 Railway URL 사용
   - **중요**: 끝에 `/api` 추가!

   **Environment:**
   - ✅ Production 체크
   - ✅ Preview 체크 (선택사항)
   - ✅ Development 체크 (선택사항)

6. **"Save"** 클릭
7. **재배포** (Deployments → Redeploy)

---

## 🔍 URL이 보이지 않는 경우

### 도메인이 생성되지 않은 경우

1. **Settings → Networking** 섹션으로 이동
2. **"Generate Domain"** 또는 **"Create Domain"** 버튼 클릭
3. 도메인 생성 대기 (몇 초)
4. 생성된 도메인 확인

### Networking 섹션이 없는 경우

1. **서비스 → Settings → Deploy** 섹션 확인
2. 또는 **서비스 → Overview** 탭 확인
3. Railway UI 업데이트로 위치가 변경되었을 수 있음

---

## 🧪 URL 테스트

URL을 확인한 후 테스트:

1. **브라우저에서 접속:**
   ```
   https://your-railway-backend-url.railway.app/api/health
   ```

2. **응답 확인:**
   - `{"status":"ok"}` 응답이 오면 성공! ✅
   - 에러가 나면 Railway 백엔드 상태 확인

---

## 📝 예시

### Railway에서 확인한 URL:
```
https://planner-backend-production.up.railway.app
```

### Vercel 환경 변수에 설정할 값:
```
https://planner-backend-production.up.railway.app/api
```

**차이점:**
- Railway URL: `/api` 없음
- Vercel 환경 변수: `/api` 추가 (프론트엔드에서 API 호출 시 사용)

---

## 💡 팁

- **Railway URL은 배포 후 자동 생성됩니다**
- **URL은 변경되지 않습니다** (서비스 삭제 전까지)
- **URL을 복사할 때 전체 URL을 복사하세요** (https:// 포함)
- **Vercel 환경 변수에는 끝에 `/api`를 추가해야 합니다**

---

## 🆘 문제 해결

### URL이 보이지 않음

1. **서비스가 "Active" 상태인지 확인**
2. **배포가 완료되었는지 확인** (Deployments 탭)
3. **Settings → Networking 섹션 다시 확인**
4. **"Generate Domain" 버튼 클릭**

### URL로 접속이 안 됨

1. **Railway 백엔드가 "Active" 상태인지 확인**
2. **배포 로그 확인** (에러가 있는지)
3. **환경 변수 확인** (PORT, NODE_ENV 등)
4. **`/api/health` 엔드포인트 테스트**

---

## 다음 단계

1. ✅ Railway에서 백엔드 URL 확인
2. ✅ Vercel 환경 변수에 설정 (`/api` 추가)
3. ✅ Vercel 재배포
4. ✅ 프론트엔드 URL로 접속하여 테스트

자세한 내용은 `RAILWAY_URL_GUIDE.md` 참고!

