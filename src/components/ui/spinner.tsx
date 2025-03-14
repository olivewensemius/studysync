// src/components/ui/spinner.tsx
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'destructive';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  variant = 'default', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-[3px]',
    lg: 'w-8 h-8 border-4',
    xl: 'w-12 h-12 border-[5px]'
  };

  const variantClasses = {
    default: 'border-secondary-200 border-t-secondary-600',
    primary: 'border-primary-200 border-t-primary-600',
    secondary: 'border-secondary-100 border-t-secondary-500',
    destructive: 'border-red-200 border-t-red-600'
  };

  return (
    <div 
      className={cn(
        'animate-spin rounded-full border-solid',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export { Spinner };