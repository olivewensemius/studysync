// src/components/analytics/WeeklyActivityChart.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp, Filter, Loader2 } from 'lucide-react';
import { fetchWeeklyActivity, type DailyActivity } from '@/app/analytics/actions';

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card-bg p-3 border border-card-border rounded-md shadow-lg">
        <p className="text-text-primary font-medium">{label}</p>
        <p className="text-primary-400">{`${payload[0].value} hours`}</p>
      </div>
    );
  }
  return null;
};

interface WeeklyActivityChartProps {
  timeframe?: string;
}

const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({ 
  timeframe = 'weekly'
}) => {
  const [weeklyActivity, setWeeklyActivity] = useState<DailyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadWeeklyActivity = async () => {
      try {
        setLoading(true);
        
        // Fetch weekly activity data from backend
        const data = await fetchWeeklyActivity(timeframe);
        
        // Only use real data if it's available and not empty
        if (data && data.length > 0) {
          setWeeklyActivity(data);
        } else {
          // Fallback to mock data only if no real data exists
          setWeeklyActivity([
            { day: 'Mon', hours: 2.5 },
            { day: 'Tue', hours: 3.2 },
            { day: 'Wed', hours: 1.8 },
            { day: 'Thu', hours: 4.0 },
            { day: 'Fri', hours: 3.5 },
            { day: 'Sat', hours: 5.0 },
            { day: 'Sun', hours: 2.0 },
          ]);
        }
        
      } catch (err) {
        console.error("Error loading weekly activity:", err);
        setError("Failed to load activity data");
      } finally {
        setLoading(false);
      }
    };
    
    loadWeeklyActivity();
  }, [timeframe]);
  
  // Calculate total hours
  const totalHours = weeklyActivity.reduce((sum, day) => sum + day.hours, 0).toFixed(1);
  
  return (
    <Card className="dark-card lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-text-primary">Weekly Study Activity</h2>
        <Button variant="ghost" size="sm" className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center text-red-400 text-center">
          <div>
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm"
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyActivity}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#a0a0a0' }}
              />
              <YAxis 
                tick={{ fill: '#a0a0a0' }}
                tickFormatter={(value) => `${value}h`}
                domain={[0, 'dataMax + 1']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="hours" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]}
                barSize={36}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <div className="mt-4 flex items-center justify-between text-text-secondary text-sm">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>Total: {totalHours} hours</span>
        </div>
        <div className="flex items-center">
          <TrendingUp className="h-4 w-4 text-accent-400 mr-1" />
          <span>+18% vs. last week</span>
        </div>
      </div>
    </Card>
  );
};

export default WeeklyActivityChart;