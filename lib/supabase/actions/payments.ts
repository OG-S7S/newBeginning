'use server'

import { createClient } from '../server'
import { revalidatePath } from 'next/cache'

export async function getPayments() {
  const supabase = await createClient()
  
  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
      *,
      profiles!payments_student_id_fkey (
        id,
        full_name,
        email
      ),
      courses (
        id,
        name
      )
    `)
    .order('payment_date', { ascending: false })

  if (error) {
    console.error('Error fetching payments:', error)
    return { data: null, error }
  }

  return { data: payments, error: null }
}

export async function getPaymentStats() {
  const supabase = await createClient()
  
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  // Monthly revenue
  const { data: monthlyPayments, error: monthlyError } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'paid')
    .gte('payment_date', startOfMonth.toISOString().split('T')[0])
    .lte('payment_date', endOfMonth.toISOString().split('T')[0])

  const monthlyRevenue = monthlyPayments?.reduce((acc, p) => acc + parseFloat(p.amount || '0'), 0) || 0

  // Last month revenue for comparison
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  const { data: lastMonthPayments } = await supabase
    .from('payments')
    .select('amount')
    .eq('status', 'paid')
    .gte('payment_date', lastMonthStart.toISOString().split('T')[0])
    .lte('payment_date', lastMonthEnd.toISOString().split('T')[0])

  const lastMonthRevenue = lastMonthPayments?.reduce((acc, p) => acc + parseFloat(p.amount || '0'), 0) || 0
  const revenueChange = lastMonthRevenue > 0 
    ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
    : '0'

  // Pending and overdue
  const { data: allPayments } = await supabase
    .from('payments')
    .select('status, due_date')
    .in('status', ['pending', 'overdue'])

  const pending = allPayments?.filter(p => p.status === 'pending').length || 0
  const overdue = allPayments?.filter(p => p.status === 'overdue').length || 0

  return {
    data: {
      monthlyRevenue: monthlyRevenue.toFixed(2),
      revenueChange,
      pending,
      overdue,
    },
    error: null
  }
}

export async function createPayment(paymentData: {
  student_id: string
  course_id?: string
  amount: number
  currency?: string
  payment_method: string
  payment_date: string
  due_date?: string
  notes?: string
}) {
  const supabase = await createClient()
  
  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      student_id: paymentData.student_id,
      course_id: paymentData.course_id || null,
      amount: paymentData.amount,
      currency: paymentData.currency || 'EGP',
      payment_method: paymentData.payment_method,
      payment_date: paymentData.payment_date,
      due_date: paymentData.due_date || null,
      notes: paymentData.notes || null,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  revalidatePath('/admin/payments')
  
  return { data: payment, error: null }
}

export async function updatePayment(id: string, paymentData: {
  amount?: number
  payment_method?: string
  payment_date?: string
  due_date?: string
  status?: string
  notes?: string
}) {
  const supabase = await createClient()
  
  const updateData: any = {}
  if (paymentData.amount !== undefined) updateData.amount = paymentData.amount
  if (paymentData.payment_method !== undefined) updateData.payment_method = paymentData.payment_method
  if (paymentData.payment_date !== undefined) updateData.payment_date = paymentData.payment_date
  if (paymentData.due_date !== undefined) updateData.due_date = paymentData.due_date || null
  if (paymentData.status !== undefined) updateData.status = paymentData.status
  if (paymentData.notes !== undefined) updateData.notes = paymentData.notes

  const { data: payment, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  revalidatePath('/admin/payments')
  
  return { data: payment, error: null }
}

export async function exportPayments(format: 'csv' | 'xlsx' = 'csv') {
  const supabase = await createClient()
  
  const { data: payments, error } = await supabase
    .from('payments')
    .select(`
      invoice_id,
      payment_date,
      amount,
      currency,
      payment_method,
      status,
      profiles!payments_student_id_fkey (
        full_name,
        email
      ),
      courses (
        name
      )
    `)
    .order('payment_date', { ascending: false })

  if (error) {
    return { data: null, error }
  }

  // Convert to CSV format
  if (format === 'csv') {
    const headers = ['Invoice ID', 'Date', 'Student', 'Email', 'Course', 'Amount', 'Currency', 'Method', 'Status']
    const rows = payments?.map(p => [
      p.invoice_id,
      p.payment_date,
      (p.profiles as any)?.full_name || '',
      (p.profiles as any)?.email || '',
      (p.courses as any)?.name || '',
      p.amount,
      p.currency,
      p.payment_method,
      p.status,
    ]) || []

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    return { data: csvContent, error: null }
  }

  // For xlsx, we'd need a library like xlsx, but for now return JSON
  return { data: payments, error: null }
}
