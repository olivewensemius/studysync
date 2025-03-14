import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles for all buttons
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    // Different style variants
    variants: {
      variant: {
        // Main action button
        default: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
        // Outlined button for secondary actions
        outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
        // Subtle background button
        secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500',
        // Minimal styling button
        ghost: 'hover:bg-secondary-100 text-secondary-700 focus:ring-secondary-500',
        // Destructive action button (e.g., delete)
        destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
      },
      // Button size variations
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-12 px-6 text-lg',
        icon: 'h-10 w-10 p-0' // For icon-only buttons
      }
    },
    // Default styles if no variant is specified
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

// Extend HTML button props with our custom variants
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean; // Allows rendering as different components if needed
}

// Create the Button component using forwardRef for ref forwarding
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };