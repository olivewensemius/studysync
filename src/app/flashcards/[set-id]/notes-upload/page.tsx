// src/app/flashcards/[set-id]/notes-upload/page.tsx
"use client";

import React, { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  Zap,
  Upload,
  FileText,
  Trash2,
  Check,
  Loader2,
  X,
  Image as ImageIcon,
  FileType,
  File as FileIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { generateFlashcards, saveBatchFlashcards } from '../../actions';
import { parseFileContent } from '@/utils/file-parser';

export default function NotesUploadGenerator() {
  const router = useRouter();
  const params = useParams();
  
  const setId = params['set-id'] as string;
  console.log("Using set ID from URL params:", setId, params);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [count, setCount] = useState(10);
  const [error, setError] = useState('');
  const [generatedCards, setGeneratedCards] = useState<any[]>([]);
  
  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    setUploadedFile(file);
    setError('');
    setIsProcessing(true);
    
    try {
      const content = await parseFileContent(file);
      setFileContent(content);
    } catch (err: any) {
      console.error('Error processing file:', err);
      setError(err.message || 'Failed to process file');
      setFileContent('');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Get file icon based on type
  const getFileIcon = (file: File) => {
    const type = file.type;
    const name = file.name.toLowerCase();
    
    if (type.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-primary-400" />;
    } else if (type === 'application/pdf' || name.endsWith('.pdf')) {
      return <FileIcon className="h-8 w-8 text-primary-400" />;
    } else {
      return <FileText className="h-8 w-8 text-primary-400" />;
    }
  };
  
  // Clear file selection
  const clearFile = () => {
    setUploadedFile(null);
    setFileContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Generate flashcards from notes
  const handleGenerate = async () => {
    if (!fileContent) {
      setError('Please upload a file or enter text manually');
      return;
    }
    
    setIsGenerating(true);
    setError('');
    
    try {
      const cards = await generateFlashcards({
        content: fileContent,
        count
      });
      
      setGeneratedCards(cards);
    } catch (err: any) {
      setError(err.message || 'Failed to generate flashcards');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Save generated cards
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
  
  // Remove a card
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
        Generate Flashcards from Notes
      </h1>
      
      <Card className="dark-card p-6">
        <h2 className="text-lg font-bold text-text-primary mb-6">
          Upload Your Notes
        </h2>
        
        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed border-card-border/50 rounded-lg p-6 text-center">
            {!uploadedFile ? (
              <>
                <FileText className="h-12 w-12 mx-auto text-text-secondary opacity-50 mb-4" />
                <p className="text-text-secondary mb-4">
                  Upload your notes as a text file
                </p>
                <p className="text-text-secondary text-sm mb-4">
                  Text files (.txt, .md) work best. PDFs and images will require manual text extraction.
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="*/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  leftIcon={<Upload className="h-4 w-4" />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select File
                </Button>
              </>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getFileIcon(uploadedFile)}
                  <div className="ml-3">
                    <p className="text-text-primary font-medium">{uploadedFile.name}</p>
                    <p className="text-text-secondary text-sm">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-300"
                  onClick={clearFile}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
          
          {isProcessing && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 text-primary-400 animate-spin mr-2" />
              <span className="text-text-secondary">Processing file...</span>
            </div>
          )}
          
          <div>
            <label htmlFor="fileContent" className="block text-sm font-medium text-text-primary mb-1">
              Notes Content
            </label>
            <Textarea
              id="fileContent"
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              placeholder="Paste or type your notes here, or upload a file above"
              className="min-h-32 text-white border-white bg-card-bg"
            />
            <p className="text-text-secondary text-xs mt-1">
              {fileContent.length > 0 ? 
                `${fileContent.length} characters - Edit as needed before generating flashcards` :
                'Enter your study notes here or upload a file'}
            </p>
          </div>
          
          <div>
            <label htmlFor="count" className="block text-sm font-medium text-text-primary mb-1">
              Number of flashcards to generate
            </label>
            <Input
              id="count"
              type="number"
              min="1"
              max="30"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 10)}
              className="text-black"
            />
            <p className="text-text-secondary text-xs mt-1">
              For longer documents, you may want to generate more flashcards
            </p>
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
            disabled={isGenerating || !fileContent.trim()}
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate Flashcards from Notes'}
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
                      className="text-red-400 hover:text-red-300"
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
                disabled={isSaving}
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