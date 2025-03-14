// src/app/flashcards/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  BookOpen, 
  RefreshCw, 
  ArrowLeft, 
  ArrowRight, 
  Trash2,
  Edit,
  Check,
  X,
  Filter,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Define types for our data
interface FlashcardSet {
  id: string;
  title: string;
  subject: string;
  cardsCount: number;
  mastered: number;
  lastStudied: string;
  tags: string[];
}

interface Flashcard {
  id: string;
  setId: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mastered: boolean;
}

// Mock data for flashcards - will be replaced with actual backend data
const mockFlashcardSets: FlashcardSet[] = [
  {
    id: '1',
    title: 'Calculus Fundamentals',
    subject: 'Mathematics',
    cardsCount: 25,
    mastered: 10,
    lastStudied: '2025-03-15T10:30:00Z',
    tags: ['Derivatives', 'Integrals']
  },
  {
    id: '2',
    title: 'Organic Chemistry Reactions',
    subject: 'Chemistry',
    cardsCount: 40,
    mastered: 15,
    lastStudied: '2025-03-10T14:45:00Z',
    tags: ['Organic', 'Mechanisms']
  },
  {
    id: '3',
    title: 'Python Programming Concepts',
    subject: 'Computer Science',
    cardsCount: 30,
    mastered: 22,
    lastStudied: '2025-03-12T16:20:00Z',
    tags: ['Algorithms', 'Data Structures']
  }
];

const mockFlashcards: Flashcard[] = [
  {
    id: '1',
    setId: '1',
    front: 'What is the power rule for derivatives?',
    back: 'For a function f(x) = x^n, the derivative is f\'(x) = n * x^(n-1)',
    difficulty: 'medium',
    mastered: false
  },
  {
    id: '2',
    setId: '1',
    front: 'Define the chain rule',
    back: 'If f(x) and g(x) are differentiable, then the derivative of their composition is: (f ∘ g)\'(x) = f\'(g(x)) * g\'(x)',
    difficulty: 'hard',
    mastered: false
  }
];

export default function FlashcardsPage() {
  const router = useRouter();
  
  // State management
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>(mockFlashcardSets);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(mockFlashcards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState<'all' | 'mastered' | 'unmastered'>('all');

  // Filtered and processed flashcards
  const processedFlashcards = selectedSet 
    ? flashcards.filter(card => 
        card.setId === selectedSet && 
        (filter === 'all' || 
         (filter === 'mastered' && card.mastered) || 
         (filter === 'unmastered' && !card.mastered))
      ) 
    : [];

  // Navigation and interaction methods
  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => 
      (prevIndex + 1) % processedFlashcards.length
    );
    setIsFlipped(false);
  };

  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) => 
      prevIndex === 0 ? processedFlashcards.length - 1 : prevIndex - 1
    );
    setIsFlipped(false);
  };

  const handleMasterCard = () => {
    if (processedFlashcards.length === 0) return;
    
    const currentCard = processedFlashcards[currentCardIndex];
    const updatedFlashcards = flashcards.map(card => 
      card.id === currentCard.id ? { ...card, mastered: !card.mastered } : card
    );
    
    setFlashcards(updatedFlashcards);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Flashcards</h1>
          <p className="text-text-secondary mt-1">Study and master your learning materials</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="ghost"
            leftIcon={<Filter className="h-4 w-4" />}
          >
            Filter Sets
          </Button>
          <Button 
            variant="default"
            leftIcon={<PlusCircle className="h-4 w-4" />}
            onClick={() => router.push('/flashcards/create-set')}
          >
            Create Set
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flashcard Sets Column */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="dark-card">
            <h2 className="text-lg font-bold text-text-primary mb-4">Your Flashcard Sets</h2>
            
            {flashcardSets.map((set) => (
              <div 
                key={set.id}
                className={`p-4 rounded-lg mb-2 cursor-pointer transition-all ${
                  selectedSet === set.id 
                    ? 'bg-primary-500/20 border-primary-500/50 border' 
                    : 'hover:bg-card-border/20'
                }`}
                onClick={() => {
                  setSelectedSet(set.id);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-text-primary">{set.title}</h3>
                    <p className="text-text-secondary text-sm">{set.subject}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="primary">
                      {set.mastered}/{set.cardsCount}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement edit set functionality
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Flashcard Study Area */}
        <div className="lg:col-span-2">
          {!selectedSet ? (
            <Card className="dark-card text-center p-10">
              <BookOpen className="mx-auto h-12 w-12 text-text-secondary opacity-50 mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                Select a Flashcard Set to Begin Studying
              </h3>
              <p className="text-text-secondary mb-4">
                Choose a set from the left panel or create a new one
              </p>
              <Button 
                variant="default"
                leftIcon={<PlusCircle className="h-4 w-4" />}
                onClick={() => router.push('/flashcards/create-set')}
              >
                Create First Set
              </Button>
            </Card>
          ) : processedFlashcards.length === 0 ? (
            <Card className="dark-card text-center p-10">
              <BookOpen className="mx-auto h-12 w-12 text-text-secondary opacity-50 mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                No Cards in this Set
              </h3>
              <p className="text-text-secondary mb-4">
                Add some cards to start studying
              </p>
              <Button 
                variant="default"
                leftIcon={<PlusCircle className="h-4 w-4" />}
                onClick={() => router.push(`/flashcards/add-card/${selectedSet}`)}
              >
                Add Cards
              </Button>
            </Card>
          ) : (
            <Card className="dark-card">
              {/* Study Mode Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-bold text-text-primary">
                    {flashcardSets.find(set => set.id === selectedSet)?.title}
                  </h2>
                  <p className="text-text-secondary text-sm">
                    Card {currentCardIndex + 1} of {processedFlashcards.length}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost"
                    leftIcon={<Filter className="h-4 w-4" />}
                    className="text-xs"
                    onClick={() => setFilter(
                      filter === 'all' ? 'mastered' : 
                      filter === 'mastered' ? 'unmastered' : 
                      'all'
                    )}
                  >
                    {filter === 'all' ? 'All Cards' : 
                     filter === 'mastered' ? 'Mastered' : 
                     'Unmastered'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => processedFlashcards.length > 0 && router.push(`/flashcards/edit-card/${processedFlashcards[currentCardIndex].id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => {
                      // TODO: Implement delete card functionality
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Flashcard */}
              <div 
                className={`
                  relative w-full h-96 perspective-1000 cursor-pointer
                  ${isFlipped ? 'rotate-y-180' : ''}
                `}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div 
                  className={`
                    absolute inset-0 bg-card-border/10 rounded-lg p-6 
                    flex items-center justify-center text-center
                    backface-hidden transition-transform duration-500 
                    ${isFlipped ? 'rotate-y-180 hidden' : ''}
                  `}
                >
                  <p className="text-xl font-medium text-text-primary">
                    {processedFlashcards.length > 0 ? processedFlashcards[currentCardIndex].front : ''}
                  </p>
                </div>
                <div 
                  className={`
                    absolute inset-0 bg-primary-500/10 rounded-lg p-6 
                    flex items-center justify-center text-center
                    backface-hidden rotate-y-180 transition-transform duration-500
                    ${isFlipped ? '' : 'hidden'}
                  `}
                >
                  <p className="text-xl font-medium text-text-primary">
                    {processedFlashcards.length > 0 ? processedFlashcards[currentCardIndex].back : ''}
                  </p>
                </div>
              </div>

              {/* Navigation and Action Buttons */}
              <div className="mt-6 flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handlePrevCard}
                    disabled={processedFlashcards.length === 0}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleNextCard}
                    disabled={processedFlashcards.length === 0}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="destructive" 
                    size="icon"
                    onClick={() => {
                      // TODO: Implement not mastered logic
                    }}
                    disabled={processedFlashcards.length === 0}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="accent" 
                    size="icon"
                    onClick={handleMasterCard}
                    disabled={processedFlashcards.length === 0}
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}