'use server'

import { createClient } from '../server'
import { revalidatePath } from 'next/cache'

export async function getReports() {
  const supabase = await createClient()
  
  const { data: reports, error } = await supabase
    .from('reports')
    .select('*')
    .order('generated_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching reports:', error)
    return { data: null, error }
  }

  return { data: reports, error: null }
}

export async function generateReport(reportData: {
  title: string
  description?: string
  report_type: string
  parameters?: any
}) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  // For now, we'll just create a report record
  // In a real implementation, you'd generate the actual report file
  const { data: report, error } = await supabase
    .from('reports')
    .insert({
      title: reportData.title,
      description: reportData.description || null,
      report_type: reportData.report_type,
      generated_by: user?.id || null,
      parameters: reportData.parameters || null,
      file_format: 'pdf',
    })
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  revalidatePath('/admin/reports')
  
  return { data: report, error: null }
}

export async function getReportData(reportType: string, parameters?: any) {
  const supabase = await createClient()
  
  switch (reportType) {
    case 'enrollment':
      const { data: enrollments } = await supabase
        .from('student_enrollments')
        .select(`
          *,
          profiles (
            full_name,
            email,
            age
          ),
          programs (
            title
          )
        `)
        .order('enrolled_at', { ascending: false })
      
      return { data: enrollments, error: null }
    
    case 'financial':
      const { data: payments } = await supabase
        .from('payments')
        .select(`
          *,
          profiles (
            full_name
          ),
          courses (
            name
          )
        `)
        .order('payment_date', { ascending: false })
      
      return { data: payments, error: null }
    
    case 'attendance':
      const { data: attendance } = await supabase
        .from('session_attendance')
        .select(`
          *,
          sessions (
            courses (
              name
            )
          ),
          profiles (
            full_name
          )
        `)
        .order('date', { ascending: false })
      
      return { data: attendance, error: null }
    
    case 'performance':
      // Course completion rates
      const { data: courseEnrollments } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          courses (
            name
          ),
          profiles (
            full_name
          )
        `)
      
      return { data: courseEnrollments, error: null }
    
    case 'instructor':
      const { data: instructors } = await supabase
        .from('instructors')
        .select(`
          *,
          profiles (
            full_name,
            email
          ),
          instructor_assignments (
            programs (
              title
            )
          )
        `)
      
      return { data: instructors, error: null }
    
    default:
      return { data: null, error: { message: 'Unknown report type' } as any }
  }
}
