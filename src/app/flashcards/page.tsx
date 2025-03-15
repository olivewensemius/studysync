// src/app/flashcards/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  Trash2,
  Edit,
  Check,
  X,
  Filter,
  Zap,
  FileText,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getFlashcardSets, getFlashcards, updateFlashcardMastery, deleteFlashcard } from './actions';

// Define types for our data
interface FlashcardSet {
  id: string;
  title: string;
  subject: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

interface Flashcard {
  id: string;
  set_id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mastered: boolean;
  last_studied?: string;
}

export default function FlashcardsPage() {
  const router = useRouter();
  
  // State management
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState<'all' | 'mastered' | 'unmastered'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cardCounts, setCardCounts] = useState<{[key: string]: {total: number, mastered: number}}>({});

  // Load flashcard sets
  useEffect(() => {
    const loadSets = async () => {
      try {
        const sets = await getFlashcardSets();
        setFlashcardSets(sets);
        
        // Calculate card counts for each set
        const counts: {[key: string]: {total: number, mastered: number}} = {};
        for (const set of sets) {
          try {
            const cards = await getFlashcards(set.id);
            counts[set.id] = {
              total: cards.length,
              mastered: cards.filter(card => card.mastered).length
            };
          } catch (err) {
            console.error(`Error fetching cards for set ${set.id}:`, err);
          }
        }
        setCardCounts(counts);
      } catch (err: any) {
        console.error("Error loading flashcard sets:", err);
        setError("Failed to load flashcard sets");
      } finally {
        setLoading(false);
      }
    };
    
    loadSets();
  }, []);

  // Load flashcards when a set is selected
  useEffect(() => {
    if (selectedSet) {
      const loadCards = async () => {
        try {
          setLoading(true);
          const cards = await getFlashcards(selectedSet);
          setFlashcards(cards);
          setCurrentCardIndex(0);
        } catch (err: any) {
          console.error("Error loading flashcards:", err);
          setError("Failed to load flashcards");
        } finally {
          setLoading(false);
        }
      };
      
      loadCards();
    }
  }, [selectedSet]);

  // Filtered and processed flashcards
  const processedFlashcards = selectedSet 
    ? flashcards.filter(card => 
        (filter === 'all' || 
         (filter === 'mastered' && card.mastered) || 
         (filter === 'unmastered' && !card.mastered))
      ) 
    : [];

  // Navigation and interaction methods
  const handleNextCard = () => {
    if (processedFlashcards.length === 0) return;
    
    setCurrentCardIndex((prevIndex) => 
      (prevIndex + 1) % processedFlashcards.length
    );
    setIsFlipped(false);
  };

  const handlePrevCard = () => {
    if (processedFlashcards.length === 0) return;
    
    setCurrentCardIndex((prevIndex) => 
      prevIndex === 0 ? processedFlashcards.length - 1 : prevIndex - 1
    );
    setIsFlipped(false);
  };

  const handleMasterCard = async () => {
    if (processedFlashcards.length === 0) return;
    
    const currentCard = processedFlashcards[currentCardIndex];
    const newMasteredValue = !currentCard.mastered;
    
    try {
      // Update in the database
      await updateFlashcardMastery(currentCard.id, newMasteredValue);
      
      // Update local state
      const updatedFlashcards = flashcards.map(card => 
        card.id === currentCard.id ? { ...card, mastered: newMasteredValue } : card
      );
      
      setFlashcards(updatedFlashcards);
      
      // Update card counts
      if (selectedSet) {
        const newCounts = { ...cardCounts };
        newCounts[selectedSet] = {
          total: cardCounts[selectedSet]?.total || 0,
          mastered: newMasteredValue 
            ? (cardCounts[selectedSet]?.mastered || 0) + 1
            : (cardCounts[selectedSet]?.mastered || 0) - 1
        };
        setCardCounts(newCounts);
      }
    } catch (err) {
      console.error("Error updating mastery status:", err);
      setError("Failed to update card");
    }
  };

  const handleDeleteCard = async () => {
    if (processedFlashcards.length === 0) return;
    
    const currentCard = processedFlashcards[currentCardIndex];
    
    if (confirm("Are you sure you want to delete this flashcard?")) {
      try {
        await deleteFlashcard(currentCard.id);
        
        // Remove from local state
        const updatedFlashcards = flashcards.filter(card => card.id !== currentCard.id);
        setFlashcards(updatedFlashcards);
        
        // Update card counts
        if (selectedSet) {
          const newCounts = { ...cardCounts };
          newCounts[selectedSet] = {
            total: (cardCounts[selectedSet]?.total || 0) - 1,
            mastered: currentCard.mastered 
              ? (cardCounts[selectedSet]?.mastered || 0) - 1
              : (cardCounts[selectedSet]?.mastered || 0)
          };
          setCardCounts(newCounts);
        }
        
        // Adjust current index if needed
        if (currentCardIndex >= updatedFlashcards.length) {
          setCurrentCardIndex(Math.max(0, updatedFlashcards.length - 1));
        }
      } catch (err) {
        console.error("Error deleting card:", err);
        setError("Failed to delete card");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 mb-4">
          {error}
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2"
            onClick={() => setError('')}
          >
            Dismiss
          </Button>
        </div>
      )}
      
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
            
            {loading && flashcardSets.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
              </div>
            ) : flashcardSets.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-text-secondary mb-4">You don't have any flashcard sets yet</p>
                <Button 
                  variant="default"
                  leftIcon={<PlusCircle className="h-4 w-4" />}
                  onClick={() => router.push('/flashcards/create-set')}
                  size="sm"
                >
                  Create Your First Set
                </Button>
              </div>
            ) : (
              <>
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
                          {cardCounts[set.id]?.mastered || 0}/{cardCounts[set.id]?.total || 0}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/flashcards/edit-set/${set.id}`);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
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
          ) : loading ? (
            <Card className="dark-card text-center p-10">
              <Loader2 className="mx-auto h-12 w-12 text-primary-400 animate-spin mb-4" />
              <h3 className="text-lg font-medium text-text-primary">
                Loading flashcards...
              </h3>
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
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Button 
                  variant="default"
                  leftIcon={<PlusCircle className="h-4 w-4" />}
                  onClick={() => router.push(`/flashcards/${selectedSet}/add-card`)}
                >
                  Add Cards Manually
                </Button>
                <Button
                  variant="outline"
                  leftIcon={<FileText className="h-4 w-4" />}
                  onClick={() => router.push(`/flashcards/${selectedSet}/notes-upload`)}
                >
                  Upload Notes
                </Button>
                <Button
                  variant="accent"
                  leftIcon={<Zap className="h-4 w-4" />}
                  onClick={() => router.push(`/flashcards/${selectedSet}/ai-generate`)}
                >
                  AI Generate
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="dark-card p-6">
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
                    onClick={handleDeleteCard}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Flashcard */}
              <div 
                className="relative w-full h-96 border rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div 
                  className={`
                    absolute inset-0 bg-card-border/10 rounded-lg p-6 
                    flex items-center justify-center text-center
                    transition-opacity duration-300
                    ${isFlipped ? 'opacity-0' : 'opacity-100'}
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
                    transition-opacity duration-300
                    ${isFlipped ? 'opacity-100' : 'opacity-0'}
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
                    disabled={processedFlashcards.length <= 1}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleNextCard}
                    disabled={processedFlashcards.length <= 1}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex flex-col items-center">
                  <Badge variant={
                    processedFlashcards.length > 0 && processedFlashcards[currentCardIndex].difficulty === 'easy' ? 'success' :
                    processedFlashcards.length > 0 && processedFlashcards[currentCardIndex].difficulty === 'hard' ? 'destructive' :
                    'primary'
                  }>
                    {processedFlashcards.length > 0 ? processedFlashcards[currentCardIndex].difficulty : 'medium'}
                  </Badge>
                  <span className="text-text-secondary text-xs mt-1">Difficulty</span>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant={processedFlashcards.length > 0 && processedFlashcards[currentCardIndex].mastered ? 'ghost' : 'destructive'}
                    size="icon"
                    onClick={() => {
                      if (processedFlashcards.length > 0 && processedFlashcards[currentCardIndex].mastered) {
                        handleMasterCard();
                      }
                    }}
                    disabled={processedFlashcards.length === 0 || !processedFlashcards[currentCardIndex].mastered}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant={processedFlashcards.length > 0 && processedFlashcards[currentCardIndex].mastered ? 'ghost' : 'accent'}
                    size="icon"
                    onClick={handleMasterCard}
                    disabled={processedFlashcards.length === 0}
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Add Cards Button */}
              <div className="mt-6 flex justify-center">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button 
                    variant="ghost"
                    leftIcon={<PlusCircle className="h-4 w-4" />}
                    onClick={() => router.push(`/flashcards/${selectedSet}/add-card`)}
                    size="sm"
                  >
                    Add More Cards
                  </Button>
                  <Button
                    variant="ghost"
                    leftIcon={<Zap className="h-4 w-4" />}
                    onClick={() => router.push(`/flashcards/${selectedSet}/ai-generate`)}
                    size="sm"
                  >
                    AI Generate
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