# 배포 방법 대안

여러 배포 옵션을 제공합니다. 프로젝트에 맞는 방법을 선택하세요.

---

## 방법 1: Render에서 모두 배포 (가장 간단) ⭐ 추천

**장점**: 하나의 플랫폼에서 프론트엔드와 백엔드 모두 관리, 무료 티어 제공

### Render 배포 방법

1. **Render 계정 생성**
   - https://render.com 접속
   - GitHub 계정으로 로그인

2. **백엔드 배포**
   - "New" → "Web Service" 선택
   - GitHub 저장소 선택
   - 설정:
     - Name: `planner-backend`
     - Root Directory: `backend`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
     - Environment: `Node`
   - 환경 변수:
     ```
     PORT=3001
     NODE_ENV=production
     JWT_SECRET=your-secret-key
     ```
   - 배포 완료 후 URL 확인 (예: `https://planner-backend.onrender.com`)

3. **프론트엔드 배포**
   - "New" → "Static Site" 선택
   - GitHub 저장소 선택
   - 설정:
     - Name: `planner-frontend`
     - Root Directory: `frontend`
     - Build Command: `npm install && npm run build`
     - Publish Directory: `dist`
   - 환경 변수:
     ```
     VITE_API_URL=https://planner-backend.onrender.com/api
     ```

**참고**: Render 무료 티어는 15분 비활성 시 슬리프 모드로 전환됩니다.

---

## 방법 2: Netlify + Netlify Functions

**장점**: Netlify는 프론트엔드 배포에 최적화, Functions로 백엔드도 가능

### Netlify 배포 방법

1. **Netlify 계정 생성**
   - https://netlify.com 접속
   - GitHub 계정으로 로그인

2. **프론트엔드 배포**
   - "Add new site" → "Import an existing project"
   - GitHub 저장소 선택
   - 설정:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `dist`
   - 환경 변수:
     ```
     VITE_API_URL=https://your-backend-url/api
     ```

3. **백엔드 배포**
   - Render 또는 Railway 사용 (위 방법 1 참고)
   - 또는 Netlify Functions로 마이그레이션 (추가 작업 필요)

---

## 방법 3: Fly.io (무료 티어)

**장점**: 전 세계 CDN, 빠른 배포, 무료 티어 제공

### Fly.io 배포 방법

1. **Fly.io 계정 생성**
   - https://fly.io 접속
   - GitHub 계정으로 로그인

2. **Fly CLI 설치**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

3. **백엔드 배포**
   ```bash
   cd backend
   fly launch
   # 설정 선택 후 배포
   ```

4. **프론트엔드 배포**
   - Vercel 또는 Netlify 사용

---

## 방법 4: 단일 Express 서버로 통합 배포

**장점**: 하나의 서버에서 모든 것을 관리, 설정 간단

프론트엔드를 Express에서 정적 파일로 서빙하는 방법입니다.

### 설정 방법

1. **백엔드에 정적 파일 서빙 추가**

`backend/src/index.ts`에 추가:
```typescript
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 정적 파일 서빙 (프로덕션 환경)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  
  // 모든 라우트를 React 앱으로 리다이렉트
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}
```

2. **빌드 스크립트 추가**

`package.json`에 추가:
```json
{
  "scripts": {
    "build": "cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build",
    "start": "cd backend && npm start"
  }
}
```

3. **배포**
   - Render, Railway, Fly.io 등 어느 플랫폼이든 사용 가능
   - Root Directory를 프로젝트 루트로 설정
   - Build Command: `npm run build`
   - Start Command: `npm start`

---

## 방법 5: Docker를 사용한 배포

**장점**: 환경 독립성, 어디서든 동일하게 실행

### Docker 설정

1. **Dockerfile 생성** (프로젝트 루트)

```dockerfile
# 멀티 스테이지 빌드
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY backend/src/index.ts ./backend/src/

WORKDIR /app/backend
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

2. **docker-compose.yml** (선택사항)

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - NODE_ENV=production
      - JWT_SECRET=your-secret-key
```

3. **배포**
   - Railway, Render, Fly.io 등 Docker 지원 플랫폼 사용
   - 또는 자체 서버에 Docker로 배포

---

## 방법 6: GitHub Pages + 별도 백엔드

**장점**: 프론트엔드 무료 호스팅, 설정 간단

### GitHub Pages 배포

1. **프론트엔드 빌드 설정**

`frontend/vite.config.ts`에 추가:
```typescript
export default defineConfig({
  base: '/planner/', // 저장소 이름
  // ... 나머지 설정
});
```

2. **GitHub Actions 설정**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd frontend && npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

3. **백엔드**
   - Render, Railway 등 별도 배포

---

## 비교표

| 방법 | 난이도 | 비용 | 추천도 | 특징 |
|------|--------|------|--------|------|
| Render 통합 | ⭐ 쉬움 | 무료 | ⭐⭐⭐⭐⭐ | 하나의 플랫폼, 간단 |
| Vercel + Railway | ⭐⭐ 보통 | 무료 | ⭐⭐⭐⭐ | 각각 최적화된 플랫폼 |
| 단일 Express | ⭐⭐ 보통 | 무료 | ⭐⭐⭐ | 하나의 서버로 통합 |
| Docker | ⭐⭐⭐ 어려움 | 무료 | ⭐⭐⭐ | 환경 독립성 |
| GitHub Pages | ⭐⭐ 보통 | 무료 | ⭐⭐ | 프론트엔드만 |

---

## 추천 순서

1. **Render 통합 배포** - 가장 간단하고 빠름
2. **단일 Express 서버** - 하나의 서버로 관리하고 싶을 때
3. **Vercel + Railway** - 각 플랫폼의 최적 기능 활용

---

## 다음 단계

선택한 방법에 따라 해당 섹션을 따라 진행하세요. 추가 도움이 필요하면 알려주세요!

