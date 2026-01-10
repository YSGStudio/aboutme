# GitHub 저장소 설정 가이드

Railway와 Vercel에 배포하려면 먼저 GitHub에 코드를 올려야 합니다.

---

## 1단계: GitHub 저장소 생성

### 방법 1: GitHub 웹사이트에서 생성

1. **GitHub 접속**
   - https://github.com 접속
   - 로그인

2. **새 저장소 생성**
   - 우측 상단 "+" 아이콘 클릭
   - "New repository" 선택

3. **저장소 설정**
   - **Repository name**: `planner` (원하는 이름)
   - **Description**: "주간계획 플래너 웹서비스" (선택사항)
   - **Visibility**: 
     - Public (무료, 누구나 볼 수 있음)
     - Private (유료 플랜 필요, 본인만 볼 수 있음)
   - **Initialize this repository with**: 체크하지 않기
     - (README, .gitignore, license 체크 해제)
   - "Create repository" 클릭

4. **저장소 URL 확인**
   - 생성된 페이지에서 저장소 URL 확인
   - 예: `https://github.com/your-username/planner`

---

## 2단계: 로컬 프로젝트를 Git 저장소로 초기화

터미널에서 프로젝트 폴더로 이동 후 다음 명령어 실행:

```bash
# 프로젝트 폴더로 이동
cd /Users/yangseung-geun/planner

# Git 저장소 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Planner web service"

# GitHub 저장소 연결 (위에서 만든 저장소 URL 사용)
git remote add origin https://github.com/your-username/planner.git

# 또는 SSH 사용하는 경우
# git remote add origin git@github.com:your-username/planner.git

# 메인 브랜치로 이름 변경 (필요시)
git branch -M main

# GitHub에 푸시
git push -u origin main
```

---

## 3단계: GitHub 인증

### HTTPS 사용 시
- GitHub에 푸시할 때 사용자 이름과 비밀번호(또는 Personal Access Token) 입력 필요
- Personal Access Token 생성 방법:
  1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  2. "Generate new token" 클릭
  3. 권한 선택: `repo` 체크
  4. 생성 후 토큰 복사 (다시 볼 수 없으니 저장!)
  5. 비밀번호 대신 이 토큰 사용

### SSH 사용 시
- SSH 키 설정 필요 (더 안전하고 편리함)
- 설정 방법은 GitHub 문서 참고

---

## 4단계: 확인

1. **GitHub 저장소 페이지 새로고침**
   - 모든 파일이 업로드되었는지 확인

2. **Railway/Vercel에서 저장소 선택**
   - 이제 배포 시 이 저장소를 선택하면 됩니다!

---

## 빠른 명령어 모음

```bash
# 1. Git 초기화
git init

# 2. 파일 추가
git add .

# 3. 커밋
git commit -m "Initial commit"

# 4. 원격 저장소 연결 (URL은 본인의 것으로 변경)
git remote add origin https://github.com/your-username/planner.git

# 5. 푸시
git push -u origin main
```

---

## 문제 해결

### "fatal: not a git repository" 에러
- 프로젝트 폴더에서 `git init` 실행했는지 확인

### "remote origin already exists" 에러
- 기존 원격 저장소 제거: `git remote remove origin`
- 다시 추가: `git remote add origin [URL]`

### 푸시 실패
- GitHub 인증 확인
- Personal Access Token 사용 확인
- 저장소 URL이 올바른지 확인

---

## 다음 단계

GitHub에 코드가 올라갔다면:
1. Railway에서 이 저장소 선택하여 백엔드 배포
2. Vercel에서 이 저장소 선택하여 프론트엔드 배포

자세한 배포 방법은 `DEPLOY_RAILWAY_VERCEL.md` 참고!

