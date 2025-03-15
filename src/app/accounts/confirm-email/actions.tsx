'use server'

import { createClient } from '@/utils/supabase/server'

export async function resendConfirmation() {
  const supabase = await createClient()
  
  // Get user from session
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session || !session.user) {
    throw new Error('No active session')
  }
  
  // Resend the email
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: session.user.email || '',
  })

  if (error) {
    throw error
  }

  return { success: true }
}