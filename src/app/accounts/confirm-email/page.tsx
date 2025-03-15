'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { resendConfirmation } from './actions';

export default function ConfirmEmailPage() {
  const [isResent, setIsResent] = useState(false);
  const [error, setError] = useState('');

  const handleResend = async () => {
    try {
      await resendConfirmation();
      setIsResent(true);
      setError('');
    } catch (err) {
      setError('Failed to resend confirmation email');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="dark-card p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-indigo-100 p-3">
            <Mail className="h-10 w-10 text-indigo-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-100">
          Verify your email
        </h1>
        
        <p className="text-gray-300 mb-6 text-center">
          We've sent a verification email to your inbox. Please click the link in the email to verify your account.
        </p>
        
        <div className="bg-gray-800 border border-gray-700 rounded-md p-4 mb-6">
          <p className="text-gray-300 text-sm">
            <span className="font-medium">Note:</span> You need to verify your email before you can access your account. If you don't see the email, check your spam folder.
          </p>
        </div>
        
        {isResent && (
          <div className="p-4 mb-6 bg-green-900/30 border border-green-700 text-green-400 rounded-md text-sm">
            Confirmation email has been resent! Please check your inbox.
          </div>
        )}
        
        {error && (
          <div className="p-4 mb-6 bg-red-900/30 border border-red-700 text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full mb-4"
          onClick={handleResend}
          disabled={isResent}
        >
          {isResent ? 'Email Sent' : 'Resend Verification Email'}
        </Button>
        
        <div className="text-center">
          <Link href="/accounts/login">
            <span className="text-sm text-indigo-400 hover:text-indigo-300">Back to Login</span>
          </Link>
        </div>
      </Card>
    </div>
  );
}