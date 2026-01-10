# Vercel 빌드 문제 해결 가이드

## 현재 문제
- `vite` 패키지를 찾을 수 없음
- `vite.config.ts`를 로드할 수 없음

## 해결 방법

### Vercel 프로젝트 설정에서 확인할 사항

1. **Root Directory 확인**
   - Settings → General → Root Directory
   - 값: `frontend` (확인!)

2. **Build & Development Settings**
   - Framework Preset: `Vite` 선택
   - Build Command: `npm run build` (자동 감지)
   - Output Directory: `dist` (자동 감지)
   - Install Command: `npm install` (자동 감지)

3. **환경 변수**
   - `NODE_ENV`를 설정하지 않기 (Vercel이 자동으로 설정)
   - 또는 `NODE_ENV=development`로 설정 (devDependencies 설치)

### 대안: Vercel UI에서 직접 설정

Vercel 대시보드에서:
1. 프로젝트 → Settings → General
2. "Override" 버튼 클릭
3. 다음 설정:
   - Build Command: `npm install && npm run build`
   - Install Command: `npm install`
   - Output Directory: `dist`

### 또는 package.json 수정

`frontend/package.json`에 `postinstall` 스크립트 추가:

```json
{
  "scripts": {
    "postinstall": "echo 'Dependencies installed'",
    "build": "npx vite build"
  }
}
```

