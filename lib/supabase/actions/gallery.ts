'use server'

import { createClient } from '../server'
import { revalidatePath } from 'next/cache'

export async function getGalleryItems(category?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('gallery_items')
    .select('*')
    .order('display_order', { ascending: true })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching gallery items:', error)
    return { data: null, error }
  }

  return { data, error: null }
}

export async function createGalleryItem(itemData: {
  category: string
  title: string
  description?: string
  type?: string
  thumbnail_url?: string
  image_url?: string
  video_url?: string
  is_featured?: boolean
  display_order?: number
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('gallery_items')
    .insert(itemData)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
  
  return { data, error: null }
}

export async function updateGalleryItem(id: string, itemData: {
  category?: string
  title?: string
  description?: string
  type?: string
  thumbnail_url?: string
  image_url?: string
  video_url?: string
  is_featured?: boolean
  display_order?: number
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('gallery_items')
    .update(itemData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
  
  return { data, error: null }
}

export async function deleteGalleryItem(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('gallery_items')
    .delete()
    .eq('id', id)

  if (error) {
    return { error }
  }

  revalidatePath('/gallery')
  revalidatePath('/admin/gallery')
  
  return { error: null }
}
