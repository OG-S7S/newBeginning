-- Verify admin access and RLS policies
-- Run this SQL in your Supabase SQL Editor to debug admin access issues

-- 1. Check if is_admin function exists and works
SELECT 
  proname as function_name,
  prosrc as function_body
FROM pg_proc 
WHERE proname = 'is_admin';

-- 2. Test the is_admin function with a specific user (replace with your user ID)
-- First, get your user ID from auth.users or profiles table
SELECT id, email, role FROM profiles WHERE role = 'admin' LIMIT 1;

-- Then test (replace 'USER_ID_HERE' with the actual UUID from above):
-- SELECT public.is_admin('USER_ID_HERE'::uuid);

-- 3. Check all RLS policies on applications table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'applications' AND schemaname = 'public'
ORDER BY policyname;

-- 4. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'applications' AND schemaname = 'public';

-- 5. Count total applications (should work if RLS allows)
SELECT COUNT(*) as total_applications FROM applications;

-- 6. Check if there are any applications with status 'pending'
SELECT COUNT(*) as pending_count FROM applications WHERE status = 'pending';

-- 7. Check if created_at column exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'applications' 
      AND column_name = 'created_at'
      AND table_schema = 'public'
    ) THEN 'created_at column exists - you can order by it'
    ELSE 'created_at column does NOT exist - run fix-applications-timestamps.sql first'
  END as column_status;

-- 8. View a sample application (if RLS allows) - without ordering by created_at
SELECT * FROM applications LIMIT 1;
