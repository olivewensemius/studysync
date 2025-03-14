import { login } from './actions'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="fixed inset-0 bg-gradient-to-br from-primary-50 to-neutral-50">
      <div className="h-full flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-neutral-800 mb-2">Welcome to StudySync</h1>
            <p className="text-neutral-600">Sign in to your account or create a new one</p>
          </div>

          <form className="space-y-6">
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
                formAction={login}
                variant="outline"
                className="w-full bg-blue-500 text-white hover:bg-blue-600"
              >
                Sign In
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-500 hover:text-blue-600 font-medium">
                Sign up
              </Link>
            </p>
          </div>

        </Card>
      </div>
    </main>
  )
}

