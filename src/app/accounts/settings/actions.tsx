// src/app/accounts/settings/actions.tsx
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  // Get the user session
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return { error: 'You must be logged in to update your profile' }
  }
  
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  
  // Create display name from first and last name
  const displayName = `${firstName} ${lastName}`.trim()
  
  if (!displayName) {
    return { error: 'Name cannot be empty' }
  }
  
  // Update the profile
  const { error } = await supabase
    .from('profiles')
    .update({ 
      display_name: displayName,
      updated_at: new Date().toISOString()
    })
    .eq('id', session.user.id)
  
  if (error) {
    console.error('Error updating profile:', error)
    return { error: 'Failed to update profile' }
  }
  
  // Also update user metadata in auth
  const { error: authError } = await supabase.auth.updateUser({
    data: { display_name: displayName }
  })
  
  if (authError) {
    console.error('Error updating auth user:', authError)
    // Not returning error here since the profile was already updated
  }
  
  revalidatePath('/accounts/settings')
  revalidatePath('/dashboard')
  
  return { success: true }
}