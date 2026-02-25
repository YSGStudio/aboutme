CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  class_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  teacher_id INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  class_code TEXT NOT NULL,
  role TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (class_code, class_number)
);

CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  plan_text TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS check_data (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  check_date DATE NOT NULL,
  is_checked INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, plan_id, check_date)
);

CREATE TABLE IF NOT EXISTS role_check_data (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  check_date DATE NOT NULL,
  is_checked INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, check_date)
);

CREATE TABLE IF NOT EXISTS emotion_data (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  check_date DATE NOT NULL,
  emotion TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, check_date)
);

CREATE TABLE IF NOT EXISTS emotion_replies (
  id SERIAL PRIMARY KEY,
  emotion_data_id INTEGER NOT NULL REFERENCES emotion_data(id) ON DELETE CASCADE,
  teacher_id INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_teacher ON students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_plans_student ON plans(student_id);
CREATE INDEX IF NOT EXISTS idx_check_data_student_date ON check_data(student_id, check_date);
CREATE INDEX IF NOT EXISTS idx_role_check_student_date ON role_check_data(student_id, check_date);
CREATE INDEX IF NOT EXISTS idx_emotion_data_student_date ON emotion_data(student_id, check_date);
CREATE INDEX IF NOT EXISTS idx_emotion_replies_emotion ON emotion_replies(emotion_data_id);
