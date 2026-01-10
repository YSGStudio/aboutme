import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 배포 환경에서는 환경 변수로 데이터 디렉토리 설정 가능
const dataDir = process.env.DATA_DIR || path.join(__dirname, '../data');
const dbFile = path.join(dataDir, 'planner.json');

interface Database {
  teachers: Teacher[];
  students: Student[];
  plans: Plan[];
  checkData: CheckData[];
  roleCheckData: RoleCheckData[];
  emotionData: EmotionData[];
  emotionReplies: EmotionReply[];
}

interface Teacher {
  id: number;
  email: string;
  password: string;
  class_code: string;
  created_at: string;
}

interface Student {
  id: number;
  teacher_id: number;
  class_number: number;
  name: string;
  class_code: string;
  role?: string;
  created_at: string;
}

interface Plan {
  id: number;
  student_id: number;
  plan_text: string;
  display_order: number;
  created_at: string;
}

interface CheckData {
  id: number;
  student_id: number;
  plan_id: number;
  check_date: string;
  is_checked: number;
  created_at: string;
}

interface RoleCheckData {
  id: number;
  student_id: number;
  check_date: string;
  is_checked: number;
  created_at: string;
}

interface EmotionData {
  id: number;
  student_id: number;
  check_date: string;
  emotion: string;
  reason: string;
  created_at: string;
}

interface EmotionReply {
  id: number;
  emotion_data_id: number;
  teacher_id: number;
  reply_text: string;
  created_at: string;
}

let db: Database = {
  teachers: [],
  students: [],
  plans: [],
  checkData: [],
  roleCheckData: [],
  emotionData: [],
  emotionReplies: []
};

function loadDatabase() {
  if (fs.existsSync(dbFile)) {
    const data = fs.readFileSync(dbFile, 'utf-8');
    db = JSON.parse(data);
  }
}

function saveDatabase() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(dbFile, JSON.stringify(db, null, 2));
}

// 데이터베이스 초기화
loadDatabase();

// 간단한 데이터베이스 인터페이스
export class SimpleDB {
  private static instance: SimpleDB;
  private teachers: Teacher[] = [];
  private students: Student[] = [];
  private plans: Plan[] = [];
  private checkData: CheckData[] = [];
  private roleCheckData: RoleCheckData[] = [];
  private emotionData: EmotionData[] = [];
  private emotionReplies: EmotionReply[] = [];
  private teacherIdCounter = 1;
  private studentIdCounter = 1;
  private planIdCounter = 1;
  private checkDataIdCounter = 1;
  private roleCheckDataIdCounter = 1;
  private emotionDataIdCounter = 1;
  private emotionReplyIdCounter = 1;

  private constructor() {
    this.load();
  }

  static getInstance(): SimpleDB {
    if (!SimpleDB.instance) {
      SimpleDB.instance = new SimpleDB();
    }
    return SimpleDB.instance;
  }

  private load() {
    if (fs.existsSync(dbFile)) {
      const data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
      this.teachers = data.teachers || [];
      this.students = data.students || [];
      this.plans = data.plans || [];
      this.checkData = data.checkData || [];
      this.roleCheckData = data.roleCheckData || [];
      this.emotionData = data.emotionData || [];
      this.emotionReplies = data.emotionReplies || [];
      
      // ID 카운터 설정
      if (this.teachers.length > 0) {
        this.teacherIdCounter = Math.max(...this.teachers.map(t => t.id)) + 1;
      }
      if (this.students.length > 0) {
        this.studentIdCounter = Math.max(...this.students.map(s => s.id)) + 1;
      }
      if (this.plans.length > 0) {
        this.planIdCounter = Math.max(...this.plans.map(p => p.id)) + 1;
      }
      if (this.checkData.length > 0) {
        this.checkDataIdCounter = Math.max(...this.checkData.map(c => c.id)) + 1;
      }
      if (this.roleCheckData.length > 0) {
        this.roleCheckDataIdCounter = Math.max(...this.roleCheckData.map(r => r.id)) + 1;
      }
      if (this.emotionData.length > 0) {
        this.emotionDataIdCounter = Math.max(...this.emotionData.map(e => e.id)) + 1;
      }
      if (this.emotionReplies.length > 0) {
        this.emotionReplyIdCounter = Math.max(...this.emotionReplies.map(r => r.id)) + 1;
      }
    }
  }

  private save() {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dbFile, JSON.stringify({
      teachers: this.teachers,
      students: this.students,
      plans: this.plans,
      checkData: this.checkData,
      roleCheckData: this.roleCheckData,
      emotionData: this.emotionData,
      emotionReplies: this.emotionReplies
    }, null, 2));
  }

  // Teachers
  createTeacher(email: string, password: string, classCode: string): number {
    const id = this.teacherIdCounter++;
    this.teachers.push({
      id,
      email,
      password,
      class_code: classCode,
      created_at: new Date().toISOString()
    });
    this.save();
    return id;
  }

  getTeacherByEmail(email: string): Teacher | undefined {
    return this.teachers.find(t => t.email === email);
  }

  getTeacherById(id: number): Teacher | undefined {
    return this.teachers.find(t => t.id === id);
  }

  // Students
  createStudent(teacherId: number, name: string, classNumber: number, classCode: string, role?: string): number {
    const id = this.studentIdCounter++;
    this.students.push({
      id,
      teacher_id: teacherId,
      name,
      class_number: classNumber,
      class_code: classCode,
      role: role || '',
      created_at: new Date().toISOString()
    });
    this.save();
    return id;
  }

  updateStudent(id: number, name?: string, classNumber?: number, role?: string) {
    const student = this.students.find(s => s.id === id);
    if (student) {
      if (name !== undefined) student.name = name;
      if (classNumber !== undefined) student.class_number = classNumber;
      if (role !== undefined) student.role = role;
      this.save();
    }
  }

  getStudentByClassCodeAndNumber(classCode: string, classNumber: number): Student | undefined {
    return this.students.find(s => s.class_code === classCode && s.class_number === classNumber);
  }

  getStudentsByTeacherId(teacherId: number): Student[] {
    return this.students.filter(s => s.teacher_id === teacherId);
  }

  getStudentById(id: number): Student | undefined {
    return this.students.find(s => s.id === id);
  }

  deleteStudent(id: number) {
    this.students = this.students.filter(s => s.id !== id);
    this.plans = this.plans.filter(p => p.student_id !== id);
    this.checkData = this.checkData.filter(c => c.student_id !== id);
    this.save();
  }

  // Plans
  createPlan(studentId: number, planText: string, displayOrder: number): number {
    const id = this.planIdCounter++;
    this.plans.push({
      id,
      student_id: studentId,
      plan_text: planText,
      display_order: displayOrder,
      created_at: new Date().toISOString()
    });
    this.save();
    return id;
  }

  getPlansByStudentId(studentId: number): Plan[] {
    return this.plans.filter(p => p.student_id === studentId).sort((a, b) => a.display_order - b.display_order);
  }

  getPlanById(id: number): Plan | undefined {
    return this.plans.find(p => p.id === id);
  }

  updatePlan(id: number, planText: string) {
    const plan = this.plans.find(p => p.id === id);
    if (plan) {
      plan.plan_text = planText;
      this.save();
    }
  }

  deletePlan(id: number) {
    this.plans = this.plans.filter(p => p.id !== id);
    this.checkData = this.checkData.filter(c => c.plan_id !== id);
    this.save();
  }

  updatePlanOrder(id: number, displayOrder: number) {
    const plan = this.plans.find(p => p.id === id);
    if (plan) {
      plan.display_order = displayOrder;
      this.save();
    }
  }

  getMaxDisplayOrder(studentId: number): number {
    const plans = this.plans.filter(p => p.student_id === studentId);
    if (plans.length === 0) return 0;
    return Math.max(...plans.map(p => p.display_order));
  }

  // Check Data
  getCheckData(studentId: number, date?: string): CheckData[] {
    let data = this.checkData.filter(c => c.student_id === studentId);
    if (date) {
      data = data.filter(c => c.check_date === date);
    }
    return data;
  }

  getTodayChecks(studentId: number, date: string): Array<{ plan_id: number; plan_text: string; display_order: number; is_checked: number; check_id?: number }> {
    const plans = this.getPlansByStudentId(studentId);
    const checks = this.checkData.filter(c => c.student_id === studentId && c.check_date === date);
    
    return plans.map(plan => {
      const check = checks.find(c => c.plan_id === plan.id);
      return {
        plan_id: plan.id,
        plan_text: plan.plan_text,
        display_order: plan.display_order,
        is_checked: check ? check.is_checked : 0,
        check_id: check?.id
      };
    });
  }

  upsertCheck(studentId: number, planId: number, date: string, isChecked: number) {
    const existing = this.checkData.find(
      c => c.student_id === studentId && c.plan_id === planId && c.check_date === date
    );

    if (existing) {
      existing.is_checked = isChecked;
    } else {
      const id = this.checkDataIdCounter++;
      this.checkData.push({
        id,
        student_id: studentId,
        plan_id: planId,
        check_date: date,
        is_checked: isChecked,
        created_at: new Date().toISOString()
      });
    }
    this.save();
  }

  getStudentStatus(teacherId: number, date: string): Array<{ id: number; name: string; class_number: number; isCompleted: boolean; checkedCount: number; totalCount: number; roleChecked: boolean }> {
    const students = this.getStudentsByTeacherId(teacherId);
    return students.map(student => {
      const plans = this.getPlansByStudentId(student.id);
      const checks = this.checkData.filter(c => c.student_id === student.id && c.check_date === date);
      // 완료(1) 또는 미완료(0) 모두 체크된 것으로 간주
      const checkedCount = checks.filter(c => c.is_checked === 1 || c.is_checked === 0).length;
      const totalCount = plans.length;
      
      // 교실역할 체크 확인
      const hasRole = student.role && student.role.trim() !== '';
      const roleCheck = hasRole ? this.getRoleCheck(student.id, date) : null;
      const roleChecked = !hasRole || (roleCheck && roleCheck.is_checked === 1);
      
      // 계획과 교실역할 모두 완료되어야 완전히 완료 (완료(1)로 체크된 것만 완료로 간주)
      const completedCount = checks.filter(c => c.is_checked === 1).length;
      const plansCompleted = totalCount > 0 && completedCount === totalCount;
      const isCompleted = plansCompleted && roleChecked;
      
      return {
        id: student.id,
        name: student.name,
        class_number: student.class_number,
        isCompleted: !!isCompleted,
        checkedCount,
        totalCount,
        roleChecked: !!roleChecked
      };
    });
  }

  getDailyStats(studentId: number): Array<{ check_date: string; total_plans: number; checked_plans: number; success_rate: number }> {
    const plans = this.getPlansByStudentId(studentId);
    const planIds = plans.map(p => p.id);
    const checks = this.checkData.filter(c => c.student_id === studentId && planIds.includes(c.plan_id));
    
    const dateMap: Record<string, { total: number; checked: number }> = {};
    
    planIds.forEach(planId => {
      const planChecks = checks.filter(c => c.plan_id === planId);
      planChecks.forEach(check => {
        if (!dateMap[check.check_date]) {
          dateMap[check.check_date] = { total: 0, checked: 0 };
        }
        dateMap[check.check_date].total++;
        if (check.is_checked === 1) {
          dateMap[check.check_date].checked++;
        }
      });
    });

    return Object.entries(dateMap)
      .map(([date, stats]) => ({
        check_date: date,
        total_plans: stats.total,
        checked_plans: stats.checked,
        success_rate: stats.total > 0 ? Math.round((stats.checked / stats.total) * 100 * 100) / 100 : 0
      }))
      .sort((a, b) => b.check_date.localeCompare(a.check_date));
  }

  getPlanStats(studentId: number): Array<{ id: number; plan_text: string; total_checks: number; checked_count: number; success_rate: number }> {
    const plans = this.getPlansByStudentId(studentId);
    return plans.map(plan => {
      const checks = this.checkData.filter(c => c.plan_id === plan.id);
      const checkedCount = checks.filter(c => c.is_checked === 1).length;
      const totalChecks = checks.length;
      return {
        id: plan.id,
        plan_text: plan.plan_text,
        total_checks: totalChecks,
        checked_count: checkedCount,
        success_rate: totalChecks > 0 ? Math.round((checkedCount / totalChecks) * 100 * 100) / 100 : 0
      };
    }).sort((a, b) => b.success_rate - a.success_rate);
  }

  getUncheckedPlansByDate(studentId: number, date: string): Array<{ plan_id: number; plan_text: string; display_order: number }> {
    const plans = this.getPlansByStudentId(studentId);
    const checks = this.checkData.filter(c => c.student_id === studentId && c.check_date === date);
    
    const uncheckedPlans: Array<{ plan_id: number; plan_text: string; display_order: number }> = [];
    
    plans.forEach(plan => {
      const check = checks.find(c => c.plan_id === plan.id);
      // 체크 데이터가 없거나 미완료(0)인 경우만 미완료로 표시 (미완료도 체크된 것으로 간주하지만, 미완료 목록에는 표시)
      if (!check || check.is_checked === 0) {
        uncheckedPlans.push({
          plan_id: plan.id,
          plan_text: plan.plan_text,
          display_order: plan.display_order
        });
      }
    });
    
    return uncheckedPlans.sort((a, b) => a.display_order - b.display_order);
  }

  // Role Check Data
  getRoleCheck(studentId: number, date: string): RoleCheckData | undefined {
    return this.roleCheckData.find(
      r => r.student_id === studentId && r.check_date === date
    );
  }

  upsertRoleCheck(studentId: number, date: string, isChecked: number) {
    const existing = this.roleCheckData.find(
      r => r.student_id === studentId && r.check_date === date
    );

    if (existing) {
      existing.is_checked = isChecked;
    } else {
      const id = this.roleCheckDataIdCounter++;
      this.roleCheckData.push({
        id,
        student_id: studentId,
        check_date: date,
        is_checked: isChecked,
        created_at: new Date().toISOString()
      });
    }
    this.save();
  }

  // Emotion Data
  getEmotionData(studentId: number, date: string): EmotionData | undefined {
    return this.emotionData.find(
      e => e.student_id === studentId && e.check_date === date
    );
  }

  upsertEmotionData(studentId: number, date: string, emotion: string, reason: string) {
    const existing = this.emotionData.find(
      e => e.student_id === studentId && e.check_date === date
    );

    if (existing) {
      existing.emotion = emotion;
      existing.reason = reason;
    } else {
      const id = this.emotionDataIdCounter++;
      this.emotionData.push({
        id,
        student_id: studentId,
        check_date: date,
        emotion,
        reason,
        created_at: new Date().toISOString()
      });
    }
    this.save();
  }

  getClassEmotions(classCode: string, date: string): Array<{
    emotion_id: number;
    student_id: number;
    student_name: string;
    emotion: string;
    reason: string;
    created_at: string;
  }> {
    // 같은 반 학생들 찾기
    const classStudents = this.students.filter(s => s.class_code === classCode);
    const studentIds = classStudents.map(s => s.id);

    // 해당 날짜의 감정 데이터 가져오기
    const emotions = this.emotionData.filter(
      e => studentIds.includes(e.student_id) && e.check_date === date && e.emotion
    );

    // 학생 정보와 함께 반환
    return emotions.map(emotion => {
      const student = classStudents.find(s => s.id === emotion.student_id);
      return {
        emotion_id: emotion.id,
        student_id: emotion.student_id,
        student_name: student?.name || '알 수 없음',
        emotion: emotion.emotion,
        reason: emotion.reason,
        created_at: emotion.created_at
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // Emotion Replies
  getEmotionReplies(emotionDataId: number): EmotionReply[] {
    return this.emotionReplies.filter(r => r.emotion_data_id === emotionDataId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  addEmotionReply(emotionDataId: number, teacherId: number, replyText: string): number {
    const id = this.emotionReplyIdCounter++;
    this.emotionReplies.push({
      id,
      emotion_data_id: emotionDataId,
      teacher_id: teacherId,
      reply_text: replyText,
      created_at: new Date().toISOString()
    });
    this.save();
    return id;
  }

  deleteEmotionReply(replyId: number, teacherId: number) {
    const reply = this.emotionReplies.find(r => r.id === replyId);
    if (reply && reply.teacher_id === teacherId) {
      this.emotionReplies = this.emotionReplies.filter(r => r.id !== replyId);
      this.save();
    }
  }

  getStudentEmotionStats(studentId: number): Array<{ emotion: string; count: number }> {
    const studentEmotions = this.emotionData.filter(e => e.student_id === studentId && e.emotion);
    
    // 감정별로 카운트
    const emotionCount: Record<string, number> = {};
    studentEmotions.forEach(e => {
      emotionCount[e.emotion] = (emotionCount[e.emotion] || 0) + 1;
    });

    // 배열로 변환하고 정렬
    return Object.entries(emotionCount)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // 상위 5개만
  }
}

export function initDatabase() {
  const db = SimpleDB.getInstance();
  console.log('데이터베이스 초기화 완료 (JSON 파일 기반)');
}

export function getDatabase() {
  return SimpleDB.getInstance();
}
