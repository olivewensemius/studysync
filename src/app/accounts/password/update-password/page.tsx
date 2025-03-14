// src/app/accounts/password/update-password/page.tsx 

'use client'

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { resetPassword } from './actions';

export default function UpdatePasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    const newPassword = formData.get('new_password') as string;
    const confirmPassword = formData.get('confirm_new_password') as string;

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await resetPassword(formData);
      setIsSuccess(true);
    } catch (err) {
      setError('An error occurred while updating your password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="dark-card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-100">Reset your Password</h1>
        
        {isSuccess ? (
          <div className="text-center">
            <div className="p-4 mb-4 bg-green-100 text-green-700 rounded-md">
              Password successfully updated!
            </div>

            <Link href="/dashboard">
              <p className="text-sm text-indigo-400 hover:text-indigo-300">Back to Profile</p>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-300 mb-6">
              Please enter your new password below.
            </p>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="new_password" className="block mb-2 text-sm font-medium text-gray-200">New Password</label>
                <Input 
                  type="password" 
                  name="new_password" 
                  id="new_password" 
                  leftIcon={<Lock className="text-gray-400" />}
                  placeholder="••••••••" 
                  required 
                  className="text-gray-800"
                  variant={error ? "error" : "default"}
                />
              </div>
              <div>
                <label htmlFor="confirm_new_password" className="block mb-2 text-sm font-medium text-gray-200">Confirm New Password</label>
                <Input 
                  type="password" 
                  name="confirm_new_password" 
                  id="confirm_new_password" 
                  leftIcon={<Lock className="text-gray-400" />}
                  placeholder="••••••••" 
                  required 
                  className="text-gray-800"
                  variant={error ? "error" : "default"}
                  error={error}
                />
              </div>
              <Button 
                type="submit" 
                variant="default" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer" 
                formAction={handleSubmit}
              >
                Update Password
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <Link href="/dashboard">
                <p className="text-sm text-indigo-400 hover:text-indigo-300">Back to Profile</p>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}