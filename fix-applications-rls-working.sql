-- Working fix for applications table RLS - Allow anonymous inserts
-- Run this SQL in your Supabase SQL Editor

-- Drop ALL existing policies first
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'applications' AND schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.applications';
    END LOOP;
END $$;

-- Ensure RLS is enabled
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- CRITICAL FIX: Create insert policy that explicitly allows anonymous users
-- For INSERT operations, we need WITH CHECK (true) and the policy must be permissive
-- Using a function that always returns true to ensure it works
CREATE POLICY "public_application_insert"
  ON public.applications
  FOR INSERT
  WITH CHECK (true);

-- Alternative approach: If above doesn't work, try disabling RLS temporarily or using a function
-- But first, let's try making sure the policy is created correctly

-- Admins can view all applications
CREATE POLICY "admin_view_applications"
  ON public.applications
  FOR SELECT
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE public.is_admin(auth.uid())
    END
  );

-- Admins can update applications  
CREATE POLICY "admin_update_applications"
  ON public.applications
  FOR UPDATE
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE public.is_admin(auth.uid())
    END
  );

-- Admins can delete applications
CREATE POLICY "admin_delete_applications"
  ON public.applications
  FOR DELETE
  USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE public.is_admin(auth.uid())
    END
  );

-- If the above still doesn't work, try temporarily disabling RLS for testing
-- (Only use this for testing, then re-enable with proper policies)
-- ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Verify policies were created
SELECT 
  policyname, 
  cmd, 
  qual, 
  with_check,
  roles
FROM pg_policies 
WHERE tablename = 'applications' AND schemaname = 'public'
ORDER BY policyname;
