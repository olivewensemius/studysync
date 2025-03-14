// src/components/ui/card.tsx
import React from 'react';
import { cn } from '@/lib/utils';

// Define props for the Card component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
  accent?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, header, footer, hover = false, glow = false, accent = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Base card styling
        'bg-card-bg border border-card-border rounded-lg overflow-hidden',
        // Optional hover effect
        hover && 'transition-all duration-200 hover:translate-y-[-2px]',
        // Optional glow effect
        glow && !accent && 'shadow-glow',
        glow && accent && 'shadow-accent-glow',
        // Allow additional custom classes
        className
      )}
      {...props}
    >
      {/* Optional header */}
      {header && (
        <div className="px-6 py-4 border-b border-card-border bg-background/50">
          {header}
        </div>
      )}
      
      {/* Card content */}
      <div className="p-6">{children}</div>
      
      {/* Optional footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-card-border bg-background/50">
          {footer}
        </div>
      )}
    </div>
  )
);

Card.displayName = 'Card';

export { Card };