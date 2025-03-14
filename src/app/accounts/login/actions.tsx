'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: 'Your email or password is incorrect' }
  }
  revalidatePath('/', 'layout')
  redirect('/')
}


export async function loginGoogle() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider:"google",
    options: {
      redirectTo: 'http://localhost:3000/auth/callback', //remind me to change this on production :)
    },
  })

  if (error) {
    console.error("OAuth login error:", error);
    return;
  }
  
  if (data.url) {
    redirect(data.url) 
  }
}

export async function loginDiscord() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider:"discord",
    options: {
      redirectTo: 'http://localhost:3000/auth/callback',
    },
  })

if (data.url) {
  redirect(data.url) // use the redirect API for your server framework
}
}

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect('/error')
  }

  redirect('/accounts/login')
}