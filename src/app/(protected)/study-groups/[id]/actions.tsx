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
export async function joinStudyGroup(groupId: string) {
  const { joinStudyGroup } = await import('../actions');
  return joinStudyGroup(groupId);
}

export async function leaveStudyGroup(groupId: string) {
  const { leaveStudyGroup } = await import('../actions');
  return leaveStudyGroup(groupId);
}

export async function fetchGroupMembers(groupId: string) {
  const { fetchGroupMembers } = await import('../actions');
  return fetchGroupMembers(groupId);
}

export async function updateStudyGroup(groupId: string, data: { name?: string; description?: string }) {
  const { updateStudyGroup } = await import('../actions');
  return updateStudyGroup(groupId, data);
}

export async function getPendingInvitations() {
  const { getPendingInvitations } = await import('../actions');
  return getPendingInvitations();
}

export async function acceptGroupInvitation(invitationId: string) {
  const { acceptGroupInvitation } = await import('../actions');
  return acceptGroupInvitation(invitationId);
}

export async function declineGroupInvitation(invitationId: string) {
  const { declineGroupInvitation } = await import('../actions');
  return declineGroupInvitation(invitationId);
}