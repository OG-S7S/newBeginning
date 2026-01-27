'use server'

import { createClient } from '../server'
import { revalidatePath } from 'next/cache'

export async function getPrograms() {
  const supabase = await createClient()
  
  const { data: programs, error } = await supabase
    .from('programs')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching programs:', error)
    return { data: null, error }
  }

  // Fetch related data
  const programIds = programs?.map(p => p.id) || []
  
  const [highlights, outcomes, projects] = await Promise.all([
    supabase.from('program_highlights').select('*').in('program_id', programIds).order('display_order'),
    supabase.from('program_outcomes').select('*').in('program_id', programIds).order('display_order'),
    supabase.from('program_projects').select('*').in('program_id', programIds).order('display_order'),
  ])

  // Combine data
  const programsWithDetails = programs?.map(program => ({
    ...program,
    highlights: highlights.data?.filter(h => h.program_id === program.id).map(h => h.highlight) || [],
    outcomes: outcomes.data?.filter(o => o.program_id === program.id).map(o => o.outcome) || [],
    projects: projects.data?.filter(p => p.program_id === program.id).map(p => p.project) || [],
  }))

  return { data: programsWithDetails, error: null }
}

export async function getProgramById(id: string) {
  const supabase = await createClient()
  
  const { data: program, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !program) {
    return { data: null, error }
  }

  // Fetch related data
  const [highlights, outcomes, projects] = await Promise.all([
    supabase.from('program_highlights').select('*').eq('program_id', id).order('display_order'),
    supabase.from('program_outcomes').select('*').eq('program_id', id).order('display_order'),
    supabase.from('program_projects').select('*').eq('program_id', id).order('display_order'),
  ])

  return {
    data: {
      ...program,
      highlights: highlights.data?.map(h => h.highlight) || [],
      outcomes: outcomes.data?.map(o => o.outcome) || [],
      projects: projects.data?.map(p => p.project) || [],
    },
    error: null
  }
}

export async function createProgram(programData: {
  id: string
  title: string
  ages: string
  duration: string
  class_size: string
  description: string
  icon_name?: string
  color: string
  highlights: string[]
  outcomes: string[]
  projects: string[]
  display_order?: number
}) {
  const supabase = await createClient()
  
  // Create program
  const { data: program, error: programError } = await supabase
    .from('programs')
    .insert({
      id: programData.id,
      title: programData.title,
      ages: programData.ages,
      duration: programData.duration,
      class_size: programData.class_size,
      description: programData.description,
      icon_name: programData.icon_name,
      color: programData.color,
      display_order: programData.display_order || 0,
    })
    .select()
    .single()

  if (programError) {
    return { data: null, error: programError }
  }

  // Insert highlights, outcomes, projects
  const highlights = programData.highlights.map((h, i) => ({
    program_id: programData.id,
    highlight: h,
    display_order: i,
  }))

  const outcomes = programData.outcomes.map((o, i) => ({
    program_id: programData.id,
    outcome: o,
    display_order: i,
  }))

  const projects = programData.projects.map((p, i) => ({
    program_id: programData.id,
    project: p,
    display_order: i,
  }))

  await Promise.all([
    supabase.from('program_highlights').insert(highlights),
    supabase.from('program_outcomes').insert(outcomes),
    supabase.from('program_projects').insert(projects),
  ])

  revalidatePath('/programs')
  revalidatePath('/admin/programs')
  
  return { data: program, error: null }
}

export async function updateProgram(id: string, programData: {
  title?: string
  ages?: string
  duration?: string
  class_size?: string
  description?: string
  icon_name?: string
  color?: string
  highlights?: string[]
  outcomes?: string[]
  projects?: string[]
  is_active?: boolean
  display_order?: number
}) {
  const supabase = await createClient()
  
  // Update program
  const updateData: any = {}
  if (programData.title !== undefined) updateData.title = programData.title
  if (programData.ages !== undefined) updateData.ages = programData.ages
  if (programData.duration !== undefined) updateData.duration = programData.duration
  if (programData.class_size !== undefined) updateData.class_size = programData.class_size
  if (programData.description !== undefined) updateData.description = programData.description
  if (programData.icon_name !== undefined) updateData.icon_name = programData.icon_name
  if (programData.color !== undefined) updateData.color = programData.color
  if (programData.is_active !== undefined) updateData.is_active = programData.is_active
  if (programData.display_order !== undefined) updateData.display_order = programData.display_order

  const { data: program, error: programError } = await supabase
    .from('programs')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (programError) {
    return { data: null, error: programError }
  }

  // Update related data if provided
  if (programData.highlights) {
    await supabase.from('program_highlights').delete().eq('program_id', id)
    const highlights = programData.highlights.map((h, i) => ({
      program_id: id,
      highlight: h,
      display_order: i,
    }))
    await supabase.from('program_highlights').insert(highlights)
  }

  if (programData.outcomes) {
    await supabase.from('program_outcomes').delete().eq('program_id', id)
    const outcomes = programData.outcomes.map((o, i) => ({
      program_id: id,
      outcome: o,
      display_order: i,
    }))
    await supabase.from('program_outcomes').insert(outcomes)
  }

  if (programData.projects) {
    await supabase.from('program_projects').delete().eq('program_id', id)
    const projects = programData.projects.map((p, i) => ({
      program_id: id,
      project: p,
      display_order: i,
    }))
    await supabase.from('program_projects').insert(projects)
  }

  revalidatePath('/programs')
  revalidatePath('/admin/programs')
  
  return { data: program, error: null }
}

export async function deleteProgram(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('programs')
    .delete()
    .eq('id', id)

  if (error) {
    return { error }
  }

  revalidatePath('/programs')
  revalidatePath('/admin/programs')
  
  return { error: null }
}
