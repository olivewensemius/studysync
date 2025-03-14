// src/app/study-groups/actions.tsx
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createStudyGroup({ name, description, created_by }: { name: string; description: string; created_by: string }) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('study_groups')
    .insert([{ 
        name, 
        description, 
        created_by, 
        members: [created_by] // Automatically add creator as first member
    }]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/study-groups');
}
