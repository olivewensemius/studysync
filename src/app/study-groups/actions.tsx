'use server'

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server'

export async function fetchStudyGroups() {
  const supabase = await createClient();

  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('You must be logged in.');
  }

  // Fetch all study groups (for "Find a Group")
  const { data: allGroups, error: allGroupsError } = await supabase
    .from('study_groups')
    .select('*');

  if (allGroupsError) {
    throw new Error(allGroupsError.message);
  }

  // Filter groups where the user is a member
  const myGroups = allGroups.filter(group => group.members.includes(user.id));
  
  // Filter groups the user has created
  const createdGroups = allGroups.filter(group => group.created_by === user.id);

  return { allGroups, myGroups, createdGroups, userId: user.id };
}

export async function deleteStudyGroup(groupId: string) {
  const supabase = await createClient();

  // Retrieve authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
      throw new Error('You must be logged in to delete a group.');
  }

  console.log('Deleting group:', groupId, 'Requested by:', user.id);

  // Fetch the study group to verify ownership
  const { data: group, error: fetchError } = await supabase
      .from('study_groups')
      .select('created_by')
      .eq('id', groupId)
      .single();

  if (fetchError) {
      console.error('Error fetching group:', fetchError);
      throw new Error('Error fetching group.');
  }

  if (!group) {
      throw new Error('Study group not found.');
  }

  // Ensure the current user is the creator
  if (group.created_by !== user.id) {
      throw new Error('You are not authorized to delete this group.');
  }

  // Delete the study group
  const { error: deleteError } = await supabase
      .from('study_groups')
      .delete()
      .eq('id', groupId);

  if (deleteError) {
      console.error('Error deleting group:', deleteError);
      throw new Error('Failed to delete study group.');
  }

  console.log('Successfully deleted group:', groupId);

  // Revalidate study groups page
  revalidatePath('/study-groups');
}