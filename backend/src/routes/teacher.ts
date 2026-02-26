import express from 'express';
import { authenticateToken, requireTeacher, AuthRequest } from '../middleware/auth.js';
import { getDatabase } from '../database.js';

const router = express.Router();
const db = getDatabase();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);
router.use(requireTeacher);

// 학생 목록 조회
router.get('/students', async (req: AuthRequest, res) => {
  try {
    const teacherId = req.userId!;
    const students = await db.getStudentsByTeacherId(teacherId);

    res.json(students.map(s => ({
      id: s.id,
      name: s.name,
      class_number: s.class_number,
      class_code: s.class_code,
      role: s.role || '',
      created_at: s.created_at
    })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 학생 생성
router.post('/students', async (req: AuthRequest, res) => {
  try {
    const teacherId = req.userId!;
    const { name, classNumber, classCode, role } = req.body;

    if (!name || !classNumber || !classCode) {
      return res.status(400).json({ error: '이름, 학급번호, 학급코드를 입력해주세요.' });
    }

    // 중복 확인
    const existing = await db.getStudentByClassCodeAndNumber(classCode, parseInt(classNumber));

    if (existing) {
      return res.status(400).json({ error: '이미 존재하는 학급번호입니다.' });
    }

    const studentId = await db.createStudent(teacherId, name, parseInt(classNumber), classCode, role);

    res.status(201).json({
      id: studentId,
      name,
      classNumber: parseInt(classNumber),
      classCode,
      role: role || ''
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 학생 수정
router.put('/students/:id', async (req: AuthRequest, res) => {
  try {
    const teacherId = req.userId!;
    const studentId = parseInt(req.params.id);
    const { name, classNumber, role } = req.body;

    // 권한 확인
    const student = await db.getStudentById(studentId);
    if (!student || student.teacher_id !== teacherId) {
      return res.status(404).json({ error: '학생을 찾을 수 없습니다.' });
    }

    await db.updateStudent(studentId, name, classNumber ? parseInt(classNumber) : undefined, role);

    const updatedStudent = await db.getStudentById(studentId);
    res.json({
      id: updatedStudent!.id,
      name: updatedStudent!.name,
      classNumber: updatedStudent!.class_number,
      classCode: updatedStudent!.class_code,
      role: updatedStudent!.role || ''
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 학생 삭제
router.delete('/students/:id', async (req: AuthRequest, res) => {
  try {
    const teacherId = req.userId!;
    const studentId = parseInt(req.params.id);

    // 권한 확인
    const student = await db.getStudentById(studentId);
    if (!student || student.teacher_id !== teacherId) {
      return res.status(404).json({ error: '학생을 찾을 수 없습니다.' });
    }

    await db.deleteStudent(studentId);

    res.json({ message: '학생이 삭제되었습니다.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 학생의 날짜별 체크 데이터 조회
router.get('/students/:id/checks', async (req: AuthRequest, res) => {
  try {
    const teacherId = req.userId!;
    const studentId = parseInt(req.params.id);
    const { date } = req.query;

    // 권한 확인
    const student = await db.getStudentById(studentId);
    if (!student || student.teacher_id !== teacherId) {
      return res.status(404).json({ error: '학생을 찾을 수 없습니다.' });
    }

    const checks = await db.getCheckData(studentId, date as string);
    const plans = await db.getPlansByStudentId(studentId);

    // 날짜별로 그룹화
    const groupedByDate: Record<string, any[]> = {};
    checks.forEach(check => {
      const plan = plans.find(p => p.id === check.plan_id);
      if (plan) {
        if (!groupedByDate[check.check_date]) {
          groupedByDate[check.check_date] = [];
        }
        groupedByDate[check.check_date].push({
          check_date: check.check_date,
          plan_id: check.plan_id,
          plan_text: plan.plan_text,
          is_checked: check.is_checked,
          display_order: plan.display_order
        });
      }
    });

    // 각 날짜별로 display_order로 정렬
    Object.keys(groupedByDate).forEach(date => {
      groupedByDate[date].sort((a, b) => a.display_order - b.display_order);
    });

    res.json(groupedByDate);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 학생의 감정 TOP 통계 조회
router.get('/students/:id/emotion-stats', async (req: AuthRequest, res) => {
  try {
    const teacherId = req.userId!;
    const studentId = parseInt(req.params.id);
    const limit = Math.max(1, parseInt((req.query.limit as string) || '3'));

    const student = await db.getStudentById(studentId);
    if (!student || student.teacher_id !== teacherId) {
      return res.status(404).json({ error: '학생을 찾을 수 없습니다.' });
    }

    const stats = (await db.getStudentEmotionStats(studentId)).slice(0, limit);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 학생의 오늘 체크 상태 확인 (대시보드용)
router.get('/students/status', async (req: AuthRequest, res) => {
  try {
    const teacherId = req.userId!;
    const today = new Date().toISOString().split('T')[0];

    const status = await db.getStudentStatus(teacherId, today);

    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 같은 반 학생들의 감정 피드 조회
router.get('/emotion/feed/:date', async (req: AuthRequest, res) => {
  try {
    const teacherId = req.userId!;
    const date = req.params.date;

    const teacher = await db.getTeacherById(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: '교사를 찾을 수 없습니다.' });
    }

    const feed = await db.getClassEmotions(teacher.class_code, date);
    
    // 각 감정에 답글 정보 추가
    const feedWithReplies = await Promise.all(feed.map(async emotion => {
      const replies = await db.getEmotionReplies(emotion.emotion_id);
      return {
        ...emotion,
        replies: replies.map(reply => ({
          id: reply.id,
          teacher_id: reply.teacher_id,
          reply_text: reply.reply_text,
          created_at: reply.created_at
        }))
      };
    }));

    res.json(feedWithReplies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 감정에 답글 작성
router.post('/emotion/reply', async (req: AuthRequest, res) => {
  try {
    const teacherId = req.userId!;
    const { emotionDataId, replyText } = req.body;

    if (!emotionDataId || !replyText) {
      return res.status(400).json({ error: '감정 ID와 답글 내용을 입력해주세요.' });
    }

    const replyId = await db.addEmotionReply(emotionDataId, teacherId, replyText);

    res.json({
      id: replyId,
      message: '답글이 작성되었습니다.'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 답글 삭제
router.delete('/emotion/reply/:id', async (req: AuthRequest, res) => {
  try {
    const teacherId = req.userId!;
    const replyId = parseInt(req.params.id);

    await db.deleteEmotionReply(replyId, teacherId);

    res.json({ message: '답글이 삭제되었습니다.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
