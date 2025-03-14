// src/app/auth/register.tsx 
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="dark-card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-text-secondary">Email address</label>
            <input type="email" name="email" id="email" className="border border-card-border bg-card-bg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-500 rounded-md w-full px-4 py-2" placeholder="you@example.com" required />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-text-secondary">Password</label>
            <input type="password" name="password" id="password" className="border border-card-border bg-card-bg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-500 rounded-md w-full px-4 py-2" placeholder="••••••••" required />
          </div>
          <div>
            <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-text-secondary">Confirm Password</label>
            <input type="password" name="confirm_password" id="confirm_password" className="border border-card-border bg-card-bg text-text-primary focus:outline-none focus:ring-1 focus:ring-primary-500 rounded-md w-full px-4 py-2" placeholder="••••••••" required />
          </div>
          <Button type="submit" variant="default" className="w-full">
            Register
          </Button>
        </form>
        
        <p className="text-center text-sm mt-6">
          Already have an account?{' '}
          <Link href="/auth/login">
            <span className="text-primary-400 hover:text-primary-300">Login</span>
          </Link>
        </p>
      </Card>
    </div>
  );
}