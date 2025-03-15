'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
export async function signup(formData: FormData) {
    const supabase = await createClient()
  
    // type-casting here for convenience
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      display_name: formData.get('display_name') as string
    }

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          display_name: data.display_name

        }
      }
    })
  
    if (error) {
      redirect('/error')
    }
    console.log('success')
    revalidatePath('/', 'layout')
    redirect('/')
  }

