// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Calendar, Bookmark, Users, AlertTriangle } from 'lucide-react';

// Mock data for dashboard
const studyStats = [
  { label: 'Study Hours', value: '24', change: '+12%', icon: Clock, color: 'text-primary-400' },
  { label: 'Completion Rate', value: '87%', change: '+5%', icon: CheckCircle2, color: 'text-accent-400' },
  { label: 'Sessions', value: '12', change: '+3', icon: Calendar, color: 'text-primary-400' },
  { label: 'Flashcards', value: '124', change: '+18', icon: Bookmark, color: 'text-accent-400' },
];

const upcomingSessions = [
  { id: 1, title: 'Calculus II Review', group: 'Math Study Group', date: 'Today, 3:00 PM', members: 4 },
  { id: 2, title: 'Computer Science Project', group: 'CS 301 Team', date: 'Tomorrow, 5:30 PM', members: 6 },
  { id: 3, title: 'Biology Exam Prep', group: 'Bio Study Circle', date: 'Wed, 2:00 PM', members: 3 },
];

const studyGroups = [
  { id: 1, name: 'Math Study Group', members: 8, lastActivity: '2 hours ago' },
  { id: 2, name: 'CS 301 Team', members: 5, lastActivity: 'Yesterday' },
  { id: 3, name: 'Bio Study Circle', members: 12, lastActivity: '3 days ago' },
];

const recentActivity = [
  { id: 1, type: 'session', content: 'Attended "Linear Algebra Review" session', time: '2 hours ago' },
  { id: 2, type: 'achievement', content: 'Earned "Study Streak" badge', time: 'Yesterday' },
  { id: 3, type: 'flashcard', content: 'Created 20 new flashcards for Biology', time: '2 days ago' },
];

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

  const prompt = "Generate a personalized study insight for the user based on their recent activity and progress.";
  const result = await model.generateContent(prompt);
  const studyInsight = result.response.text();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Welcome back, {data.user.email}</h1>

      {/* Display the personalized study insight */}
      <Card className="dark-card bg-primary-900/30 border-primary-800/50">
        <div className="flex items-start space-x-3">
          <div className="bg-primary-500/20 p-2 rounded-full">
            <AlertTriangle className="h-5 w-5 text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-primary-300 mb-1">Your Personalized Study Insight</h3>
            <p className="text-text-primary">{studyInsight}</p>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {studyStats.map((stat, index) => (
          <Card key={index} className="dark-card">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${index % 2 === 0 ? 'bg-primary-500/20' : 'bg-accent-500/20'} mr-4`}>
                <stat.icon className={stat.color} size={20} />
              </div>
              <div>
                <p className="text-text-secondary text-sm">{stat.label}</p>
                <div className="flex items-center">
                  <p className="text-text-primary text-2xl font-bold mr-2">{stat.value}</p>
                  <Badge 
                    variant={stat.change.startsWith('+') ? 'success' : 'destructive'} 
                    className="text-xs px-1"
                  >
                    {stat.change}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Upcoming Sessions */}
      <Card className="dark-card">
        <h2 className="text-xl font-bold text-text-primary mb-4">Upcoming Study Sessions</h2>
        <div className="space-y-4">
          {upcomingSessions.map((session) => (
            <div key={session.id} className="flex justify-between items-center">
              <div>
                <p className="text-text-primary font-medium">{session.title}</p>
                <p className="text-text-secondary text-sm">{session.group}</p>
              </div>
              <div className="text-right">
                <p className="text-text-secondary text-sm">{session.date}</p>
                <div className="flex items-center mt-1">
                  <Users className="text-text-secondary mr-1 h-4 w-4" />
                  <span className="text-text-secondary text-sm">{session.members} members</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Study Groups */}
      <Card className="dark-card">
        <h2 className="text-xl font-bold text-text-primary mb-4">Your Study Groups</h2>
        <div className="space-y-4">
          {studyGroups.map((group) => (
            <div key={group.id} className="flex justify-between items-center">
              <div>
                <p className="text-text-primary font-medium">{group.name}</p>
                <div className="flex items-center mt-1">
                  <Users className="text-text-secondary mr-1 h-4 w-4" />
                  <span className="text-text-secondary text-sm">{group.members} members</span>
                </div>
              </div>
              <p className="text-text-secondary text-sm">{group.lastActivity}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="dark-card">
        <h2 className="text-xl font-bold text-text-primary mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center">
              <div className="flex-shrink-0">
                {activity.type === 'session' && <Calendar className="text-primary-400 h-5 w-5" />}
                {activity.type === 'achievement' && <CheckCircle2 className="text-accent-400 h-5 w-5" />}
                {activity.type === 'flashcard' && <Bookmark className="text-secondary-400 h-5 w-5" />}
              </div>
              <div className="ml-4">
                <p className="text-text-primary">{activity.content}</p>
                <p className="text-text-secondary text-sm">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}