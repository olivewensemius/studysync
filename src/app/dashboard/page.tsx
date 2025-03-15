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

// Mock data
const upcomingSessions = [
  { id: 1, title: 'Advanced Mathematics', date: '2025-03-17T14:00:00', duration: 90, participants: 5, subject: 'Mathematics' },
  { id: 2, title: 'Algorithm Design', date: '2025-03-18T10:30:00', duration: 60, participants: 3, subject: 'Computer Science' },
  { id: 3, title: 'Organic Chemistry Review', date: '2025-03-20T16:00:00', duration: 120, participants: 4, subject: 'Chemistry' },
];

const activeFlashcards = [
  { id: 1, title: 'Calculus Formulas', totalCards: 48, progress: 68, lastStudied: '2 days ago' },
  { id: 2, title: 'Python Programming', totalCards: 35, progress: 42, lastStudied: '5 days ago' },
  { id: 3, title: 'Spanish Vocabulary', totalCards: 120, progress: 23, lastStudied: '1 day ago' },
];

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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{greeting}, {user.name}</h1>
          <p className="text-text-secondary mt-1">Here's your study overview for today</p>
        </div>
        <Button
          variant="outline"
          leftIcon={<Calendar className="h-4 w-4" />}
        >
          March 16, 2025
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="dark-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-500/20 mr-4">
              <Star className="text-primary-400" size={20} />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Study Streak</p>
              <p className="text-text-primary text-xl font-bold">{user.studyStreak} days</p>
            </div>
          </div>
        </Card>

        <Card className="dark-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-500/20 mr-4">
              <Clock className="text-primary-400" size={20} />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Total Study Time</p>
              <p className="text-text-primary text-xl font-bold">{user.totalHours} hours</p>
            </div>
          </div>
        </Card>

        <Card className="dark-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-500/20 mr-4">
              <BarChart3 className="text-primary-400" size={20} />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Weekly Goal</p>
              <div className="flex items-center">
                <p className="text-text-primary text-xl font-bold mr-2">75%</p>
                <div className="w-20 h-2 bg-card-border/50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${user.weeklyGoal}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="dark-card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-500/20 mr-4">
              <Users className="text-primary-400" size={20} />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Study Groups</p>
              <p className="text-text-primary text-xl font-bold">{studyGroups.length} active</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <Card className="dark-card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-text-primary">Upcoming Sessions</h2>
            <Link href="/study-session">
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingSessions.map((session) => {
              const sessionDate = new Date(session.date);
              const formattedDate = sessionDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              });
              const formattedTime = sessionDate.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true
              });

              return (
                <div 
                  key={session.id} 
                  className="p-3 rounded-lg border border-card-border/30 hover:border-primary-500/30 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-text-primary">{session.title}</h3>
                      <div className="flex items-center mt-1 text-text-secondary text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        <span>{formattedDate} at {formattedTime}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                        <span>{session.duration} mins</span>
                      </div>
                    </div>
                    <Badge variant="primary" size="sm">
                      {session.subject}
                    </Badge>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex -space-x-2">
                      {Array.from({ length: Math.min(3, session.participants) }).map((_, i) => (
                        <Avatar 
                          key={i}
                          fallback={`P${i+1}`}
                          size="xs"
                          className="border border-card-bg"
                        />
                      ))}
                    </div>
                    {session.participants > 3 && (
                      <span className="text-xs text-text-secondary ml-1">+{session.participants - 3} more</span>
                    )}
                    <Link href={`/study-session/${session.id}`} className="ml-auto">
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}

            <Link href="/study-session/create">
              <Button variant="ghost" className="w-full border border-dashed border-card-border mt-3 py-2" leftIcon={<PlusCircle className="h-4 w-4" />}>
                Schedule New Session
              </Button>
            </Link>
          </div>
        </Card>

        {/* Activity Feed */}
        <Card className="dark-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-text-primary">Recent Activity</h2>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              let Icon = BookOpen;
              let iconColor = "text-primary-400";
              let bgColor = "bg-primary-500/20";
              
              if (activity.type === 'flashcard') {
                Icon = Star;
                iconColor = "text-yellow-400";
                bgColor = "bg-yellow-500/20";
              } else if (activity.type === 'group') {
                Icon = Users;
                iconColor = "text-accent-400";
                bgColor = "bg-accent-500/20";
              }

              return (
                <div key={index} className="flex items-start">
                  <div className={`p-2 rounded-full ${bgColor} mr-3`}>
                    <Icon className={iconColor} size={16} />
                  </div>
                  <div>
                    <p className="text-text-primary text-sm">
                      You {activity.action} <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-text-secondary text-xs">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-card-border">
            <Link href="/analytics">
              <Button variant="ghost" size="sm" className="w-full justify-between">
                View all activity
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
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