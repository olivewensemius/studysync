"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  PieChart, 
  Presentation, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const sidebarNavItems = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard 
  },
  { 
    name: 'Study Groups', 
    href: '/study-groups', 
    icon: Users 
  },
  { 
    name: 'Study Sessions', 
    href: '/study-session', 
    icon: BookOpen 
  },
  { 
    name: 'Flashcards', 
    href: '/flashcards', 
    icon: Presentation,
    badge: '3 New'
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: PieChart 
  }
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        'bg-white border-r border-primary-100',
        'transition-all duration-300 ease-in-out',
        'flex flex-col h-full',
        isCollapsed ? 'w-20' : 'w-64',
        'shadow-md'
      )}
    >
      {/* Logo and Collapse Button */}
      <div className="bg-blue-gradient border-b border-primary-200 p-4 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Sparkles className="text-white" size={24} />
            <span className="text-lg font-bold text-white font-display">StudySync</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-primary-600/20"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-2">
        {sidebarNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                'flex items-center p-3 rounded-lg mb-1',
                'transition-all duration-200 group',
                isActive 
                  ? 'bg-primary-500 text-white shadow-blue' 
                  : 'text-neutral-600 hover:bg-primary-50 hover:text-primary-600',
                isCollapsed ? 'justify-center' : ''
              )}
            >
              <Icon 
                size={20} 
                className={cn(
                  'transition-transform',
                  !isCollapsed && 'mr-3',
                  isActive ? 'text-white' : 'text-neutral-500 group-hover:text-primary-500',
                  'group-hover:scale-110'
                )} 
              />
              {!isCollapsed && (
                <span className={cn(
                  "flex-1 text-sm font-medium",
                  isActive ? 'text-white' : 'text-neutral-700'
                )}>
                  {item.name}
                </span>
              )}
              {!isCollapsed && item.badge && (
                <Badge 
                  variant={isActive ? "secondary" : "primary"} 
                  size="sm"
                  className={isActive ? "bg-white text-primary-600" : ""}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-primary-100 mt-auto">
          <div className="bg-primary-50 rounded-lg p-3 text-xs text-primary-700">
            <p className="font-medium mb-1">Pro Tip</p>
            <p>Create study flashcards to boost retention by 70%!</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;