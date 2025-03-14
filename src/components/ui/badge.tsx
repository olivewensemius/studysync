import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  className, 
  variant = 'default', 
  size = 'md',
  glow = false,
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    destructive: 'bg-red-100 text-red-800',
    outline: 'bg-transparent border border-primary-300 text-primary-800'
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
        variantClasses[variant],
        sizeClasses[size],
        glow && variant === 'primary' && 'shadow-glow',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };