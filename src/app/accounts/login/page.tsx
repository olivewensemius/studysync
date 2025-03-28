'use client';

import { login, loginGoogle, loginDiscord } from './actions'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (formData: FormData) => {
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="dark-card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-100">Login</h1>
        
        <Button
          type="button"
          variant="outline"
          className="w-full mb-4 flex items-center justify-center gap-2 cursor-pointer"
          onClick={loginGoogle}
        >
          <Image 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            width={16} 
            height={16} 
            className="w-4 h-4" 
          />
          Sign in with Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full mb-4 flex items-center justify-center gap-2 cursor-pointer"
          onClick={loginDiscord}
        >
         <Image 
            src="/discord.svg" 
            alt="Discord" 
            width={16} 
            height={16} 
            className="w-4 h-4" 
          />
          Sign in with Discord
        </Button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="text-gray-400 bg-[#1e1e1e] px-2">Or continue with</span>
          </div>
        </div>
        
        <form className="space-y-4">
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
              required 
              className="text-gray-800"
              variant={error ? "error" : "default"}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-200">Password</label>
            <Input 
              type="password" 
              name="password" 
              id="password" 
              value={formData.password}
              onChange={handleChange}
              leftIcon={<Lock className="text-gray-400" />}
              placeholder="••••••••" 
              required 
              className="text-gray-800"
              variant={error ? "error" : "default"}
              error={error}
            />
          </div>
          <div className="flex justify-end">
            <Link href="/accounts/password/reset">
              <p className="text-sm text-indigo-400 hover:text-indigo-300">Forgot password?</p>
            </Link>
          </div>
          <Button 
            type="submit" 
            variant="default" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer" 
            formAction={handleSubmit}
          >
            Login
          </Button>
        </form>
        
        <p className="text-center text-sm mt-6 text-gray-300">
          Don&apos;t have an account?{' '}
          <Link href="/accounts/signup">
            <span className="text-indigo-400 hover:text-indigo-300 underline">Register</span>
          </Link>
        </p>
      </Card>
    </div>
  );
}