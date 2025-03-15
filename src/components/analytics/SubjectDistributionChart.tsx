// src/components/analytics/SubjectDistributionChart.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchSubjectDistribution, type SubjectAnalytics } from '@/app/(protected)/analytics/actions';

// Custom tooltip component for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card-bg p-3 border border-card-border rounded-md shadow-lg">
        <p className="text-text-primary font-medium">{data.name}</p>
        <p className="text-text-primary">{`${data.hours} hours (${data.percentage}%)`}</p>
      </div>
    );
  }
  return null;
};

interface SubjectDistributionChartProps {
  timeframe?: string;
  totalStudyTime?: number;
}

const SubjectDistributionChart: React.FC<SubjectDistributionChartProps> = ({
  timeframe = 'weekly',
  totalStudyTime = 0 
}) => {
  const [subjects, setSubjects] = useState<SubjectAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Chart colors
  const COLORS = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ec4899'];
  
  useEffect(() => {
    const loadSubjectDistribution = async () => {
      try {
        setLoading(true);
        
        // Fetch subject distribution data from the backend
        const data = await fetchSubjectDistribution(timeframe);
        
        // Only use real data if it's available and not empty
        if (data && data.length > 0) {
          setSubjects(data);
        } else {
          console.log("No subject data found, showing empty state");
          setSubjects([]);
        }
        
      } catch (err) {
        console.error("Error loading subject distribution:", err);
        setError("Failed to load subject data");
      } finally {
        setLoading(false);
      }
    };
    
    loadSubjectDistribution();
  }, [timeframe]);
  
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <li key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="text-xs text-text-secondary">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <Card className="dark-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-text-primary">Subject Distribution</h2>
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
      ) : subjects.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-text-secondary text-center">
          <p>No subject data available. Start studying to see data here!</p>
        </div>
      ) : (
        <>
          {/* Pie Chart */}
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjects}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="hours"
                  animationDuration={1000}
                >
                  {subjects.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Subject bars */}
          <div className="space-y-4 mt-6">
            {subjects.map((subject, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-text-primary text-sm">{subject.name}</span>
                  <span className="text-text-secondary text-xs">{subject.hours} hrs ({subject.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-card-border/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${subject.percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-card-border">
            <div className="flex justify-between text-text-secondary text-sm">
              <span>Total Study Time</span>
              <span className="text-text-primary font-medium">{totalStudyTime} hours</span>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default SubjectDistributionChart;