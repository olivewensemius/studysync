// src/app/study-sessions/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

import { fetchStudySessions } from './actions'
import { 
  Clock, 
  PlusCircle, 
  Calendar, 
  BookOpen, 
  MoreVertical,
  ChevronRight,
  Filter,
  Users,
  Zap
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function StudySessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all'); // 'all', 'scheduled', 'in-progress', 'completed'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      try {
        const data = await fetchStudySessions();
        const sortedData = [...data].sort((a, b) => {
          if (a.status === 'in-progress') return -1;
          if (b.status === 'in-progress') return 1;
          return 0;
        });
        setSessions(sortedData);
   
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      } 
    };

    loadSessions();
  }, []);

  // Filter sessions based on selected filter
  const filteredSessions = filter === 'all' 
    ? sessions 
    : sessions.filter(session => session.status === filter);

  // Function to get status badge styling
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled':
        return { variant: 'warning' as const, text: 'Scheduled' };
      case 'in-progress':
        return { variant: 'success' as const, text: 'In Progress', glow: true };
      case 'completed':
        return { variant: 'info' as const, text: 'Completed' };
      default:  
        return { variant: 'default' as const, text: status };
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Study Sessions</h1>
          <p className="text-text-secondary mt-1">Schedule and manage your learning sessions</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="ghost"
            leftIcon={<Filter className="h-4 w-4" />}
          >
            Filter
          </Button>
          <Link href="/study-session/create">
            <Button 
              variant="default"
              leftIcon={<PlusCircle className="h-4 w-4" />}
            >
              New Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-card-border">
        <button 
          className={`px-4 py-2 font-medium text-sm ${filter === 'all' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-text-secondary hover:text-text-primary'}`}
          onClick={() => setFilter('all')}
        >
          All Sessions
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${filter === 'scheduled' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-text-secondary hover:text-text-primary'}`}
          onClick={() => setFilter('scheduled')}
        >
          Scheduled
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${filter === 'in-progress' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-text-secondary hover:text-text-primary'}`}
          onClick={() => setFilter('in-progress')}
        >
          In Progress
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${filter === 'completed' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-text-secondary hover:text-text-primary'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-10">
          <BookOpen className="mx-auto h-12 w-12 text-text-secondary opacity-50 mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-1">No sessions found</h3>
          <p className="text-text-secondary">
            {filter === 'all' 
              ? "You don't have any study sessions yet" 
              : `You don't have any ${filter} sessions`}
          </p>
          <Link href="/study-session/create">
            <Button 
              variant="outline" 
              className="mt-4"
              leftIcon={<PlusCircle className="h-4 w-4" />}
            >
              Create Your First Session
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const statusBadge = getStatusBadge(session.status);
            const sessionDate = new Date(session.date);
            const isToday = new Date().toDateString() === sessionDate.toDateString();
            
            return (
              <Card 
                key={session.id}
                className="dark-card hover:border-primary-500/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center">
                  {/* Date/Time Column */}
                  <div className="md:w-48 flex-shrink-0 flex flex-row md:flex-col items-center md:items-start md:border-r md:border-card-border md:pr-4 mb-4 md:mb-0">
                    <div className="flex items-center text-text-secondary md:mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {isToday ? 'Today' : formatDate(sessionDate)}
                      </span>
                    </div>
                    <div className="flex items-center text-text-secondary ml-4 md:ml-0">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {session.duration} min
                      </span>
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <div className="flex-grow md:pl-4">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-text-primary">{session.title}</h3>
                        <p className="text-text-secondary text-sm">{session.subject}</p>
                      </div>
                      <Badge 
                        variant={statusBadge.variant === 'info' ? 'default' : statusBadge.variant}
                        glow={statusBadge.glow}
                      >
                        {statusBadge.text}
                      </Badge>
                    </div>
                    
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                      {session.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center justify-between mt-auto">
                    <div className="flex items-center">
                        {/* <div className="flex -space-x-2 mr-2">
                          {(session.participants || []).slice(0, 3).map((participant, i) => (
                            <Avatar 
                              key={participant.id}
                              fallback={participant.name?.split(' ').map(n => n[0]).join('') || '?'}
                              size="sm"
                              className="border-2 border-card-bg"
                            />
                          ))}
                          {(session.participants || []).length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-primary-500/20 border-2 border-card-bg flex items-center justify-center text-xs text-primary-400">
                              +{session.participants.length - 3}
                            </div>
                          )}
                        </div> */}
                        <span className="text-text-secondary text-xs">
                          {/* {(session.participants || []).length} participant{(session.participants || []).length !== 1 ? 's' : ''} */}
                        </span>
                      </div> 
                      
                      <div className="flex items-center mt-2 sm:mt-0">
                        {session.status === 'in-progress' && (
                          <Link href="/study-session">
                            <Button 
                              variant="accent" 
                              size="sm"
                              leftIcon={<Zap className="h-3.5 w-3.5" />}
                              className="mr-2 cursor-pointer bg-purple-600 hover:bg-purple-700"
                            >
                              Join Now
                            </Button>
                          </Link>
                        )}
                        
                        <Link href={`/study-session/${session.id}`}>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            rightIcon={<ChevronRight className="h-4 w-4" />}
                          >
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}