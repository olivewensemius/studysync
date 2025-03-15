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

  // Fetch group members' IDs
  const { data: group, error: groupError } = await supabase
    .from('study_groups')
    .select('members')  // Ensure `members` is selected
    .eq('id', groupId)
    .single();

  if (groupError || !group) {
    console.error("Error fetching group members:", groupError);
    throw new Error("Failed to fetch group members.");
  }

  if (!group.members || group.members.length === 0) {
    console.warn("Group has no members.");
    return [];
  }

  console.log("Member IDs:", group.members); // Debugging to check member IDs

  // Ensure `group.members` is an array of strings
  const memberIds = group.members.map((id: any) => String(id)).filter((id: string) => id.trim() !== "");

  if (memberIds.length === 0) {
    console.warn("No valid member IDs found.");
    return [];
  }

  console.log("Formatted Member IDs:", memberIds); // Debugging to verify correct ID formatting

  // Fetch user details for those members
  const { data: members, error: membersError } = await supabase
    .from('profiles')
    .select('id, display_name, email, avatar_url') // Match previous working query
    .in('id', memberIds);

  if (membersError || !members) {
    console.error("Error fetching member details:", membersError);
    throw new Error("Failed to fetch member details.");
  }

  console.log("Fetched Members:", members); // Debugging to ensure correct data is fetched

  return members; // Return full user objects
}

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