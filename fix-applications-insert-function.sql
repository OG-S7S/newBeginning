-- Create a SECURITY DEFINER function to insert applications (bypasses RLS)
-- Run this SQL in your Supabase SQL Editor

-- Drop the existing function if it exists (needed to change return type)
DROP FUNCTION IF EXISTS public.insert_application(
  TEXT, TEXT, TEXT, TEXT, INTEGER, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
);

-- Create function that bypasses RLS for inserting applications
-- Returns JSONB for easier handling
CREATE OR REPLACE FUNCTION public.insert_application(
  p_parent_name TEXT,
  p_parent_email TEXT,
  p_parent_phone TEXT,
  p_student_name TEXT,
  p_student_age INTEGER,
  p_student_grade TEXT DEFAULT NULL,
  p_school_name TEXT DEFAULT NULL,
  p_program_id TEXT DEFAULT NULL,
  p_branch TEXT DEFAULT NULL,
  p_application_type TEXT DEFAULT 'trial',
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_application applications%ROWTYPE;
BEGIN
  INSERT INTO applications (
    parent_name,
    parent_email,
    parent_phone,
    student_name,
    student_age,
    student_grade,
    school_name,
    program_id,
    branch,
    application_type,
    notes,
    status
  ) VALUES (
    p_parent_name,
    p_parent_email,
    p_parent_phone,
    p_student_name,
    p_student_age,
    p_student_grade,
    p_school_name,
    p_program_id,
    p_branch,
    p_application_type,
    p_notes,
    'pending'
  )
  RETURNING * INTO v_application;
  
  RETURN to_jsonb(v_application);
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.insert_application TO anon;
GRANT EXECUTE ON FUNCTION public.insert_application TO authenticated;
GRANT EXECUTE ON FUNCTION public.insert_application TO public;

-- Also ensure the insert policy exists (as backup)
DROP POLICY IF EXISTS "public_application_insert" ON applications;
CREATE POLICY "public_application_insert"
  ON applications
  FOR INSERT
  WITH CHECK (true);
