-- Simple fix: Add missing columns to existing tables and create missing tables
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- FIX COURSES TABLE - Add missing columns
-- ============================================
DO $$
BEGIN
  -- Add name column if missing (and copy from title if it exists)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'name') THEN
    ALTER TABLE courses ADD COLUMN name TEXT;
    -- Copy from title if it exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'title') THEN
      UPDATE courses SET name = title WHERE name IS NULL;
    END IF;
  END IF;
  
  -- Add other missing columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'age_range_min') THEN
    ALTER TABLE courses ADD COLUMN age_range_min INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'age_range_max') THEN
    ALTER TABLE courses ADD COLUMN age_range_max INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'duration_months') THEN
    ALTER TABLE courses ADD COLUMN duration_months INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'price_per_month') THEN
    ALTER TABLE courses ADD COLUMN price_per_month DECIMAL(10, 2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'instructor_id') THEN
    ALTER TABLE courses ADD COLUMN instructor_id UUID;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'max_students') THEN
    ALTER TABLE courses ADD COLUMN max_students INTEGER DEFAULT 20;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'current_students') THEN
    ALTER TABLE courses ADD COLUMN current_students INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'status') THEN
    ALTER TABLE courses ADD COLUMN status TEXT DEFAULT 'draft';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'level') THEN
    ALTER TABLE courses ADD COLUMN level TEXT;
  END IF;
END $$;

-- Add foreign key for instructor_id
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'instructors') THEN
    ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_instructor_id_fkey;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'courses_instructor_id_fkey' AND table_name = 'courses'
    ) THEN
      ALTER TABLE courses 
      ADD CONSTRAINT courses_instructor_id_fkey 
      FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- ============================================
-- CREATE MISSING TABLES
-- ============================================

-- Course enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(course_id, student_id)
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  max_capacity INTEGER DEFAULT 20,
  current_attendance INTEGER DEFAULT 0,
  is_recurring BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add foreign key for sessions.instructor_id
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'instructors') THEN
    ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_instructor_id_fkey;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'sessions_instructor_id_fkey' AND table_name = 'sessions'
    ) THEN
      ALTER TABLE sessions 
      ADD CONSTRAINT sessions_instructor_id_fkey 
      FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- Session attendance
CREATE TABLE IF NOT EXISTS session_attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(session_id, student_id, date)
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL CHECK (report_type IN ('enrollment', 'financial', 'attendance', 'performance', 'instructor', 'custom')),
  generated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  file_url TEXT,
  file_format TEXT DEFAULT 'pdf' CHECK (file_format IN ('pdf', 'csv', 'xlsx')),
  parameters JSONB,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Scheduled reports
CREATE TABLE IF NOT EXISTS scheduled_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL,
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('daily', 'weekly', 'monthly', 'custom')),
  schedule_config JSONB NOT NULL,
  recipients TEXT[],
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'notifications', 'security', 'business_hours', 'email')),
  description TEXT,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_courses_program_id ON courses(program_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student_id ON course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_course_id ON sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_sessions_instructor_id ON sessions(instructor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_day_of_week ON sessions(day_of_week);
CREATE INDEX IF NOT EXISTS idx_reports_report_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_generated_at ON reports(generated_at);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;
DROP POLICY IF EXISTS "Students can view own enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Admins can manage enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Sessions are viewable by everyone" ON sessions;
DROP POLICY IF EXISTS "Admins can manage sessions" ON sessions;
DROP POLICY IF EXISTS "Students can view own attendance" ON session_attendance;
DROP POLICY IF EXISTS "Admins can manage attendance" ON session_attendance;
DROP POLICY IF EXISTS "Admins can manage reports" ON reports;
DROP POLICY IF EXISTS "Admins can manage scheduled reports" ON scheduled_reports;
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON settings;

-- Create policies
CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage courses"
  ON courses FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Students can view own enrollments"
  ON course_enrollments FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can manage enrollments"
  ON course_enrollments FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Sessions are viewable by everyone"
  ON sessions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage sessions"
  ON sessions FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Students can view own attendance"
  ON session_attendance FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Admins can manage attendance"
  ON session_attendance FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage reports"
  ON reports FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage scheduled reports"
  ON scheduled_reports FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Settings are viewable by everyone"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage settings"
  ON settings FOR ALL
  USING (public.is_admin(auth.uid()));

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_scheduled_reports_updated_at ON scheduled_reports;
CREATE TRIGGER update_scheduled_reports_updated_at BEFORE UPDATE ON scheduled_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update course current_students count
CREATE OR REPLACE FUNCTION update_course_student_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE courses
    SET current_students = (
      SELECT COUNT(*) FROM course_enrollments
      WHERE course_id = NEW.course_id AND status = 'active'
    )
    WHERE id = NEW.course_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE courses
    SET current_students = (
      SELECT COUNT(*) FROM course_enrollments
      WHERE course_id = NEW.course_id AND status = 'active'
    )
    WHERE id = NEW.course_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE courses
    SET current_students = (
      SELECT COUNT(*) FROM course_enrollments
      WHERE course_id = OLD.course_id AND status = 'active'
    )
    WHERE id = OLD.course_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_course_students_on_enrollment ON course_enrollments;
CREATE TRIGGER update_course_students_on_enrollment
  AFTER INSERT OR UPDATE OR DELETE ON course_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_course_student_count();
