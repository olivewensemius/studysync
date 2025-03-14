'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { resetPassword } from './actions';

export default function ResetPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    try {
      await resetPassword(formData);
      setIsSuccess(true);
    } catch (err) {
      setError('An error occurred while sending the reset link');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="dark-card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-100">Reset Password</h1>
        
        {isSuccess ? (
          <div className="text-center">
            <div className="p-4 mb-4 bg-green-100 text-green-700 rounded-md">
              If an account exists with that email address, you will receive a password reset link shortly.
            </div>
            <p className="text-gray-300 mb-4">
              Please check your email for instructions to reset your password.
            </p>
            <Link href="/accounts/login">
              <p className="text-sm text-indigo-400 hover:text-indigo-300">Back to Login</p>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-300 mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200">Email address</label>
                <Input 
                  type="email" 
                  name="email" 
                  id="email" 
                  leftIcon={<Mail className="text-gray-400" />}
                  placeholder="you@example.com" 
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
                Reset Password
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <Link href="/accounts/login">
                <p className="text-sm text-indigo-400 hover:text-indigo-300">Back to Login</p>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}