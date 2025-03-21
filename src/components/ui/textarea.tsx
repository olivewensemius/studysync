// src/components/ui/textarea.tsx
"use client";

import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full px-3 py-2 border rounded-md text-sm ${className}`}
      {...props}
    />
  );
}
