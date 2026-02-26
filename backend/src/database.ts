import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

interface Teacher {
  id: number;
  auth_user_id?: string;
  email: string;
  password: string;
  class_code: string;
  created_at: string;
}

interface Student {
  id: number;
  auth_user_id?: string;
  teacher_id: number;
  email?: string;
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

const connectionString = process.env.DATABASE_URL;
const isLocalDb = connectionString?.includes('localhost') || connectionString?.includes('127.0.0.1');
const ssl =
  process.env.DB_SSL === 'false'
    ? false
    : isLocalDb
    ? false
    : { rejectUnauthorized: false };

export class SimpleDB {
  private static instance: SimpleDB;
  private pool: Pool;

  private constructor() {
    if (!connectionString) {
      throw new Error('DATABASE_URL 환경 변수가 설정되지 않았습니다.');
    }
    this.pool = new Pool({
      connectionString,
      ssl
    });
  }

  static getInstance(): SimpleDB {
    if (!SimpleDB.instance) {
      SimpleDB.instance = new SimpleDB();
    }
    return SimpleDB.instance;
  }

  async ping() {
    await this.pool.query('SELECT 1');
  }

  // Teachers
  async createTeacher(email: string, password: string, classCode: string, authUserId?: string): Promise<number> {
    const result = await this.pool.query<{ id: number }>(
      'INSERT INTO teachers (auth_user_id, email, password, class_code) VALUES ($1, $2, $3, $4) RETURNING id',
      [authUserId || null, email, password, classCode]
    );
    return result.rows[0].id;
  }

  async getTeacherByEmail(email: string): Promise<Teacher | undefined> {
    const result = await this.pool.query<Teacher>('SELECT * FROM teachers WHERE email = $1 LIMIT 1', [email]);
    return result.rows[0];
  }

  async getTeacherById(id: number): Promise<Teacher | undefined> {
    const result = await this.pool.query<Teacher>('SELECT * FROM teachers WHERE id = $1 LIMIT 1', [id]);
    return result.rows[0];
  }

  async getTeacherByAuthId(authUserId: string): Promise<Teacher | undefined> {
    const result = await this.pool.query<Teacher>('SELECT * FROM teachers WHERE auth_user_id = $1 LIMIT 1', [authUserId]);
    return result.rows[0];
  }

  async getTeacherByClassCode(classCode: string): Promise<Teacher | undefined> {
    const result = await this.pool.query<Teacher>('SELECT * FROM teachers WHERE class_code = $1 LIMIT 1', [classCode]);
    return result.rows[0];
  }

  // Students
  async createStudent(
    teacherId: number,
    name: string,
    classNumber: number,
    classCode: string,
    role?: string,
    authUserId?: string,
    email?: string
  ): Promise<number> {
    const result = await this.pool.query<{ id: number }>(
      'INSERT INTO students (auth_user_id, teacher_id, email, name, class_number, class_code, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [authUserId || null, teacherId, email || null, name, classNumber, classCode, role || '']
    );
    return result.rows[0].id;
  }

  async updateStudent(id: number, name?: string, classNumber?: number, role?: string) {
    const updates: string[] = [];
    const values: Array<string | number> = [];

    if (name !== undefined) {
      values.push(name);
      updates.push(`name = $${values.length}`);
    }
    if (classNumber !== undefined) {
      values.push(classNumber);
      updates.push(`class_number = $${values.length}`);
    }
    if (role !== undefined) {
      values.push(role);
      updates.push(`role = $${values.length}`);
    }

    if (updates.length === 0) {
      return;
    }

    values.push(id);
    await this.pool.query(`UPDATE students SET ${updates.join(', ')} WHERE id = $${values.length}`, values);
  }

  async getStudentByClassCodeAndNumber(classCode: string, classNumber: number): Promise<Student | undefined> {
    const result = await this.pool.query<Student>(
      'SELECT * FROM students WHERE class_code = $1 AND class_number = $2 LIMIT 1',
      [classCode, classNumber]
    );
    return result.rows[0];
  }

  async getStudentsByTeacherId(teacherId: number): Promise<Student[]> {
    const result = await this.pool.query<Student>('SELECT * FROM students WHERE teacher_id = $1 ORDER BY class_number ASC', [teacherId]);
    return result.rows;
  }

  async getStudentById(id: number): Promise<Student | undefined> {
    const result = await this.pool.query<Student>('SELECT * FROM students WHERE id = $1 LIMIT 1', [id]);
    return result.rows[0];
  }

  async getStudentByAuthId(authUserId: string): Promise<Student | undefined> {
    const result = await this.pool.query<Student>('SELECT * FROM students WHERE auth_user_id = $1 LIMIT 1', [authUserId]);
    return result.rows[0];
  }

  async deleteStudent(id: number) {
    await this.pool.query('DELETE FROM students WHERE id = $1', [id]);
  }

  // Plans
  async createPlan(studentId: number, planText: string, displayOrder: number): Promise<number> {
    const result = await this.pool.query<{ id: number }>(
      'INSERT INTO plans (student_id, plan_text, display_order) VALUES ($1, $2, $3) RETURNING id',
      [studentId, planText, displayOrder]
    );
    return result.rows[0].id;
  }

  async getPlansByStudentId(studentId: number): Promise<Plan[]> {
    const result = await this.pool.query<Plan>(
      'SELECT * FROM plans WHERE student_id = $1 ORDER BY display_order ASC',
      [studentId]
    );
    return result.rows;
  }

  async getPlanById(id: number): Promise<Plan | undefined> {
    const result = await this.pool.query<Plan>('SELECT * FROM plans WHERE id = $1 LIMIT 1', [id]);
    return result.rows[0];
  }

  async updatePlan(id: number, planText: string) {
    await this.pool.query('UPDATE plans SET plan_text = $1 WHERE id = $2', [planText, id]);
  }

  async deletePlan(id: number) {
    await this.pool.query('DELETE FROM plans WHERE id = $1', [id]);
  }

  async updatePlanOrder(id: number, displayOrder: number) {
    await this.pool.query('UPDATE plans SET display_order = $1 WHERE id = $2', [displayOrder, id]);
  }

  async getMaxDisplayOrder(studentId: number): Promise<number> {
    const result = await this.pool.query<{ max_order: string }>(
      'SELECT COALESCE(MAX(display_order), 0) AS max_order FROM plans WHERE student_id = $1',
      [studentId]
    );
    return parseInt(result.rows[0].max_order, 10) || 0;
  }

  // Check Data
  async getCheckData(studentId: number, date?: string): Promise<CheckData[]> {
    if (date) {
      const result = await this.pool.query<CheckData>(
        'SELECT * FROM check_data WHERE student_id = $1 AND check_date = $2',
        [studentId, date]
      );
      return result.rows;
    }
    const result = await this.pool.query<CheckData>('SELECT * FROM check_data WHERE student_id = $1', [studentId]);
    return result.rows;
  }

  async getTodayChecks(studentId: number, date: string): Promise<Array<{ plan_id: number; plan_text: string; display_order: number; is_checked: number; check_id?: number }>> {
    const result = await this.pool.query<{
      plan_id: number;
      plan_text: string;
      display_order: number;
      is_checked: number | null;
      check_id: number | null;
    }>(
      `SELECT p.id AS plan_id,
              p.plan_text,
              p.display_order,
              c.is_checked,
              c.id AS check_id
       FROM plans p
       LEFT JOIN check_data c
         ON c.plan_id = p.id
        AND c.student_id = $1
        AND c.check_date = $2
       WHERE p.student_id = $1
       ORDER BY p.display_order ASC`,
      [studentId, date]
    );

    const rows = result.rows as Array<{
      plan_id: number;
      plan_text: string;
      display_order: number;
      is_checked: number | null;
      check_id: number | null;
    }>;

    return rows.map((row) => ({
      plan_id: row.plan_id,
      plan_text: row.plan_text,
      display_order: row.display_order,
      is_checked: row.is_checked ?? -1,
      check_id: row.check_id ?? undefined
    }));
  }

  async upsertCheck(studentId: number, planId: number, date: string, isChecked: number) {
    await this.pool.query(
      `INSERT INTO check_data (student_id, plan_id, check_date, is_checked)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (student_id, plan_id, check_date)
       DO UPDATE SET is_checked = EXCLUDED.is_checked`,
      [studentId, planId, date, isChecked]
    );
  }

  async getStudentStatus(teacherId: number, date: string): Promise<Array<{ id: number; name: string; class_number: number; isCompleted: boolean; checkedCount: number; totalCount: number; roleChecked: boolean; emotionChecked: boolean }>> {
    const students = await this.getStudentsByTeacherId(teacherId);

    const results: Array<{ id: number; name: string; class_number: number; isCompleted: boolean; checkedCount: number; totalCount: number; roleChecked: boolean; emotionChecked: boolean }> = [];
    for (const student of students) {
      const plans = await this.getPlansByStudentId(student.id);
      const checks = await this.pool.query<{ is_checked: number }>(
        'SELECT is_checked FROM check_data WHERE student_id = $1 AND check_date = $2',
        [student.id, date]
      );
      const checkValues = (checks.rows as Array<{ is_checked: number }>).map((row) => row.is_checked);

      const checkedCount = checkValues.filter((value: number) => value === 1 || value === 0).length;
      const totalCount = plans.length;

      const hasRole = !!(student.role && student.role.trim() !== '');
      const roleCheck = hasRole ? await this.getRoleCheck(student.id, date) : null;
      const roleChecked = !hasRole || (roleCheck && roleCheck.is_checked === 1);

      const emotionData = await this.getEmotionData(student.id, date);
      const emotionChecked = !!(emotionData && emotionData.emotion && emotionData.emotion.trim() !== '');

      const completedCount = checkValues.filter((value: number) => value === 1).length;
      const plansCompleted = totalCount > 0 && completedCount === totalCount;
      const isCompleted = plansCompleted && roleChecked && emotionChecked;

      results.push({
        id: student.id,
        name: student.name,
        class_number: student.class_number,
        isCompleted: !!isCompleted,
        checkedCount,
        totalCount,
        roleChecked: !!roleChecked,
        emotionChecked
      });
    }

    return results;
  }

  async getDailyStats(studentId: number): Promise<Array<{ check_date: string; total_plans: number; checked_plans: number; success_rate: number }>> {
    const result = await this.pool.query<{
      check_date: string;
      total_plans: string;
      checked_plans: string | null;
    }>(
      `SELECT check_date,
              COUNT(*) AS total_plans,
              SUM(CASE WHEN is_checked = 1 THEN 1 ELSE 0 END) AS checked_plans
       FROM check_data
       WHERE student_id = $1
       GROUP BY check_date
       ORDER BY check_date DESC`,
      [studentId]
    );

    const rows = result.rows as Array<{ check_date: string; total_plans: string; checked_plans: string | null }>;

    return rows.map((row) => {
      const total = parseInt(row.total_plans, 10) || 0;
      const checked = parseInt(row.checked_plans ?? '0', 10) || 0;
      return {
        check_date: row.check_date,
        total_plans: total,
        checked_plans: checked,
        success_rate: total > 0 ? Math.round((checked / total) * 100 * 100) / 100 : 0
      };
    });
  }

  async getPlanStats(studentId: number): Promise<Array<{ id: number; plan_text: string; total_checks: number; checked_count: number; success_rate: number }>> {
    const result = await this.pool.query<{
      id: number;
      plan_text: string;
      total_checks: string;
      checked_count: string | null;
    }>(
      `SELECT p.id,
              p.plan_text,
              COUNT(c.id) AS total_checks,
              SUM(CASE WHEN c.is_checked = 1 THEN 1 ELSE 0 END) AS checked_count
       FROM plans p
       LEFT JOIN check_data c ON c.plan_id = p.id
       WHERE p.student_id = $1
       GROUP BY p.id
       ORDER BY p.id ASC`,
      [studentId]
    );

    const rows = result.rows as Array<{ id: number; plan_text: string; total_checks: string; checked_count: string | null }>;
    const stats = rows.map((row) => {
      const total = parseInt(row.total_checks, 10) || 0;
      const checked = parseInt(row.checked_count ?? '0', 10) || 0;
      return {
        id: row.id,
        plan_text: row.plan_text,
        total_checks: total,
        checked_count: checked,
        success_rate: total > 0 ? Math.round((checked / total) * 100 * 100) / 100 : 0
      };
    });

    return stats.sort((a: { success_rate: number }, b: { success_rate: number }) => b.success_rate - a.success_rate);
  }

  async getUncheckedPlansByDate(studentId: number, date: string): Promise<Array<{ plan_id: number; plan_text: string; display_order: number }>> {
    const result = await this.pool.query<{ plan_id: number; plan_text: string; display_order: number }>(
      `SELECT p.id AS plan_id, p.plan_text, p.display_order
       FROM plans p
       LEFT JOIN check_data c
         ON c.plan_id = p.id
        AND c.student_id = $1
        AND c.check_date = $2
       WHERE p.student_id = $1
         AND (c.id IS NULL OR c.is_checked = 0)
       ORDER BY p.display_order ASC`,
      [studentId, date]
    );
    return result.rows;
  }

  // Role Check Data
  async getRoleCheck(studentId: number, date: string): Promise<RoleCheckData | undefined> {
    const result = await this.pool.query<RoleCheckData>(
      'SELECT * FROM role_check_data WHERE student_id = $1 AND check_date = $2 LIMIT 1',
      [studentId, date]
    );
    return result.rows[0];
  }

  async upsertRoleCheck(studentId: number, date: string, isChecked: number) {
    await this.pool.query(
      `INSERT INTO role_check_data (student_id, check_date, is_checked)
       VALUES ($1, $2, $3)
       ON CONFLICT (student_id, check_date)
       DO UPDATE SET is_checked = EXCLUDED.is_checked`,
      [studentId, date, isChecked]
    );
  }

  // Emotion Data
  async getEmotionData(studentId: number, date: string): Promise<EmotionData | undefined> {
    const result = await this.pool.query<EmotionData>(
      'SELECT * FROM emotion_data WHERE student_id = $1 AND check_date = $2 LIMIT 1',
      [studentId, date]
    );
    return result.rows[0];
  }

  async upsertEmotionData(studentId: number, date: string, emotion: string, reason: string) {
    await this.pool.query(
      `INSERT INTO emotion_data (student_id, check_date, emotion, reason)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (student_id, check_date)
       DO UPDATE SET emotion = EXCLUDED.emotion, reason = EXCLUDED.reason`,
      [studentId, date, emotion, reason]
    );
  }

  async getClassEmotions(classCode: string, date: string): Promise<Array<{
    emotion_id: number;
    student_id: number;
    student_name: string;
    emotion: string;
    reason: string;
    created_at: string;
  }>> {
    const result = await this.pool.query<{
      emotion_id: number;
      student_id: number;
      student_name: string;
      emotion: string;
      reason: string;
      created_at: string;
    }>(
      `SELECT e.id AS emotion_id,
              e.student_id,
              s.name AS student_name,
              e.emotion,
              e.reason,
              e.created_at
       FROM emotion_data e
       JOIN students s ON s.id = e.student_id
       WHERE s.class_code = $1
         AND e.check_date = $2
         AND e.emotion <> ''
       ORDER BY e.created_at DESC`,
      [classCode, date]
    );
    return result.rows;
  }

  // Emotion Replies
  async getEmotionReplies(emotionDataId: number): Promise<EmotionReply[]> {
    const result = await this.pool.query<EmotionReply>(
      'SELECT * FROM emotion_replies WHERE emotion_data_id = $1 ORDER BY created_at ASC',
      [emotionDataId]
    );
    return result.rows;
  }

  async addEmotionReply(emotionDataId: number, teacherId: number, replyText: string): Promise<number> {
    const result = await this.pool.query<{ id: number }>(
      'INSERT INTO emotion_replies (emotion_data_id, teacher_id, reply_text) VALUES ($1, $2, $3) RETURNING id',
      [emotionDataId, teacherId, replyText]
    );
    return result.rows[0].id;
  }

  async deleteEmotionReply(replyId: number, teacherId: number) {
    await this.pool.query('DELETE FROM emotion_replies WHERE id = $1 AND teacher_id = $2', [replyId, teacherId]);
  }

  async getStudentEmotionStats(studentId: number): Promise<Array<{ emotion: string; count: number }>> {
    const result = await this.pool.query<{ emotion: string; count: number }>(
      `SELECT emotion, COUNT(*)::int AS count
       FROM emotion_data
       WHERE student_id = $1 AND emotion <> ''
       GROUP BY emotion
       ORDER BY count DESC
       LIMIT 5`,
      [studentId]
    );
    return result.rows;
  }
}

export async function initDatabase() {
  const db = SimpleDB.getInstance();
  await db.ping();
  console.log('데이터베이스 초기화 완료 (Postgres)');
}

export function getDatabase() {
  return SimpleDB.getInstance();
}
