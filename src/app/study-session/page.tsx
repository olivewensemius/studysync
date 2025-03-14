// src/app/study-session/page.tsx
"use client";

import React, { useState } from 'react';
import { 
  Clock, 
  Play, 
  Pause,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  MessageSquare, 
  Users,
  CheckCircle,
  X,
  PlusSquare
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

// Mock data
const sessionTopics = [
  { id: 1, title: 'Linear Algebra Concepts', completed: true, duration: '45 mins' },
  { id: 2, title: 'Calculus Integration Methods', completed: true, duration: '30 mins' },
  { id: 3, title: 'Differential Equations', completed: false, duration: '40 mins', current: true },
  { id: 4, title: 'Vector Calculus', completed: false, duration: '35 mins' },
];

const participants = [
  { id: 1, name: 'Alex Johnson', status: 'online', avatar: null },
  { id: 2, name: 'Maria Garcia', status: 'online', avatar: null },
  { id: 3, name: 'David Chen', status: 'online', avatar: null },
  { id: 4, name: 'Sarah Williams', status: 'away', avatar: null },
];

const notes = [
  { id: 1, content: 'Remember to review the Laplace transform formulas before next session', time: '5 mins ago' },
  { id: 2, content: 'The key to solving these differential equations is recognizing the pattern', time: '12 mins ago' },
  { id: 3, content: 'Check textbook page 157 for additional examples', time: '20 mins ago' },
];

export default function StudySessionPage() {
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState('00:32:15');
  const [newNote, setNewNote] = useState('');

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-text-primary">Advanced Mathematics</h1>
            <Badge variant="primary" className="ml-3">In Progress</Badge>
          </div>
          <p className="text-text-secondary mt-1">Session with Math Study Group</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            leftIcon={<MessageSquare className="h-4 w-4" />}
          >
            Chat
          </Button>
          <Button 
            variant="default" 
            leftIcon={<Users className="h-4 w-4" />}
          >
            Participants
          </Button>
        </div>
      </div>

      {/* Timer and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer Card */}
        <Card className="dark-card">
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold text-text-primary mb-4">Session Timer</h2>
            
            <div className="relative">
              {/* Timer Circle */}
              <div className="w-32 h-32 rounded-full border-4 border-primary-500/30 flex items-center justify-center mb-4">
                <div className="absolute w-32 h-32 rounded-full border-t-4 border-r-4 border-primary-500 animate-spin"></div>
                <p className="text-3xl font-mono text-text-primary">{timer}</p>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsPaused(false)}
                disabled={!isPaused}
              >
                <Play className="h-5 w-5" />
              </Button>
              <Button 
                variant={isPaused ? "ghost" : "default"}
                size="icon"
                onClick={() => setIsPaused(true)}
                disabled={isPaused}
              >
                <Pause className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-text-secondary text-sm">Total session time</p>
              <p className="text-text-primary font-medium">2 hours 15 minutes</p>
            </div>
          </div>
        </Card>

        {/* Current Topic */}
        <Card className="dark-card">
          <h2 className="text-lg font-bold text-text-primary mb-4">Current Topic</h2>
          
          <div className="p-4 rounded-lg bg-card-border/30 border border-card-border">
            <div className="flex justify-between">
              <h3 className="font-medium text-text-primary">Differential Equations</h3>
              <Badge variant="primary" className="bg-primary-500/20 text-primary-300">
                <Clock className="h-3 w-3 mr-1" /> 40 mins
              </Badge>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-text-secondary text-sm">
                <div className="w-24">Progress:</div>
                <div className="flex-1 h-2 bg-card-border/50 rounded-full overflow-hidden ml-2">
                  <div className="h-full bg-primary-500 rounded-full w-3/4"></div>
                </div>
                <div className="ml-2">75%</div>
              </div>
              
              <div className="flex items-center text-text-secondary text-sm">
                <div className="w-24">Time left:</div>
                <div className="text-text-primary">12 minutes</div>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <Button variant="outline" size="sm" leftIcon={<Edit className="h-3.5 w-3.5" />}>
                Edit
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<CheckCircle className="h-3.5 w-3.5" />}>
                Mark Complete
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-text-primary mb-2">Session Objectives:</h3>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start">
                <div className="h-5 w-5 flex-shrink-0 rounded-full bg-primary-500/20 flex items-center justify-center mr-2">
                  <CheckCircle className="h-3 w-3 text-primary-400" />
                </div>
                <span>Understand first and second order equations</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 flex-shrink-0 rounded-full bg-primary-500/20 flex items-center justify-center mr-2">
                  <CheckCircle className="h-3 w-3 text-primary-400" />
                </div>
                <span>Practice solving homogeneous equations</span>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 flex-shrink-0 rounded-full bg-card-border flex items-center justify-center mr-2">
                  <div className="h-2 w-2 bg-text-secondary rounded-full"></div>
                </div>
                <span>Complete practice problems 5-10</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Participants */}
        <Card className="dark-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-text-primary">Participants</h2>
            <Badge className="bg-accent-500/20 text-accent-300">
              {participants.filter(p => p.status === 'online').length} Online
            </Badge>
          </div>
          
          <div className="space-y-3">
            {participants.map((participant) => (
              <div 
                key={participant.id} 
                className="flex items-center"
              >
                <Avatar 
                  fallback={participant.name.split(' ').map(n => n[0]).join('')}
                  status={participant.status as any}
                  className="mr-3"
                />
                <div>
                  <p className="text-text-primary text-sm">{participant.name}</p>
                  <p className="text-text-muted text-xs capitalize">{participant.status}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-4 w-full"
            leftIcon={<PlusCircle className="h-4 w-4" />}
          >
            Invite More
          </Button>
        </Card>
      </div>

      {/* Topics List */}
      <Card className="dark-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-text-primary">Session Topics</h2>
          <Button 
            variant="outline" 
            size="sm" 
            leftIcon={<PlusSquare className="h-4 w-4" />}
          >
            Add Topic
          </Button>
        </div>
        
        <div className="space-y-3">
          {sessionTopics.map((topic) => (
            <div 
              key={topic.id} 
              className={`p-3 rounded-lg flex items-center justify-between ${
                topic.current ? 'bg-primary-500/10 border border-primary-500/30' : 
                topic.completed ? 'bg-card-border/20' : 'bg-card-border/10'
              }`}
            >
              <div className="flex items-center">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                  topic.completed ? 'bg-accent-500/20' : 
                  topic.current ? 'bg-primary-500/20' : 'bg-card-border/30'
                }`}>
                  {topic.completed ? (
                    <CheckCircle className="h-4 w-4 text-accent-400" />
                  ) : topic.current ? (
                    <Play className="h-3.5 w-3.5 text-primary-400" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-text-secondary"></div>
                  )}
                </div>
                <span className={`text-sm ${
                  topic.completed ? 'text-text-secondary line-through' : 'text-text-primary'
                }`}>
                  {topic.title}
                </span>
                {topic.current && (
                  <Badge variant="primary" className="ml-2 text-xs py-0.5 px-1.5">
                    Current
                  </Badge>
                )}
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="text-text-secondary border-card-border mr-2">
                  <Clock className="h-3 w-3 mr-1" /> {topic.duration}
                </Badge>
                <button className="text-text-muted hover:text-text-secondary p-1">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="text-text-muted hover:text-red-400 p-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Notes */}
      <Card className="dark-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-text-primary">Session Notes</h2>
        </div>
        
        {/* Add Note form */}
        <div className="flex mb-5 space-x-2">
          <input
            type="text"
            placeholder="Add a note..."
            className="flex-1 px-3 py-2 rounded-md bg-card-border/30 border border-card-border text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-500"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <Button variant="default" disabled={!newNote.trim()}>
            Add
          </Button>
        </div>

        {/* Notes list */}
        <div className="space-y-3">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className="p-3 rounded-lg bg-card-border/20 border border-card-border"
            >
              <p className="text-text-primary text-sm">{note.content}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-text-muted text-xs">{note.time}</p>
                <div className="flex space-x-1">
                  <button className="text-text-muted hover:text-text-secondary p-1">
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button className="text-text-muted hover:text-red-400 p-1">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}