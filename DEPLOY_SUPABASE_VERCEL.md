## Supabase + Vercel 배포 (데이터 초기화 기준)

### 1) Supabase 프로젝트 생성
- 새 프로젝트 생성 후 **DB 비밀번호** 저장
- SQL Editor에서 `backend/sql/schema.sql` 실행

### 2) 백엔드 환경 변수
백엔드 서비스에 아래 환경 변수를 설정합니다.
- `DATABASE_URL`: Supabase **Connection string (Public)**  
- `JWT_SECRET`: 임의의 보안 문자열
- `DB_SSL`: `true` (Supabase는 SSL 사용)

### 3) 프론트엔드 환경 변수
프론트 Vercel 프로젝트에 아래 환경 변수 설정:
- `VITE_API_URL`: 백엔드 API URL (`https://<backend-host>/api`)

### 4) 배포 순서
1. 백엔드 배포 (환경 변수 세팅 후)
2. 프론트 배포 (VITE_API_URL 연결)

### 5) 체크리스트
- Supabase SQL 실행 완료 여부
- 백엔드 `DATABASE_URL` 적용 여부
- 프론트 `VITE_API_URL` 적용 여부
