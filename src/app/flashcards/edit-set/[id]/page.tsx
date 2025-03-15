// src/app/flashcards/edit-set/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  PlusCircle, 
  Tag, 
  Save,
  Trash2,
  X,
  Loader2
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getFlashcardSets, updateFlashcardSet, deleteFlashcardSet } from '../../actions';

export default function EditFlashcardSetPage() {
  const router = useRouter();
  const params = useParams();
  const setId = params.id as string;
  
  // Form state
  const [setDetails, setSetDetails] = useState({
    id: '',
    title: '',
    subject: '',
    description: ''
  });

  // Tags state
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load flashcard set data
  useEffect(() => {
    const loadFlashcardSet = async () => {
      try {
        setLoading(true);
        const sets = await getFlashcardSets();
        const set = sets.find(s => s.id === setId);
        
        if (set) {
          setSetDetails({
            id: set.id,
            title: set.title,
            subject: set.subject,
            description: set.description || ''
          });
          
          if (set.tags && Array.isArray(set.tags)) {
            setTags(set.tags);
          }
        } else {
          setError('Flashcard set not found');
        }
      } catch (err: any) {
        console.error("Error loading flashcard set:", err);
        setError('Failed to load flashcard set');
      } finally {
        setLoading(false);
      }
    };
    
    loadFlashcardSet();
  }, [setId]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSetDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear success/error when editing
    setSuccess('');
    setError('');
  };

  // Add a new tag
  const addTag = () => {
    if (!newTag.trim()) return;

    // Check for duplicate tags
    if (tags.some(tag => tag.toLowerCase() === newTag.trim().toLowerCase())) {
      setError('This tag already exists');
      return;
    }

    setTags(prev => [...prev, newTag.trim()]);
    setNewTag('');
    setError('');
  };

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  // Save changes
  const handleSave = async () => {
    // Validate form
    if (!setDetails.title.trim()) {
      setError('Set title is required');
      return;
    }

    if (!setDetails.subject.trim()) {
      setError('Subject is required');
      return;
    }

    setSaving(true);
    try {
      await updateFlashcardSet(setId, {
        title: setDetails.title,
        subject: setDetails.subject,
        description: setDetails.description,
        tags: tags.length > 0 ? tags : undefined
      });
      
      setSuccess('Flashcard set updated successfully');
      setSaving(false);
      
      // Clear success message after delay
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      console.error("Error updating flashcard set:", err);
      setError('Failed to update flashcard set');
      setSaving(false);
    }
  };

  // Delete flashcard set
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this flashcard set? All cards in this set will be permanently deleted. This action cannot be undone.')) {
      setDeleting(true);
      try {
        await deleteFlashcardSet(setId);
        router.push('/flashcards');
      } catch (err: any) {
        console.error("Error deleting flashcard set:", err);
        setError('Failed to delete flashcard set');
        setDeleting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary-400" />
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

      <h1 className="text-2xl font-bold text-text-primary">Edit Flashcard Set</h1>

      {/* Notification Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-md text-red-400">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-md text-green-400 flex items-center">
          <Save className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

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
            />
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
            />
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
              className="pl-10"
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
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="destructive"
          leftIcon={<Trash2 className="h-4 w-4" />}
          onClick={handleDelete}
          disabled={deleting || saving}
        >
          {deleting ? 'Deleting...' : 'Delete Set'}
        </Button>
        
        <div className="flex space-x-3">
          <Button
            variant="ghost"
            onClick={() => router.push('/flashcards')}
            disabled={saving || deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            leftIcon={saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            onClick={handleSave}
            disabled={saving || deleting}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}