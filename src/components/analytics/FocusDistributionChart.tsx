// src/components/analytics/FocusDistributionChart.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchFocusDistribution, type FocusDistribution } from '@/app/analytics/actions';

interface FocusDistributionChartProps {
  timeframe?: string;
}

const FocusDistributionChart: React.FC<FocusDistributionChartProps> = ({
  timeframe = 'weekly'
}) => {
  const [focusData, setFocusData] = useState<{
    distribution: FocusDistribution[];
    averageFocusTime: number;
  }>({
    distribution: [],
    averageFocusTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTimeframe, setActiveTimeframe] = useState(timeframe);
  
  // Chart colors
  const COLORS = ['#3b82f6', '#10b981', '#6366f1'];
  
  useEffect(() => {
    const loadFocusDistribution = async () => {
      try {
        setLoading(true);
        
        // Fetch focus distribution data from the backend
        const data = await fetchFocusDistribution(activeTimeframe);
        
        // Check if distribution data exists and isn't empty
        if (data && data.distribution && data.distribution.length > 0) {
          setFocusData(data);
        } else {
          console.log("No focus distribution data found, using empty state");
          setFocusData({
            distribution: [],
            averageFocusTime: 0
          });
        }
        
      } catch (err) {
        console.error("Error loading focus distribution:", err);
        setError("Failed to load focus data");
      } finally {
        setLoading(false);
      }
    };
    
    loadFocusDistribution();
  }, [activeTimeframe]);
  
  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card-bg p-3 border border-card-border rounded-md shadow-lg">
          <p className="text-text-primary font-medium">{data.period}</p>
          <p className="text-text-primary">{`${data.percentage}% of study time`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="dark-card">
      <h2 className="text-lg font-bold text-text-primary mb-4">Focus Distribution</h2>
      
      <div className="flex space-x-2 mb-6">
        <Button 
          variant={activeTimeframe === 'weekly' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setActiveTimeframe('weekly')}
        >
          Week
        </Button>
        <Button 
          variant={activeTimeframe === 'monthly' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setActiveTimeframe('monthly')}
        >
          Month
        </Button>
        <Button 
          variant={activeTimeframe === 'yearly' ? 'default' : 'ghost'} 
          size="sm"
          onClick={() => setActiveTimeframe('yearly')}
        >
          Year
        </Button>
      </div>
      
      {loading ? (
        <div className="h-40 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
        </div>
      ) : error ? (
        <div className="h-40 flex items-center justify-center text-red-400 text-center">
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
        <>
          {/* Donut chart */}
          <div className="flex items-center justify-center">
            <div className="h-40 w-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={focusData.distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={50}
                    dataKey="percentage"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {focusData.distribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Center text - average focus time */}
          <div className="flex justify-center mt-4">
            <div className="text-center">
              <p className="text-xl font-bold text-text-primary">{focusData.averageFocusTime} min</p>
              <p className="text-xs text-text-secondary">avg. session</p>
            </div>
          </div>
          
          {/* Distribution legend */}
          <div className="mt-6 space-y-2">
            {focusData.distribution.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-text-secondary text-sm">{item.period}</span>
                </div>
                <span className="text-text-primary text-sm">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default FocusDistributionChart;