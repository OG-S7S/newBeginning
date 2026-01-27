'use server'

import { createClient } from '../server'
import { revalidatePath } from 'next/cache'

export async function getStudents() {
  const supabase = await createClient()
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select(`
      *,
      student_enrollments (
        program_id,
        status,
        enrolled_at
      )
    `)
    .eq('role', 'student')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching students:', error)
    return { data: null, error }
  }

  // Get program names for enrollments
  const programIds = [...new Set(
    profiles?.flatMap(p => 
      (p.student_enrollments || []).map((e: any) => e.program_id)
    ) || []
  )]

  const { data: programs } = await supabase
    .from('programs')
    .select('id, title')
    .in('id', programIds)

  const programMap = new Map(programs?.map(p => [p.id, p.title]) || [])

  // Enhance student data with program names
  const studentsWithPrograms = profiles?.map(profile => ({
    ...profile,
    programs: (profile.student_enrollments || []).map((e: any) => programMap.get(e.program_id) || e.program_id),
    enrollments: profile.student_enrollments || [],
  }))

  return { data: studentsWithPrograms, error: null }
}

export async function getStudentStats() {
  const supabase = await createClient()
  
  const { data: students, error } = await supabase
    .from('profiles')
    .select('status')
    .eq('role', 'student')

  if (error) {
    return { data: null, error }
  }

  const total = students?.length || 0
  const active = students?.filter(s => s.status === 'active').length || 0
  const inactive = students?.filter(s => s.status === 'inactive').length || 0
  const graduated = students?.filter(s => s.status === 'graduated').length || 0

  return {
    data: {
      total,
      active,
      inactive,
      graduated,
    },
    error: null
  }
}

export async function getStudentById(id: string) {
  const supabase = await createClient()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      *,
      student_enrollments (
        *,
        programs (
          id,
          title
        )
      )
    `)
    .eq('id', id)
    .eq('role', 'student')
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data: profile, error: null }
}

export async function createStudent(studentData: {
  email: string
  full_name: string
  phone?: string
  age?: number
  parent_email?: string
  parent_phone?: string
  program_ids?: string[]
  status?: string
  join_date?: string
  notes?: string
  password?: string
}) {
  // Note: Creating users requires SUPABASE_SERVICE_ROLE_KEY
  // If not set, users must be created manually through Supabase Dashboard
  const supabase = await createClient()
  
  // Try to use admin client if service role key is available
  let adminSupabase
  try {
    const { createAdminClient } = await import('../admin')
    adminSupabase = createAdminClient()
  } catch (err) {
    // Service role key not available - return error with instructions
    return { 
      data: null, 
      error: {
        message: 'Service role key not configured. Please set SUPABASE_SERVICE_ROLE_KEY in .env.local, or create users manually through Supabase Dashboard.',
        code: 'SERVICE_ROLE_KEY_MISSING'
      } as any
    }
  }
  
  // Generate password if not provided
  const password = studentData.password || Math.random().toString(36).slice(-12) + 'A1!'
  
  // First create auth user using admin client
  const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
    email: studentData.email,
    password: password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    // Check if user already exists
    if (authError?.message?.includes('already registered') || authError?.message?.includes('already exists')) {
      return { 
        data: null, 
        error: {
          message: 'An account with this email already exists. Please use a different email or update the existing user.',
          code: 'USER_EXISTS'
        } as any
      }
    }
    return { data: null, error: authError || new Error('Failed to create user') }
  }

  // Check if profile already exists (might be created by trigger)
  const { data: existingProfile } = await adminSupabase
    .from('profiles')
    .select('id')
    .eq('id', authData.user.id)
    .single()

  // Create or update profile using admin client to bypass RLS
  const profileData = {
    email: studentData.email,
    full_name: studentData.full_name,
    phone: studentData.phone,
    age: studentData.age,
    parent_email: studentData.parent_email,
    parent_phone: studentData.parent_phone,
    status: studentData.status || 'active',
    join_date: studentData.join_date ? new Date(studentData.join_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    notes: studentData.notes,
    role: 'student',
  }

  const { data: profile, error: profileError } = existingProfile
    ? await adminSupabase
        .from('profiles')
        .update(profileData)
        .eq('id', authData.user.id)
        .select()
        .single()
    : await adminSupabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          ...profileData,
        })
        .select()
        .single()

  if (profileError) {
    // Clean up auth user if profile creation fails
    try {
      await adminSupabase.auth.admin.deleteUser(authData.user.id)
    } catch (err) {
      console.error('Could not delete auth user:', err)
    }
    return { data: null, error: profileError }
  }

  // Create enrollments if programs provided (using admin client)
  if (studentData.program_ids && studentData.program_ids.length > 0) {
    const enrollments = studentData.program_ids.map(program_id => ({
      student_id: authData.user.id,
      program_id,
      status: 'active',
    }))

    await adminSupabase.from('student_enrollments').insert(enrollments)
  }

  revalidatePath('/admin/students')
  
  return { data: profile, error: null }
}

export async function updateStudent(id: string, studentData: {
  full_name?: string
  phone?: string
  age?: number
  parent_email?: string
  parent_phone?: string
  status?: string
  notes?: string
  program_ids?: string[]
}) {
  const supabase = await createClient()
  
  const updateData: any = {}
  if (studentData.full_name !== undefined) updateData.full_name = studentData.full_name
  if (studentData.phone !== undefined) updateData.phone = studentData.phone
  if (studentData.age !== undefined) updateData.age = studentData.age
  if (studentData.parent_email !== undefined) updateData.parent_email = studentData.parent_email
  if (studentData.parent_phone !== undefined) updateData.parent_phone = studentData.parent_phone
  if (studentData.status !== undefined) updateData.status = studentData.status
  if (studentData.notes !== undefined) updateData.notes = studentData.notes

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (profileError) {
    return { data: null, error: profileError }
  }

  // Update enrollments if provided
  if (studentData.program_ids !== undefined) {
    // Delete existing enrollments
    await supabase.from('student_enrollments').delete().eq('student_id', id)
    
    // Create new enrollments
    if (studentData.program_ids.length > 0) {
      const enrollments = studentData.program_ids.map(program_id => ({
        student_id: id,
        program_id,
        status: 'active',
      }))
      await supabase.from('student_enrollments').insert(enrollments)
    }
  }

  revalidatePath('/admin/students')
  
  return { data: profile, error: null }
}

export async function deleteStudent(id: string) {
  const supabase = await createClient()
  
  // Use admin client for deletions to bypass RLS
  let adminSupabase
  try {
    const { createAdminClient } = await import('../admin')
    adminSupabase = createAdminClient()
  } catch (err) {
    // If service role key not available, use regular client (may fail due to RLS)
    adminSupabase = supabase
  }
  
  // Delete enrollments first (CASCADE should handle this, but being explicit)
  await adminSupabase.from('student_enrollments').delete().eq('student_id', id)
  
  // Delete profile
  const { error: profileError } = await adminSupabase
    .from('profiles')
    .delete()
    .eq('id', id)

  if (profileError) {
    return { error: profileError }
  }

  // Try to delete auth user using admin client
  try {
    await adminSupabase.auth.admin.deleteUser(id)
  } catch (err) {
    // If service role key not available, log but don't fail
    console.error('Could not delete auth user (service role key may be missing):', err)
  }

  revalidatePath('/admin/students')
  
  return { error: null }
}
