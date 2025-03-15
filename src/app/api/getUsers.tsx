'use server'

import { createClient } from '@/utils/supabase/server'

export async function fetchAllUsers() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')

  if (error) {
    throw new Error(error.message)
  }

  return data;
}
