-- Fix courses table: Migrate from 'title' to 'name' column
-- Run this SQL in your Supabase SQL Editor

DO $$
BEGIN
  -- Check if table has 'title' column (old structure)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'title'
  ) THEN
    -- If 'name' column doesn't exist, add it
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'courses' AND column_name = 'name'
    ) THEN
      -- Add name column and copy data from title
      ALTER TABLE courses ADD COLUMN name TEXT;
      UPDATE courses SET name = title WHERE name IS NULL;
    END IF;
    
    -- Make title nullable (so we can drop it later)
    ALTER TABLE courses ALTER COLUMN title DROP NOT NULL;
    
    -- Copy any remaining data
    UPDATE courses SET name = COALESCE(name, title) WHERE name IS NULL;
    
    -- Make name NOT NULL if it has data
    UPDATE courses SET name = COALESCE(name, 'Unnamed Course') WHERE name IS NULL;
    ALTER TABLE courses ALTER COLUMN name SET NOT NULL;
    
    -- Drop the old title column
    ALTER TABLE courses DROP COLUMN IF EXISTS title;
  END IF;
  
  -- Ensure name column exists and is NOT NULL
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'name'
  ) THEN
    ALTER TABLE courses ADD COLUMN name TEXT NOT NULL DEFAULT 'Unnamed Course';
  END IF;
  
  -- Add all other missing columns
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
  
  -- Fix the level check constraint to match the code (title case)
  -- Drop old constraint if it exists
  ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_level_check;
  -- Add new constraint with title case
  ALTER TABLE courses ADD CONSTRAINT courses_level_check 
    CHECK (level IS NULL OR level IN ('Beginner', 'Intermediate', 'Advanced'));
END $$;
