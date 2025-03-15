import React from 'react';
import { cn } from '@/lib/utils';

// 1. Define ALL variants in the type definition
export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' | 'accent';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

// 2. Create a type guard for valid variants
const isBadgeVariant = (variant: string): variant is BadgeVariant => {
  return ['default', 'primary', 'secondary', 'success', 'warning', 'destructive', 'outline', 'accent'].includes(variant);
};

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  className, 
  variant = 'default', 
  size = 'md',
  glow = false,
  ...props 
}) => {
  // 3. Validate variant at runtime
  const validatedVariant = isBadgeVariant(variant) ? variant : 'default';

  // 4. Update variant classes with all possible variants
  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    destructive: 'bg-red-100 text-red-800',
    outline: 'bg-transparent border border-primary-300 text-primary-800',
    accent: 'bg-accent-100 text-accent-800'
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full',
        'transition-all duration-200',
        variantClasses[validatedVariant],
        sizeClasses[size],
        glow && (validatedVariant === 'primary' || validatedVariant === 'accent') && 'shadow-glow',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

// 5. Helper function for status mapping (should be in a separate file)
export const getStatusBadge = (status: string) => {
  switch(status.toLowerCase()) {
    case 'scheduled':
      return { variant: 'primary' as const, text: 'Scheduled' };
    case 'in-progress':
      return { variant: 'accent' as const, text: 'In Progress', glow: true };
    case 'completed':
      return { variant: 'success' as const, text: 'Completed' };
    default:
      return { variant: 'default' as const, text: status };
  }
};

export { Badge };