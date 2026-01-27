-- Fix applications SELECT RLS policy to ensure admins can view all applications
-- Run this SQL in your Supabase SQL Editor

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Admins can view all applications" ON applications;
DROP POLICY IF EXISTS "admin_view_applications" ON applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;

-- Create a simple, permissive SELECT policy for admins
-- This ensures admins can read applications even when joining with other tables
CREATE POLICY "admin_view_applications"
  ON public.applications
  FOR SELECT
  USING (
    -- Allow if user is authenticated and is an admin
    auth.uid() IS NOT NULL AND public.is_admin(auth.uid())
  );

-- Also ensure the programs table allows reads (needed for the join)
-- Check if programs table has a public read policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'programs' 
    AND schemaname = 'public'
    AND cmd = 'SELECT'
    AND (qual::text LIKE '%true%' OR qual::text = 'true')
  ) THEN
    -- Create a policy that allows everyone to read programs (they're public data)
    CREATE POLICY "programs_public_read"
      ON public.programs
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- Verify the policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename IN ('applications', 'programs')
  AND schemaname = 'public'
ORDER BY tablename, policyname;
