"use client";

import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  BookOpen,
  Users,
  Star,
  ChevronRight,
  PlusCircle,
  Bell,
  Lightbulb
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import Link from 'next/link';
import StudyGroupsSection from "@/app/dashboard/StudyGroupsSection";
import FlashCardsSection from "@/app/dashboard/FlashCardsSection";
import StudySessionSection from "@/app/dashboard/StudySessionSection";
import DashboardHeader from "@/app/dashboard/DashboardHeaderSection";
import RecentActivitySection from "@/app/dashboard/RecentActivitySection";
import StatsCardsSection from "@/app/dashboard/StatsCardSection";

// Mock data
const studyGroups = [
  { id: 1, name: 'Computer Science Majors', members: 12, activity: 'high' },
  { id: 2, name: 'Pre-Med Study Group', members: 8, activity: 'medium' },
  { id: 3, name: 'Language Exchange', members: 15, activity: 'high' },
];

const recentActivity = [
  { type: 'session', action: 'completed', target: 'Physics Fundamentals', time: '2 hours ago' },
  { type: 'flashcard', action: 'created', target: 'Biology Terms', time: '5 hours ago' },
  { type: 'group', action: 'joined', target: 'Literature Club', time: '1 day ago' },
  { type: 'session', action: 'scheduled', target: 'History Review', time: '1 day ago' },
];

export default function DashboardPage() {
  // Get current date for greeting
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good evening";
  }

  const [user, setUser] = useState({
    name: "Alex Johnson",
    studyStreak: 14,
    totalHours: 128,
    weeklyGoal: 75
  });

  return (
    <div className="space-y-6">
      {/* Header with greeting and overview */}
      <DashboardHeader />

      {/* Stats Cards */}
      <StatsCardsSection />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <StudySessionSection />

        {/* Activity Feed */}
        <RecentActivitySection />
      </div>

      {/* Flashcards and Study Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Flashcards */}
        <FlashCardsSection />

        {/* Study Groups */}
        <StudyGroupsSection />
      </div>

      {/* Study Tip Banner */}
      <Card className="dark-card bg-gradient-to-r from-primary-900/50 to-card-bg border-primary-800/50">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-primary-500/30 mr-4">
            <Lightbulb className="text-primary-300" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-md font-bold text-text-primary">Study Tip of the Day</h3>
            <p className="text-text-secondary text-sm">
              The "Pomodoro Technique" suggests studying in 25-minute intervals with 5-minute breaks to maximize focus and retention.
            </p>
          </div>
          <Button variant="outline" className="ml-4 border-primary-700 text-text-primary whitespace-nowrap">
            More Tips
          </Button>
        </div>
      </Card>
    </div>
  );
}