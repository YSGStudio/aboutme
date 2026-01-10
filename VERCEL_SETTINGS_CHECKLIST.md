# Vercel 설정 체크리스트

빌드가 실패하는 경우 다음을 확인하세요.

## 필수 확인 사항

### 1. Root Directory
- Settings → General → Root Directory
- 값: `frontend` ✅

### 2. Framework Preset
- Settings → General → Framework Preset
- 값: `Vite` 선택 ✅
- (이렇게 하면 자동으로 빌드 명령이 설정됨)

### 3. Build & Development Settings
Settings → General → Build & Development Settings에서:

#### Build Command
- `npm run build` (자동 감지됨)
- 또는 수동으로: `npm install && npm run build`

#### Output Directory
- `dist` (자동 감지됨)

#### Install Command
- `npm install` (자동 감지됨)
- 또는 비워두기 (자동)

### 4. 환경 변수
- Settings → Environment Variables
- `VITE_API_URL` = `https://your-railway-backend.railway.app/api`

---

## 문제 해결

### vite를 찾을 수 없는 경우

**방법 1: Framework Preset 확인**
1. Settings → General
2. Framework Preset을 `Vite`로 변경
3. "Save" 클릭
4. "Redeploy" 클릭

**방법 2: Build Command 수정**
1. Settings → General → Build & Development Settings
2. "Override" 클릭
3. Build Command: `npm install && npm run build`
4. "Save" 클릭
5. "Redeploy" 클릭

**방법 3: package.json 확인**
- `vite`가 `devDependencies`에 있는지 확인
- Vercel은 빌드 시 devDependencies를 자동으로 설치함

---

## 권장 설정

### Vercel UI에서 설정 (가장 확실함)

1. **프로젝트 → Settings → General**
2. **Root Directory**: `frontend`
3. **Framework Preset**: `Vite` 선택
4. **Build Command**: (자동 감지되면 그대로 사용)
5. **Output Directory**: `dist` (자동 감지)
6. **Install Command**: (비워두거나 `npm install`)

### 환경 변수
- Settings → Environment Variables
- `VITE_API_URL` = `https://your-backend-url.railway.app/api`

---

## 빠른 해결 방법

1. Vercel 프로젝트 → Settings → General
2. Framework Preset을 `Vite`로 설정
3. Root Directory를 `frontend`로 설정
4. "Save" 클릭
5. "Deployments" → 최신 배포 → "Redeploy"

이렇게 하면 Vercel이 자동으로 올바른 빌드 명령을 사용합니다!

