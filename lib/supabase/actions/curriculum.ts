'use server'

import { createClient } from '../server'
import { revalidatePath } from 'next/cache'

export async function getCurriculumByProgram(programId: string) {
  const supabase = await createClient()
  
  const { data: modules, error: modulesError } = await supabase
    .from('curriculum_modules')
    .select('*')
    .eq('program_id', programId)
    .order('display_order', { ascending: true })

  if (modulesError) {
    return { data: null, error: modulesError }
  }

  // Fetch topics for each module
  const moduleIds = modules?.map(m => m.id) || []
  
  const { data: topics, error: topicsError } = await supabase
    .from('curriculum_topics')
    .select('*')
    .in('module_id', moduleIds)
    .order('display_order', { ascending: true })

  if (topicsError) {
    return { data: null, error: topicsError }
  }

  // Combine modules with their topics
  const modulesWithTopics = modules?.map(module => ({
    ...module,
    topics: topics?.filter(t => t.module_id === module.id).map(t => t.topic) || [],
  }))

  return { data: modulesWithTopics, error: null }
}

export async function createCurriculumModule(moduleData: {
  program_id: string
  title: string
  weeks: string
  outcome: string
  topics: string[]
  display_order?: number
}) {
  const supabase = await createClient()
  
  // Create module
  const { data: module, error: moduleError } = await supabase
    .from('curriculum_modules')
    .insert({
      program_id: moduleData.program_id,
      title: moduleData.title,
      weeks: moduleData.weeks,
      outcome: moduleData.outcome,
      display_order: moduleData.display_order || 0,
    })
    .select()
    .single()

  if (moduleError) {
    return { data: null, error: moduleError }
  }

  // Insert topics
  if (moduleData.topics.length > 0) {
    const topics = moduleData.topics
      .filter(t => t.trim() !== "")
      .map((topic, index) => ({
        module_id: module.id,
        topic: topic.trim(),
        display_order: index,
      }))

    if (topics.length > 0) {
      await supabase.from('curriculum_topics').insert(topics)
    }
  }

  revalidatePath('/curriculum')
  revalidatePath('/admin/curriculum')
  
  return { data: module, error: null }
}

export async function updateCurriculumModule(moduleId: string, moduleData: {
  title?: string
  weeks?: string
  outcome?: string
  topics?: string[]
  display_order?: number
}) {
  const supabase = await createClient()
  
  // Update module
  const updateData: any = {}
  if (moduleData.title !== undefined) updateData.title = moduleData.title
  if (moduleData.weeks !== undefined) updateData.weeks = moduleData.weeks
  if (moduleData.outcome !== undefined) updateData.outcome = moduleData.outcome
  if (moduleData.display_order !== undefined) updateData.display_order = moduleData.display_order

  const { data: module, error: moduleError } = await supabase
    .from('curriculum_modules')
    .update(updateData)
    .eq('id', moduleId)
    .select()
    .single()

  if (moduleError) {
    return { data: null, error: moduleError }
  }

  // Update topics if provided
  if (moduleData.topics) {
    await supabase.from('curriculum_topics').delete().eq('module_id', moduleId)
    
    const topics = moduleData.topics
      .filter(t => t.trim() !== "")
      .map((topic, index) => ({
        module_id: moduleId,
        topic: topic.trim(),
        display_order: index,
      }))

    if (topics.length > 0) {
      await supabase.from('curriculum_topics').insert(topics)
    }
  }

  revalidatePath('/curriculum')
  revalidatePath('/admin/curriculum')
  
  return { data: module, error: null }
}

export async function deleteCurriculumModule(moduleId: string) {
  const supabase = await createClient()
  
  // Topics will be deleted automatically due to CASCADE
  const { error } = await supabase
    .from('curriculum_modules')
    .delete()
    .eq('id', moduleId)

  if (error) {
    return { error }
  }

  revalidatePath('/curriculum')
  revalidatePath('/admin/curriculum')
  
  return { error: null }
}
