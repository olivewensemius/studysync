
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Define button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles for all buttons
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed',
  {
    // Different style variants
    variants: {
      variant: {
        // Main action button
        default: 'bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow',
        // Outlined button for secondary actions
        outline: 'border border-primary-500 text-primary-400 hover:bg-primary-500/10 hover:text-primary-300',
        // Subtle background button
        secondary: 'bg-secondary-800 text-secondary-100 hover:bg-secondary-700',
        // Minimal styling button
        ghost: 'text-text-secondary hover:bg-card-bg hover:text-text-primary',
        // Destructive action button (e.g., delete)
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        // Accent button (green)
        accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-sm hover:shadow',
        // Glowing button for emphasis
        glow: 'bg-primary-500 text-white shadow-glow hover:bg-primary-600 hover:shadow-glow'
      },
      // Button size variations
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 py-1 text-xs',
        lg: 'h-12 px-6 py-3 text-base',
        icon: 'h-9 w-9 p-1.5' // For icon-only buttons
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
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Create the Button component using forwardRef for ref forwarding
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };