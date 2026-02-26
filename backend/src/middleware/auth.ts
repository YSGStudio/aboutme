import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
const db = getDatabase();

export interface AuthRequest extends Request {
  userId?: number;
  userType?: 'teacher' | 'student';
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
  }

  const verifySecret = SUPABASE_JWT_SECRET || JWT_SECRET;

  jwt.verify(token, verifySecret, async (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
    }

    if (decoded.userId && decoded.userType) {
      req.userId = decoded.userId;
      req.userType = decoded.userType;
      return next();
    }

    const authUserId = decoded.sub;
    const userType = decoded.user_metadata?.type || decoded.app_metadata?.type;
    if (!authUserId || !userType) {
      return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
    }

    try {
      if (userType === 'teacher') {
        const teacher = await db.getTeacherByAuthId(authUserId);
        if (!teacher) return res.status(403).json({ error: '교사를 찾을 수 없습니다.' });
        req.userId = teacher.id;
        req.userType = 'teacher';
      } else if (userType === 'student') {
        const student = await db.getStudentByAuthId(authUserId);
        if (!student) return res.status(403).json({ error: '학생을 찾을 수 없습니다.' });
        req.userId = student.id;
        req.userType = 'student';
      } else {
        return res.status(403).json({ error: '유효하지 않은 사용자 유형입니다.' });
      }
      return next();
    } catch (lookupError: any) {
      return res.status(500).json({ error: lookupError.message });
    }
  });
}

export function requireTeacher(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userType !== 'teacher') {
    return res.status(403).json({ error: '교사 권한이 필요합니다.' });
  }
  next();
}

export function requireStudent(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userType !== 'student') {
    return res.status(403).json({ error: '학생 권한이 필요합니다.' });
  }
  next();
}

export function generateToken(userId: number, userType: 'teacher' | 'student') {
  return jwt.sign({ userId, userType }, JWT_SECRET, { expiresIn: '7d' });
}

