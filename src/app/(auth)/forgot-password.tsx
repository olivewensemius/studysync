// src/app/auth/forgot-password.tsx
import { Card } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="dark-card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
        
        <p className="text-text-secondary mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-text-secondary">Email address</label>
            <input type="email" name="email" id="email" className="border border-card-border bg-card-bg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-500 rounded-md w-full px-4 py-2" placeholder="you@example.com" required />
          </div>
          <Button type="submit" variant="default" className="w-full">
            Reset Password
          </Button>
        </form>
        
        <div className="text-center mt-6">
          <Link href="/auth/login">
            <p className="text-sm text-primary-400 hover:text-primary-300">Back to Login</p>
          </Link>
        </div>
      </Card>
    </div>
  );
}