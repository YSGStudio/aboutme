# Personal Access Token 생성 가이드

GitHub에 코드를 올릴 때 사용하는 토큰을 만드는 방법입니다.

---

## 📋 단계별 가이드

### 1단계: GitHub 로그인
- https://github.com 접속
- 계정으로 로그인

### 2단계: Settings로 이동
1. **우측 상단 프로필 사진 클릭**
   - 화면 오른쪽 위 모서리에 있는 작은 원형 아이콘
2. **"Settings" 클릭**
   - 드롭다운 메뉴에서 가장 아래쪽에 있음

### 3단계: Developer settings 찾기
1. **왼쪽 사이드바 스크롤**
   - Settings 페이지 왼쪽에 메뉴가 있음
2. **맨 아래로 스크롤**
   - "Developer settings"가 맨 아래에 있음
3. **"Developer settings" 클릭**

### 4단계: Personal access tokens로 이동
1. **"Personal access tokens" 클릭**
   - Developer settings 페이지에서 왼쪽 메뉴에 있음
2. **"Tokens (classic)" 클릭**
   - 두 가지 옵션이 있음:
     - Fine-grained tokens (새로운 방식)
     - Tokens (classic) ← **이것 선택**

### 5단계: 새 토큰 생성
1. **"Generate new token" 클릭**
   - 오른쪽 상단에 있는 버튼
2. **"Generate new token (classic)" 클릭**
   - 드롭다운 메뉴에서 선택

### 6단계: 토큰 설정 입력
1. **Note (이름) 입력**
   - 예: `planner-deploy` 또는 `aboutme-project`
   - 나중에 무엇을 위한 토큰인지 알 수 있도록 의미있는 이름

2. **Expiration (만료 기간) 선택**
   - 드롭다운에서 선택:
     - `No expiration` (만료 없음) - 편리하지만 보안상 권장하지 않음
     - `90 days` (90일) - 추천
     - `30 days` (30일)
     - `Custom` (사용자 지정)

3. **Select scopes (권한 선택)**
   - 체크박스 목록이 있음
   - **`repo` 체크박스 클릭**
     - 이렇게 하면 repo 아래의 모든 하위 항목이 자동으로 체크됨:
       - repo:status
       - repo_deployment
       - public_repo
       - repo:invite
       - security_events
   - **중요**: `repo`만 체크하면 충분합니다!

### 7단계: 토큰 생성
1. **맨 아래로 스크롤**
2. **"Generate token" 버튼 클릭** (초록색 버튼)
3. **GitHub 비밀번호 입력** (보안 확인)

### 8단계: 토큰 복사 (매우 중요!)
1. **토큰이 생성되면 페이지에 표시됨**
   - 예: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **이 페이지를 떠나면 다시 볼 수 없습니다!**
2. **토큰 전체를 복사**
   - 마우스로 드래그하여 선택
   - Cmd+C (Mac) 또는 Ctrl+C (Windows)로 복사
   - 또는 복사 버튼 클릭
3. **안전한 곳에 저장**
   - 메모장, 노트 앱 등에 임시로 저장
   - 나중에 사용할 수 있도록

---

## ⚠️ 중요 사항

### 토큰은 비밀번호처럼 다뤄야 합니다
- ✅ 안전한 곳에 저장
- ❌ GitHub에 커밋하지 않기
- ❌ 다른 사람과 공유하지 않기
- ❌ 공개된 곳에 올리지 않기

### 토큰 사용 방법
터미널에서 `git push` 할 때:
- **Username**: GitHub 사용자명 입력
- **Password**: 비밀번호가 아니라 **위에서 복사한 토큰** 붙여넣기

---

## 🔍 찾기 어려운 경우

### Settings를 찾을 수 없어요
- 우측 상단 프로필 사진 클릭
- 또는 직접 https://github.com/settings 접속

### Developer settings가 안 보여요
- Settings 페이지 왼쪽 사이드바 맨 아래로 스크롤
- 또는 직접 https://github.com/settings/developers 접속

### Personal access tokens가 안 보여요
- Developer settings 페이지 왼쪽 메뉴 확인
- 또는 직접 https://github.com/settings/tokens 접속

---

## 📝 요약

1. GitHub → 프로필 사진 → Settings
2. 왼쪽 맨 아래 → Developer settings
3. Personal access tokens → Tokens (classic)
4. Generate new token → Generate new token (classic)
5. Note 입력, Expiration 선택, **repo 체크**
6. Generate token 클릭
7. **토큰 복사해서 저장** (중요!)

---

## 다음 단계

토큰을 받았다면:
1. 터미널에서 `git push` 실행
2. Username: GitHub 사용자명 입력
3. Password: 복사한 토큰 붙여넣기

자세한 Git 명령어는 `PUSH_TO_GITHUB.md` 참고!

