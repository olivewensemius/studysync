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
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const handleSubmit = (e: React.FormEvent) => {
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

    // TODO: Implement actual submission logic
    console.log('Submitting flashcard set:', {
      ...setDetails,
      tags
    });

    // Redirect to flashcards page or the new set
    router.push('/flashcards');
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
        Create New Flashcard Set
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Set Information */}
        <Card className="dark-card">
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
        <Card className="dark-card">
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
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
          >
            Create Flashcard Set
          </Button>
        </div>
      </form>
    </div>
  );
}