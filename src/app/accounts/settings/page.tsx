// src/app/accounts/settings/page.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Save } from 'lucide-react';
import Link from 'next/link';
import { updateProfile } from './actions';

export default function ProfileSettingsPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const result = await updateProfile(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (err) {
      setError('An error occurred while updating profile');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="dark-card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-100">Profile Settings</h1>
        
        {isSuccess && (
          <div className="p-4 mb-6 bg-green-900/30 border border-green-700 text-green-400 rounded-md text-sm">
            Profile updated successfully!
          </div>
        )}
        
        {error && (
          <div className="p-4 mb-6 bg-red-900/30 border border-red-700 text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-200">First Name</label>
              <Input 
                type="text" 
                name="firstName" 
                id="firstName" 
                value={formData.firstName}
                onChange={handleChange}
                leftIcon={<User className="text-gray-400" />}
                placeholder="John" 
                className="text-gray-800"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-200">Last Name</label>
              <Input 
                type="text" 
                name="lastName" 
                id="lastName" 
                value={formData.lastName}
                onChange={handleChange}
                leftIcon={<User className="text-gray-400" />}
                placeholder="Doe" 
                className="text-gray-800"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200">Email address</label>
            <Input 
              type="email" 
              name="email" 
              id="email" 
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail className="text-gray-400" />}
              placeholder="you@example.com" 
              disabled
              className="text-gray-800 bg-gray-700/50"
            />
            <p className="mt-1 text-xs text-gray-400">Email cannot be changed</p>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              variant="default" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer flex items-center justify-center gap-2" 
              formAction={handleSubmit}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
        
        <div className="mt-6 space-y-4">
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-lg font-medium text-gray-100 mb-4">Password Management</h2>
            <Link href="/accounts/password/update-password">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </Link>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-lg font-medium text-gray-100 mb-4">Back to App</h2>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}