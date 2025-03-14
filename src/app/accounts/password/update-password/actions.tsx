
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
export async function resetPassword(formData: FormData) {
    const supabase = await createClient()

    const data = {
      password: formData.get('password') as string,
    } 
    const {error} = await supabase.auth.updateUser({ password: data.password })

  
    if (error) {
        console.log('error', error)

      redirect('/error')
    }


  }