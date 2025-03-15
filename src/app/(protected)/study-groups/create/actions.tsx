'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createStudyGroup({ name, description }: { name: string; description: string }) {
  const supabase = await createClient();

  // Get currently authenticated user clearly from Supabase
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('You must be logged in to create a group.');
  }

  const { error } = await supabase
    .from('study_groups')
    .insert([{ name, description, created_by: user.id, members: [user.id] }]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/study-groups');
}
