import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database.js';
import authRoutes from './routes/auth.js';
import teacherRoutes from './routes/teacher.js';
import studentRoutes from './routes/student.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 설정 - 프로덕션에서는 모든 도메인 허용 (필요시 특정 도메인만 허용 가능)
app.use(cors({
  origin: true, // 모든 origin 허용
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 데이터베이스 초기화
initDatabase();

// API 라우트 설정
app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 프로덕션 환경에서 프론트엔드 정적 파일 서빙
if (process.env.NODE_ENV === 'production') {
  const frontendDistPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDistPath));
  
  // API가 아닌 모든 요청을 React 앱으로 리다이렉트
  app.get('*', (req, res) => {
    // API 요청은 제외
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  if (process.env.NODE_ENV === 'production') {
    console.log('프로덕션 모드: 프론트엔드 정적 파일 서빙 활성화');
  }
});

