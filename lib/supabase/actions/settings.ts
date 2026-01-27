'use server'

import { createClient } from '../server'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
  const supabase = await createClient()
  
  const { data: settings, error } = await supabase
    .from('settings')
    .select('*')
    .order('category', { ascending: true })
    .order('key', { ascending: true })

  if (error) {
    console.error('Error fetching settings:', error)
    return { data: null, error }
  }

  // Convert array to object for easier access
  // Preserve value + metadata so the UI can access `.value`
  const settingsObj: Record<string, any> = {}
  settings?.forEach(setting => {
    settingsObj[setting.key] = {
      value: setting.value,
      category: setting.category,
      description: setting.description,
      updated_by: setting.updated_by,
      updated_at: setting.updated_at,
    }
  })

  return { data: settingsObj, error: null }
}

export async function getSetting(key: string) {
  const supabase = await createClient()
  
  const { data: setting, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', key)
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data: setting.value, error: null }
}

export async function updateSetting(
  key: string,
  value: any,
  category: string = 'general',
  description?: string
) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  // Check if setting exists
  const { data: existing } = await supabase
    .from('settings')
    .select('id')
    .eq('key', key)
    .single()

  if (existing) {
    // Update existing
    const { data: setting, error } = await supabase
      .from('settings')
      .update({
        value,
        category,
        description: description || null,
        updated_by: user?.id || null,
      })
      .eq('key', key)
      .select()
      .single()

    if (error) {
      return { data: null, error }
    }

    revalidatePath('/admin/settings')
    return { data: setting, error: null }
  } else {
    // Create new
    const { data: setting, error } = await supabase
      .from('settings')
      .insert({
        key,
        value,
        category,
        description: description || null,
        updated_by: user?.id || null,
      })
      .select()
      .single()

    if (error) {
      return { data: null, error }
    }

    revalidatePath('/admin/settings')
    return { data: setting, error: null }
  }
}

export async function updateSettings(settingsData: Record<string, { value: any; category?: string }>) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  const updates = Object.entries(settingsData).map(([key, { value, category }]) => ({
    key,
    value,
    category: category || 'general',
    updated_by: user?.id || null,
  }))

  // Use upsert for all settings
  const { data: settings, error } = await supabase
    .from('settings')
    .upsert(updates, { onConflict: 'key' })
    .select()

  if (error) {
    return { data: null, error }
  }

  revalidatePath('/admin/settings')
  
  return { data: settings, error: null }
}
