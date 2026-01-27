'use server'

import { createClient } from '../server'

// Get student's own profile data
export async function getStudentProfile(studentId: string) {
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
    .eq('id', studentId)
    .eq('role', 'student')
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data: profile, error: null }
}

// Get student's upcoming sessions
export async function getStudentUpcomingSessions(studentId: string) {
  const supabase = await createClient()
  
  // Get student's course enrollments
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('course_id')
    .eq('student_id', studentId)
    .eq('status', 'active')

  const courseIds = enrollments?.map(e => e.course_id) || []

  if (courseIds.length === 0) {
    return { data: [], error: null }
  }

  // Get upcoming sessions for enrolled courses
  // Calculate next occurrence of each session based on day_of_week
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select(`
      *,
      courses (
        id,
        name,
        level
      ),
      instructors (
        id,
        profiles (
          full_name
        )
      )
    `)
    .in('course_id', courseIds)
    .eq('is_recurring', true)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    return { data: null, error }
  }

  // Find the next session (first session that hasn't occurred yet this week)
  const today = new Date()
  const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.
  
  const nextSession = sessions?.find(session => {
    const sessionDay = session.day_of_week === 0 ? 7 : session.day_of_week // Convert Sunday from 0 to 7
    return sessionDay >= currentDay
  }) || sessions?.[0] // If no session this week, get first one

  return { data: nextSession || null, error: null }
}

// Get student's attendance statistics
export async function getStudentAttendanceStats(studentId: string) {
  const supabase = await createClient()
  
  const { data: attendance, error } = await supabase
    .from('session_attendance')
    .select('status')
    .eq('student_id', studentId)

  if (error) {
    return { data: null, error }
  }

  const total = attendance?.length || 0
  const present = attendance?.filter(a => a.status === 'present').length || 0
  const absent = attendance?.filter(a => a.status === 'absent').length || 0
  const late = attendance?.filter(a => a.status === 'late').length || 0

  return {
    data: {
      total,
      present,
      absent,
      late,
      attendanceRate: total > 0 ? Math.round((present / total) * 100) : 0,
    },
    error: null
  }
}

// Get student's course enrollments
export async function getStudentEnrollments(studentId: string) {
  const supabase = await createClient()
  
  const { data: enrollments, error } = await supabase
    .from('course_enrollments')
    .select(`
      *,
      courses (
        id,
        name,
        level,
        description
      )
    `)
    .eq('student_id', studentId)
    .order('enrolled_at', { ascending: false })

  if (error) {
    return { data: null, error }
  }

  return { data: enrollments, error: null }
}

// Get student's recent attendance records
export async function getStudentRecentAttendance(studentId: string, limit: number = 10) {
  const supabase = await createClient()
  
  const { data: attendance, error } = await supabase
    .from('session_attendance')
    .select(`
      *,
      sessions (
        courses (
          name
        ),
        day_of_week,
        start_time,
        end_time
      )
    `)
    .eq('student_id', studentId)
    .order('date', { ascending: false })
    .limit(limit)

  if (error) {
    return { data: null, error }
  }

  return { data: attendance, error: null }
}

// Get student's program enrollments
export async function getStudentProgramEnrollments(studentId: string) {
  const supabase = await createClient()
  
  const { data: enrollments, error } = await supabase
    .from('student_enrollments')
    .select(`
      *,
      programs (
        id,
        title,
        description
      )
    `)
    .eq('student_id', studentId)
    .order('enrolled_at', { ascending: false })

  if (error) {
    return { data: null, error }
  }

  return { data: enrollments, error: null }
}
