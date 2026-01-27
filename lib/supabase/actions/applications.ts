'use server'

import { createClient } from '../server'
import { createAdminClient } from '../admin'
import { revalidatePath } from 'next/cache'

export async function getApplications() {
  const supabase = await createClient()
  
  // First verify the user is authenticated and check their role
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    console.error('Auth error in getApplications:', authError)
    return { data: null, error: authError || new Error('Not authenticated') }
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
  }

  console.log('User role check:', { userId: user.id, role: profile?.role, isAdmin: profile?.role === 'admin' })
  
  // For admin users, use admin client directly to bypass RLS issues
  if (profile?.role === 'admin') {
    try {
      const adminSupabase = createAdminClient()
      const { data: applications, error: adminError } = await adminSupabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (adminError) {
        console.error('Admin client error:', adminError)
        // Fall through to try regular client
      } else if (applications) {
        console.log('Successfully fetched applications using admin client:', applications.length)
        
        // Fetch programs separately
        const programIds = applications
          .map(app => app.program_id)
          .filter((id): id is string => id !== null && id !== undefined)
        
        let programsMap: Record<string, { id: string; title: string }> = {}
        
        if (programIds.length > 0) {
          const { data: programs } = await adminSupabase
            .from('programs')
            .select('id, title')
            .in('id', programIds)
          
          if (programs) {
            programsMap = programs.reduce((acc, prog) => {
              acc[prog.id] = prog
              return acc
            }, {} as Record<string, { id: string; title: string }>)
          }
        }
        
        const applicationsWithPrograms = applications.map(app => ({
          ...app,
          programs: app.program_id && programsMap[app.program_id] 
            ? programsMap[app.program_id] 
            : null
        }))
        
        return { data: applicationsWithPrograms, error: null }
      }
    } catch (adminClientError: any) {
      console.error('Admin client error:', adminClientError)
      // Fall through to try regular client
    }
  }
  
  // Fallback: Try with regular client (respects RLS)
  const { data: applications, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching applications:', error)
    console.error('Error details:', { message: error.message, code: error.code, details: error.details, hint: error.hint })
    
    // Fallback: Try with admin client if regular client fails (for admin operations)
    if (profile?.role === 'admin') {
      try {
        const adminSupabase = createAdminClient()
        const { data: adminApplications, error: adminError } = await adminSupabase
          .from('applications')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (!adminError && adminApplications) {
          console.log('Successfully fetched applications using admin client:', adminApplications.length)
          // Still fetch programs separately
          const programIds = adminApplications
            .map(app => app.program_id)
            .filter((id): id is string => id !== null && id !== undefined)
          
          let programsMap: Record<string, { id: string; title: string }> = {}
          
          if (programIds.length > 0) {
            const { data: programs } = await adminSupabase
              .from('programs')
              .select('id, title')
              .in('id', programIds)
            
            if (programs) {
              programsMap = programs.reduce((acc, prog) => {
                acc[prog.id] = prog
                return acc
              }, {} as Record<string, { id: string; title: string }>)
            }
          }
          
          const applicationsWithPrograms = adminApplications.map(app => ({
            ...app,
            programs: app.program_id && programsMap[app.program_id] 
              ? programsMap[app.program_id] 
              : null
          }))
          
          return { data: applicationsWithPrograms, error: null }
        }
      } catch (adminClientError) {
        console.error('Admin client fallback also failed:', adminClientError)
      }
    }
    
    return { data: null, error }
  }

  console.log('Applications fetched:', applications?.length || 0)

  if (!applications || applications.length === 0) {
    return { data: [], error: null }
  }

  // Fetch programs separately and attach them
  const programIds = applications
    .map(app => app.program_id)
    .filter((id): id is string => id !== null && id !== undefined)
  
  let programsMap: Record<string, { id: string; title: string }> = {}
  
  if (programIds.length > 0) {
    const { data: programs } = await supabase
      .from('programs')
      .select('id, title')
      .in('id', programIds)
    
    if (programs) {
      programsMap = programs.reduce((acc, prog) => {
        acc[prog.id] = prog
        return acc
      }, {} as Record<string, { id: string; title: string }>)
    }
  }

  // Attach programs to applications
  const applicationsWithPrograms = applications.map(app => ({
    ...app,
    programs: app.program_id && programsMap[app.program_id] 
      ? programsMap[app.program_id] 
      : null
  }))

  return { data: applicationsWithPrograms, error: null }
}

export async function getApplicationStats() {
  const supabase = await createClient()
  
  const { data: applications, error } = await supabase
    .from('applications')
    .select('status')

  if (error) {
    return { data: null, error }
  }

  const pending = applications?.filter(a => a.status === 'pending').length || 0
  const approved = applications?.filter(a => a.status === 'approved').length || 0
  const rejected = applications?.filter(a => a.status === 'rejected').length || 0

  return {
    data: {
      pending,
      approved,
      rejected,
    },
    error: null
  }
}

export async function getApplicationById(id: string) {
  const supabase = await createClient()
  
  const { data: application, error } = await supabase
    .from('applications')
    .select(`
      *,
      programs (
        id,
        title
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data: application, error: null }
}

export async function createApplication(applicationData: {
  parent_name: string
  parent_email: string
  parent_phone: string
  student_name: string
  student_age: number
  student_grade?: string
  school_name?: string
  program_id?: string
  branch?: string
  application_type?: string
  notes?: string
}) {
  const supabase = await createClient()
  
  // Try using RPC function first (bypasses RLS)
  const { data: applicationJson, error: rpcError } = await supabase.rpc('insert_application', {
    p_parent_name: applicationData.parent_name,
    p_parent_email: applicationData.parent_email,
    p_parent_phone: applicationData.parent_phone,
    p_student_name: applicationData.student_name,
    p_student_age: applicationData.student_age,
    p_student_grade: applicationData.student_grade || null,
    p_school_name: applicationData.school_name || null,
    p_program_id: applicationData.program_id || null,
    p_branch: applicationData.branch || null,
    p_application_type: applicationData.application_type || 'trial',
    p_notes: applicationData.notes || null,
  })

  if (!rpcError && applicationJson) {
    // Function returns JSONB, convert to object
    const application = typeof applicationJson === 'string' 
      ? JSON.parse(applicationJson) 
      : applicationJson
    revalidatePath('/admin/applications')
    return { data: application, error: null }
  }

  // Fallback to direct insert if RPC function doesn't exist
  const { data: application, error } = await supabase
    .from('applications')
    .insert({
      parent_name: applicationData.parent_name,
      parent_email: applicationData.parent_email,
      parent_phone: applicationData.parent_phone,
      student_name: applicationData.student_name,
      student_age: applicationData.student_age,
      student_grade: applicationData.student_grade || null,
      school_name: applicationData.school_name || null,
      program_id: applicationData.program_id || null,
      branch: applicationData.branch || null,
      application_type: applicationData.application_type || 'trial',
      notes: applicationData.notes || null,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  revalidatePath('/admin/applications')
  
  return { data: application, error: null }
}

export async function updateApplicationStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected' | 'cancelled',
  reviewNotes?: string
) {
  const supabase = await createClient()
  
  // Get current user for reviewed_by
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: application, error } = await supabase
    .from('applications')
    .update({
      status,
      reviewed_by: user?.id || null,
      reviewed_at: new Date().toISOString(),
      review_notes: reviewNotes || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  revalidatePath('/admin/applications')
  
  return { data: application, error: null }
}
