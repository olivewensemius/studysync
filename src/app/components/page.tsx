// src/app/components/page.tsx
"use client";

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Mail, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';

export default function ComponentsPage() {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">UI Components</h1>
      
      {/* Button section */}
      <div className="space-x-4">
        <Button>Default Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="ghost">Ghost Button</Button>
        <Button variant="destructive">Destructive Button</Button>
      </div>
      
      {/* Card Component Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Card Variants</h2>
        
        {/* Basic Card */}
        <Card>
          <p>This is a basic card with default styling.</p>
        </Card>
        
        {/* Card with Header */}
        <Card 
          header={<h3 className="text-lg font-bold">Card Title</h3>}
        >
          <p>This card has a header section.</p>
        </Card>
        
        {/* Card with Header and Footer */}
        <Card 
          header={<h3 className="text-lg font-bold">Card with Footer</h3>}
          footer={<Button size="sm">Action</Button>}
        >
          <p>This card has both a header and a footer.</p>
        </Card>
      </div>

      {/* Input Component Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Input Variants</h2>
        
        {/* Default Input */}
        <Input 
          placeholder="Enter your email" 
          leftIcon={<Mail className="text-secondary-500" />}
        />
        
        {/* Input with Error State */}
        <Input 
          variant="error"
          placeholder="Password" 
          type="password"
          leftIcon={<Lock className="text-red-500" />}
          error="Invalid password"
        />
        
        {/* Disabled Input */}
        <Input 
          placeholder="Disabled input" 
          disabled
        />
      </div>

      {/* Avatar Component Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Avatar Variants</h2>
        
        <div className="flex items-center space-x-4">
          {/* Image Avatar */}
          <Avatar 
            src="/path/to/image.jpg" 
            alt="User avatar" 
            fallback="John Doe"
          />
          
          {/* Fallback with Initials */}
          <Avatar 
            fallback="John Doe" 
            size="lg"
          />
          
          {/* Different Shapes and Sizes */}
          <Avatar 
            fallback="Jane Smith" 
            size="xl" 
            shape="rounded"
          />
          
          {/* Tiny Avatar */}
          <Avatar 
            fallback="A B" 
            size="xs"
          />
        </div>
      </div>

      {/* Badge Component Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Badge Variants</h2>
        
        <div className="flex items-center space-x-2">
          {/* Default Badge */}
          <Badge>Default</Badge>
          
          {/* Primary Badge */}
          <Badge variant="primary">Primary</Badge>
          
          {/* Secondary Badge */}
          <Badge variant="secondary">Secondary</Badge>
          
          {/* Success Badge */}
          <Badge variant="success">Success</Badge>
          
          {/* Warning Badge */}
          <Badge variant="warning">Warning</Badge>
          
          {/* Destructive Badge */}
          <Badge variant="destructive">Destructive</Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Different Sizes */}
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </div>
      </div>

      {/* Spinner Component Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Spinner Variants</h2>

        <div className="flex items-center space-x-4">
          {/* Default Spinner */}
          <Spinner />
          
          {/* Primary Spinner */}
          <Spinner variant="primary" />
          
          {/* Secondary Spinner */}
          <Spinner variant="secondary" />
          
          {/* Destructive Spinner */}
          <Spinner variant="destructive" />
        </div>

        <div className="flex items-center space-x-4">
          {/* Different Sizes */}
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="xl" />
        </div>
      </div>
    </div>
  );
}