"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { 
  Search, 
  Bell, 
  Settings, 
  HelpCircle 
} from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-soft border-b border-secondary-100 px-4 py-3 flex items-center justify-between">
      {/* Search Bar */}
      <div className="flex-1 max-w-md mr-4">
        <Input 
          placeholder="Search StudySync" 
          leftIcon={<Search className="text-secondary-500" />}
        />
      </div>
      
      {/* Header Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="text-secondary-600 hover:bg-secondary-100">
          <Bell size={20} />
        </Button>
        
        {/* Help */}
        <Button variant="ghost" size="icon" className="text-secondary-600 hover:bg-secondary-100">
          <HelpCircle size={20} />
        </Button>
        
        {/* Settings */}
        <Button variant="ghost" size="icon" className="text-secondary-600 hover:bg-secondary-100">
          <Settings size={20} />
        </Button>
        
        {/* User Avatar */}
        <Avatar 
          fallback="OW" 
          size="md"
        />
      </div>
    </header>
  );
};

export default Header;