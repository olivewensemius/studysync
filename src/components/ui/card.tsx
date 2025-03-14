import React from 'react';
import { cn } from '@/lib/utils';

// Define props for the Card component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, header, footer, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Base card styling
        'bg-white border border-secondary-100 rounded-lg shadow-soft',
        // Allow additional custom classes
        className
      )}
      {...props}
    >
      {/* Optional header */}
      {header && (
        <div className="px-6 py-4 border-b border-secondary-100 bg-secondary-50 rounded-t-lg">
          {header}
        </div>
      )}
      
      {/* Card content */}
      <div className="p-6">{children}</div>
      
      {/* Optional footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-secondary-100 bg-secondary-50 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  )
);

Card.displayName = 'Card';

export { Card };