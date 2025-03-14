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
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  fallback,
  size = 'md',
  shape = 'circle',
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

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        'bg-secondary-200 text-secondary-800',
        'overflow-hidden',
        sizeClasses[size],
        shapeClasses[shape],
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
  );
};

export { Avatar };