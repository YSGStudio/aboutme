import express from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../database.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();
const db = getDatabase();

// 교사 로그인
router.post('/teacher/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    }

    const teacher = db.getTeacherByEmail(email);

    if (!teacher) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const isValidPassword = await bcrypt.compare(password, teacher.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    const token = generateToken(teacher.id, 'teacher');

    res.json({
      token,
      user: {
        id: teacher.id,
        email: teacher.email,
        classCode: teacher.class_code,
        type: 'teacher'
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 교사 회원가입
router.post('/teacher/register', async (req, res) => {
  try {
    const { email, password, classCode } = req.body;

    if (!email || !password || !classCode) {
      return res.status(400).json({ error: '이메일, 비밀번호, 학급코드를 입력해주세요.' });
    }

    // 이미 존재하는 이메일인지 확인
    const existing = db.getTeacherByEmail(email);
    if (existing) {
      return res.status(400).json({ error: '이미 등록된 이메일입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacherId = db.createTeacher(email, hashedPassword, classCode);

    const token = generateToken(teacherId, 'teacher');

    res.status(201).json({
      token,
      user: {
        id: teacherId,
        email,
        classCode,
        type: 'teacher'
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 학생 로그인
router.post('/student/login', (req, res) => {
  try {
    const { classCode, classNumber } = req.body;

    if (!classCode || !classNumber) {
      return res.status(400).json({ error: '학급코드와 학급번호를 입력해주세요.' });
    }

    const student = db.getStudentByClassCodeAndNumber(classCode, parseInt(classNumber));

    if (!student) {
      return res.status(401).json({ error: '학급코드 또는 학급번호가 올바르지 않습니다.' });
    }

    const token = generateToken(student.id, 'student');

    res.json({
      token,
      user: {
        id: student.id,
        name: student.name,
        classCode: student.class_code,
        classNumber: student.class_number,
        type: 'student'
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
