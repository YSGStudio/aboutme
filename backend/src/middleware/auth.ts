import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
    }
    req.userId = decoded.userId;
    req.userType = decoded.userType;
    next();
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

