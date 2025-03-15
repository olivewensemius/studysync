// src/utils/file-parser.ts
export async function parseFileContent(file: File): Promise<string> {
    // For now, let's focus on text files which don't require external libraries
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    // Handle text files directly
    if (fileType === 'text/plain' || 
        fileName.endsWith('.txt') || 
        fileName.endsWith('.md')) {
      return await readTextFile(file);
    }
    // For other file types, provide a helpful message
    else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return "PDF uploaded. For full PDF support, please extract text manually and edit in the text area below.";
    }
    else if (fileType.includes('word') || 
            fileName.endsWith('.docx') || 
            fileName.endsWith('.doc')) {
      return "Word document uploaded. For full document support, please extract text manually and edit in the text area below.";
    }
    else if (fileType.startsWith('image/')) {
      return "Image uploaded. For best results, please type or paste the text from this image in the text area below.";
    }
    else {
      return "File uploaded. Please edit the text area below to ensure correct content for flashcard generation.";
    }
  }
  
  // Read text files directly
  function readTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          resolve(text);
        } catch (err) {
          reject(new Error('Failed to read text file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }