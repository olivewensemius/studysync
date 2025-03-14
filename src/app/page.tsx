// src/app/page.tsx
import { 
  BookOpen, 
  Users, 
  Calendar, 
  BarChart3, 
  Sparkles,
  ArrowRight,
  BrainCircuit,
  Clock,
  Globe,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="py-12 relative">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-primary-500/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-accent-500/20 rounded-full blur-[100px] -z-10"></div>
        
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display gradient-text">
            Welcome to StudySync
          </h1>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Your collaborative learning platform designed to help you achieve academic excellence through minimalist design and powerful tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="glow" size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-8 font-display">
          <span className="gradient-text">Key Features</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Study Groups */}
          <Card hover glow className="dark-card">
            <div className="flex flex-col items-start">
              <div className="bg-primary-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="text-primary-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-text-primary">Study Groups</h3>
              <p className="text-text-secondary">
                Collaborate with peers on challenging subjects and share knowledge
              </p>
            </div>
          </Card>
          
          {/* Study Sessions */}
          <Card hover glow className="dark-card">
            <div className="flex flex-col items-start">
              <div className="bg-primary-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BookOpen className="text-primary-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-text-primary">Study Sessions</h3>
              <p className="text-text-secondary">
                Structured learning sessions with timers and topic tracking
              </p>
            </div>
          </Card>
          
          {/* Scheduling */}
          <Card hover glow accent className="dark-card">
            <div className="flex flex-col items-start">
              <div className="bg-accent-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Calendar className="text-accent-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-text-primary">Smart Scheduling</h3>
              <p className="text-text-secondary">
                AI-powered scheduling to optimize your study times
              </p>
            </div>
          </Card>
          
          {/* Analytics */}
          <Card hover glow className="dark-card">
            <div className="flex flex-col items-start">
              <div className="bg-primary-500/20 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <BarChart3 className="text-primary-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-text-primary">Analytics</h3>
              <p className="text-text-secondary">
                Track your progress and identify areas for improvement
              </p>
            </div>
          </Card>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="rounded-xl p-8 bg-dark-gradient relative overflow-hidden">
        {/* Glowing accent */}
        <div className="absolute inset-0 bg-primary-500/10 backdrop-blur-sm"></div>
        
        <div className="relative flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2 flex items-center text-text-primary">
              <Sparkles className="mr-2 text-primary-400" /> Boost Your Learning Today
            </h2>
            <p className="text-text-secondary">
              Join thousands of students achieving better results with StudySync
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="glow" size="lg">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Extra Features Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold text-center mb-12 font-display">
          <span className="gradient-text">Why StudySync?</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start">
            <div className="bg-primary-500/20 p-3 rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4">
              <BrainCircuit className="text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 text-text-primary">AI-Powered Learning</h3>
              <p className="text-text-secondary">
                Our advanced AI analyzes your study patterns and helps optimize your learning process for maximum retention
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-accent-500/20 p-3 rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4">
              <Clock className="text-accent-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 text-text-primary">Time Management</h3>
              <p className="text-text-secondary">
                Built-in tools to help you manage your time effectively and build consistent study habits
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-primary-500/20 p-3 rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4">
              <Globe className="text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 text-text-primary">Global Community</h3>
              <p className="text-text-secondary">
                Connect with students worldwide to share resources, collaborate on projects, and expand your knowledge
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-accent-500/20 p-3 rounded-full w-12 h-12 flex-shrink-0 flex items-center justify-center mr-4">
              <Zap className="text-accent-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2 text-text-primary">Productivity Boost</h3>
              <p className="text-text-secondary">
                Streamlined interface and focused study tools designed to eliminate distractions and boost productivity
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-8 bg-card-bg rounded-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-400 mb-2">10,000+</p>
            <p className="text-text-secondary">Active Students</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-400 mb-2">250+</p>
            <p className="text-text-secondary">Study Groups</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-400 mb-2">95%</p>
            <p className="text-text-secondary">Improvement Rate</p>
          </div>
        </div>
      </section>
    </div>
  );
}