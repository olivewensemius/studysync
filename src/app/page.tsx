import Image from "next/image";
import Link from "next/link";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  BarChart3, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-10 py-6">
      {/* Hero Section */}
      <section className="py-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary-100 opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-accent-100 opacity-50 blur-3xl"></div>
        
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display gradient-text">
            Welcome to StudySync
          </h1>
          <p className="text-lg text-neutral-600 mb-8">
            Your collaborative learning platform designed to help you achieve academic excellence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-primary">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button className="btn-outline">
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-8">
        <h2 className="section-title text-center mb-8">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Study Groups */}
          <Card className="card p-6 hover:border-primary-500 transition-colors">
            <div className="bg-primary-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Users className="text-primary-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-neutral-800">Study Groups</h3>
            <p className="text-neutral-600">
              Collaborate with peers on challenging subjects and share knowledge.
            </p>
          </Card>
          
          {/* Study Sessions */}
          <Card className="card p-6 hover:border-primary-500 transition-colors">
            <div className="bg-secondary-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <BookOpen className="text-secondary-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-neutral-800">Study Sessions</h3>
            <p className="text-neutral-600">
              Structured learning sessions with timers and topic tracking.
            </p>
          </Card>
          
          {/* Scheduling */}
          <Card className="card p-6 hover:border-primary-500 transition-colors">
            <div className="bg-accent-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Calendar className="text-accent-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-neutral-800">Smart Scheduling</h3>
            <p className="text-neutral-600">
              AI-powered scheduling to optimize your study times and improve retention.
            </p>
          </Card>
          
          {/* Analytics */}
          <Card className="card p-6 hover:border-primary-500 transition-colors">
            <div className="bg-primary-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <BarChart3 className="text-primary-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-neutral-800">Analytics</h3>
            <p className="text-neutral-600">
              Track your progress and identify areas for improvement.
            </p>
          </Card>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-blue-gradient rounded-xl p-8 shadow-blue text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <Sparkles className="mr-2" /> Boost Your Learning Today
            </h2>
            <p className="text-primary-50">
              Join thousands of students achieving better results with StudySync
            </p>
          </div>
          <div>
            <Link href="/dashboard">
              <Button className="bg-white text-primary-600 hover:bg-primary-50">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600 mb-2">10,000+</p>
            <p className="text-neutral-600">Active Students</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600 mb-2">250+</p>
            <p className="text-neutral-600">Study Groups</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600 mb-2">95%</p>
            <p className="text-neutral-600">Improvement Rate</p>
          </div>
        </div>
      </section>
    </div>
  );
}