'use server'

import { createClient } from '../server'
import { revalidatePath } from 'next/cache'

export async function getCourses() {
  const supabase = await createClient()
  
  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      *,
      programs (
        id,
        title
      ),
      instructors (
        id,
        profiles (
          full_name
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching courses:', error)
    return { data: null, error }
  }

  return { data: courses, error: null }
}

export async function getCourseStats() {
  const supabase = await createClient()
  
  const { data: courses, error } = await supabase
    .from('courses')
    .select('status, current_students')

  if (error) {
    return { data: null, error }
  }

  const total = courses?.length || 0
  const active = courses?.filter(c => c.status === 'active').length || 0
  const draft = courses?.filter(c => c.status === 'draft').length || 0
  const totalEnrollments = courses?.reduce((acc, c) => acc + (c.current_students || 0), 0) || 0

  return {
    data: {
      total,
      active,
      draft,
      totalEnrollments,
    },
    error: null
  }
}

export async function getCourseById(id: string) {
  const supabase = await createClient()
  
  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      programs (
        id,
        title
      ),
      instructors (
        id,
        profiles (
          full_name
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data: course, error: null }
}

export async function createCourse(courseData: {
  name: string
  program_id?: string
  level: string
  age_range_min: number
  age_range_max: number
  duration_months: number
  price_per_month: number
  instructor_id?: string
  max_students?: number
  status?: string
  description?: string
}) {
  const supabase = await createClient()
  
  const { data: course, error } = await supabase
    .from('courses')
    .insert({
      name: courseData.name,
      program_id: courseData.program_id || null,
      level: courseData.level,
      age_range_min: courseData.age_range_min,
      age_range_max: courseData.age_range_max,
      duration_months: courseData.duration_months,
      price_per_month: courseData.price_per_month,
      instructor_id: courseData.instructor_id || null,
      max_students: courseData.max_students || 20,
      status: courseData.status || 'draft',
      description: courseData.description || null,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  revalidatePath('/admin/courses')
  
  return { data: course, error: null }
}

export async function updateCourse(id: string, courseData: {
  name?: string
  program_id?: string
  level?: string
  age_range_min?: number
  age_range_max?: number
  duration_months?: number
  price_per_month?: number
  instructor_id?: string
  max_students?: number
  status?: string
  description?: string
}) {
  const supabase = await createClient()
  
  const updateData: any = {}
  if (courseData.name !== undefined) updateData.name = courseData.name
  if (courseData.program_id !== undefined) updateData.program_id = courseData.program_id || null
  if (courseData.level !== undefined) updateData.level = courseData.level
  if (courseData.age_range_min !== undefined) updateData.age_range_min = courseData.age_range_min
  if (courseData.age_range_max !== undefined) updateData.age_range_max = courseData.age_range_max
  if (courseData.duration_months !== undefined) updateData.duration_months = courseData.duration_months
  if (courseData.price_per_month !== undefined) updateData.price_per_month = courseData.price_per_month
  if (courseData.instructor_id !== undefined) updateData.instructor_id = courseData.instructor_id || null
  if (courseData.max_students !== undefined) updateData.max_students = courseData.max_students
  if (courseData.status !== undefined) updateData.status = courseData.status
  if (courseData.description !== undefined) updateData.description = courseData.description

  const { data: course, error } = await supabase
    .from('courses')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  revalidatePath('/admin/courses')
  
  return { data: course, error: null }
}

export async function deleteCourse(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id)

  if (error) {
    return { error }
  }

  revalidatePath('/admin/courses')
  
  return { error: null }
}
