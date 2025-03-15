import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Define input variants and states
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'error';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    variant = 'default', 
    leftIcon, 
    rightIcon, 
    error, 
    ...props 
  }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            className={cn(
              // Base input styles
              'block w-full px-3 py-2 border rounded-md',
              // Default state
              'text-black bg-white placeholder-secondary-500',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              
              // Variant-specific styles
              variant === 'default' && 'border-secondary-300',
              variant === 'error' && 'border-red-500 text-red-900 focus:ring-red-500',
              
              // Icon padding
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              
              // Additional custom classes
              className
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };