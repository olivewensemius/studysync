// src/services/ai-flashcard-service.ts
export async function generateFlashcardsWithAI(options: {
    topic?: string;
    content?: string;
    count?: number;
    difficulty?: string;
  }) {
    const { topic, content, count = 5, difficulty = 'mixed' } = options;
    
    if (!topic && !content) {
      throw new Error('Either topic or content must be provided');
    }
  
    // Create the prompt
    const prompt = createFlashcardPrompt(topic, content, count, difficulty);
    
    try {
      // Call the Gemini API directly
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY || ''
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 8192,
          }
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
      }
  
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Parse the AI response to get flashcards
      return parseAIResponse(text);
    } catch (error) {
      console.error('AI generation error:', error);
      throw new Error('Failed to generate flashcards');
    }
  }
  
  function createFlashcardPrompt(
    topic?: string, 
    content?: string, 
    count: number = 5,
    difficulty: string = 'mixed'
  ): string {
    let prompt = `Create ${count} high-quality flashcards in JSON format for studying.`;
    
    if (topic) {
      prompt += ` The topic is: "${topic}".`;
    }
    
    if (content) {
      // Truncate content if it's too long
      const truncatedContent = content.length > 8000 
        ? content.substring(0, 8000) + "... (content truncated)"
        : content;
        
      prompt += ` Based on this content: 
  
  ${truncatedContent}
  
  Extract the most important concepts, definitions, facts, and relationships.`;
    }
    
    if (difficulty && difficulty !== 'mixed') {
      prompt += ` Make all flashcards ${difficulty} difficulty.`;
    }
    
    prompt += `
    
  For each flashcard:
  1. The "front" should contain a clear, concise question or prompt
  2. The "back" should provide a comprehensive but concise answer
  3. Assign an appropriate difficulty level ("easy", "medium", or "hard")
  
  Return the flashcards in the following JSON format only:
  [
    {
      "front": "Question 1?",
      "back": "Answer 1",
      "difficulty": "medium"
    },
    ...
  ]
  
  Do not include any explanatory text outside of the JSON array.`;
    
    return prompt;
  }
  
  function parseAIResponse(text: string) {
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Try parsing the entire response if no specific JSON pattern is found
      try {
        return JSON.parse(text);
      } catch {
        throw new Error('No valid JSON found in response');
      }
    } catch (error) {
      console.error('Parsing error:', error);
      throw new Error('Failed to parse AI response');
    }
  }