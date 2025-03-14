// src/app/study-sessions/create/page.tsx
"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users,
  MapPin,
  ChevronLeft,
  Plus,
  X,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateSessionPage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    date: '',
    time: '',
    duration: '60',
    location: 'Online',
    locationDetails: '',
  });
  
  // Topics and participants state
  const [topics, setTopics] = useState<{title: string, duration: string}[]>([
    { title: '', duration: '30' }
  ]);
  
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newTopic, setNewTopic] = useState({ title: '', duration: '30' });
  
  // Form errors state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  // Handle topic changes
  const handleTopicChange = (index: number, field: 'title' | 'duration', value: string) => {
    const updatedTopics = [...topics];
    updatedTopics[index] = { ...updatedTopics[index], [field]: value };
    setTopics(updatedTopics);
  };
  
  // Add new topic
  const addTopic = () => {
    if (newTopic.title.trim() === '') {
      setErrors({ ...errors, newTopic: 'Topic title is required' });
      return;
    }
    
    setTopics([...topics, { ...newTopic }]);
    setNewTopic({ title: '', duration: '30' });
    setErrors({ ...errors, newTopic: '' });
  };
  
  // Remove topic
  const removeTopic = (index: number) => {
    const updatedTopics = [...topics];
    updatedTopics.splice(index, 1);
    setTopics(updatedTopics);
  };
  
  // Add participant email
  const addParticipant = () => {
    if (newEmail.trim() === '') {
      setErrors({ ...errors, newEmail: 'Email is required' });
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setErrors({ ...errors, newEmail: 'Please enter a valid email' });
      return;
    }
    
    if (invitedEmails.includes(newEmail)) {
      setErrors({ ...errors, newEmail: 'This email has already been added' });
      return;
    }
    
    setInvitedEmails([...invitedEmails, newEmail]);
    setNewEmail('');
    setErrors({ ...errors, newEmail: '' });
  };
  
  // Remove participant email
  const removeParticipant = (email: string) => {
    setInvitedEmails(invitedEmails.filter(e => e !== email));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.date.trim()) newErrors.date = 'Date is required';
    if (!formData.time.trim()) newErrors.time = 'Time is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    
    // Validate topics
    if (topics.length === 0) {
      newErrors.topics = 'At least one topic is required';
    } else {
      const invalidTopics = topics.some(topic => !topic.title.trim());
      if (invalidTopics) newErrors.topics = 'All topics must have a title';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // In a real application, this would send data to the server
    console.log('Submitting session data:', { 
      ...formData, 
      topics, 
      participants: invitedEmails 
    });
    
    // Redirect to sessions list
    router.push('/study-sessions');
  };
  
  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button 
        variant="ghost" 
        size="sm"
        leftIcon={<ChevronLeft className="h-4 w-4" />}
        onClick={() => router.push('/study-sessions')}
      >
        Back to Sessions
      </Button>
      
      <h1 className="text-2xl font-bold text-text-primary">Create New Study Session</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Card */}
        <Card className="dark-card">
          <h2 className="text-lg font-bold text-text-primary mb-6">Session Information</h2>
          
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-1">
                Session Title*
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Advanced Calculus Review"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            
            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-1">
                Subject*
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g., Mathematics"
                className={errors.subject ? 'border-red-500' : ''}
              />
              {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide details about what will be covered in this session"
                className="min-h-24"
              />
            </div>
          </div>
        </Card>
        
        {/* Schedule Card */}
        <Card className="dark-card">
          <h2 className="text-lg font-bold text-text-primary mb-6">Schedule</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-text-primary mb-1">
                Date*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-text-secondary" />
                </div>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.date ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            
            {/* Time */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-text-primary mb-1">
                Time*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-4 w-4 text-text-secondary" />
                </div>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.time ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>
            
            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-text-primary mb-1">
                Duration (minutes)*
              </label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="15"
                step="5"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="60"
                className={errors.duration ? 'border-red-500' : ''}
              />
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
            </div>
            
            {/* Location Type */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-1">
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-text-secondary" />
                </div>
                <select
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange as any}
                  className="pl-10 w-full px-3 py-2 border rounded-md bg-card-bg border-card-border text-text-primary"
                >
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
            </div>
            
            {/* Location Details */}
            <div className="md:col-span-2">
              <label htmlFor="locationDetails" className="block text-sm font-medium text-text-primary mb-1">
                Location Details
              </label>
              <Input
                id="locationDetails"
                name="locationDetails"
                value={formData.locationDetails}
                onChange={handleInputChange}
                placeholder={formData.location === 'Online' ? 'e.g., Zoom link, Microsoft Teams' : 'e.g., Library, Room 204'}
              />
            </div>
          </div>
        </Card>
        
        {/* Topics Card */}
        <Card className="dark-card">
          <h2 className="text-lg font-bold text-text-primary mb-6">Session Topics</h2>
          
          {errors.topics && <p className="text-red-500 text-sm mb-4">{errors.topics}</p>}
          
          {/* Existing Topics */}
          {topics.length > 0 && (
            <div className="space-y-3 mb-4">
              {topics.map((topic, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-2 p-3 rounded-lg bg-card-border/10 border border-card-border/30"
                >
                  <div className="h-6 w-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <span className="text-primary-400 text-xs font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-grow">
                    <Input
                      value={topic.title}
                      onChange={(e) => handleTopicChange(index, 'title', e.target.value)}
                      placeholder="Topic title"
                      className="border-none bg-transparent px-0 py-0 h-auto"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      min="5"
                      step="5"
                      value={topic.duration}
                      onChange={(e) => handleTopicChange(index, 'duration', e.target.value)}
                      className="w-16 text-center"
                    />
                    <span className="text-text-secondary text-sm">min</span>
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="text-text-muted hover:text-red-400 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Add New Topic */}
          <div className="flex items-center space-x-2">
            <Input
              value={newTopic.title}
              onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
              placeholder="Add a new topic"
              className={errors.newTopic ? 'border-red-500' : ''}
            />
            <Input
              type="number"
              min="5"
              step="5"
              value={newTopic.duration}
              onChange={(e) => setNewTopic({ ...newTopic, duration: e.target.value })}
              className="w-16 text-center"
            />
            <span className="text-text-secondary text-sm">min</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addTopic}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {errors.newTopic && <p className="text-red-500 text-xs mt-1">{errors.newTopic}</p>}
          
          <div className="mt-4 text-text-secondary text-sm flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              Total duration: {topics.reduce((acc, topic) => acc + (parseInt(topic.duration) || 0), 0)} minutes
            </span>
          </div>
        </Card>
        
        {/* Participants Card */}
        <Card className="dark-card">
          <h2 className="text-lg font-bold text-text-primary mb-6">Invite Participants</h2>
          
          {/* Invite List */}
          {invitedEmails.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {invitedEmails.map((email) => (
                <div 
                  key={email} 
                  className="flex items-center bg-primary-500/20 text-primary-400 rounded-full px-3 py-1 text-sm"
                >
                  <span>{email}</span>
                  <button
                    type="button"
                    onClick={() => removeParticipant(email)}
                    className="ml-2 text-primary-400 hover:text-primary-300"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Add New Participant */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-4 w-4 text-text-secondary" />
              </div>
              <Input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email address"
                className={`pl-10 ${errors.newEmail ? 'border-red-500' : ''}`}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addParticipant}
            >
              Invite
            </Button>
          </div>
          {errors.newEmail && <p className="text-red-500 text-xs mt-1">{errors.newEmail}</p>}
          
          <p className="mt-4 text-text-secondary text-sm">
            {invitedEmails.length ? `${invitedEmails.length} participants invited` : 'No participants invited yet'}
          </p>
        </Card>
        
        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/study-sessions')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
          >
            Create Session
          </Button>
        </div>
      </form>
    </div>
  );
}