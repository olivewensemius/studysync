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

  export async function joinStudyGroup(groupId: string) {
    const supabase = await createClient();

    // Retrieve authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
  
    if (userError || !user) {
        console.error('Auth error:', userError);
        throw new Error('You must be logged in to join a group.');
    }

    console.log('Current User:', user.id);

    // Fetch the current members list
    const { data: group, error: groupError } = await supabase
        .from('study_groups')
        .select('id, members')
        .eq('id', groupId)
        .single();

    if (groupError) {
        console.error('Group fetch error:', groupError);
        throw new Error('Error fetching group.');
    }

    if (!group) {
        throw new Error('Group not found.');
    }

    console.log('Existing Members:', group.members);

    // Prevent duplicate entries
    if (group.members.includes(user.id)) {
        console.warn('User is already a member of this group.');
        return;
    }

    // Append the new user to the members array
    const updatedMembers = [...group.members, user.id];

    console.log('Updated Members:', updatedMembers);

    // Perform the update in Supabase
    const { error: updateError } = await supabase
        .from('study_groups')
        .update({ members: updatedMembers })
        .eq('id', groupId);

    if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(`Failed to join group: ${updateError.message}`);
    }

    console.log(`User ${user.id} successfully joined group ${groupId}`);

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

  export async function leaveStudyGroup(groupId: string) {
    const supabase = await createClient();
  
    // Retrieve authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('You must be logged in to leave a group.');
    }
  
    // Fetch the current study group data
    const { data: group, error: groupError } = await supabase
      .from('study_groups')
      .select('created_by, members')
      .eq('id', groupId)
      .single();
  
    if (groupError || !group) {
      throw new Error('Group not found.');
    }
  
    // Restrict the creator from leaving
    if (group.created_by === user.id) {
      throw new Error("You cannot leave a group that you created.");
    }
  
    // If the user is not a member, return early
    if (!group.members.includes(user.id)) {
      throw new Error('You are not a member of this group.');
    }
  
    // Remove the user from the members array
    const updatedMembers = group.members.filter((memberId: string) => memberId !== user.id);
  
    // Update the study group
    const { error } = await supabase
      .from('study_groups')
      .update({ members: updatedMembers })
      .eq('id', groupId);
  
    if (error) {
      throw new Error(error.message);
    }
  
    revalidatePath(`/study-groups/${groupId}`);
  }
  
  export async function updateStudyGroup(groupId: string, { name, description }: { name?: string; description?: string }) {
    const supabase = await createClient();

    // Retrieve authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        throw new Error('You must be logged in to update a group.');
    }

    console.log('Updating group:', groupId, 'Requested by:', user.id);

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
        throw new Error('You are not authorized to update this group.');
    }

    // Update the study group with new details
    const { error: updateError } = await supabase
        .from('study_groups')
        .update({ 
            ...(name ? { name } : {}), 
            ...(description ? { description } : {})
        })
        .eq('id', groupId);

    if (updateError) {
        console.error('Error updating group:', updateError);
        throw new Error('Failed to update study group.');
    }

    console.log('Successfully updated group:', groupId);

    // Revalidate study groups page
    revalidatePath(`/study-groups/${groupId}`);
}