# GitHub에 코드 올리기 - 간단한 방법

## 방법 1: GitHub Desktop 사용 (가장 쉬움) ⭐ 추천

### 1. GitHub Desktop 설치
- https://desktop.github.com 접속
- 다운로드 및 설치

### 2. GitHub Desktop으로 저장소 추가
1. GitHub Desktop 실행
2. "File" → "Add Local Repository" 클릭
3. `/Users/yangseung-geun/planner` 폴더 선택
4. "Add repository" 클릭

### 3. GitHub에 연결
1. GitHub Desktop에서 "Publish repository" 클릭
2. Repository name: `aboutme`
3. "Keep this code private" 체크 (원하는 경우)
4. "Publish repository" 클릭
5. GitHub 로그인 (브라우저에서 자동 인증)

### 4. 완료!
- 코드가 자동으로 GitHub에 올라갑니다!

---

## 방법 2: SSH 키 사용 (터미널, 토큰 불필요)

### 1. SSH 키 확인
터미널에서 실행:
```bash
ls -al ~/.ssh
```

### 2. SSH 키가 없으면 생성
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Enter 키 3번 누르기 (기본 설정 사용)
```

### 3. SSH 키를 GitHub에 추가
```bash
# 공개 키 복사
cat ~/.ssh/id_ed25519.pub
# 출력된 내용 전체 복사
```

1. GitHub → Settings → SSH and GPG keys
2. "New SSH key" 클릭
3. Title: `Mac` (원하는 이름)
4. Key: 위에서 복사한 내용 붙여넣기
5. "Add SSH key" 클릭

### 4. Git 명령어 실행 (SSH 사용)
```bash
cd /Users/yangseung-geun/planner
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:your-username/aboutme.git
git push -u origin main
```

**중요**: `your-username`을 본인의 GitHub 사용자명으로 변경!

---

## 방법 3: Personal Access Token (단계별 상세 가이드)

### 1단계: GitHub 웹사이트 접속
- https://github.com 로그인

### 2단계: Settings로 이동
- 우측 상단 프로필 사진 클릭
- "Settings" 클릭

### 3단계: Developer settings 찾기
- 왼쪽 메뉴 맨 아래 "Developer settings" 클릭
- (스크롤해서 찾기)

### 4단계: Personal access tokens
- "Personal access tokens" 클릭
- "Tokens (classic)" 클릭

### 5단계: 새 토큰 생성
- "Generate new token" 클릭
- "Generate new token (classic)" 클릭

### 6단계: 토큰 설정
- **Note**: `planner-deploy` (원하는 이름)
- **Expiration**: `90 days` 또는 원하는 기간
- **Select scopes**: `repo` 체크박스 클릭
  - (repo 아래 모든 항목이 자동으로 체크됨)

### 7단계: 토큰 생성
- 맨 아래 "Generate token" 클릭
- **중요**: 생성된 토큰을 복사! (다시 볼 수 없음)
- 예: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 8단계: Git 명령어 실행
```bash
cd /Users/yangseung-geun/planner
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/aboutme.git
git push -u origin main
```

### 9단계: 인증
- Username: GitHub 사용자명 입력
- Password: 위에서 복사한 토큰 붙여넣기 (비밀번호 아님!)

---

## 추천 순서

1. **GitHub Desktop** - 가장 쉬움, 클릭만 하면 됨
2. **SSH 키** - 한 번 설정하면 계속 사용 가능
3. **Personal Access Token** - 위 방법이 안 될 때

---

## 문제 해결

### GitHub Desktop이 저장소를 찾지 못함
- "Add Local Repository" 대신 "Clone repository" 사용
- GitHub에서 먼저 빈 저장소 생성 후 클론

### SSH 키가 작동하지 않음
```bash
# SSH 연결 테스트
ssh -T git@github.com
# "Hi username! You've successfully authenticated" 메시지가 나오면 성공
```

### 토큰이 작동하지 않음
- 토큰이 만료되지 않았는지 확인
- `repo` 권한이 있는지 확인
- 토큰을 다시 생성해보기

---

가장 쉬운 방법은 **GitHub Desktop**입니다! 설치 후 몇 번 클릭하면 끝!

