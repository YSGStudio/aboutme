import express from 'express';
import { authenticateToken, requireStudent, AuthRequest } from '../middleware/auth.js';
import { getDatabase } from '../database.js';

const router = express.Router();
const db = getDatabase();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticateToken);
router.use(requireStudent);

// 학생 정보 조회
router.get('/info', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const student = db.getStudentById(studentId);

    if (!student) {
      return res.status(404).json({ error: '학생을 찾을 수 없습니다.' });
    }

    res.json({
      id: student.id,
      name: student.name,
      classNumber: student.class_number,
      classCode: student.class_code,
      role: student.role || ''
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 오늘의 교실역할 체크 조회
router.get('/role/check/today', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const today = new Date().toISOString().split('T')[0];
    const student = db.getStudentById(studentId);
    const roleCheck = db.getRoleCheck(studentId, today);

    res.json({
      role: student?.role || '',
      is_checked: roleCheck ? roleCheck.is_checked : 0
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 교실역할 체크 상태 변경
router.post('/role/check', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const { date, isChecked } = req.body;

    if (!date) {
      return res.status(400).json({ error: '날짜를 입력해주세요.' });
    }

    db.upsertRoleCheck(studentId, date, isChecked ? 1 : 0);

    res.json({ message: '교실역할 체크 상태가 업데이트되었습니다.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 오늘의 감정 데이터 조회
router.get('/emotion/today', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const today = new Date().toISOString().split('T')[0];
    const emotionData = db.getEmotionData(studentId, today);

    res.json({
      emotion: emotionData?.emotion || '',
      reason: emotionData?.reason || ''
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 감정 데이터 저장
router.post('/emotion', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const { date, emotion, reason } = req.body;

    if (!date || !emotion) {
      return res.status(400).json({ error: '날짜와 감정을 입력해주세요.' });
    }

    db.upsertEmotionData(studentId, date, emotion, reason || '');

    res.json({ message: '감정이 저장되었습니다.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 같은 반 학생들의 감정 피드 조회
router.get('/emotion/feed/:date', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const date = req.params.date;
    
    const student = db.getStudentById(studentId);
    if (!student) {
      return res.status(404).json({ error: '학생을 찾을 수 없습니다.' });
    }

    const feed = db.getClassEmotions(student.class_code, date);
    
    // 각 감정에 답글 정보 추가
    const feedWithReplies = feed.map(emotion => {
      const replies = db.getEmotionReplies(emotion.emotion_id);
      return {
        ...emotion,
        replies: replies.map(reply => ({
          id: reply.id,
          teacher_id: reply.teacher_id,
          reply_text: reply.reply_text,
          created_at: reply.created_at
        }))
      };
    });

    res.json(feedWithReplies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 계획 목록 조회
router.get('/plans', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const plans = db.getPlansByStudentId(studentId);

    res.json(plans.map(p => ({
      id: p.id,
      plan_text: p.plan_text,
      display_order: p.display_order
    })));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 계획 추가
router.post('/plans', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const { planText } = req.body;

    if (!planText) {
      return res.status(400).json({ error: '계획 내용을 입력해주세요.' });
    }

    // 다음 display_order 찾기
    const maxOrder = db.getMaxDisplayOrder(studentId);
    const nextOrder = maxOrder + 1;

    const planId = db.createPlan(studentId, planText, nextOrder);

    res.status(201).json({
      id: planId,
      planText,
      displayOrder: nextOrder
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 계획 수정
router.put('/plans/:id', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const planId = parseInt(req.params.id);
    const { planText } = req.body;

    if (!planText) {
      return res.status(400).json({ error: '계획 내용을 입력해주세요.' });
    }

    // 권한 확인
    const plan = db.getPlanById(planId);
    if (!plan || plan.student_id !== studentId) {
      return res.status(404).json({ error: '계획을 찾을 수 없습니다.' });
    }

    db.updatePlan(planId, planText);

    res.json({ message: '계획이 수정되었습니다.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 계획 삭제
router.delete('/plans/:id', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const planId = parseInt(req.params.id);

    // 권한 확인
    const plan = db.getPlanById(planId);
    if (!plan || plan.student_id !== studentId) {
      return res.status(404).json({ error: '계획을 찾을 수 없습니다.' });
    }

    db.deletePlan(planId);

    res.json({ message: '계획이 삭제되었습니다.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 계획 순서 변경
router.put('/plans/:id/order', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const planId = parseInt(req.params.id);
    const { displayOrder } = req.body;

    // 권한 확인
    const plan = db.getPlanById(planId);
    if (!plan || plan.student_id !== studentId) {
      return res.status(404).json({ error: '계획을 찾을 수 없습니다.' });
    }

    db.updatePlanOrder(planId, displayOrder);

    res.json({ message: '순서가 변경되었습니다.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 오늘의 체크 데이터 조회
router.get('/checks/today', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const today = new Date().toISOString().split('T')[0];

    const checks = db.getTodayChecks(studentId, today);

    res.json(checks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 체크 상태 변경
router.post('/checks', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const { planId, date, isChecked } = req.body;

    if (!planId || !date) {
      return res.status(400).json({ error: '계획 ID와 날짜를 입력해주세요.' });
    }

    // 권한 확인
    const plan = db.getPlanById(planId);
    if (!plan || plan.student_id !== studentId) {
      return res.status(404).json({ error: '계획을 찾을 수 없습니다.' });
    }

    db.upsertCheck(studentId, planId, date, isChecked ? 1 : 0);

    res.json({ message: '체크 상태가 업데이트되었습니다.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 통계 데이터 조회
router.get('/stats', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;

    const dailyStats = db.getDailyStats(studentId);
    const planStats = db.getPlanStats(studentId);
    const emotionStats = db.getStudentEmotionStats(studentId);

    res.json({
      dailyStats,
      planStats,
      emotionStats
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 날짜의 통계 데이터 조회
router.get('/stats/date/:date', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const date = req.params.date;

    const checks = db.getCheckData(studentId, date);
    const plans = db.getPlansByStudentId(studentId);
    
    const planChecks = plans.map(plan => {
      const check = checks.find(c => c.plan_id === plan.id);
      return {
        plan_id: plan.id,
        plan_text: plan.plan_text,
        is_checked: check ? check.is_checked : 0,
        display_order: plan.display_order
      };
    });

    const totalPlans = plans.length;
    const checkedPlans = planChecks.filter(pc => pc.is_checked === 1).length;
    const successRate = totalPlans > 0 ? Math.round((checkedPlans / totalPlans) * 100 * 100) / 100 : 0;

    res.json({
      date,
      total_plans: totalPlans,
      checked_plans: checkedPlans,
      success_rate: successRate,
      plan_checks: planChecks.sort((a, b) => a.display_order - b.display_order)
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 날짜의 미완료 계획 조회
router.get('/stats/unchecked/:date', (req: AuthRequest, res) => {
  try {
    const studentId = req.userId!;
    const date = req.params.date;

    const uncheckedPlans = db.getUncheckedPlansByDate(studentId, date);

    res.json(uncheckedPlans);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
