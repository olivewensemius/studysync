'use client'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useState, useEffect } from 'react';
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
  Sparkles,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { logout } from '@/app/accounts/login/actions';
import { createClient } from '@/utils/supabase/client';


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
    badge: ''
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

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUserData(data);
  };

  useEffect(() => {
    fetchUser();
  }, [pathname]);



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
              </span>
            </button>
            
            {/* Profile Menu or Login/Signup */}
            {userData?.user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="focus:outline-none"
                >
                  <Avatar
                    fallback={userData.user.email?.charAt(0).toUpperCase() || "U"}
                    className="border-2 border-primary/30 cursor-pointer"
                  />
                </button>
               
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-card-bg border border-card-border rounded-md shadow-lg py-1 z-50">
                    <Link 
                      href="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-primary/10"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/accounts/login">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  Login / Signup
                </Button>
              </Link>
            )}
            
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
}
