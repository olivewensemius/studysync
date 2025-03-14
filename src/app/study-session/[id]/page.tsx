// src/app/study-sessions/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users,
  MapPin,
  MessageSquare,
  Bookmark,
  Trash2,
  Edit,
  Share2,
  ChevronLeft,
  CheckCircle,
  Zap,
  PlusCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function StudySessionDetailPage({ params }: { params: { id: string } }) {
  const sessionId = params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  // Mock session data - would be fetched from API in a real application
  const session = {
    id: parseInt(sessionId),
    title: 'Advanced Calculus Review',
    subject: 'Mathematics',
    date: '2025-03-17T15:30:00.000Z',
    duration: 90,
    status: 'scheduled',
    location: 'Online via Zoom',
    participants: [
      { id: 1, name: 'Alex Johnson', status: 'confirmed', avatar: null },
      { id: 2, name: 'Maria Garcia', status: 'confirmed', avatar: null },
      { id: 3, name: 'David Chen', status: 'confirmed', avatar: null },
      { id: 4, name: 'Sarah Williams', status: 'pending', avatar: null },
    ],
    organizer: { id: 1, name: 'Alex Johnson', avatar: null },
    description: 'Review of integration techniques and applications for the upcoming final exam. We will cover various methods including substitution, integration by parts, and partial fractions. Please bring your textbook and calculator.',
    topics: [
      { id: 1, title: 'Integration by Parts', duration: 30, completed: false },
      { id: 2, title: 'Partial Fractions', duration: 25, completed: false },
      { id: 3, title: 'Trigonometric Integrals', duration: 35, completed: false },
    ],
    resources: [
      { id: 1, title: 'Integration Techniques Cheat Sheet', type: 'pdf' },
      { id: 2, title: 'Calculus Textbook Chapter 7', type: 'reference' },
      { id: 3, title: 'Previous Year Exam Questions', type: 'pdf' },
    ]
  };

  // Mocked comments
  const mockComments = [
    { id: 1, user: { id: 2, name: 'Maria Garcia', avatar: null }, text: 'Looking forward to this session! Could we also cover integration using trigonometric substitutions?', timestamp: '2025-03-15T10:23:00Z' },
    { id: 2, user: { id: 1, name: 'Alex Johnson', avatar: null }, text: 'Definitely, Maria! I\'ve added it to the topics list.', timestamp: '2025-03-15T11:05:00Z' },
  ];

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setComments(mockComments);
      setLoading(false);
    }, 500);
  }, []);

  // Format time string
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to get status badge styling
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled':
        return { variant: 'primary' as const, text: 'Scheduled' };
      case 'in-progress':
        return { variant: 'accent' as const, text: 'In Progress', glow: true };
      case 'completed':
        return { variant: 'secondary' as const, text: 'Completed' };
      default:
        return { variant: 'default' as const, text: status };
    }
  };

  // Add a new comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const newCommentObj = {
      id: comments.length + 1,
      user: { id: 1, name: 'Alex Johnson', avatar: null },
      text: newComment,
      timestamp: new Date().toISOString()
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(session.status);
  const sessionDate = new Date(session.date);
  const isToday = new Date().toDateString() === sessionDate.toDateString();
  const isPast = sessionDate < new Date();

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4"
        leftIcon={<ChevronLeft className="h-4 w-4" />}
        onClick={() => router.push('/study-sessions')}
      >
        Back to Sessions
      </Button>

      {/* Session Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center flex-wrap gap-2">
            <h1 className="text-2xl font-bold text-text-primary">{session.title}</h1>
            <Badge variant={statusBadge.variant} glow={statusBadge.variant === 'accent'}>
              {statusBadge.text}
            </Badge>
          </div>
          <p className="text-text-secondary mt-1">{session.subject}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" leftIcon={<Share2 className="h-4 w-4" />}>
            Share
          </Button>
          <Button variant="ghost" leftIcon={<Bookmark className="h-4 w-4" />}>
            Save
          </Button>
          {session.status === 'scheduled' && (
            <>
              <Button variant="ghost" leftIcon={<Edit className="h-4 w-4" />}>
                Edit
              </Button>
              <Button variant="destructive" leftIcon={<Trash2 className="h-4 w-4" />}>
                Cancel
              </Button>
            </>
          )}
          {session.status === 'in-progress' && (
            <Button 
              variant="accent" 
              leftIcon={<Zap className="h-4 w-4" />}
              onClick={() => router.push('/study-session')}
            >
              Join Session
            </Button>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Details Card */}
          <Card className="dark-card">
            <h2 className="text-lg font-bold text-text-primary mb-4">Session Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-primary-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-text-secondary text-sm">Date</p>
                  <p className="text-text-primary">
                    {isToday ? 'Today' : formatDate(sessionDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-primary-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-text-secondary text-sm">Time</p>
                  <p className="text-text-primary">
                    {formatTime(session.date)} • {session.duration} minutes
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-text-secondary text-sm">Location</p>
                  <p className="text-text-primary">{session.location}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="h-5 w-5 text-primary-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-text-secondary text-sm">Participants</p>
                  <p className="text-text-primary">{session.participants.length} people</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-card-border pt-4">
              <h3 className="font-medium text-text-primary mb-2">Description</h3>
              <p className="text-text-secondary">{session.description}</p>
            </div>
          </Card>

          {/* Topics Card */}
          <Card className="dark-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-text-primary">Session Topics</h2>
              {session.status === 'scheduled' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  leftIcon={<PlusCircle className="h-4 w-4" />}
                >
                  Add Topic
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              {session.topics.map((topic, index) => (
                <div 
                  key={topic.id} 
                  className="p-3 rounded-lg bg-card-border/10 border border-card-border/30 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-primary-500/20 flex items-center justify-center mr-3">
                      <span className="text-primary-400 text-xs font-medium">{index + 1}</span>
                    </div>
                    <span className="text-text-primary">{topic.title}</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="text-text-secondary border-card-border mr-2">
                      <Clock className="h-3 w-3 mr-1" /> {topic.duration} min
                    </Badge>
                    {topic.completed ? (
                      <CheckCircle className="h-5 w-5 text-accent-500" />
                    ) : (
                      session.status === 'scheduled' && (
                        <button className="text-text-muted hover:text-text-secondary p-1">
                          <Edit className="h-4 w-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-text-secondary text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Total duration: {session.topics.reduce((acc, topic) => acc + topic.duration, 0)} minutes</span>
            </div>
          </Card>
          
          {/* Resources Card */}
          <Card className="dark-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-text-primary">Study Resources</h2>
              {session.status === 'scheduled' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  leftIcon={<PlusCircle className="h-4 w-4" />}
                >
                  Add Resource
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              {session.resources.map((resource) => (
                <div 
                  key={resource.id} 
                  className="p-3 rounded-lg bg-card-border/10 border border-card-border/30 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-md bg-primary-500/20 flex items-center justify-center mr-3">
                      <BookOpen className="h-4 w-4 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-text-primary">{resource.title}</p>
                      <p className="text-text-secondary text-xs uppercase">{resource.type}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Comments Section */}
          <Card className="dark-card">
            <h2 className="text-lg font-bold text-text-primary mb-4">Comments</h2>
            
            <div className="space-y-4 mb-4">
              {comments.length === 0 ? (
                <p className="text-text-secondary text-center py-4">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className="p-3 rounded-lg bg-card-border/10 border border-card-border/30"
                  >
                    <div className="flex items-center mb-2">
                      <Avatar 
                        fallback={comment.user.name.split(' ').map((n: string) => n[0]).join('')}
                        size="sm"
                        className="mr-2"
                      />
                      <div>
                        <p className="text-text-primary text-sm font-medium">{comment.user.name}</p>
                        <p className="text-text-secondary text-xs">
                          {new Date(comment.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-text-primary text-sm">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
            
            {/* Add Comment */}
            <div className="flex space-x-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-card-border/10 border-card-border/30 flex-grow"
              />
              <Button 
                variant="primary" 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Post
              </Button>
            </div>
          </Card>
        </div>
        
        {/* Right Column - Participants & Actions */}
        <div className="space-y-6">
          {/* Join Card */}
          <Card className="dark-card">
            {session.status === 'scheduled' ? (
              <>
                <h2 className="text-lg font-bold text-text-primary mb-4">Join this session</h2>
                <p className="text-text-secondary mb-4">
                  This session is scheduled for {isToday ? 'today' : formatDate(sessionDate)} at {formatTime(session.date)}.
                </p>
                <Button 
                  variant="default" 
                  className="w-full"
                  leftIcon={<Users className="h-4 w-4" />}
                >
                  RSVP for this Session
                </Button>
              </>
            ) : session.status === 'in-progress' ? (
              <>
                <h2 className="text-lg font-bold text-text-primary mb-4">Ongoing Session</h2>
                <p className="text-text-secondary mb-4">
                  This session is currently active. Join now to participate.
                </p>
                <Button 
                  variant="accent" 
                  className="w-full"
                  leftIcon={<Zap className="h-4 w-4" />}
                  onClick={() => router.push('/study-session')}
                >
                  Join Live Session
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-text-primary mb-4">Session Complete</h2>
                <p className="text-text-secondary mb-4">
                  This study session has ended. You can view the notes and resources.
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  leftIcon={<BookOpen className="h-4 w-4" />}
                >
                  View Session Notes
                </Button>
              </>
            )}
          </Card>
          
          {/* Participants Card */}
          <Card className="dark-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-text-primary">Participants</h2>
              <Badge variant="outline">
                {session.participants.filter(p => p.status === 'confirmed').length}/{session.participants.length}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {session.participants.map((participant) => (
                <div 
                  key={participant.id} 
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Avatar 
                      fallback={participant.name.split(' ').map(n => n[0]).join('')}
                      size="sm"
                      className="mr-3"
                    />
                    <div>
                      <p className="text-text-primary text-sm">
                        {participant.name}
                        {participant.id === session.organizer.id && (
                          <span className="ml-2 text-xs text-primary-400">(Organizer)</span>
                        )}
                      </p>
                      <p className="text-text-muted text-xs capitalize">{participant.status}</p>
                    </div>
                  </div>
                  
                  {session.status === 'scheduled' && participant.status === 'pending' && (
                    <Badge variant="outline" className="text-text-secondary">
                      Awaiting
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            
            {session.status === 'scheduled' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-4"
                leftIcon={<PlusCircle className="h-4 w-4" />}
              >
                Invite More
              </Button>
            )}
          </Card>
          
          {/* Organizer Card */}
          <Card className="dark-card">
            <h2 className="text-lg font-bold text-text-primary mb-4">Organized by</h2>
            
            <div className="flex items-center">
              <Avatar 
                fallback={session.organizer.name.split(' ').map(n => n[0]).join('')}
                size="md"
                className="mr-4"
              />
              <div>
                <p className="text-text-primary font-medium">{session.organizer.name}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1 h-8 px-2 py-1 text-primary-400"
                  leftIcon={<MessageSquare className="h-3.5 w-3.5" />}
                >
                  Message
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}