'use server'

import { createClient } from '@/utils/supabase/server'

export async function fetchStudyGroups() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('study_groups')
    .select('*')

  if (error) {
    throw new Error(error.message)
  }

  return data;
}
