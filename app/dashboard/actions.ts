'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Officer } from '@/lib/types'

type ActionResult = { error?: string; success?: string }

async function requireOfficer(): Promise<Officer> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data } = await supabase.from('officers').select('*').eq('id', user.id).maybeSingle()
  if (!data) {
    throw new Error('NO_CLEARANCE')
  }
  return data as Officer
}

export async function createTraining(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const officer = await requireOfficer()
  const supabase = await createClient()

  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const scheduledAt = String(formData.get('scheduled_at') ?? '')
  let battalionId = String(formData.get('battalion_id') ?? '')

  if (!title || !scheduledAt) {
    return { error: 'Title and scheduled time are required.' }
  }

  // Officers may only schedule for their own battalion. Admins choose freely.
  if (officer.role !== 'ADMIN') {
    if (!officer.battalion_id) {
      return { error: 'You are not assigned to a battalion.' }
    }
    battalionId = officer.battalion_id
  }

  const { error } = await supabase.from('trainings').insert({
    title,
    description: description || null,
    scheduled_at: new Date(scheduledAt).toISOString(),
    battalion_id: battalionId === 'GLOBAL' || battalionId === '' ? null : battalionId,
    created_by: officer.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/trainings')
  revalidatePath('/')
  return { success: 'Operation scheduled.' }
}

export async function deleteTraining(id: string): Promise<void> {
  await requireOfficer()
  const supabase = await createClient()
  await supabase.from('trainings').delete().eq('id', id)
  revalidatePath('/dashboard')
  revalidatePath('/trainings')
  revalidatePath('/')
}

export async function createAnnouncement(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const officer = await requireOfficer()
  if (officer.role !== 'ADMIN') {
    return { error: 'Only High Command (admins) may issue directives.' }
  }
  const supabase = await createClient()

  const title = String(formData.get('title') ?? '').trim()
  const body = String(formData.get('body') ?? '').trim()
  const priority = String(formData.get('priority') ?? 'STANDARD')

  if (!title || !body) return { error: 'Title and body are required.' }

  const { error } = await supabase.from('announcements').insert({
    title,
    body,
    priority,
    created_by: officer.id,
  })
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/general')
  revalidatePath('/')
  return { success: 'Directive transmitted.' }
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const officer = await requireOfficer()
  if (officer.role !== 'ADMIN') return
  const supabase = await createClient()
  await supabase.from('announcements').delete().eq('id', id)
  revalidatePath('/dashboard')
  revalidatePath('/general')
  revalidatePath('/')
}

export async function createOfficer(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireOfficer()
  if (admin.role !== 'ADMIN') {
    return { error: 'Only High Command (admins) may commission officers.' }
  }

  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const rank = String(formData.get('rank') ?? '').trim()
  const role = String(formData.get('role') ?? 'OFFICER')
  const battalionId = String(formData.get('battalion_id') ?? '')

  if (!email || !password || !name) {
    return { error: 'Email, access code, and name are required.' }
  }
  if (password.length < 6) {
    return { error: 'Access code must be at least 6 characters.' }
  }

  const svc = createAdminClient()

  // Create the auth user (email pre-confirmed so officers can log in immediately)
  const { data: created, error: createErr } = await svc.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  })

  if (createErr || !created.user) {
    return { error: createErr?.message ?? 'Failed to create officer account.' }
  }

  const { error: profileErr } = await svc.from('officers').insert({
    id: created.user.id,
    name,
    rank: rank || null,
    role: role === 'ADMIN' ? 'ADMIN' : 'OFFICER',
    battalion_id: battalionId && battalionId !== 'NONE' ? battalionId : null,
  })

  if (profileErr) {
    // Roll back the auth user if the profile insert fails
    await svc.auth.admin.deleteUser(created.user.id)
    return { error: profileErr.message }
  }

  revalidatePath('/dashboard')
  return { success: `Officer ${name} commissioned.` }
}

export async function removeOfficer(id: string): Promise<void> {
  const admin = await requireOfficer()
  if (admin.role !== 'ADMIN') return
  if (admin.id === id) return // cannot remove self
  const svc = createAdminClient()
  await svc.auth.admin.deleteUser(id) // cascades to officers row
  revalidatePath('/dashboard')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}
