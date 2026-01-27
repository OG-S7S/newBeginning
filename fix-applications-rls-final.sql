-- Final fix for applications table RLS - Allow anonymous inserts
-- Run this SQL in your Supabase SQL Editor

-- Drop ALL existing policies
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'applications' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.applications';
    END LOOP;
END $$;

-- Ensure RLS is enabled
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- CRITICAL: Create a permissive insert policy that allows ANYONE (including anonymous) to insert
-- This must be PERMISSIVE (default) and use WITH CHECK (true)
CREATE POLICY "public_application_insert"
  ON public.applications
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Admins can view all applications
CREATE POLICY "admin_view_applications"
  ON public.applications
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND public.is_admin(auth.uid())
  );

-- Admins can update applications  
CREATE POLICY "admin_update_applications"
  ON public.applications
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND public.is_admin(auth.uid())
  );

-- Admins can delete applications
CREATE POLICY "admin_delete_applications"
  ON public.applications
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND public.is_admin(auth.uid())
  );

-- Verify policies
SELECT 
  policyname, 
  cmd, 
  qual, 
  with_check,
  roles
FROM pg_policies 
WHERE tablename = 'applications' AND schemaname = 'public'
ORDER BY policyname;
