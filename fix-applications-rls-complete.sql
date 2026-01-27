-- Complete fix for applications table RLS policies
-- Run this SQL in your Supabase SQL Editor

-- First, drop ALL existing policies on applications table
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'applications') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON applications';
    END LOOP;
END $$;

-- Ensure RLS is enabled
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create insert policy that allows anyone (including anonymous users) to insert
-- This is critical for the public application form
-- The key is using WITH CHECK (true) which allows any row to be inserted
CREATE POLICY "Allow public application submissions"
  ON applications FOR INSERT
  WITH CHECK (true);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE public.is_admin(auth.uid())
    END
  );

-- Admins can update applications
CREATE POLICY "Admins can update applications"
  ON applications FOR UPDATE
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE public.is_admin(auth.uid())
    END
  );

-- Admins can delete applications
CREATE POLICY "Admins can delete applications"
  ON applications FOR DELETE
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE public.is_admin(auth.uid())
    END
  );

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'applications';
