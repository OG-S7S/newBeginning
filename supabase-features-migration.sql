-- Additional Features Migration: Courses, Sessions, Applications, Payments, Reports, Settings
-- Run this SQL in your Supabase SQL Editor after running supabase-data-migration.sql

-- ============================================
-- COURSES TABLE
-- ============================================
-- Courses are instances of programs that can be scheduled and enrolled in
-- Note: This assumes instructors table exists from supabase-data-migration.sql
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  program_id TEXT REFERENCES programs(id) ON DELETE SET NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  age_range_min INTEGER NOT NULL,
  age_range_max INTEGER NOT NULL,
  duration_months INTEGER NOT NULL,
  price_per_month DECIMAL(10, 2) NOT NULL,
  instructor_id UUID,
  max_students INTEGER DEFAULT 20,
  current_students INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add foreign key constraint for instructor_id if instructors table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'instructors') THEN
    ALTER TABLE courses 
    ADD CONSTRAINT courses_instructor_id_fkey 
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Course enrollments (students enrolled in courses)
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(course_id, student_id)
);

-- ============================================
-- SESSIONS TABLE (Schedule)
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id UUID,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday, etc.
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

-- Add foreign key constraint for sessions.instructor_id if instructors table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'instructors') THEN
    ALTER TABLE sessions 
    ADD CONSTRAINT sessions_instructor_id_fkey 
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Session attendance tracking
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

-- ============================================
-- APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Parent Information
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  -- Student Information
  student_name TEXT NOT NULL,
  student_age INTEGER NOT NULL,
  student_grade TEXT,
  school_name TEXT,
  -- Program Selection
  program_id TEXT REFERENCES programs(id) ON DELETE SET NULL,
  branch TEXT,
  application_type TEXT DEFAULT 'trial' CHECK (application_type IN ('trial', 'enrollment')),
  -- Additional Information
  notes TEXT,
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id TEXT UNIQUE NOT NULL, -- e.g., "PAY-001"
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'EGP',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash', 'Bank Transfer', 'Credit Card', 'Mobile Payment', 'Other')),
  payment_date DATE NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled', 'refunded')),
  notes TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL CHECK (report_type IN ('enrollment', 'financial', 'attendance', 'performance', 'instructor', 'custom')),
  generated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  file_url TEXT, -- URL to generated report file
  file_format TEXT DEFAULT 'pdf' CHECK (file_format IN ('pdf', 'csv', 'xlsx')),
  parameters JSONB, -- Store report parameters/filters
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE, -- Optional expiration date
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Scheduled reports
CREATE TABLE IF NOT EXISTS scheduled_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL,
  schedule_type TEXT NOT NULL CHECK (schedule_type IN ('daily', 'weekly', 'monthly', 'custom')),
  schedule_config JSONB NOT NULL, -- e.g., {"day_of_week": 5, "time": "18:00"} for weekly
  recipients TEXT[], -- Array of email addresses
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- SETTINGS TABLE
-- ============================================
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
-- Create instructor_id index only if column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'instructor_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student_id ON course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_course_id ON sessions(course_id);
-- Create instructor_id index only if column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'sessions' AND column_name = 'instructor_id'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_sessions_instructor_id ON sessions(instructor_id);
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_sessions_day_of_week ON sessions(day_of_week);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_program_id ON applications(program_id);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_reports_report_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_generated_at ON reports(generated_at);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Courses: Everyone can view, only admins can modify
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage courses" ON courses;
CREATE POLICY "Admins can manage courses"
  ON courses FOR ALL
  USING (public.is_admin(auth.uid()));

-- Course enrollments: Students can view their own, admins can manage all
DROP POLICY IF EXISTS "Students can view own enrollments" ON course_enrollments;
CREATE POLICY "Students can view own enrollments"
  ON course_enrollments FOR SELECT
  USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Admins can manage enrollments" ON course_enrollments;
CREATE POLICY "Admins can manage enrollments"
  ON course_enrollments FOR ALL
  USING (public.is_admin(auth.uid()));

-- Sessions: Everyone can view, only admins can modify
DROP POLICY IF EXISTS "Sessions are viewable by everyone" ON sessions;
CREATE POLICY "Sessions are viewable by everyone"
  ON sessions FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage sessions" ON sessions;
CREATE POLICY "Admins can manage sessions"
  ON sessions FOR ALL
  USING (public.is_admin(auth.uid()));

-- Session attendance: Students can view their own, admins can manage all
DROP POLICY IF EXISTS "Students can view own attendance" ON session_attendance;
CREATE POLICY "Students can view own attendance"
  ON session_attendance FOR SELECT
  USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Admins can manage attendance" ON session_attendance;
CREATE POLICY "Admins can manage attendance"
  ON session_attendance FOR ALL
  USING (public.is_admin(auth.uid()));

-- Applications: Public can create, admins can view/manage all
DROP POLICY IF EXISTS "Anyone can create applications" ON applications;
CREATE POLICY "Anyone can create applications"
  ON applications FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all applications" ON applications;
CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can update applications" ON applications;
CREATE POLICY "Admins can update applications"
  ON applications FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Payments: Students can view their own, admins can manage all
DROP POLICY IF EXISTS "Students can view own payments" ON payments;
CREATE POLICY "Students can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Admins can manage payments" ON payments;
CREATE POLICY "Admins can manage payments"
  ON payments FOR ALL
  USING (public.is_admin(auth.uid()));

-- Reports: Only admins can view and manage
DROP POLICY IF EXISTS "Admins can manage reports" ON reports;
CREATE POLICY "Admins can manage reports"
  ON reports FOR ALL
  USING (public.is_admin(auth.uid()));

-- Scheduled reports: Only admins can manage
DROP POLICY IF EXISTS "Admins can manage scheduled reports" ON scheduled_reports;
CREATE POLICY "Admins can manage scheduled reports"
  ON scheduled_reports FOR ALL
  USING (public.is_admin(auth.uid()));

-- Settings: Everyone can view, only admins can modify
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON settings;
CREATE POLICY "Settings are viewable by everyone"
  ON settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage settings" ON settings;
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

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_reports_updated_at BEFORE UPDATE ON scheduled_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

CREATE TRIGGER update_course_students_on_enrollment
  AFTER INSERT OR UPDATE OR DELETE ON course_enrollments
  FOR EACH ROW EXECUTE FUNCTION update_course_student_count();

-- Generate invoice ID for payments
CREATE OR REPLACE FUNCTION generate_invoice_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_id IS NULL OR NEW.invoice_id = '' THEN
    NEW.invoice_id := 'PAY-' || LPAD(
      (SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_id FROM 5) AS INTEGER)), 0) + 1 FROM payments)::TEXT,
      3,
      '0'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_payment_invoice_id
  BEFORE INSERT ON payments
  FOR EACH ROW EXECUTE FUNCTION generate_invoice_id();
