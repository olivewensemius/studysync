// src/app/flashcards/[setId]/ai-generate/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  Zap,
  Trash2,
  Check,
  Loader2,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { generateFlashcards, saveBatchFlashcards } from '../../actions';

export default function AIFlashcardGenerator() {
  const router = useRouter();
  const params = useParams();
  const setId = params.setId as string;
  
  // Form state
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState('mixed');
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [generatedCards, setGeneratedCards] = useState<any[]>([]);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);
  const [tempCardEdit, setTempCardEdit] = useState({ front: '', back: '' });
  
  // Generate flashcards
  const handleGenerate = async () => {
    if (!topic && !content) {
      setError('Please provide either a topic or content to generate flashcards');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      const cards = await generateFlashcards({
        topic,
        content,
        count,
        difficulty
      });
      
      setGeneratedCards(cards);
    } catch (err: any) {
      setError(err.message || 'Failed to generate flashcards');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Save cards to database
  const handleSaveCards = async () => {
    if (generatedCards.length === 0) return;
    
    setIsSaving(true);
    try {
      await saveBatchFlashcards(setId, generatedCards);
      router.push(`/flashcards`);
    } catch (err: any) {
      setError(err.message || 'Failed to save flashcards');
      setIsSaving(false);
    }
  };
  
  // Edit card
  const startEditing = (index: number) => {
    setEditingCardIndex(index);
    setTempCardEdit({
      front: generatedCards[index].front,
      back: generatedCards[index].back
    });
  };
  
  // Save edited card
  const saveEdit = () => {
    if (editingCardIndex === null) return;
    
    const updatedCards = [...generatedCards];
    updatedCards[editingCardIndex] = {
      ...updatedCards[editingCardIndex],
      front: tempCardEdit.front,
      back: tempCardEdit.back
    };
    
    setGeneratedCards(updatedCards);
    setEditingCardIndex(null);
  };
  
  // Remove card
  const removeCard = (index: number) => {
    setGeneratedCards(prev => prev.filter((_, i) => i !== index));
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
        AI Flashcard Generator
      </h1>
      
      <Card className="dark-card p-6">
        <h2 className="text-lg font-bold text-text-primary mb-6">
          Generate Flashcards with AI
        </h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-text-primary mb-1">
              Topic (e.g., "Calculus Derivatives" or "Spanish Verbs")
            </label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a study topic"
              className="text-black"
            />
          </div>
          
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="count" className="block text-sm font-medium text-text-primary mb-1">
                Number of flashcards
              </label>
              <Input
                id="count"
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value) || 5)}
                className="text-black"
              />
            </div>
            
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-text-primary mb-1">
                Difficulty level
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-white border-card-border text-black"
              >
                <option value="mixed">Mixed difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          
          {error && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}
          
          <Button
            variant="accent"
            leftIcon={isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            onClick={handleGenerate}
            disabled={isGenerating || (!topic && !content)}
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate Flashcards'}
          </Button>
        </div>
      </Card>
      
      {generatedCards.length > 0 && (
        <Card className="dark-card p-6">
          <h2 className="text-lg font-bold text-text-primary mb-6">
            Generated Flashcards
          </h2>
          
          <div className="space-y-4">
            {generatedCards.map((card, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border border-card-border/50 hover:border-primary-500/30 transition-colors"
              >
                {editingCardIndex === index ? (
                  <>
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium text-text-primary">Editing Card {index + 1}</h3>
                      <div className="flex space-x-2">
                        <Badge variant={
                          card.difficulty === 'easy' ? 'success' :
                          card.difficulty === 'hard' ? 'destructive' : 'primary'
                        }>
                          {card.difficulty || 'medium'}
                        </Badge>
                        <button 
                          className="text-primary-400 hover:text-primary-300"
                          onClick={saveEdit}
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-text-secondary hover:text-text-primary"
                          onClick={() => setEditingCardIndex(null)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-text-secondary mb-1">Front</label>
                      <Textarea
                        value={tempCardEdit.front}
                        onChange={(e) => setTempCardEdit({...tempCardEdit, front: e.target.value})}
                        className="bg-card-border/10 text-black"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1">Back</label>
                      <Textarea
                        value={tempCardEdit.back}
                        onChange={(e) => setTempCardEdit({...tempCardEdit, back: e.target.value})}
                        className="bg-primary-500/10 text-black"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium text-text-primary">Card {index + 1}</h3>
                      <div className="flex space-x-2">
                        <Badge variant={
                          card.difficulty === 'easy' ? 'success' :
                          card.difficulty === 'hard' ? 'destructive' : 'primary'
                        }>
                          {card.difficulty || 'medium'}
                        </Badge>
                        <button 
                          className="text-text-secondary hover:text-primary-400"
                          onClick={() => startEditing(index)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-text-secondary hover:text-red-400"
                          onClick={() => removeCard(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-card-border/10 p-3 rounded-md mb-2">
                      <p className="text-text-primary">{card.front}</p>
                    </div>
                    
                    <div className="bg-primary-500/10 p-3 rounded-md">
                      <p className="text-text-primary">{card.back}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/flashcards')}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                leftIcon={isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                onClick={handleSaveCards}
                disabled={isSaving || generatedCards.length === 0}
              >
                {isSaving ? 'Saving...' : 'Save All Flashcards'}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}