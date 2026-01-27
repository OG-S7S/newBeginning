-- Data Migration: Move static frontend data to database
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- PROGRAMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  ages TEXT NOT NULL,
  duration TEXT NOT NULL,
  class_size TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT, -- Store icon name (e.g., "Rocket", "Cog")
  color TEXT NOT NULL, -- e.g., "bg-[#ffb800]"
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Program highlights (many-to-many relationship)
CREATE TABLE IF NOT EXISTS program_highlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id TEXT REFERENCES programs(id) ON DELETE CASCADE,
  highlight TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Program outcomes
CREATE TABLE IF NOT EXISTS program_outcomes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id TEXT REFERENCES programs(id) ON DELETE CASCADE,
  outcome TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Program projects
CREATE TABLE IF NOT EXISTS program_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id TEXT REFERENCES programs(id) ON DELETE CASCADE,
  project TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- CURRICULUM TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS curriculum_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id TEXT REFERENCES programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  weeks TEXT NOT NULL, -- e.g., "Weeks 1-4"
  outcome TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Curriculum topics
CREATE TABLE IF NOT EXISTS curriculum_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES curriculum_modules(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- STUDENTS TABLE (Enhanced)
-- ============================================
-- Note: This extends the profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS join_date DATE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parent_phone TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notes TEXT;

-- Student enrollments (many-to-many with programs)
CREATE TABLE IF NOT EXISTS student_enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  program_id TEXT REFERENCES programs(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(student_id, program_id)
);

-- ============================================
-- INSTRUCTORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS instructors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  title TEXT NOT NULL, -- e.g., "Senior Programming Instructor"
  phone TEXT,
  specializations TEXT[], -- Array of specializations
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  join_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Instructor assignments (many-to-many with programs)
CREATE TABLE IF NOT EXISTS instructor_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID REFERENCES instructors(id) ON DELETE CASCADE,
  program_id TEXT REFERENCES programs(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(instructor_id, program_id)
);

-- ============================================
-- GALLERY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('projects', 'competitions', 'classes', 'events')),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'image' CHECK (type IN ('image', 'video')),
  thumbnail_url TEXT,
  image_url TEXT,
  video_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- COURSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id TEXT REFERENCES programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_hours INTEGER,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,
  student_age INTEGER NOT NULL,
  program_id TEXT REFERENCES programs(id),
  preferred_schedule TEXT,
  previous_experience TEXT,
  motivation TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'waitlisted')),
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id)
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Programs: Public read, Admin write
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Programs are viewable by everyone" ON programs;
DROP POLICY IF EXISTS "Only admins can modify programs" ON programs;
CREATE POLICY "Programs are viewable by everyone"
  ON programs FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify programs"
  ON programs FOR ALL
  USING (public.is_admin(auth.uid()));

-- Program highlights, outcomes, projects: Public read, Admin write
ALTER TABLE program_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Program details are viewable by everyone" ON program_highlights;
DROP POLICY IF EXISTS "Only admins can modify program highlights" ON program_highlights;
CREATE POLICY "Program details are viewable by everyone"
  ON program_highlights FOR SELECT USING (true);
CREATE POLICY "Only admins can modify program highlights"
  ON program_highlights FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Program outcomes are viewable by everyone" ON program_outcomes;
DROP POLICY IF EXISTS "Only admins can modify program outcomes" ON program_outcomes;
CREATE POLICY "Program outcomes are viewable by everyone"
  ON program_outcomes FOR SELECT USING (true);
CREATE POLICY "Only admins can modify program outcomes"
  ON program_outcomes FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Program projects are viewable by everyone" ON program_projects;
DROP POLICY IF EXISTS "Only admins can modify program projects" ON program_projects;
CREATE POLICY "Program projects are viewable by everyone"
  ON program_projects FOR SELECT USING (true);
CREATE POLICY "Only admins can modify program projects"
  ON program_projects FOR ALL USING (public.is_admin(auth.uid()));

-- Curriculum: Public read, Admin write
ALTER TABLE curriculum_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_topics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Curriculum modules are viewable by everyone" ON curriculum_modules;
DROP POLICY IF EXISTS "Only admins can modify curriculum modules" ON curriculum_modules;
CREATE POLICY "Curriculum modules are viewable by everyone"
  ON curriculum_modules FOR SELECT USING (true);
CREATE POLICY "Only admins can modify curriculum modules"
  ON curriculum_modules FOR ALL USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Curriculum topics are viewable by everyone" ON curriculum_topics;
DROP POLICY IF EXISTS "Only admins can modify curriculum topics" ON curriculum_topics;
CREATE POLICY "Curriculum topics are viewable by everyone"
  ON curriculum_topics FOR SELECT USING (true);
CREATE POLICY "Only admins can modify curriculum topics"
  ON curriculum_topics FOR ALL USING (public.is_admin(auth.uid()));

-- Students: Users can view own, Admins can view all
-- (Already handled by profiles table policies)

-- Student enrollments: Students can view own, Admins can view all
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Students can view own enrollments" ON student_enrollments;
DROP POLICY IF EXISTS "Admins can view all enrollments" ON student_enrollments;
DROP POLICY IF EXISTS "Only admins can modify enrollments" ON student_enrollments;
CREATE POLICY "Students can view own enrollments"
  ON student_enrollments FOR SELECT
  USING (student_id = auth.uid());
CREATE POLICY "Admins can view all enrollments"
  ON student_enrollments FOR SELECT
  USING (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can modify enrollments"
  ON student_enrollments FOR ALL
  USING (public.is_admin(auth.uid()));

-- Instructors: Public read, Admin write
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Instructors are viewable by everyone" ON instructors;
DROP POLICY IF EXISTS "Only admins can modify instructors" ON instructors;
CREATE POLICY "Instructors are viewable by everyone"
  ON instructors FOR SELECT USING (true);
CREATE POLICY "Only admins can modify instructors"
  ON instructors FOR ALL USING (public.is_admin(auth.uid()));

-- Gallery: Public read, Admin write
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Gallery items are viewable by everyone" ON gallery_items;
DROP POLICY IF EXISTS "Only admins can modify gallery items" ON gallery_items;
CREATE POLICY "Gallery items are viewable by everyone"
  ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Only admins can modify gallery items"
  ON gallery_items FOR ALL USING (public.is_admin(auth.uid()));

-- Courses: Public read, Admin write
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Only admins can modify courses" ON courses;
CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT USING (true);
CREATE POLICY "Only admins can modify courses"
  ON courses FOR ALL USING (public.is_admin(auth.uid()));

-- Applications: Admins only
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Only admins can view applications" ON applications;
DROP POLICY IF EXISTS "Only admins can modify applications" ON applications;
CREATE POLICY "Only admins can view applications"
  ON applications FOR SELECT
  USING (public.is_admin(auth.uid()));
CREATE POLICY "Only admins can modify applications"
  ON applications FOR ALL
  USING (public.is_admin(auth.uid()));

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_programs_active ON programs(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_program_highlights_program ON program_highlights(program_id, display_order);
CREATE INDEX IF NOT EXISTS idx_program_outcomes_program ON program_outcomes(program_id, display_order);
CREATE INDEX IF NOT EXISTS idx_program_projects_program ON program_projects(program_id, display_order);
CREATE INDEX IF NOT EXISTS idx_curriculum_modules_program ON curriculum_modules(program_id, display_order);
CREATE INDEX IF NOT EXISTS idx_curriculum_topics_module ON curriculum_topics(module_id, display_order);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_student ON student_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_program ON student_enrollments(program_id);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_items(category, display_order);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status, submitted_at);
CREATE INDEX IF NOT EXISTS idx_applications_program ON applications(program_id);

-- ============================================
-- UPDATE TRIGGERS
-- ============================================
CREATE OR REPLACE TRIGGER on_program_updated
  BEFORE UPDATE ON programs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER on_curriculum_module_updated
  BEFORE UPDATE ON curriculum_modules
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER on_instructor_updated
  BEFORE UPDATE ON instructors
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER on_gallery_item_updated
  BEFORE UPDATE ON gallery_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER on_course_updated
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
