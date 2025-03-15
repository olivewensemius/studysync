'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function fetchStudyGroupById(id: string) {
    const supabase = await createClient();
  
    const { data, error } = await supabase
      .from('study_groups')
      .select('id, name, description, created_at, created_by, members')
      .eq('id', id)
      .single();
  
    if (error) {
      throw new Error(error.message);
    }
  
    return data;
  }

  export async function joinStudyGroup(groupId: string) {
    const supabase = await createClient();
  
    // Retrieve authenticated user directly from Supabase session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
  
    if (userError || !user) {
      throw new Error('You must be logged in to join a group.');
    }
  
    // Fetch the current members of the study group
    const { data: group, error: groupError } = await supabase
      .from('study_groups')
      .select('members')
      .eq('id', groupId)
      .single();
  
    if (groupError || !group) {
      throw new Error('Group not found.');
    }
  
    // If the user is already a member, return early
    if (group.members.includes(user.id)) {
      throw new Error('You are already a member of this group.');
    }
  
    // Update the study group to add the user to the members array
    const { error } = await supabase
      .from('study_groups')
      .update({ members: [...group.members, user.id] })
      .eq('id', groupId);
  
    if (error) {
      throw new Error(error.message);
    }
  
    revalidatePath(`/study-groups/${groupId}`);
  }

  export async function fetchGroupMembers(groupId: string) {
    const supabase = await createClient();
  
    // Fetch the group to get the list of member UUIDs
    const { data: group, error: groupError } = await supabase
      .from('study_groups')
      .select('members')
      .eq('id', groupId)
      .single();
  
    if (groupError || !group) {
      throw new Error('Group not found.');
    }
  
    // If no members exist, return an empty array
    if (!group.members || group.members.length === 0) {
      return [];
    }
  
    // Fetch user details from profiles for each member UUID
    const { data: members, error: membersError } = await supabase
      .from('profiles')
      .select('id, display_name, email, avatar_url')
      .in('id', group.members); // Ensure this matches how members are stored
  
    if (membersError) {
      throw new Error('Could not fetch members.');
    }
  
    return members || [];
  }