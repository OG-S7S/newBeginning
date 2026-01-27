-- Fix applications table RLS policies to allow public inserts
-- Run this SQL in your Supabase SQL Editor

-- Enable RLS if not already enabled
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create applications" ON applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON applications;
DROP POLICY IF EXISTS "Admins can update applications" ON applications;
DROP POLICY IF EXISTS "Admins can delete applications" ON applications;

-- Create policies
-- Allow anyone to create applications (for public form submissions)
CREATE POLICY "Anyone can create applications"
  ON applications FOR INSERT
  WITH CHECK (true);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
  ON applications FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Admins can update applications
CREATE POLICY "Admins can update applications"
  ON applications FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Admins can delete applications
CREATE POLICY "Admins can delete applications"
  ON applications FOR DELETE
  USING (public.is_admin(auth.uid()));
