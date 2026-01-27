-- Fix courses table if columns are missing
-- Run this if you get "column does not exist" errors

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Add age_range_min if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'age_range_min'
  ) THEN
    ALTER TABLE courses ADD COLUMN age_range_min INTEGER;
  END IF;

  -- Add age_range_max if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'age_range_max'
  ) THEN
    ALTER TABLE courses ADD COLUMN age_range_max INTEGER;
  END IF;

  -- Add duration_months if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'duration_months'
  ) THEN
    ALTER TABLE courses ADD COLUMN duration_months INTEGER;
  END IF;

  -- Add price_per_month if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'price_per_month'
  ) THEN
    ALTER TABLE courses ADD COLUMN price_per_month DECIMAL(10, 2);
  END IF;

  -- Add instructor_id if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'instructor_id'
  ) THEN
    ALTER TABLE courses ADD COLUMN instructor_id UUID;
  END IF;

  -- Add max_students if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'max_students'
  ) THEN
    ALTER TABLE courses ADD COLUMN max_students INTEGER DEFAULT 20;
  END IF;

  -- Add current_students if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'current_students'
  ) THEN
    ALTER TABLE courses ADD COLUMN current_students INTEGER DEFAULT 0;
  END IF;

  -- Add status if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'status'
  ) THEN
    ALTER TABLE courses ADD COLUMN status TEXT DEFAULT 'draft';
  END IF;

  -- Add description if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'description'
  ) THEN
    ALTER TABLE courses ADD COLUMN description TEXT;
  END IF;

  -- Add level if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'level'
  ) THEN
    ALTER TABLE courses ADD COLUMN level TEXT;
  END IF;
END $$;

-- Add foreign key constraint for instructor_id if instructors table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'instructors') THEN
    -- Drop existing constraint if it exists
    ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_instructor_id_fkey;
    -- Add the constraint
    ALTER TABLE courses 
    ADD CONSTRAINT courses_instructor_id_fkey 
    FOREIGN KEY (instructor_id) REFERENCES instructors(id) ON DELETE SET NULL;
  END IF;
END $$;
