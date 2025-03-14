'use client';

import { signup } from './actions'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (formData: FormData) => {
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm_password') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup(formData);
    } catch (err) {
      setError('An error occurred during registration');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="dark-card p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-100">Create an Account</h1>
        
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
            />
          </div>
          <div>
            <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-200">Confirm Password</label>
            <Input 
              type="password" 
              name="confirm_password" 
              id="confirm_password" 
              value={formData.confirm_password}
              onChange={handleChange}
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
            Register
          </Button>
        </form>
        
        <p className="text-center text-sm mt-6 text-gray-300">
          Already have an account?{' '}
          <Link href="/accounts/login">
            <span className="text-indigo-400 hover:text-indigo-300 underline">Log in</span>
          </Link>
        </p>
      </Card>
    </div>
  );
}