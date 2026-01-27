-- Fix applications table: Add missing columns
-- Run this SQL in your Supabase SQL Editor

DO $$
BEGIN
  -- Check if applications table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'applications') THEN
    -- Add application_type column if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'applications' AND column_name = 'application_type'
    ) THEN
      ALTER TABLE applications ADD COLUMN application_type TEXT DEFAULT 'trial';
      -- Add check constraint
      ALTER TABLE applications ADD CONSTRAINT applications_application_type_check 
        CHECK (application_type IN ('trial', 'enrollment'));
    END IF;
    
    -- Add branch column if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'applications' AND column_name = 'branch'
    ) THEN
      ALTER TABLE applications ADD COLUMN branch TEXT;
    END IF;
    
    -- Add student_grade column if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'applications' AND column_name = 'student_grade'
    ) THEN
      ALTER TABLE applications ADD COLUMN student_grade TEXT;
    END IF;
    
    -- Add school_name column if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'applications' AND column_name = 'school_name'
    ) THEN
      ALTER TABLE applications ADD COLUMN school_name TEXT;
    END IF;
    
    -- Add reviewed_by column if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'applications' AND column_name = 'reviewed_by'
    ) THEN
      ALTER TABLE applications ADD COLUMN reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
    
    -- Add reviewed_at column if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'applications' AND column_name = 'reviewed_at'
    ) THEN
      ALTER TABLE applications ADD COLUMN reviewed_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add review_notes column if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'applications' AND column_name = 'review_notes'
    ) THEN
      ALTER TABLE applications ADD COLUMN review_notes TEXT;
    END IF;
    
    -- Update status constraint if needed
    ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;
    ALTER TABLE applications ADD CONSTRAINT applications_status_check 
      CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled'));
  END IF;
END $$;
