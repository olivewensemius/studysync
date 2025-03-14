// src/components/layout/MainLayout.tsx
"use client";

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  PieChart, 
  Presentation, 
  Search,
  Bell,
  Settings,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Navigation links
const navItems = [
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
    badge: '3'
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: PieChart 
  }
];

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Navigation Bar */}
      <header className="glass-nav sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Sparkles className="text-primary h-6 w-6" />
            <span className="text-xl font-bold font-display gradient-text">StudySync</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={cn(
                    "flex items-center opacity-80 hover:opacity-100 transition-opacity",
                    isActive ? "text-primary font-medium" : "text-foreground"
                  )}
                >
                  <Icon size={18} className="mr-1.5" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <Badge 
                      variant="primary" 
                      className="ml-1.5 bg-primary text-white px-1.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button className="p-2 rounded-full hover:bg-card-bg text-text-secondary">
              <Search size={20} />
            </button>
            
            {/* Notifications */}
            <button className="p-2 rounded-full hover:bg-card-bg text-text-secondary relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            
            {/* User Avatar */}
            <Avatar
              fallback="JS"
              className="border-2 border-primary/30"
            />
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-card-bg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 pt-16">
          <nav className="flex flex-col p-5 space-y-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center py-3 px-4 rounded-lg",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-card-bg"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="text-lg">{item.name}</span>
                  {item.badge && (
                    <Badge 
                      variant="primary" 
                      className="ml-auto bg-primary text-white"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
      
      {/* Main Content */}
      <main className="py-6 px-4 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;