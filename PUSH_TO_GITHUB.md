# GitHub 저장소에 코드 올리기

저장소 이름: `aboutme`

## 터미널에서 실행할 명령어

프로젝트 폴더(`/Users/yangseung-geun/planner`)에서 다음 명령어를 순서대로 실행하세요:

```bash
# 1. Git 저장소 초기화
git init

# 2. 모든 파일 추가
git add .

# 3. 첫 커밋 생성
git commit -m "Initial commit: Planner web service"

# 4. 메인 브랜치로 이름 변경
git branch -M main

# 5. GitHub 저장소 연결 (your-username을 본인의 GitHub 사용자명으로 변경)
git remote add origin https://github.com/your-username/aboutme.git

# 또는 SSH를 사용하는 경우:
# git remote add origin git@github.com:your-username/aboutme.git

# 6. GitHub에 푸시
git push -u origin main
```

## 중요 사항

### GitHub 인증
- HTTPS 사용 시: Personal Access Token 필요
- SSH 사용 시: SSH 키 설정 필요

### Personal Access Token 생성 방법
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. "Generate new token (classic)" 클릭
4. 권한: `repo` 체크
5. 생성 후 토큰 복사 (비밀번호 대신 사용)

### 저장소 URL 확인
- GitHub 저장소 페이지에서 "Code" 버튼 클릭
- HTTPS 또는 SSH URL 복사
- 위의 `git remote add origin` 명령어에 사용

## 문제 해결

### "remote origin already exists" 에러
```bash
git remote remove origin
git remote add origin https://github.com/your-username/aboutme.git
```

### 푸시 실패
- GitHub 인증 확인
- 저장소 URL이 올바른지 확인
- 저장소가 Private인 경우 권한 확인

## 다음 단계

코드가 GitHub에 올라갔다면:
1. Railway에서 `aboutme` 저장소 선택하여 백엔드 배포
2. Vercel에서 `aboutme` 저장소 선택하여 프론트엔드 배포

