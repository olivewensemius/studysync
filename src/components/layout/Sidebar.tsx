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
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
      className={`
        bg-white border-r border-secondary-100 
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        flex flex-col
      `}
    >
      {/* Logo and Collapse Button */}
      <div className="flex items-center justify-between p-4 border-b border-secondary-100">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Presentation className="text-primary-500" size={24} />
            <span className="text-lg font-bold text-secondary-800">StudySync</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4">
        {sidebarNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`
                flex items-center p-3 mx-2 rounded-md 
                transition-colors duration-200
                ${isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-secondary-600 hover:bg-secondary-100'}
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <Icon size={20} className="mr-3" />
              {!isCollapsed && (
                <span className="flex-1 text-sm font-medium">
                  {item.name}
                </span>
              )}
              {!isCollapsed && item.badge && (
                <Badge variant="primary" size="sm">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;