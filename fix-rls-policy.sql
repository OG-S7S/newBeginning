-- Fix RLS Policy Circular Dependency
-- Run this in Supabase SQL Editor

-- Step 1: Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Step 2: Create a function that bypasses RLS to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Use SECURITY DEFINER to bypass RLS when checking admin status
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Recreate the admin policies using the function
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Step 4: Verify the function works
-- This should return true if your user is an admin (replace with your user UUID)
-- SELECT public.is_admin('your-user-uuid-here');
