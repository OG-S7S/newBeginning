-- Fix the level check constraint to accept title case values
-- Run this SQL in your Supabase SQL Editor

-- Drop the old constraint (might be lowercase)
ALTER TABLE courses DROP CONSTRAINT IF EXISTS courses_level_check;

-- Add new constraint with title case (matching the code)
ALTER TABLE courses ADD CONSTRAINT courses_level_check 
  CHECK (level IS NULL OR level IN ('Beginner', 'Intermediate', 'Advanced'));

-- Also update any existing lowercase values to title case
UPDATE courses 
SET level = INITCAP(level)
WHERE level IN ('beginner', 'intermediate', 'advanced');
