// src/app/flashcards/[setId]/add-card/page.tsx
"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  PlusCircle,
  Zap
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export default function AddFlashcardPage() {
  const router = useRouter();
  const params = useParams();
  const setId = params.setId as string;

  // Form state
  const [flashcard, setFlashcard] = useState({
    front: '',
    back: '',
    difficulty: 'medium'
  });

  // Errors state
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFlashcard(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear any existing errors for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: {[key: string]: string} = {};

    if (!flashcard.front.trim()) {
      newErrors.front = 'Front of the card is required';
    }

    if (!flashcard.back.trim()) {
      newErrors.back = 'Back of the card is required';
    }

    // If there are errors, set them and prevent submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: Implement actual card creation logic
    console.log('Creating flashcard:', {
      ...flashcard,
      setId
    });

    // Redirect to flashcards page or stay on the same page to add more
    router.push(`/flashcards`);
  };

  // Handle adding another card
  const handleAddAnother = () => {
    // Validate form first
    const newErrors: {[key: string]: string} = {};

    if (!flashcard.front.trim()) {
      newErrors.front = 'Front of the card is required';
    }

    if (!flashcard.back.trim()) {
      newErrors.back = 'Back of the card is required';
    }

    // If there are errors, set them and prevent submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: Implement actual card creation logic
    console.log('Creating flashcard:', {
      ...flashcard,
      setId
    });

    // Reset form for another card
    setFlashcard({
      front: '',
      back: '',
      difficulty: 'medium'
    });
    setErrors({});
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        size="sm"
        leftIcon={<ChevronLeft className="h-4 w-4" />}
        onClick={() => router.push('/flashcards')}
      >
        Back to Flashcards
      </Button>

      <h1 className="text-2xl font-bold text-text-primary">
        Add New Flashcard
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Flashcard Content */}
        <Card className="dark-card">
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
                className={`min-h-24 ${errors.front ? 'border-red-500' : ''}`}
              />
              {errors.front && (
                <p className="text-red-500 text-xs mt-1">{errors.front}</p>
              )}
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
                className={`min-h-24 ${errors.back ? 'border-red-500' : ''}`}
              />
              {errors.back && (
                <p className="text-red-500 text-xs mt-1">{errors.back}</p>
              )}
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
        <Card className="dark-card bg-gradient-to-r from-primary-900/50 to-card-bg border-primary-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-bold text-text-primary">
                Need Help Creating Flashcards?
              </h2>
              <p className="text-text-secondary text-sm mt-1">
                Use AI to generate flashcard content or get suggestions
              </p>
            </div>
            <Button 
              variant="glow"
              leftIcon={<Zap className="h-4 w-4" />}
            >
              AI Flashcard Assistant
            </Button>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/flashcards')}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            leftIcon={<PlusCircle className="h-4 w-4" />}
            onClick={handleAddAnother}
          >
            Save and Add Another
          </Button>
          <Button
            type="submit"
            variant="default"
          >
            Save Flashcard
          </Button>
        </div>
      </form>
    </div>
  );
}