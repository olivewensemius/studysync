'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function fetchStudyGroupById(id: string) {
  const supabase = await createClient();

  // Retrieve authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
      throw new Error('You must be logged in.');
  }

  // Retrieve study group details
  const { data: group, error: groupError } = await supabase
    .from('study_groups')
    .select('id, name, description, created_at, created_by, members')
    .eq('id', id)
    .single();

  if (groupError || !group) {
    throw new Error("Group not found.");
  }

  // Check if the user is already a member
  const isMember = group.members.includes(user.id);

  // Check if the user is the creator
  const isCreator = group.created_by === user.id;

  return { ...group, isMember, isCreator };
}

// Re-export these functions from the main actions file
export {
  joinStudyGroup,
  leaveStudyGroup, 
  fetchGroupMembers,
  updateStudyGroup
} from '../actions';