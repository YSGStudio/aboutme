# 주간계획 플래너 웹서비스

학생들과 함께 주간계획을 세우며 실행정도를 체크하고 체크한 데이터를 저장해서 자신의 삶을 되돌아보는 플래너 웹서비스입니다.

## 주요 기능

1. **교사 기능**
   - 이메일과 학급코드로 회원가입/로그인
   - 학생 계정 생성 (학급번호, 이름, 교실역할)
   - 학생들의 실천 상태 확인 (초록색: 완료, 하얀색: 미완료)
   - 날짜별 학생의 계획 실행 데이터 조회
   - 학생 감정 피드 확인 및 답글 작성

2. **학생 기능**
   - 학급코드와 학급번호로 로그인
   - 주간계획 설정 및 관리
   - 매일 계획 실천 여부 체크 (완료/미완료)
   - 교실역할 체크
   - 감정 공유 및 반 친구들의 감정 피드 확인
   - 실천률 게이지바 확인
   - 통계 창에서 자신의 실천 데이터 분석
     - 일자별 실천 성공률
     - 계획 항목별 완료률
     - 가장 많이 선택한 감정 TOP 5

## 기술 스택

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: JSON 파일 기반 (SimpleDB)
- **Authentication**: JWT

## 설치 및 실행

### 1. 전체 의존성 설치

```bash
npm run install:all
```

### 2. 백엔드 환경 변수 설정

`backend/.env` 파일을 생성하고 다음 내용을 추가하세요:

```
PORT=3001
JWT_SECRET=your-secret-key-change-in-production
```

### 3. 개발 서버 실행

```bash
npm run dev
```

또는 개별 실행:

```bash
# 백엔드만 실행
npm run dev:backend

# 프론트엔드만 실행
npm run dev:frontend
```

- 프론트엔드: http://localhost:3000
- 백엔드: http://localhost:3001

## 프로젝트 구조

```
planner/
├── backend/
│   ├── src/
│   │   ├── index.ts          # 서버 진입점
│   │   ├── database.ts       # 데이터베이스 관리
│   │   ├── middleware/
│   │   │   └── auth.ts       # 인증 미들웨어
│   │   └── routes/
│   │       ├── auth.ts       # 인증 라우트
│   │       ├── teacher.ts    # 교사 라우트
│   │       └── student.ts    # 학생 라우트
│   └── data/                 # JSON 데이터베이스 저장 위치
├── frontend/
│   └── src/
│       ├── pages/            # 페이지 컴포넌트
│       ├── components/       # 공통 컴포넌트
│       └── contexts/         # React Context
└── package.json
```

## 사용 방법

### 교사

1. `/teacher/login`에서 회원가입 또는 로그인
2. 대시보드에서 학생 추가 (이름, 학급번호, 교실역할)
3. 학생 카드를 클릭하여 날짜별 계획 실행 데이터 확인
4. 학생 감정 피드에서 학생들의 감정을 확인하고 답글 작성

### 학생

1. `/student/login`에서 학급코드와 학급번호로 로그인
2. 대시보드에서 주간계획 설정
3. 매일 계획 실천 여부 체크 (완료/미완료)
4. 교실역할 체크
5. 감정 공유 및 반 친구들의 감정 피드 확인
6. 통계 창에서 자신의 실천 데이터 확인

## 배포

배포 가이드는 [DEPLOY.md](./DEPLOY.md)를 참고하세요.

### 빠른 배포 요약

1. **백엔드**: Railway 또는 Render에 배포
2. **프론트엔드**: Vercel에 배포
3. 환경 변수 설정:
   - 백엔드: `PORT`, `JWT_SECRET`
   - 프론트엔드: `VITE_API_URL` (백엔드 URL)

자세한 내용은 [DEPLOY.md](./DEPLOY.md)를 확인하세요.

## 데이터베이스 스키마

- `teachers`: 교사 정보
- `students`: 학생 정보 (교실역할 포함)
- `plans`: 학생의 계획 목록
- `check_data`: 계획 실천 체크 데이터
- `role_check_data`: 교실역할 체크 데이터
- `emotion_data`: 학생 감정 공유 데이터
- `emotion_replies`: 교사 답글 데이터
