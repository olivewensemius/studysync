// src/app/flashcards/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'

// Get all flashcard sets for the current user
export async function getFlashcardSets() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }
  
  const { data, error } = await supabase
    .from('flashcard_sets')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error("Error fetching flashcard sets:", error)
    throw new Error('Failed to fetch flashcard sets')
  }
  
  return data || []
}

// Get flashcards for a specific set
export async function getFlashcards(setId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('set_id', setId)
  
  if (error) {
    console.error("Error fetching flashcards:", error)
    throw new Error('Failed to fetch flashcards')
  }
  
  return data || []
}

// Create a flashcard set
export async function createFlashcardSet(data: { 
  title: string, 
  subject: string, 
  description?: string, 
  tags?: string[] 
}) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }
  
  const { data: newSet, error } = await supabase
    .from('flashcard_sets')
    .insert([{ 
      ...data,
      user_id: user.id 
    }])
    .select()
  
  if (error) {
    console.error("Error creating flashcard set:", error)
    throw new Error('Failed to create flashcard set')
  }
  
  return newSet[0]
}

// Create a flashcard
export async function createFlashcard(data: {
  set_id: string,
  front: string,
  back: string,
  difficulty?: 'easy' | 'medium' | 'hard'
}) {
  const supabase = await createClient()
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      throw new Error('User not authenticated')
    }
    
    // Validate set ID
    console.log("Creating flashcard for set ID:", data.set_id);
    
    if (!data.set_id || data.set_id === 'undefined') {
      console.error("Invalid set ID:", data.set_id);
      throw new Error('Invalid set ID');
    }
    
    // Verify set exists and user has access
    const { data: setData, error: setError } = await supabase
      .from('flashcard_sets')
      .select('id')
      .eq('id', data.set_id)
      .single();
    
    if (setError) {
      console.error("Error verifying set ID:", setError);
      throw new Error(`Set with ID ${data.set_id} not found or access denied`);
    }
    
    // Prepare flashcard data
    const flashcardData = {
      set_id: data.set_id,
      user_id: user.id,
      front: data.front,
      back: data.back,
      difficulty: data.difficulty || 'medium',
      mastered: false
    };
    
    console.log("Prepared flashcard data:", flashcardData);
    
    // Insert the flashcard
    const { data: newCard, error } = await supabase
      .from('flashcards')
      .insert([flashcardData])
      .select()
    
    if (error) {
      console.error("Error creating flashcard:", error)
      throw new Error('Failed to create flashcard')
    }
    
    console.log("Flashcard created successfully:", newCard[0]);
    return newCard[0]
  } catch (error) {
    console.error("Error in createFlashcard:", error);
    throw error;
  }
}
// Update a flashcard's mastery status
export async function updateFlashcardMastery(id: string, mastered: boolean) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('flashcards')
    .update({ 
      mastered,
      last_studied: new Date().toISOString()
    })
    .eq('id', id)
    .select()
  
  if (error) {
    console.error("Error updating flashcard mastery:", error)
    throw new Error('Failed to update flashcard')
  }
  
  return data?.[0]
}

// Delete a flashcard
export async function deleteFlashcard(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('flashcards')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error("Error deleting flashcard:", error)
    throw new Error('Failed to delete flashcard')
  }
  
  return true
}

// Update a flashcard
export async function updateFlashcard(id: string, data: {
  front?: string,
  back?: string,
  difficulty?: 'easy' | 'medium' | 'hard'
}) {
  const supabase = await createClient()
  
  const { data: updatedCard, error } = await supabase
    .from('flashcards')
    .update(data)
    .eq('id', id)
    .select()
  
  if (error) {
    console.error("Error updating flashcard:", error)
    throw new Error('Failed to update flashcard')
  }
  
  return updatedCard?.[0]
}

// Delete a flashcard set and all its cards
export async function deleteFlashcardSet(id: string) {
  const supabase = await createClient()
  
  // First, delete all flashcards in the set
  const { error: cardsError } = await supabase
    .from('flashcards')
    .delete()
    .eq('set_id', id)
  
  if (cardsError) {
    console.error("Error deleting flashcards in set:", cardsError)
    throw new Error('Failed to delete flashcards in set')
  }
  
  // Then delete the set itself
  const { error: setError } = await supabase
    .from('flashcard_sets')
    .delete()
    .eq('id', id)
  
  if (setError) {
    console.error("Error deleting flashcard set:", setError)
    throw new Error('Failed to delete flashcard set')
  }
  
  return true
}

// Update a flashcard set
export async function updateFlashcardSet(id: string, data: { 
  title?: string, 
  subject?: string, 
  description?: string, 
  tags?: string[] 
}) {
  const supabase = await createClient()
  
  const { data: updatedSet, error } = await supabase
    .from('flashcard_sets')
    .update(data)
    .eq('id', id)
    .select()
  
  if (error) {
    console.error("Error updating flashcard set:", error)
    throw new Error('Failed to update flashcard set')
  }
  
  return updatedSet?.[0]
}
interface FlashcardWithDifficulty {
  front: string;
  back: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Generate flashcards with Gemini API
export async function generateFlashcards(options: {
  topic?: string;
  content?: string;
  count?: number;
  difficulty?: string;
}): Promise<FlashcardWithDifficulty[]> {
  const { topic, content, count = 5, difficulty = 'mixed' } = options;
  
  if (!topic && !content) {
    throw new Error('Either topic or content must be provided');
  }

  // Create the prompt
  const prompt = createFlashcardPrompt(topic, content, count, difficulty);
  
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.NEXT_PUBLIC_GEMINI_API_KEY|| ''
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`AI error: ${errorData.error?.message || 'Failed to generate flashcards'}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!text) {
      throw new Error('No content generated by AI');
    }
    
    // Parse the AI response to get flashcards
    return parseAIResponse(text);
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error('Failed to generate flashcards. Please try again.');
  }
}
// Updated actions.ts with correct profiles fields
async function createUserProfile(userId: string) {
  const supabase = await createClient();
  
  // First, get the auth user to have their email
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Authentication error:", userError);
    return false;
  }
  
  // Create profile with the correct fields from your schema
  const profileData = {
    id: userId,
    email: user.email,
    display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    created_at: new Date().toISOString()
    // avatar_url and role are likely optional
  };
  
  console.log("Creating profile with data:", profileData);
  
  const { data, error } = await supabase
    .from('profiles')
    .insert([profileData])
    .select();
  
  if (error) {
    console.error("Error creating profile:", error);
    return false;
  }
  
  console.log("Profile created successfully:", data);
  return true;
}

// Ensure user has a profile
async function ensureUserProfile() {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error("Authentication error:", userError);
    throw new Error('User not authenticated');
  }
  
  // Check if profile exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();
  
  if (profileError && profileError.code !== 'PGRST116') {
    console.error("Error checking profile:", profileError);
    return false;
  }
  
  if (profile) {
    console.log("Profile already exists:", profile);
    return true;
  }
  
  // Profile doesn't exist, create it
  return await createUserProfile(user.id);
}

export async function saveFlashcard(data: {
  set_id: string,
  front: string,
  back: string,
  difficulty?: 'easy' | 'medium' | 'hard'
}) {
  const supabase = await createClient();
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      throw new Error('User not authenticated');
    }
    
    // Validate set ID
    console.log("Adding flashcard for set ID:", data.set_id);
    
    if (!data.set_id || data.set_id === 'undefined') {
      console.error("Invalid set ID:", data.set_id);
      throw new Error('Invalid set ID');
    }
    
    // Try to fetch the set to ensure it exists
    const { data: setData, error: setError } = await supabase
      .from('flashcard_sets')
      .select('id')
      .eq('id', data.set_id)
      .single();
    
    if (setError) {
      console.error("Error verifying set ID:", setError);
      throw new Error(`Set with ID ${data.set_id} not found or access denied`);
    }
    
    // Prepare the flashcard data
    const flashcardData = {
      set_id: data.set_id,
      user_id: user.id,
      front: data.front,
      back: data.back,
      difficulty: data.difficulty || 'medium',
      mastered: false,
      created_at: new Date().toISOString()
    };
    
    console.log("Saving flashcard:", flashcardData);
    
    // Insert the flashcard
    const { data: newCard, error } = await supabase
      .from('flashcards')
      .insert([flashcardData])
      .select();
    
    if (error) {
      console.error("Error saving flashcard:", error);
      throw new Error(`Failed to save flashcard: ${error.message}`);
    }
    
    console.log("Successfully saved flashcard:", newCard[0]);
    return newCard[0];
  } catch (error) {
    console.error("Error in saveFlashcard:", error);
    throw error;
  }
}
export async function saveBatchFlashcards(setId: string, cards: any[]) {
  const supabase = await createClient();
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      throw new Error('User not authenticated');
    }
    
    // First check and create profile if needed
    console.log("Ensuring user profile exists...");
    const profileExists = await ensureUserProfile();
    
    if (!profileExists) {
      throw new Error('Failed to create user profile');
    }
    
    // Log the setId to verify it's correct
    console.log("About to save flashcards for set ID:", setId);
    
    if (!setId || setId === 'undefined') {
      console.error("Invalid set ID:", setId);
      throw new Error('Invalid set ID');
    }
    
    // Transform cards to include set_id and user_id
    const cardsWithUserData = cards.map(card => ({
      set_id: setId,
      user_id: user.id,
      front: card.front,
      back: card.back,
      difficulty: card.difficulty || 'medium'
    }));
    
    // Log the first card's data to verify
    console.log("First card data example:", cardsWithUserData[0]);
    
    // Insert cards
    const { data, error } = await supabase
      .from('flashcards')
      .insert(cardsWithUserData)
      .select();
    
    if (error) {
      console.error('Error saving flashcards:', error);
      throw new Error(`Failed to save flashcards: ${error.message}`);
    }
    
    console.log("Successfully saved flashcards:", data);
    return data;
  } catch (error) {
    console.error("Error in saveBatchFlashcards:", error);
    throw error;
  }
}
// Helper function to create prompt for AI
function createFlashcardPrompt(
  topic?: string, 
  content?: string, 
  count: number = 5,
  difficulty: string = 'mixed'
): string {
  let prompt = `Create ${count} high-quality flashcards in JSON format for studying.`;
  
  if (topic) {
    prompt += ` The topic is: "${topic}".`;
  }
  
  if (content) {
    // Truncate content if it's too long
    const truncatedContent = content.length > 8000 
      ? content.substring(0, 8000) + "... (content truncated)"
      : content;
      
    prompt += ` Based on this content: 

${truncatedContent}

Extract the most important concepts, definitions, facts, and relationships.`;
  }
  
  if (difficulty && difficulty !== 'mixed') {
    prompt += ` Make all flashcards ${difficulty} difficulty.`;
  }
  
  prompt += `
  
For each flashcard:
1. The "front" should contain a clear, concise question or prompt
2. The "back" should provide a comprehensive but concise answer
3. Assign an appropriate difficulty level ("easy", "medium", or "hard")

Return the flashcards in the following JSON format only:
[
  {
    "front": "Question 1?",
    "back": "Answer 1",
    "difficulty": "medium"
  },
  ...
]

Do not include any explanatory text outside of the JSON array.`;
  
  return prompt;
}

// Helper function to parse AI response
function parseAIResponse(text: string): FlashcardWithDifficulty[] {
  try {
    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Try parsing the entire response if no specific JSON pattern is found
    try {
      return JSON.parse(text);
    } catch {
      throw new Error('No valid JSON found in response');
    }
  } catch (error) {
    console.error('Parsing error:', error);
    throw new Error('Failed to parse AI response');
  }
}