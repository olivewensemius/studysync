"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'rounded';
  status?: 'online' | 'offline' | 'away' | 'busy' | 'none';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  fallback,
  size = 'md',
  shape = 'circle',
  status = 'none',
  className
}) => {
  const [imageError, setImageError] = useState(!src);

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const shapeClasses = {
    circle: 'rounded-full',
    rounded: 'rounded-md'
  };
  
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-neutral-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    none: 'hidden'
  };

  // Generate initials if fallback is not provided
  const getInitials = (name?: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Determine status indicator size based on avatar size
  const statusSize = size === 'xs' ? 'w-1.5 h-1.5' : 
                     size === 'sm' ? 'w-2 h-2' : 
                     size === 'lg' ? 'w-3.5 h-3.5' : 
                     size === 'xl' ? 'w-4 h-4' : 'w-3 h-3';

  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'inline-flex items-center justify-center',
          'overflow-hidden',
          'bg-gradient-to-br from-primary-400 to-primary-600 text-white',
          sizeClasses[size],
          shapeClasses[shape],
          'transition-transform hover:scale-105',
          className
        )}
      >
        {src && !imageError ? (
          <Image
            src={src}
            alt={alt}
            width={48}
            height={48}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="font-medium">
            {fallback ? getInitials(fallback) : '?'}
          </span>
        )}
      </div>
      
      {status !== 'none' && (
        <div 
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            statusColors[status],
            statusSize
          )} 
        />
      )}
    </div>
  );
};

export { Avatar };