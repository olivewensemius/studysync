"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Bell, 
  Settings, 
  HelpCircle,
  Calendar,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-soft border-b border-primary-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      {/* Search Bar */}
      <div className="flex-1 max-w-md mr-4">
        <Input 
          placeholder="Search StudySync" 
          leftIcon={<Search className="text-primary-400" />}
          className="bg-primary-50 border-primary-100 focus:bg-white transition-colors"
        />
      </div>
      
      {/* Quick Actions */}
      <div className="hidden md:flex items-center space-x-2 mr-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-primary-600 border-primary-200 hover:bg-primary-50"
        >
          <Calendar size={16} className="mr-1" />
          Schedule
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-primary-600 border-primary-200 hover:bg-primary-50"
        >
          <BookOpen size={16} className="mr-1" />
          New Session
        </Button>
      </div>
      
      {/* Header Actions */}
      <div className="flex items-center space-x-1 md:space-x-2">
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-neutral-600 hover:bg-primary-50 hover:text-primary-600 relative"
        >
          <Bell size={20} />
          <Badge 
            variant="primary" 
            size="sm" 
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0"
          >
          </Badge>
        </Button>
        
        {/* Help */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-neutral-600 hover:bg-primary-50 hover:text-primary-600"
        >
          <HelpCircle size={20} />
        </Button>
        
        {/* Settings */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-neutral-600 hover:bg-primary-50 hover:text-primary-600"
        >
          <Settings size={20} />
        </Button>
        
        {/* User Avatar with Online Status */}
        <div className="relative">
          <Avatar 
            fallback="OW" 
            size="md"
            className="border-2 border-white shadow-sm"
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;