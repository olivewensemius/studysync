'use server'
/* eslint-disable */

import { createClient } from '@/utils/supabase/server'

export async function fetchStudySessions() {
  const supabase = await createClient();

  // Get the authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: participantSessions, error: participantError } = await supabase
    .from("study_session_participants")
    .select("session_id")
    .eq("profile", user.id);

  if (participantError) {
    throw new Error("Error fetching participant sessions: " + participantError.message);
  }

  const participantSessionIds = participantSessions.map(session => session.session_id);

  const { data, error } = await supabase
    .from("study_sessions")
    .select("*")
    .or(`created_by.eq.${user.id}, id.in.(${participantSessionIds.join(",")})`);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createStudySession(data: {
  title: string;
  subject: string;
  date: string;
  duration: number;
  status: string;
  description?: string;
  location: string;
  locationDetails?: string;
  participantEmails?: string[];
  resources?: { title: string; type: string; url: string; }[];
  topics?: { title: string; duration: string; }[];
}) {
  const supabase = await createClient();

  // Get the current user's ID
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error('User not authenticated');
  }

  // First create the study session
  const { data: sessionData, error: sessionError } = await supabase
    .from('study_sessions')
    .insert([
      {
        title: data.title,
        subject: data.subject,
        date: data.date,
        duration: data.duration,
        status: data.status,
        description: data.description || null,
        location: data.location,
        location_details: data.locationDetails || null,
        created_by: user.id
      }
    ])
    .select()
    .single();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  // Handle topics if provided
  if (data.topics && data.topics.length > 0) {
    const topicData = data.topics.map(topic => ({
      session_id: sessionData.id,
      topic_name: topic.title,
      duration: parseInt(topic.duration),
      completed: false
    }));

    const { error: topicsError } = await supabase
      .from('study_session_topics')
      .insert(topicData);

    if (topicsError) {
      throw new Error('Error adding topics: ' + topicsError.message);
    }
  }

  if (data.participantEmails && data.participantEmails.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .in('email', data.participantEmails);

    if (profilesError) {
      throw new Error('Error fetching participant profiles: ' + profilesError.message);
    }

    if (profiles && profiles.length > 0) {

      const participantData = profiles.map(profile => ({
        session_id: sessionData.id,
        profile: profile.id,

      }));

      const { error: participantsError } = await supabase
        .from('study_session_participants')
        .insert(participantData);

      if (participantsError) {
        throw new Error('Error adding participants: ' + participantsError.message);
      }
    }
  }

  // Handle resources if provided
  if (data.resources && data.resources.length > 0) {
    const resourceData = data.resources.map(resource => ({
      session_id: sessionData.id,
      title: resource.title,
      type: resource.type,
      url: resource.url
    }));

    const { error: resourcesError } = await supabase
      .from('study_session_resources')
      .insert(resourceData);

    if (resourcesError) {
      throw new Error('Error adding resources: ' + resourcesError.message);
    }
  }

  return sessionData;
}

export async function fetchSingleStudySession(sessionId: string) {
  const supabase = await createClient();

  const { data: session, error: sessionError } = await supabase
    .from('study_sessions')
    .select(`
      id,
      title,
      subject,
      date,
      duration,
      status,
      description,
      location,
      location_details,
      created_at,
      study_session_participants (
        id,
        profiles (
          id,
          display_name,
          avatar_url,
          email,
          role
        )
      )
    `)
    .eq('id', sessionId)
    .single();

  if (sessionError) {
    throw new Error('Error fetching study session: ' + sessionError.message);
  }



  const transformedSession = {
    ...session,
    participants: session.study_session_participants?.map(participant => ({
      id: participant.profiles.id,
      display_name: participant.profiles.display_name,
      email: participant.profiles.email,
      role: participant.profiles.role
    })) || []
  };


  return transformedSession;
}

export async function fetchSessionTopics(sessionId: string) {
    const supabase = await createClient()
  
    const { data, error } = await supabase
      .from('study_session_topics')
      .select(`
        id,
        topic_name,
        duration,
        completed,
        session_id
      `)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
       
    if (error) {
      throw new Error('Error fetching session topics: ' + error.message);
    }

    return data;
  }

export async function fetchSessionResources(sessionId: string) {
  const supabase = await createClient();

  const { data: resources, error } = await supabase
    .from('study_session_resources')
    .select('*')
    .eq('session_id', sessionId)


  if (error) {
    throw new Error('Error fetching session resources: ' + error.message);
  }

  return resources;
}

export async function deleteStudySession(sessionId: string) {
  const supabase = await createClient();

  // With CASCADE delete, we only need to delete the session
  // and all related records will be automatically deleted
  const { error: sessionError } = await supabase
    .from('study_sessions')
    .delete()
    .eq('id', sessionId);

  if (sessionError) {
    throw new Error('Error deleting study session: ' + sessionError.message);
  }
}

export async function updateStudySession(sessionId: string, data: {
  title?: string;
  subject?: string;
  date?: string;
  duration?: number;
  description?: string;
  status?:string;
  location?: string;
  locationDetails?: string;
  participantEmails?: string[]; 
  resources?: { title: string; type: string; url: string; }[];
  topics?: { title: string; duration: string; }[];
}) {
  const supabase = await createClient();
  // Update the study session
  const { error: sessionError } = await supabase
    .from('study_sessions')
    .update({
      title: data.title,
      subject: data.subject,
      date: data.date,
      duration: data.duration,
      description: data.description,
      location: data.location,
      location_details: data.locationDetails,
      status: data.status,
    })
    .eq('id', sessionId);

  if (sessionError) {
    throw new Error('Error updating study session: ' + sessionError.message);
  }

  if (data.participantEmails && data.participantEmails.length > 0) {

    //select pariticpants before delete
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .in('email', data.participantEmails);

    if (profilesError) {
      throw new Error('Error fetching participant profiles: ' + profilesError.message);
    }

    // Delete cuur partiicpants
    const { error: deleteError } = await supabase
      .from('study_session_participants')
      .delete()
      .eq('session_id', sessionId);

    if (deleteError) {
      throw new Error('Error removing existing participants: ' + deleteError.message);
    }

    // Add new participants if profiles were found
    if (profiles && profiles.length > 0) {
      const participantData = profiles.map(profile => ({
        session_id: sessionId,
        profile: profile.id,
      }));

      const { error: participantsError } = await supabase
        .from('study_session_participants')
        .insert(participantData);

      if (participantsError) {
        throw new Error('Error adding participants: ' + participantsError.message);
      }
    }
  }

  // Handle topics if provided
  if (data.topics && data.topics.length > 0) {
    // Delete 
    const { error: deleteTopicsError } = await supabase
      .from('study_session_topics')
      .delete()
      .eq('session_id', sessionId);

    if (deleteTopicsError) {
      throw new Error('Error removing existing topics: ' + deleteTopicsError.message);
    }

    // Add new 
    const topicData = data.topics.map(topic => ({
      session_id: sessionId,
      topic_name: topic.title,
      duration: parseInt(topic.duration),
      completed: false
    }));

    const { error: topicsError } = await supabase
      .from('study_session_topics')
      .insert(topicData);

    if (topicsError) {
      throw new Error('Error adding topics: ' + topicsError.message);
    }
  }

  
  if (data.resources && data.resources.length > 0) {
    // Delete eresource
    const { error: deleteResourcesError } = await supabase
      .from('study_session_resources')
      .delete()
      .eq('session_id', sessionId);

    if (deleteResourcesError) {
      throw new Error('Error removing existing resources: ' + deleteResourcesError.message);
    }

    // Add n
    const resourceData = data.resources.map(resource => ({
      session_id: sessionId,
      title: resource.title,
      type: resource.type,
      url: resource.url
    }));

    const { error: resourcesError } = await supabase
      .from('study_session_resources')
      .insert(resourceData);

    if (resourcesError) {
      throw new Error('Error adding resources: ' + resourcesError.message);
    }
  }
}
