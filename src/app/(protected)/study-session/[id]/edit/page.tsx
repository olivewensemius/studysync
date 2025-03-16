"use client";

import React, { useState, useEffect } from 'react';
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
  Trash2
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { fetchSingleStudySession, fetchSessionTopics, fetchSessionResources, updateStudySession } from '../../actions';


//Edit page to eddit a study session
export default function EditStudySessionPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    date: '',
    time: '',
    duration: '',
    description: '',
    location: 'Online',
    locationDetails: '',
    status: 'scheduled'
  });
  
  // Bunch of states
  const [topics, setTopics] = useState<{id?: string, title: string, duration: string}[]>([]);
  const [resources, setResources] = useState<{id?: string, title: string, type: string, url: string}[]>([]);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newTopic, setNewTopic] = useState({ title: '', duration: '30' });
  const [showTopicInput, setShowTopicInput] = useState(false);
  const [newResource, setNewResource] = useState({ title: '', type: 'PDF', url: '' });
  const [showResourceInput, setShowResourceInput] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSaving, setIsSaving] = useState(false);


  const resourceTypes = ['PDF', 'URL', 'Document', 'Video', 'Image', 'Other'];

  const statusOptions = ['scheduled', 'in-progress', 'completed'];

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const [sessionData, topicsData, resourcesData] = await Promise.all([
          fetchSingleStudySession(sessionId),
          fetchSessionTopics(sessionId),
          fetchSessionResources(sessionId)
        ]);

 
        const sessionDate = new Date(sessionData.date);
        const formattedDate = sessionDate.toISOString().split('T')[0];
        const formattedTime = sessionDate.toTimeString().slice(0, 5);

        setFormData({
          title: sessionData.title,
          subject: sessionData.subject,
          date: formattedDate,
          time: formattedTime,
          duration: sessionData.duration.toString(),
          description: sessionData.description || '',
          location: sessionData.location,
          locationDetails: sessionData.location_details || '',
          status: sessionData.status || 'scheduled'
        });

        setTopics(topicsData.map((topic: any) => ({
          id: topic.id,
          title: topic.topic_name,
          duration: topic.duration.toString()
        })));

        setResources(resourcesData || []);
        // setInvitedEmails(sessionData.participants.map((p: any) => p.email));
      } catch (error) {
        console.error('Error loading session:', error);

      } finally {
        setLoading(false);
      }
    };

    loadSessionData();
  }, [sessionId]);

  // Handle form changes
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
    if (!showTopicInput) {
      setShowTopicInput(true);
      return;
    }

    if (newTopic.title.trim() === '') {
      setErrors({ ...errors, newTopic: 'Topic title is required' });
      return;
    }
    
    setTopics([...topics, { ...newTopic }]);
    setNewTopic({ title: '', duration: '30' });
    setErrors({ ...errors, newTopic: '' });
    setShowTopicInput(false);
  };

  // remove topic
  const removeTopic = (index: number) => {
    const updatedTopics = [...topics];
    updatedTopics.splice(index, 1);
    setTopics(updatedTopics);
  };

  // Add email
  const addParticipant = () => {
    if (newEmail.trim() === '') {
      setErrors({ ...errors, newEmail: 'Email is required' });
      return;
    }
    
    // email check
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

  // Add new resource
  const addResource = () => {
    if (!showResourceInput) {
      setShowResourceInput(true);
      return;
    }

    if (newResource.title.trim() === '') {
      setErrors({ ...errors, newResource: 'Resource title is required' });
      return;
    }

    if (newResource.url.trim() === '') {
      setErrors({ ...errors, newResource: 'Resource URL is required' });
      return;
    }

    setResources([...resources, { ...newResource }]);
    setNewResource({ title: '', type: 'PDF', url: '' });
    setErrors({ ...errors, newResource: '' });
    setShowResourceInput(false);
  };

  // Remove resource
  const removeResource = (index: number) => {
    const updatedResources = [...resources];
    updatedResources.splice(index, 1);
    setResources(updatedResources);
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      setIsSaving(true);
    
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      await updateStudySession(sessionId, {
        title: formData.title,
        subject: formData.subject,
        date: dateTime.toISOString(),
        duration: parseInt(formData.duration),
        description: formData.description,
        location: formData.location,
        status: formData.status,
        locationDetails: formData.locationDetails,
        participantEmails: invitedEmails,
        resources: resources,
        topics: topics,
      });

      // redirect on success
      router.push(`/study-session/${sessionId}`);
    } catch (error) {
      console.error('Error updating study session:', error);
      setErrors({
        submit: 'Failed to update study session. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button 
        variant="ghost" 
        size="sm"
        className="mb-4"
        onClick={() => router.push(`/study-session/${sessionId}`)}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Session
      </Button>
      
      <h1 className="text-2xl font-bold text-text-primary">Edit Study Session</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
       
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

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-1/2 px-3 py-2 border rounded-md bg-card-bg border-card-border text-text-primary"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
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
        
        {/* Schedule*/}
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
                  onChange={handleInputChange}
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
                  key={topic.id || index} 
                  className="flex items-center space-x-2 p-4 rounded-lg bg-primary-500/10 border-2 border-primary-500/30"
                >
                  <div className="h-7 w-7 rounded-full bg-primary-500/30 flex items-center justify-center">
                    <span className="text-primary-400 text-sm font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-grow">
                    <Input
                      value={topic.title}
                      onChange={(e) => handleTopicChange(index, 'title', e.target.value)}
                      placeholder="Topic title"
                      className="border-none bg-transparent px-0 py-0 h-auto text-lg font-medium text-primary-400"
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
                      className="text-primary-400 hover:text-red-400 p-1"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Add New Topic */}
          {showTopicInput ? (
            <div className="flex items-center space-x-2">
              <Input
                value={newTopic.title}
                onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                placeholder="Add a new topic"
                className={`text-lg ${errors.newTopic ? 'border-red-500' : 'border-primary-500/50'}`}
              />
              <Input
                type="number"
                min="5"
                step="5"
                value={newTopic.duration}
                onChange={(e) => setNewTopic({ ...newTopic, duration: e.target.value })}
                className="w-20 text-center text-lg border-primary-500/50"
              />
              <span className="text-primary-400 text-sm font-medium">min</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addTopic}
                className="border-primary-500/50 hover:bg-primary-500/20"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={addTopic}
              className="w-full text-lg border-primary-500/50 hover:bg-primary-500/20"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Topic
            </Button>
          )}
          {errors.newTopic && <p className="text-red-500 text-xs mt-1">{errors.newTopic}</p>}
          
          <div className="mt-4 text-text-secondary text-sm flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              Total duration: {topics.reduce((acc, topic) => acc + (parseInt(topic.duration) || 0), 0)} minutes
            </span>
          </div>
        </Card>
        
        {/* Resources Card */}
        <Card className="dark-card">
          <h2 className="text-lg font-bold text-text-primary mb-6">Study Resources</h2>
          
          {/* Existing Resources */}
          {resources.length > 0 && (
            <div className="space-y-3 mb-4">
              {resources.map((resource, index) => (
                <div 
                  key={resource.id || index} 
                  className="flex items-center space-x-2 p-4 rounded-lg bg-primary-500/10 border-2 border-primary-500/30"
                >
                  <div className="h-8 w-8 rounded-md bg-primary-500/30 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-primary-400" />
                  </div>
                  <div className="flex-grow space-y-1">
                    <p className="text-lg font-medium text-primary-400">{resource.title}</p>
                    <div className="flex items-center space-x-2 text-sm text-text-secondary">
                      <span className="uppercase">{resource.type}</span>
                      <span>•</span>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline truncate">
                        {resource.url}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeResource(index)}
                    className="text-primary-400 hover:text-red-400 p-1"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Add New Resource */}
          {showResourceInput ? (
            <div className="space-y-3">
              <Input
                value={newResource.title}
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                placeholder="Resource title"
                className={errors.newResource ? 'border-red-500' : 'border-primary-500/50'}
              />
              <div className="flex space-x-2">
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                  className="flex-shrink-0 w-32 px-3 py-2 border rounded-md bg-card-bg border-primary-500/50 text-text-primary"
                >
                  {resourceTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <Input
                  value={newResource.url}
                  onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                  placeholder="Resource URL"
                  className="border-primary-500/50"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addResource}
                  className="border-primary-500/50 hover:bg-primary-500/20"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
              {errors.newResource && <p className="text-red-500 text-xs">{errors.newResource}</p>}
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={addResource}
              className="w-full text-lg border-primary-500/50 hover:bg-primary-500/20"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Resource
            </Button>
          )}
        </Card>
        
        {/* Participants Card */}
        <Card className="dark-card">
          <h2 className="text-lg font-bold text-text-primary mb-6">Participants</h2>
          
          {/* Existing Participants */}
          {invitedEmails.length > 0 && (
            <div className="space-y-2 mb-4">
              {invitedEmails.map((email) => (
                <div 
                  key={email}
                  className="flex items-center justify-between p-2 rounded-lg bg-primary-500/10"
                >
                  <span className="text-text-primary">{email}</span>
                  <button
                    type="button"
                    onClick={() => removeParticipant(email)}
                    className="text-primary-400 hover:text-red-400 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
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
            onClick={() => router.push(`/study-session/${sessionId}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={isSaving}
          >
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
} 