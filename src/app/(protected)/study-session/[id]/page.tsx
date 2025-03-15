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
import { useRouter, useParams } from 'next/navigation';
import { fetchSingleStudySession } from '../actions';
import { fetchSessionTopics } from '../actions';
import { fetchSessionResources } from '../actions';
import { deleteStudySession } from '../actions';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';

export default function StudySessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as string;
  console.log("Using session ID from URL params:", sessionId, params);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Awaited<ReturnType<typeof fetchSingleStudySession>> | null>(null);
  const [topics, setTopics] = useState<Awaited<ReturnType<typeof fetchSessionTopics>> | null>(null);
  const [resources, setResources] = useState<Awaited<ReturnType<typeof fetchSessionResources>> | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const [sessionData, topicsData, resourcesData] = await Promise.all([
          fetchSingleStudySession(sessionId),
          fetchSessionTopics(sessionId),
          fetchSessionResources(sessionId)
        ]);
        setSession(sessionData);
        setTopics(topicsData);
        setResources(resourcesData);
      } catch (error) {
        console.error('Error loading session:', error);
        // You might want to show an error message to the user
      } finally {
        setLoading(false);
      }
    };

    loadSessionData();
  }, [sessionId]);

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
        return { variant: 'success' as const, text: 'In Progress', glow: true };
      case 'completed':
        return { variant: 'secondary' as const, text: 'Completed' };
      default:
        return { variant: 'default' as const, text: status };
    }
  };

  const handleDeleteSession = async () => {
    try {
      setIsDeleting(true);
      await deleteStudySession(sessionId);
      router.push('/study-session'); // Redirect to sessions list after deletion
    } catch (error) {
      console.error('Error deleting session:', error);
      // You might want to show an error message to the user
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading || !session) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(session.status);
  const sessionDate = new Date(session.date);
  const isToday = new Date().toDateString() === sessionDate.toDateString();

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4"
        onClick={() => router.push('/study-session')}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Sessions
      </Button>

      {/* Session Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center flex-wrap gap-2">
            <h1 className="text-2xl font-bold text-text-primary">{session.title}</h1>
            <Badge variant={statusBadge.variant} glow={statusBadge.variant === 'success'}>
              {statusBadge.text}
            </Badge>
          </div>
          <p className="text-text-secondary mt-1">{session.subject}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="ghost">
            <Bookmark className="h-4 w-4 mr-2" />
            Save
          </Button>
          {session.status === 'scheduled' && (
            <>
              <Button 
                variant="ghost"
                onClick={() => router.push(`/study-session/${sessionId}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Cancel
              </Button>

              {/* Delete Confirmation Modal */}
              <Modal isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                <ModalHeader>Cancel Study Session</ModalHeader>
                <ModalBody>
                  Are you sure you want to cancel this study session? This action cannot be undone.
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="ghost"
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Keep Session
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteSession}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Cancel Session
                      </>
                    )}
                  </Button>
                </ModalFooter>
              </Modal>
            </>
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
                  <p className="text-text-primary">
                    {session.location}
                    {session.location_details && ` - ${session.location_details}`}
                  </p>
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
            
            {session.description && (
              <div className="border-t border-card-border pt-4">
                <h3 className="font-medium text-text-primary mb-2">Description</h3>
                <p className="text-text-secondary">{session.description}</p>
              </div>
            )}
          </Card>

          {/* Topics Card */}
          <Card className="dark-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-text-primary">Session Topics</h2>

            </div>
            
            <div className="space-y-3">
              {topics && topics.map((topic) => (
                <div 
                  key={topic.id} 
                  className="p-3 rounded-lg bg-card-border/10 border border-card-border/30 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-primary-500/20 flex items-center justify-center mr-3">
                      <span className="text-primary-400 text-xs font-medium">{topics.indexOf(topic) + 1}</span>
                    </div>
                    <span className="text-text-primary">{topic.topic_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="text-text-secondary border-card-border mr-2">
                      <Clock className="h-3 w-3 mr-1" /> {topic.duration} min
                    </Badge>
                    {topic.completed && (
                      <CheckCircle className="h-5 w-5 text-accent-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-text-secondary text-sm flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                Total duration: {topics?.reduce((acc, topic) => acc + topic.duration, 0)} minutes
              </span>
            </div>
          </Card>
          
          {/* Resources Card */}
          <Card className="dark-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-text-primary">Study Resources</h2>
 
            </div>
            
            <div className="space-y-3">
              {resources && resources.length > 0 ? (
                resources.map((resource) => (
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
                    {resource.url && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        View
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-text-secondary">
                  No resources added yet
                </div>
              )}
            </div>
          </Card>
        </div>
        
        {/* Right Column - Actions */}
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
                >
                  <Users className="h-4 w-4 mr-2" />
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
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => router.push(`/study-session/${session.id}/live`)}
                >
                  <Zap className="h-4 w-4 mr-2" />
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
                >
                  <BookOpen className="h-4 w-4 mr-2" />
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
                {session.participants.length}
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
                      fallback={participant.display_name?.split(' ').map((n: string) => n[0]).join('') || '??'}
                      className="h-8 w-8 mr-3"
                    />
                    <div>
                      <p className="text-text-primary text-sm">
                        {participant.display_name || participant.email}
                      </p>
                      <p className="text-text-muted text-xs capitalize">{participant.role}</p>
                    </div>
                  </div>
                  
             
                </div>
              ))}
            </div>
            
            {session.status === 'scheduled' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full mt-4"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Invite More
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}