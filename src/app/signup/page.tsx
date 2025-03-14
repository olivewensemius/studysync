import { signup } from './actions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <main className="fixed inset-0 bg-gradient-to-br from-primary-50 to-neutral-50">
      <div className="h-full flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-neutral-800 mb-2">Welcome to StudySync</h1>
            <p className="text-neutral-600">Sign in to your account or create a new one</p>
          </div>

          <form className="space-y-6">
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <label htmlFor="firstName" className="text-sm font-medium text-neutral-700">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  placeholder="First name"
                  leftIcon={<User className="text-primary-400" />}
                  className="w-full"
                />
              </div>

              <div className="space-y-2 flex-1">
                <label htmlFor="lastName" className="text-sm font-medium text-neutral-700">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  placeholder="Last name"
                  leftIcon={<User className="text-primary-400" />}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-neutral-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                leftIcon={<Mail className="text-primary-400" />}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-neutral-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                leftIcon={<Lock className="text-primary-400" />}
                className="w-full"
              />
            </div>

            <div className="flex flex-col space-y-3">
              <Button
                formAction={signup}
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Sign Up
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Already Have an Account?{' '}
              <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
                Login
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">

          </div>
        </Card>
      </div>
    </main>
  )
}