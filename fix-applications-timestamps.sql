-- Fix applications table: Add missing created_at and updated_at columns
-- Run this SQL in your Supabase SQL Editor

DO $$
BEGIN
  -- Check if applications table exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'applications' AND table_schema = 'public') THEN
    
    -- Add created_at column if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'applications' 
      AND column_name = 'created_at'
      AND table_schema = 'public'
    ) THEN
      ALTER TABLE applications 
      ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
      
      -- Set default value for existing rows
      UPDATE applications 
      SET created_at = COALESCE(created_at, NOW())
      WHERE created_at IS NULL;
    END IF;
    
    -- Add updated_at column if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'applications' 
      AND column_name = 'updated_at'
      AND table_schema = 'public'
    ) THEN
      ALTER TABLE applications 
      ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
      
      -- Set default value for existing rows
      UPDATE applications 
      SET updated_at = COALESCE(updated_at, NOW())
      WHERE updated_at IS NULL;
    END IF;
    
  END IF;
END $$;

-- Create or replace function to update updated_at column (must be outside DO block)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on row update
DROP TRIGGER IF EXISTS update_applications_updated_at ON applications;
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify the columns were added
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'applications' 
  AND table_schema = 'public'
  AND column_name IN ('created_at', 'updated_at')
ORDER BY column_name;
