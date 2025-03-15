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
  
  const { data: newCard, error } = await supabase
    .from('flashcards')
    .insert([{
      ...data,
      difficulty: data.difficulty || 'medium'
    }])
    .select()
  
  if (error) {
    console.error("Error creating flashcard:", error)
    throw new Error('Failed to create flashcard')
  }
  
  return newCard[0]
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