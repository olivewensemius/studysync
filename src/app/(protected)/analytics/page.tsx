// src/app/analytics/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Download,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Loader2,
  TrendingUp
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateAnalyticsPDF } from './export_func';
import { 
  fetchAnalyticsData, 
  type SubjectAnalytics,
  type ProductivityMetric,
  type DailyActivity
} from './actions';

// Import our custom chart components
import WeeklyActivityChart from '@/components/analytics/WeeklyActivityChart';
import SubjectDistributionChart from '@/components/analytics/SubjectDistributionChart';
import FocusDistributionChart from '@/components/analytics/FocusDistributionChart';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for analytics data
  const [topSubjects, setTopSubjects] = useState<SubjectAnalytics[]>([]);
  const [productivityMetrics, setProductivityMetrics] = useState<ProductivityMetric[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<DailyActivity[]>([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [studyStreak, setStudyStreak] = useState(0);

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        
        // Fetch all analytics data for the selected timeframe
        const analyticsData = await fetchAnalyticsData(timeframe);
        
        // Set data only if it exists
        if (analyticsData) {
          // Each property should be checked and set only if valid data exists
          if (analyticsData.topSubjects && analyticsData.topSubjects.length > 0) {
            setTopSubjects(analyticsData.topSubjects);
          }
          
          if (analyticsData.productivityMetrics && analyticsData.productivityMetrics.length > 0) {
            setProductivityMetrics(analyticsData.productivityMetrics);
          }
          
          if (analyticsData.weeklyActivity && analyticsData.weeklyActivity.length > 0) {
            setWeeklyActivity(analyticsData.weeklyActivity);
          }
          
          // Numeric values
          setTotalStudyTime(analyticsData.totalStudyTime || 0);
          setWeeklyProgress(analyticsData.weeklyProgress || 0);
          setStudyStreak(analyticsData.studyStreak || 0);
        }
        
      } catch (err) {
        console.error("Error loading analytics:", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalytics();
  }, [timeframe]);

  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-400 mx-auto mb-4" />
          <p className="text-text-secondary">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 max-w-xl mx-auto mt-8">
        <h2 className="text-lg font-bold mb-2">Error</h2>
        <p>{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

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
              className="flex items-center"
              onClick={() => {
                // Toggle between timeframes
                const nextTimeframe = 
                  timeframe === 'weekly' ? 'monthly' : 
                  timeframe === 'monthly' ? 'yearly' : 'weekly';
                handleTimeframeChange(nextTimeframe);
              }}
            >
              {timeframe === 'weekly' ? 'Weekly' : 
               timeframe === 'monthly' ? 'Monthly' : 'All Time'}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
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
        {productivityMetrics.length > 0 ? (
          productivityMetrics.map((metric, index) => (
            <Card key={index} className="dark-card p-4">
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
          ))
        ) : (
          // Show placeholder cards when no metrics are available
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="dark-card p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-card-border/50 mr-4">
                  <TrendingUp className="text-text-secondary opacity-30" size={20} />
                </div>
                <div>
                  <p className="text-text-secondary text-sm">No data available</p>
                  <p className="text-text-primary text-xl font-bold opacity-30">-</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart - Using our new component */}
        <WeeklyActivityChart timeframe={timeframe} />

        {/* Subject Distribution - Using our new component */}
        <SubjectDistributionChart 
          timeframe={timeframe}
          totalStudyTime={totalStudyTime}
        />
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Study Streak */}
        <Card className="dark-card p-6">
          <h2 className="text-lg font-bold text-text-primary mb-4">Study Streak</h2>
          
          {studyStreak > 0 ? (
            <>
              <div className="flex items-center space-x-4">
                <div className="bg-primary-500/20 text-primary-400 rounded-full p-4">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <div className="text-4xl font-bold text-text-primary">{studyStreak}</div>
                  <p className="text-text-secondary">days in a row</p>
                </div>
              </div>
              
              {/* Calendar visualization */}
              <div className="mt-6 grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-8 w-8 rounded-md flex items-center justify-center text-xs ${
                      i < studyStreak ? 'bg-primary-500/80 text-white' : 
                      i >= 25 ? 'bg-card-border/30 text-text-muted' : 
                      'bg-card-border/50 text-text-secondary'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="bg-card-border/30 text-text-secondary rounded-full p-4 mb-3">
                <CheckCircle2 size={32} />
              </div>
              <p className="text-text-secondary mb-2">No study streak data available</p>
              <p className="text-text-secondary text-sm">
                Start studying daily to build your streak!
              </p>
            </div>
          )}
        </Card>
        
        {/* Focus Time - Using our new component */}
        <FocusDistributionChart timeframe={timeframe} />
      </div>

      {/* Export Report Section */}
      <Card className="dark-card bg-gradient-to-r from-primary-900/50 to-card-bg border-primary-800/50 p-6">
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