// src/app/analytics/page.tsx
"use client";

import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  ChevronDown, 
  Clock, 
  PieChart, 
  TrendingUp, 
  Download,
  Filter,
  BarChart2,
  LineChart,
  ArrowUp,
  ArrowDown,
  CheckCircle2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateAnalyticsPDF } from './export_func';

// Mock data for analytics
const topSubjects = [
  { name: 'Mathematics', hours: 24, percentage: 35, color: 'bg-primary-500' },
  { name: 'Computer Science', hours: 18, percentage: 26, color: 'bg-accent-500' },
  { name: 'Physics', hours: 15, percentage: 22, color: 'bg-indigo-500' },
  { name: 'Chemistry', hours: 10, percentage: 14, color: 'bg-amber-500' },
  { name: 'Biology', hours: 3, percentage: 3, color: 'bg-rose-500' },
];

const productivityMetrics = [
  { label: 'Average Focus Time', value: '42 min', change: '+15%', trend: 'up' },
  { label: 'Completion Rate', value: '87%', change: '+5%', trend: 'up' },
  { label: 'Study Efficiency', value: '76%', change: '-3%', trend: 'down' },
  { label: 'Weekly Goal Progress', value: '92%', change: '+12%', trend: 'up' },
];

const weeklyActivity = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 4.0 },
  { day: 'Fri', hours: 3.5 },
  { day: 'Sat', hours: 5.0 },
  { day: 'Sun', hours: 2.0 },
];

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('weekly');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);


  const handleExport = async () => {
    setIsExporting(true);
    try {
      const doc = generateAnalyticsPDF(productivityMetrics, weeklyActivity, topSubjects);
      doc.save(`studysync-report-${Date.now()}.pdf`);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analytics Dashboard</h1>
          <p className="text-text-secondary mt-1">Track and optimize your study performance</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <Button 
              variant="outline" 
              rightIcon={<ChevronDown className="h-4 w-4" />}
            >
              {timeframe === 'weekly' ? 'Weekly' : timeframe === 'monthly' ? 'Monthly' : 'All Time'}
            </Button>
            {/* Dropdown menu would go here */}
          </div>
          <Button 
            variant="glow" 
            onClick={handleExport}
            disabled={isExporting}
            className={isExporting ? 'opacity-75 cursor-not-allowed' : ''}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {productivityMetrics.map((metric, index) => (
          <Card key={index} className="dark-card">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${
                metric.trend === 'up' ? 'bg-accent-500/20' : 'bg-red-500/20'
              } mr-4`}>
                {metric.trend === 'up' ? (
                  <TrendingUp className="text-accent-400" size={20} />
                ) : (
                  <ArrowDown className="text-red-400" size={20} />
                )}
              </div>
              <div>
                <p className="text-text-secondary text-sm">{metric.label}</p>
                <div className="flex items-center">
                  <p className="text-text-primary text-xl font-bold mr-2">{metric.value}</p>
                  <Badge 
                    variant={metric.trend === 'up' ? 'success' : 'destructive'} 
                    className="text-xs px-1.5"
                  >
                    {metric.change}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <Card className="dark-card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-text-primary">Weekly Study Activity</h2>
            <Button variant="ghost" size="sm" leftIcon={<Filter className="h-4 w-4" />}>
              Filter
            </Button>
          </div>
          
          {/* Chart visualization - in a real app, use a chart library */}
          <div className="h-64 mt-4">
            <div className="flex h-full items-end justify-between">
              {weeklyActivity.map((day, i) => (
                <div key={i} className="flex flex-col items-center w-full">
                  <div 
                    className="w-14 bg-primary-500/80 hover:bg-primary-500 transition-colors rounded-t-sm"
                    style={{ height: `${day.hours * 12}%` }}
                  ></div>
                  <div className="mt-2 text-text-secondary text-xs">{day.day}</div>
                  <div className="text-text-secondary text-xs">{day.hours}h</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-text-secondary text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Total: 22 hours</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-accent-400 mr-1" />
              <span>+18% vs. last week</span>
            </div>
          </div>
        </Card>

        {/* Subject Distribution */}
        <Card className="dark-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-text-primary">Subject Distribution</h2>
          </div>
          
          {/* Subject stats */}
          <div className="space-y-4 mt-6">
            {topSubjects.map((subject, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-text-primary text-sm">{subject.name}</span>
                  <span className="text-text-secondary text-xs">{subject.hours} hrs ({subject.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-card-border/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${subject.color} rounded-full`}
                    style={{ width: `${subject.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-card-border">
            <div className="flex justify-between text-text-secondary text-sm">
              <span>Total Study Time</span>
              <span className="text-text-primary font-medium">70 hours</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Study Streak */}
        <Card className="dark-card">
          <h2 className="text-lg font-bold text-text-primary mb-4">Study Streak</h2>
          
          <div className="flex items-center space-x-4">
            <div className="bg-primary-500/20 text-primary-400 rounded-full p-4">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <div className="text-4xl font-bold text-text-primary">14</div>
              <p className="text-text-secondary">days in a row</p>
            </div>
          </div>
          
          {/* Calendar visualization */}
          <div className="mt-6 grid grid-cols-7 gap-1">
            {Array.from({ length: 28 }).map((_, i) => (
              <div 
                key={i} 
                className={`h-8 w-8 rounded-md flex items-center justify-center text-xs ${
                  i < 14 ? 'bg-primary-500/80 text-white' : 
                  i >= 25 ? 'bg-card-border/30 text-text-muted' : 
                  'bg-card-border/50 text-text-secondary'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </Card>
        
        {/* Focus Time */}
        <Card className="dark-card">
          <h2 className="text-lg font-bold text-text-primary mb-4">Focus Distribution</h2>
          
          <div className="flex space-x-2 mb-6">
            <Button 
              variant={timeframe === 'week' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setTimeframe('week')}
            >
              Week
            </Button>
            <Button 
              variant={timeframe === 'month' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setTimeframe('month')}
            >
              Month
            </Button>
            <Button 
              variant={timeframe === 'year' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setTimeframe('year')}
            >
              Year
            </Button>
          </div>
          
          {/* Time distribution donut chart, needs chart implementation */}
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full border-8 border-primary-500/80"></div>
              <div 
                className="absolute rounded-full border-8 border-accent-500/80"
                style={{ 
                  clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)',
                  inset: 0 
                }}
              ></div>
              <div 
                className="absolute rounded-full border-8 border-indigo-500/80"
                style={{ 
                  clipPath: 'polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%)',
                  inset: 0 
                }}
              ></div>
              <div className="absolute inset-4 rounded-full bg-card-bg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-text-primary">42 min</div>
                  <div className="text-xs text-text-secondary">avg. session</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div>
                <span className="text-text-secondary text-sm">Morning</span>
              </div>
              <span className="text-text-primary text-sm">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-accent-500 mr-2"></div>
                <span className="text-text-secondary text-sm">Afternoon</span>
              </div>
              <span className="text-text-primary text-sm">35%</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                <span className="text-text-secondary text-sm">Evening</span>
              </div>
              <span className="text-text-primary text-sm">20%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Export Report Section */}
      <Card className="dark-card bg-gradient-to-r from-primary-900/50 to-card-bg border-primary-800/50">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-bold text-text-primary">Generate Detailed Analytics Report</h2>
            <p className="text-text-secondary text-sm mt-1">
              Export comprehensive study insights for personal review or sharing with tutors
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-primary-700 text-text-primary">
              Schedule Report
            </Button>
            <Button 
                variant="glow" 
                onClick={handleExport}
                disabled={isExporting}
                className={isExporting ? 'opacity-75 cursor-not-allowed' : ''}
              >
                {isExporting ? 'Exporting...' : 'Export Now'}
              </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}


