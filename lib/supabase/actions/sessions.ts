'use server'

import { createClient } from '../server'
import { revalidatePath } from 'next/cache'

export async function getSessions() {
  const supabase = await createClient()
  
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
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching sessions:', error)
    return { data: null, error }
  }

  return { data: sessions, error: null }
}

export async function getSessionStats() {
  const supabase = await createClient()
  
  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('id, current_attendance')

  if (error) {
    return { data: null, error }
  }

  const weeklySessions = sessions?.length || 0
  const totalAttendance = sessions?.reduce((acc, s) => acc + (s.current_attendance || 0), 0) || 0

  // Count unique instructors
  const { data: uniqueInstructors } = await supabase
    .from('sessions')
    .select('instructor_id')
    .not('instructor_id', 'is', null)

  const activeInstructors = new Set(uniqueInstructors?.map(s => s.instructor_id).filter(Boolean) || []).size

  // Count unique rooms
  const { data: uniqueRooms } = await supabase
    .from('sessions')
    .select('room')
    .not('room', 'is', null)

  const rooms = new Set(uniqueRooms?.map(s => s.room).filter(Boolean) || []).size

  return {
    data: {
      weeklySessions,
      activeInstructors,
      rooms,
      totalAttendance,
    },
    error: null
  }
}

export async function createSession(sessionData: {
  course_id: string
  instructor_id?: string
  day_of_week: number
  start_time: string
  end_time: string
  room?: string
  max_capacity?: number
  is_recurring?: boolean
  start_date?: string
  end_date?: string
}) {
  const supabase = await createClient()
  
  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      course_id: sessionData.course_id,
      instructor_id: sessionData.instructor_id || null,
      day_of_week: sessionData.day_of_week,
      start_time: sessionData.start_time,
      end_time: sessionData.end_time,
      room: sessionData.room || null,
      max_capacity: sessionData.max_capacity || 20,
      is_recurring: sessionData.is_recurring !== undefined ? sessionData.is_recurring : true,
      start_date: sessionData.start_date || null,
      end_date: sessionData.end_date || null,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  revalidatePath('/admin/schedule')
  
  return { data: session, error: null }
}

export async function updateSession(id: string, sessionData: {
  course_id?: string
  instructor_id?: string
  day_of_week?: number
  start_time?: string
  end_time?: string
  room?: string
  max_capacity?: number
  is_recurring?: boolean
  start_date?: string
  end_date?: string
}) {
  const supabase = await createClient()
  
  const updateData: any = {}
  if (sessionData.course_id !== undefined) updateData.course_id = sessionData.course_id
  if (sessionData.instructor_id !== undefined) updateData.instructor_id = sessionData.instructor_id || null
  if (sessionData.day_of_week !== undefined) updateData.day_of_week = sessionData.day_of_week
  if (sessionData.start_time !== undefined) updateData.start_time = sessionData.start_time
  if (sessionData.end_time !== undefined) updateData.end_time = sessionData.end_time
  if (sessionData.room !== undefined) updateData.room = sessionData.room || null
  if (sessionData.max_capacity !== undefined) updateData.max_capacity = sessionData.max_capacity
  if (sessionData.is_recurring !== undefined) updateData.is_recurring = sessionData.is_recurring
  if (sessionData.start_date !== undefined) updateData.start_date = sessionData.start_date || null
  if (sessionData.end_date !== undefined) updateData.end_date = sessionData.end_date || null

  const { data: session, error } = await supabase
    .from('sessions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  revalidatePath('/admin/schedule')
  
  return { data: session, error: null }
}

export async function deleteSession(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id)

  if (error) {
    return { error }
  }

  revalidatePath('/admin/schedule')
  
  return { error: null }
}
