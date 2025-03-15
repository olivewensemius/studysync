// src/app/flashcards/[set-id]/add-card/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  PlusCircle,
  Zap,
  FileText,
  Check,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { createFlashcard } from '../../actions';

export default function AddFlashcardPage() {
  const router = useRouter();
  const params = useParams();
  
  // Extract set ID from URL parameters
  const setId = params['set-id'] as string;
  
  useEffect(() => {
    // Debug: Log the set ID to verify it's correct
    console.log("Add card page loaded with set ID:", setId);
  }, [setId]);
  
  // Form state
  const [flashcard, setFlashcard] = useState({
    front: '',
    back: '',
    difficulty: 'medium'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFlashcard(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when editing
    if (error) setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!flashcard.front.trim()) {
      setError('Front of the card is required');
      return;
    }

    if (!flashcard.back.trim()) {
      setError('Back of the card is required');
      return;
    }

    // Submit to database
    setIsSaving(true);
    try {
      // Debug: Log what we're attempting to save
      console.log("Attempting to save flashcard with set ID:", setId);
      
      await createFlashcard({
        set_id: setId,
        front: flashcard.front,
        back: flashcard.back,
        difficulty: flashcard.difficulty as 'easy' | 'medium' | 'hard'
      });
      
      setSaveSuccess(true);
      // Reset form after successful save
      setFlashcard({
        front: '',
        back: '',
        difficulty: 'medium'
      });
      
      // Clear success message after delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error("Error saving flashcard:", err);
      setError(err.message || 'Failed to create flashcard');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle adding another card
  const handleAddAnother = () => {
    handleSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  // Go back to all flashcards
  const handleBack = () => {
    router.push('/flashcards');
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        size="sm"
        leftIcon={<ChevronLeft className="h-4 w-4" />}
        onClick={handleBack}
      >
        Back to Flashcards
      </Button>

      <h1 className="text-2xl font-bold text-text-primary">
        Add New Flashcard
      </h1>

      {saveSuccess && (
        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-md">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-500">Flashcard saved successfully!</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Flashcard Content */}
        <Card className="dark-card p-6">
          <h2 className="text-lg font-bold text-text-primary mb-6">
            Card Details
          </h2>

          <div className="space-y-4">
            {/* Front of Card */}
            <div>
              <label 
                htmlFor="front" 
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Front of Card*
              </label>
              <Textarea
                id="front"
                name="front"
                value={flashcard.front}
                onChange={handleInputChange}
                placeholder="Enter the question or prompt"
                className="min-h-24"
              />
            </div>

            {/* Back of Card */}
            <div>
              <label 
                htmlFor="back" 
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Back of Card*
              </label>
              <Textarea
                id="back"
                name="back"
                value={flashcard.back}
                onChange={handleInputChange}
                placeholder="Enter the answer or explanation"
                className="min-h-24"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label 
                htmlFor="difficulty" 
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={flashcard.difficulty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md bg-card-bg border-card-border text-text-primary"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </Card>

        {/* AI Assistance */}
        <Card className="dark-card bg-gradient-to-r from-primary-900/50 to-card-bg border-primary-800/50 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-bold text-text-primary">
                Need Help Creating Flashcards?
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                Use AI to generate flashcard content or get suggestions
              </p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                leftIcon={<FileText className="h-4 w-4" />}
                onClick={() => router.push(`/flashcards/${setId}/notes-upload`)}
              >
                Upload Notes
              </Button>
              <Button 
                variant="glow"
                leftIcon={<Zap className="h-4 w-4" />}
                onClick={() => router.push(`/flashcards/${setId}/ai-generate`)}
              >
                AI Flashcard Assistant
              </Button>
            </div>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            leftIcon={<PlusCircle className="h-4 w-4" />}
            onClick={handleAddAnother}
            disabled={isSaving}
          >
            Save and Add Another
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : 'Save Flashcard'}
          </Button>
        </div>
      </form>
    </div>
  );
}