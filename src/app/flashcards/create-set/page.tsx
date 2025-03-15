// src/app/flashcards/create-set/page.tsx
"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  PlusCircle, 
  Tag, 
  ChevronLeft, 
  Trash2,
  X,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createFlashcardSet } from '../actions';

export default function CreateFlashcardSetPage() {
  const router = useRouter();

  // Form state
  const [setDetails, setSetDetails] = useState({
    title: '',
    subject: '',
    description: ''
  });

  // Tags state
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // UI states
  const [isCreating, setIsCreating] = useState(false);
  const [newSetId, setNewSetId] = useState<string | null>(null);

  // Errors state
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSetDetails(prev => ({
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

  // Add a new tag
  const addTag = () => {
    if (!newTag.trim()) return;

    // Check for duplicate tags
    if (tags.some(tag => tag.toLowerCase() === newTag.trim().toLowerCase())) {
      setErrors(prev => ({
        ...prev,
        tags: 'This tag already exists'
      }));
      return;
    }

    setTags(prev => [...prev, newTag.trim()]);
    setNewTag('');
    
    // Clear any existing tag errors
    if (errors.tags) {
      setErrors(prev => ({
        ...prev,
        tags: ''
      }));
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: {[key: string]: string} = {};

    if (!setDetails.title.trim()) {
      newErrors.title = 'Set title is required';
    }

    if (!setDetails.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    // If there are errors, set them and prevent submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit to the database
    setIsCreating(true);
    try {
      const newSet = await createFlashcardSet({
        ...setDetails,
        tags: tags.length > 0 ? tags : undefined
      });
      
      setNewSetId(newSet.id);
      
      // Show "Add Cards" options
      setIsCreating(false);
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to create flashcard set' });
      setIsCreating(false);
    }
  };

  // If set is created, show card creation options
  if (newSetId) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          size="sm"
          leftIcon={<ChevronLeft className="h-4 w-4" />}
          onClick={() => router.push('/flashcards')}
        >
          Back to Flashcards
        </Button>

        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-md text-green-400 mb-6">
          Flashcard set created successfully! How would you like to add cards?
        </div>

        <Card className="dark-card p-6">
          <h2 className="text-lg font-bold text-text-primary mb-6">Add Cards to Your Set</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="dark-card hover:border-primary-500/30 cursor-pointer p-6" 
                  onClick={() => router.push(`/flashcards/${newSetId}/add-card`)}>
              <div className="flex flex-col items-center text-center">
                <PlusCircle className="h-12 w-12 text-primary-400 mb-4" />
                <h3 className="font-medium text-text-primary text-lg mb-2">Add Cards Manually</h3>
                <p className="text-text-secondary">
                  Create flashcards one by one with custom content
                </p>
              </div>
            </Card>
            
            <Card className="dark-card hover:border-primary-500/30 cursor-pointer p-6"
                  onClick={() => router.push(`/flashcards/${newSetId}/notes-upload`)}>
              <div className="flex flex-col items-center text-center">
                <BookOpen className="h-12 w-12 text-primary-400 mb-4" />
                <h3 className="font-medium text-text-primary text-lg mb-2">Upload Class Notes</h3>
                <p className="text-text-secondary">
                  Generate flashcards from your lecture notes or study materials
                </p>
              </div>
            </Card>
            
            <Card className="dark-card hover:border-primary-500/30 cursor-pointer p-6"
                  onClick={() => router.push(`/flashcards/${newSetId}/ai-generate`)}>
              <div className="flex flex-col items-center text-center">
                <div className="h-12 w-12 text-primary-400 mb-4 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                    <path d="M12 2v8"></path>
                    <path d="m4.93 10.93 1.41 1.41"></path>
                    <path d="M2 18h2"></path>
                    <path d="M20 18h2"></path>
                    <path d="m19.07 10.93-1.41 1.41"></path>
                    <path d="M20.285 14.57C19.166 12.22 17.15 11 12 11c-5.15 0-7.166 1.22-8.285 3.57C2.86 16.4 5.05 20 12 20c6.95 0 9.14-3.6 8.285-5.43Z"></path>
                  </svg>
                </div>
                <h3 className="font-medium text-text-primary text-lg mb-2">AI Generation</h3>
                <p className="text-text-secondary">
                  Use AI to automatically generate flashcards on any topic
                </p>
              </div>
            </Card>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              variant="ghost"
              onClick={() => router.push('/flashcards')}
            >
              Go Back to All Flashcards
            </Button>
          </div>
        </Card>
      </div>
    );
  }

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
        Create New Flashcard Set
      </h1>

      {errors.submit && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-md text-red-400">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Set Information */}
        <Card className="dark-card p-6">
          <h2 className="text-lg font-bold text-text-primary mb-6">
            Set Details
          </h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label 
                htmlFor="title" 
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Set Title*
              </label>
              <Input
                id="title"
                name="title"
                value={setDetails.title}
                onChange={handleInputChange}
                placeholder="e.g., Calculus Fundamentals"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label 
                htmlFor="subject" 
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Subject*
              </label>
              <Input
                id="subject"
                name="subject"
                value={setDetails.subject}
                onChange={handleInputChange}
                placeholder="e.g., Mathematics"
                className={errors.subject ? 'border-red-500' : ''}
              />
              {errors.subject && (
                <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label 
                htmlFor="description" 
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={setDetails.description}
                onChange={handleInputChange}
                placeholder="Optional description about this flashcard set"
                className="min-h-24"
              />
            </div>
          </div>
        </Card>

        {/* Tags */}
        <Card className="dark-card p-6">
          <h2 className="text-lg font-bold text-text-primary mb-6">
            Tags
          </h2>

          {/* Existing Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <div 
                  key={tag} 
                  className="flex items-center bg-primary-500/20 text-primary-400 rounded-full px-3 py-1 text-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-primary-400 hover:text-primary-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Tag */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-4 w-4 text-text-secondary" />
              </div>
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className={`pl-10 ${errors.tags ? 'border-red-500' : ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addTag}
            >
              Add Tag
            </Button>
          </div>
          {errors.tags && (
            <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
          )}
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/flashcards')}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : 'Create Flashcard Set'}
          </Button>
        </div>
      </form>
    </div>
  );
}