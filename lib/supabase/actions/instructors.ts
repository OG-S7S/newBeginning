'use server'

import { createClient } from '../server'
import { revalidatePath } from 'next/cache'

export async function getInstructors() {
  const supabase = await createClient()
  
  const { data: instructors, error } = await supabase
    .from('instructors')
    .select(`
      *,
      profiles (
        id,
        email,
        full_name
      ),
      instructor_assignments (
        program_id,
        programs (
          id,
          title
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching instructors:', error)
    return { data: null, error }
  }

  // Calculate courses and students count
  const instructorsWithStats = instructors?.map(instructor => {
    const programs = (instructor.instructor_assignments || []).map((a: any) => a.programs?.title || a.program_id)
    const programIds = (instructor.instructor_assignments || []).map((a: any) => a.program_id || a.programs?.id).filter(Boolean)
    
    // Count students enrolled in instructor's programs
    // This would require a more complex query, for now we'll use placeholder
    return {
      ...instructor,
      profile: instructor.profiles,
      programs: programs,
      program_ids: programIds,
      courses_count: programs.length,
      students_count: 0, // Will be calculated separately if needed
    }
  })

  return { data: instructorsWithStats, error: null }
}

export async function getInstructorStats() {
  const supabase = await createClient()
  
  const { data: instructors, error } = await supabase
    .from('instructors')
    .select('status')

  if (error) {
    return { data: null, error }
  }

  const total = instructors?.length || 0
  const active = instructors?.filter(i => i.status === 'active').length || 0
  const inactive = instructors?.filter(i => i.status === 'inactive').length || 0

  // Count total courses (program assignments)
  const { data: assignments } = await supabase
    .from('instructor_assignments')
    .select('id')
  
  const totalCourses = assignments?.length || 0

  return {
    data: {
      total,
      active,
      inactive,
      totalCourses,
    },
    error: null
  }
}

export async function getInstructorById(id: string) {
  const supabase = await createClient()
  
  const { data: instructor, error } = await supabase
    .from('instructors')
    .select(`
      *,
      profiles (
        id,
        email,
        full_name
      ),
      instructor_assignments (
        *,
        programs (
          id,
          title
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data: instructor, error: null }
}

export async function createInstructor(instructorData: {
  email: string
  full_name: string
  title: string
  phone?: string
  specializations?: string[]
  program_ids?: string[]
  status?: string
  join_date?: string
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
  const password = instructorData.password || Math.random().toString(36).slice(-12) + 'A1!'
  
  // First create auth user using admin client
  const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
    email: instructorData.email,
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
  const { error: profileError } = existingProfile
    ? await adminSupabase
        .from('profiles')
        .update({
          email: instructorData.email,
          full_name: instructorData.full_name,
          role: 'instructor',
        })
        .eq('id', authData.user.id)
    : await adminSupabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: instructorData.email,
          full_name: instructorData.full_name,
          role: 'instructor',
        })

  if (profileError) {
    try {
      await adminSupabase.auth.admin.deleteUser(authData.user.id)
    } catch (err) {
      console.error('Could not delete auth user:', err)
    }
    return { data: null, error: profileError }
  }

  // Create instructor record using admin client to bypass RLS
  const { data: instructor, error: instructorError } = await adminSupabase
    .from('instructors')
    .insert({
      profile_id: authData.user.id,
      title: instructorData.title,
      phone: instructorData.phone,
      specializations: instructorData.specializations || [],
      status: instructorData.status || 'active',
      join_date: instructorData.join_date ? new Date(instructorData.join_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    })
    .select()
    .single()

  if (instructorError) {
    try {
      await adminSupabase.auth.admin.deleteUser(authData.user.id)
    } catch (err) {
      console.error('Could not delete auth user:', err)
    }
    return { data: null, error: instructorError }
  }

  // Create assignments if programs provided (using admin client)
  if (instructorData.program_ids && instructorData.program_ids.length > 0) {
    const assignments = instructorData.program_ids.map(program_id => ({
      instructor_id: instructor.id,
      program_id,
    }))

    await adminSupabase.from('instructor_assignments').insert(assignments)
  }

  revalidatePath('/admin/instructors')
  
  return { data: instructor, error: null }
}

export async function updateInstructor(id: string, instructorData: {
  title?: string
  phone?: string
  specializations?: string[]
  status?: string
  program_ids?: string[]
}) {
  const supabase = await createClient()
  
  const updateData: any = {}
  if (instructorData.title !== undefined) updateData.title = instructorData.title
  if (instructorData.phone !== undefined) updateData.phone = instructorData.phone
  if (instructorData.specializations !== undefined) updateData.specializations = instructorData.specializations
  if (instructorData.status !== undefined) updateData.status = instructorData.status

  const { data: instructor, error: instructorError } = await supabase
    .from('instructors')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (instructorError) {
    return { data: null, error: instructorError }
  }

  // Update assignments if provided
  if (instructorData.program_ids !== undefined) {
    // Delete existing assignments
    await supabase.from('instructor_assignments').delete().eq('instructor_id', id)
    
    // Create new assignments
    if (instructorData.program_ids.length > 0) {
      const assignments = instructorData.program_ids.map(program_id => ({
        instructor_id: id,
        program_id,
      }))
      await supabase.from('instructor_assignments').insert(assignments)
    }
  }

  revalidatePath('/admin/instructors')
  
  return { data: instructor, error: null }
}

export async function deleteInstructor(id: string) {
  const supabase = await createClient()
  
  // Get profile_id first
  const { data: instructor } = await supabase
    .from('instructors')
    .select('profile_id')
    .eq('id', id)
    .single()

  // Use admin client for deletions to bypass RLS
  let adminSupabase
  try {
    const { createAdminClient } = await import('../admin')
    adminSupabase = createAdminClient()
  } catch (err) {
    // If service role key not available, use regular client (may fail due to RLS)
    adminSupabase = supabase
  }
  
  // Delete assignments
  await adminSupabase.from('instructor_assignments').delete().eq('instructor_id', id)
  
  // Delete instructor record
  const { error: instructorError } = await adminSupabase
    .from('instructors')
    .delete()
    .eq('id', id)

  if (instructorError) {
    return { error: instructorError }
  }

  // Delete profile and auth user if exists
  if (instructor?.profile_id) {
    await adminSupabase.from('profiles').delete().eq('id', instructor.profile_id)
    try {
      await adminSupabase.auth.admin.deleteUser(instructor.profile_id)
    } catch (err) {
      console.error('Could not delete auth user (service role key may be missing):', err)
    }
  }

  revalidatePath('/admin/instructors')
  
  return { error: null }
}
