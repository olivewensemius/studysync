'use server'

import { createClient } from '@/utils/supabase/server'

export async function fetchStudySessions() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')

  if (error) {
    throw new Error(error.message)
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

  // Handle participant emails if provided
  if (data.participantEmails && data.participantEmails.length > 0) {
    // Get the profile IDs for the provided emails
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .in('email', data.participantEmails);

    if (profilesError) {
      throw new Error('Error fetching participant profiles: ' + profilesError.message);
    }

    if (profiles && profiles.length > 0) {
      // Create participant entries linking profiles to the session
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

  return sessionData;
}
