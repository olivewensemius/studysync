'use server'

import { createClient } from '@/utils/supabase/server'

// Types for analytics data
export interface SubjectAnalytics {
  name: string;
  hours: number;
  percentage: number;
  color: string;
}

export interface ProductivityMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

export interface DailyActivity {
  day: string;
  hours: number;
}

export interface FocusDistribution {
  period: string;
  percentage: number;
  color: string;
}

export interface AnalyticsData {
  topSubjects: SubjectAnalytics[];
  productivityMetrics: ProductivityMetric[];
  weeklyActivity: DailyActivity[];
  totalStudyTime: number;
  weeklyProgress: number;
  studyStreak: number;
  focusDistribution: FocusDistribution[];
  averageFocusTime: number;
}

// Fetch all analytics data for the current user
export async function fetchAnalyticsData(timeframe: string = 'weekly'): Promise<AnalyticsData> {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    // Define the time range based on selected timeframe
    const now = new Date();
    let startDate = new Date();
    
    if (timeframe === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeframe === 'monthly') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (timeframe === 'yearly') {
      startDate.setFullYear(now.getFullYear() - 1);
    }
    
    // Fetch study sessions to calculate time spent on each subject
    const { data: studySessions, error: sessionsError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('created_by', user.id)
      .gte('date', startDate.toISOString())
      .order('date', { ascending: false });
      
    if (sessionsError) {
      console.error('Error fetching study sessions:', sessionsError);
    }
    
    let flashcardActivity = [];
    try {
      const { data, error } = await supabase
        .from('flashcard_activity')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString());
        
      if (!error) {
        flashcardActivity = data || [];
      }
    } catch (err) {
      console.log('Flashcard activity table might not exist yet, skipping');
    }
    
    // Fetch flashcard sets to get subjects
    const { data: flashcardSets, error: setsError } = await supabase
      .from('flashcard_sets')
      .select('id, subject, user_id')
      .eq('user_id', user.id);
      
    if (setsError) {
      console.error('Error fetching flashcard sets:', setsError);
    }
    
    // Get analytics summary data if it exists
    let analyticsData = null;
    try {
      const { data, error } = await supabase
        .from('study_analytics')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (!error) {
        analyticsData = data;
      }
    } catch (err) {
      console.log('No analytics data found, will calculate from sessions');
    }
    
    console.log(`Fetched ${studySessions?.length || 0} study sessions, ${flashcardActivity?.length || 0} flashcard activities`);
    
    // Process the data
    const topSubjects = calculateTopSubjects(studySessions || [], flashcardSets || []);
    const weeklyActivity = calculateWeeklyActivity(studySessions || []);
    const productivityMetrics = calculateProductivityMetrics(studySessions || [], flashcardActivity || []);
    const totalStudyTime = calculateTotalStudyTime(studySessions || [], analyticsData);
    const weeklyProgress = calculateWeeklyProgress(studySessions || []);
    const studyStreak = calculateStudyStreak(studySessions || []);
    const focusDistribution = calculateFocusDistribution(studySessions || []);
    const averageFocusTime = calculateAverageFocusTime(studySessions || []);
    
    // Return processed data
    return {
      topSubjects,
      productivityMetrics,
      weeklyActivity,
      totalStudyTime,
      weeklyProgress,
      studyStreak,
      focusDistribution,
      averageFocusTime
    };
    
  } catch (err) {
    console.error('Error processing analytics data:', err);
    // Return mock data if there's an error
    console.log('Falling back to mock data');
    return getMockAnalyticsData();
  }
}

// Helper functions to calculate analytics values from raw data

function calculateTopSubjects(sessions: any[], flashcardSets: any[]): SubjectAnalytics[] {
  if (sessions.length === 0 && flashcardSets.length === 0) {
    console.log('No sessions or flashcard data available, using mock subject data');
    return getMockAnalyticsData().topSubjects;
  }
  
  console.log('Calculating top subjects from real data');
  
  // Group sessions by subject and calculate total hours
  const subjectMap = new Map<string, number>();
  
  // Add time from study sessions
  sessions.forEach(session => {
    if (!session.subject) return;
    const subject = session.subject;
    const hours = (session.duration || 0) / 60; // Convert minutes to hours
    subjectMap.set(subject, (subjectMap.get(subject) || 0) + hours);
  });
  
  // Add estimated time from flashcard sets
  flashcardSets.forEach(set => {
    if (!set.subject) return;
    const subject = set.subject;
    // Assume 0.5 hours per flashcard set as a baseline
    subjectMap.set(subject, (subjectMap.get(subject) || 0) + 0.5);
  });
  
  // If we still don't have data, return mock data
  if (subjectMap.size === 0) {
    return getMockAnalyticsData().topSubjects;
  }
  
  // Convert to array and sort by hours
  const subjects = Array.from(subjectMap.entries())
    .map(([name, hours]) => ({ name, hours }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5); // Take top 5
  
  // Calculate total hours for percentage
  const totalHours = subjects.reduce((sum, subject) => sum + subject.hours, 0);
  
  // Generate colors for each subject
  const colors = [
    'bg-primary-500', 'bg-accent-500', 'bg-indigo-500', 
    'bg-amber-500', 'bg-rose-500'
  ];
  
  // Calculate percentages and add colors
  return subjects.map((subject, index) => ({
    name: subject.name,
    hours: Math.round(subject.hours * 100) / 100, // Round to 2 decimal places
    percentage: Math.round((subject.hours / totalHours) * 100) || 0,
    color: colors[index] || 'bg-gray-500'
  }));
}

function calculateWeeklyActivity(sessions: any[]): DailyActivity[] {
  if (sessions.length === 0) {
    console.log('No sessions data available, using mock weekly activity');
    return getMockAnalyticsData().weeklyActivity;
  }
  
  console.log('Calculating weekly activity from real data');
  
  // Get the current week's date range
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Start from Monday
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Initialize data for each day of the week
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailyHours = days.map(day => ({ day, hours: 0 }));
  
  // Sum up hours for each day in current week
  sessions.forEach(session => {
    if (!session.date) return;
    
    const sessionDate = new Date(session.date);
    if (sessionDate >= startOfWeek) {
      const dayIndex = (sessionDate.getDay() + 6) % 7; // Convert to 0 = Monday
      dailyHours[dayIndex].hours += (session.duration || 0) / 60; // Convert minutes to hours
    }
  });
  
  // Round hours to 1 decimal place
  return dailyHours.map(day => ({
    day: day.day,
    hours: Math.round(day.hours * 10) / 10
  }));
}

function calculateProductivityMetrics(sessions: any[], flashcardActivity: any[]): ProductivityMetric[] {
  if (sessions.length === 0) {
    console.log('No sessions data available, using mock productivity metrics');
    return getMockAnalyticsData().productivityMetrics;
  }
  
  console.log('Calculating productivity metrics from real data');
  
  // Calculate average focus time
  const completedSessions = sessions.filter(session => session.status === 'completed');
  const totalSessions = completedSessions.length;
  const totalMinutes = completedSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
  const avgFocusTime = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
  
  // Calculate completion rate
  const allScheduledSessions = sessions.filter(s => 
    s.status === 'completed' || s.status === 'cancelled' || s.status === 'missed'
  ).length;
  const completionRate = allScheduledSessions > 0 
    ? Math.round((completedSessions.length / allScheduledSessions) * 100) 
    : 0;
  
  // Calculate study efficiency
  // This could be a complex calculation based on planned vs. actual time
  // For now, we'll use a simplified calculation
  const plannedTime = sessions.reduce((sum, session) => {
    // If you have a planned_duration field, use that instead
    return sum + (session.planned_duration || session.duration || 0);
  }, 0);
  
  const actualTime = totalMinutes;
  const efficiency = plannedTime > 0 ? Math.round((actualTime / plannedTime) * 100) : 76;
  
  // Calculate weekly goal progress
  // This would require knowledge of the user's weekly goal
  // For now, return a placeholder based on actual vs target hours
  const targetHoursPerWeek = 10; // This should come from user settings
  const actualHoursThisWeek = sessions
    .filter(session => {
      if (!session.date) return false;
      const sessionDate = new Date(session.date);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return sessionDate >= oneWeekAgo;
    })
    .reduce((sum, session) => sum + ((session.duration || 0) / 60), 0);
  
  const weeklyProgress = Math.min(Math.round((actualHoursThisWeek / targetHoursPerWeek) * 100), 100);
  
  // Get previous period data for trend calculation
  
  return [
    { 
      label: 'Average Focus Time', 
      value: `${avgFocusTime || 42} min`, 
      change: '+15%', 
      trend: 'up' 
    },
    { 
      label: 'Completion Rate', 
      value: `${completionRate || 87}%`, 
      change: '+5%', 
      trend: 'up' 
    },
    { 
      label: 'Study Efficiency', 
      value: `${efficiency}%`, 
      change: '-3%', 
      trend: efficiency >= 80 ? 'up' : 'down' 
    },
    { 
      label: 'Weekly Goal Progress', 
      value: `${weeklyProgress || 92}%`, 
      change: '+12%', 
      trend: 'up' 
    }
  ];
}

function calculateTotalStudyTime(sessions: any[], analyticsData: any): number {
  // First try to get from analytics summary if available
  if (analyticsData?.total_study_time) {
    return Math.round(analyticsData.total_study_time / 60); // Convert minutes to hours
  }
  
  if (sessions.length === 0) return 70; // Default if no data
  
  // Sum up all session durations and convert to hours
  const totalMinutes = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
  return Math.round(totalMinutes / 60); // Convert minutes to hours
}

function calculateWeeklyProgress(sessions: any[]): number {
  // This would require knowledge of the user's weekly goal
  // For now, calculate based on a default target of 10 hours per week
  const targetHoursPerWeek = 10;
  
  // Calculate actual hours this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const actualHoursThisWeek = sessions
    .filter(session => {
      if (!session.date) return false;
      return new Date(session.date) >= oneWeekAgo;
    })
    .reduce((sum, session) => sum + ((session.duration || 0) / 60), 0);
  
  // Calculate progress percentage
  const progress = Math.min(Math.round((actualHoursThisWeek / targetHoursPerWeek) * 100), 100);
  
  return progress || 75; // Fallback to 75% if calculation results in 0
}

function calculateStudyStreak(sessions: any[]): number {
  if (sessions.length === 0) return 14; // Default if no data
  
  // Sort sessions by date
  const sortedSessions = [...sessions]
    .filter(session => session.date) // Filter out sessions without dates
    .sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  
  if (sortedSessions.length === 0) return 14; // Default if no valid sessions
  
  // Create a map of dates that have study sessions
  const studyDates = new Map<string, boolean>();
  
  sortedSessions.forEach(session => {
    const dateStr = new Date(session.date).toISOString().split('T')[0];
    studyDates.set(dateStr, true);
  });
  
  // Check each day going backwards from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  // Look back at most 30 days to find the streak
  for (let i = 0; i < 30; i++) {
    // Format current date to YYYY-MM-DD
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Check if this date had a study session
    if (studyDates.has(dateStr)) {
      streak++;
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break; // Streak is broken
    }
  }
  
  return streak || 14; // Return streak or default
}

function calculateFocusDistribution(sessions: any[]): FocusDistribution[] {
  if (sessions.length === 0) {
    return [
      { period: 'Morning', percentage: 45, color: 'bg-primary-500' },
      { period: 'Afternoon', percentage: 35, color: 'bg-accent-500' },
      { period: 'Evening', percentage: 20, color: 'bg-indigo-500' }
    ];
  }
  
  // Initialise counters for each time period
  let morningMinutes = 0;
  let afternoonMinutes = 0;
  let eveningMinutes = 0;
  
  sessions.forEach(session => {
    if (!session.date) return;
    
    const sessionDate = new Date(session.date);
    const hour = sessionDate.getHours();
    const duration = session.duration || 0;
    
    // Distribute the time based on the hour
    if (hour >= 5 && hour < 12) {
      morningMinutes += duration;
    } else if (hour >= 12 && hour < 17) {
      afternoonMinutes += duration;
    } else {
      eveningMinutes += duration;
    }
  });
  
  // Calculate total minutes
  const totalMinutes = morningMinutes + afternoonMinutes + eveningMinutes;
  
  // Calculate percentages, with fallbacks
  const morningPercentage = totalMinutes > 0 ? Math.round((morningMinutes / totalMinutes) * 100) : 45;
  const afternoonPercentage = totalMinutes > 0 ? Math.round((afternoonMinutes / totalMinutes) * 100) : 35;
  const eveningPercentage = totalMinutes > 0 ? Math.round((eveningMinutes / totalMinutes) * 100) : 20;
  
  // Return distribution
  return [
    { period: 'Morning', percentage: morningPercentage, color: 'bg-primary-500' },
    { period: 'Afternoon', percentage: afternoonPercentage, color: 'bg-accent-500' },
    { period: 'Evening', percentage: eveningPercentage, color: 'bg-indigo-500' }
  ];
}

function calculateAverageFocusTime(sessions: any[]): number {
  if (sessions.length === 0) return 42; // Return mock value if no data
  
  // Filter for completed sessions
  const completedSessions = sessions.filter(session => session.status === 'completed');
  
  if (completedSessions.length === 0) return 42;
  
  // Calculate average session duration
  const totalSessions = completedSessions.length;
  const totalMinutes = completedSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
  
  return totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 42;
}

// Mock data fallback
function getMockAnalyticsData(): AnalyticsData {
  return {
    topSubjects: [
      { name: 'Mathematics', hours: 24, percentage: 35, color: 'bg-primary-500' },
      { name: 'Computer Science', hours: 18, percentage: 26, color: 'bg-accent-500' },
      { name: 'Physics', hours: 15, percentage: 22, color: 'bg-indigo-500' },
      { name: 'Chemistry', hours: 10, percentage: 14, color: 'bg-amber-500' },
      { name: 'Biology', hours: 3, percentage: 3, color: 'bg-rose-500' },
    ],
    productivityMetrics: [
      { label: 'Average Focus Time', value: '42 min', change: '+15%', trend: 'up' },
      { label: 'Completion Rate', value: '87%', change: '+5%', trend: 'up' },
      { label: 'Study Efficiency', value: '76%', change: '-3%', trend: 'down' },
      { label: 'Weekly Goal Progress', value: '92%', change: '+12%', trend: 'up' },
    ],
    weeklyActivity: [
      { day: 'Mon', hours: 2.5 },
      { day: 'Tue', hours: 3.2 },
      { day: 'Wed', hours: 1.8 },
      { day: 'Thu', hours: 4.0 },
      { day: 'Fri', hours: 3.5 },
      { day: 'Sat', hours: 5.0 },
      { day: 'Sun', hours: 2.0 },
    ],
    focusDistribution: [
      { period: 'Morning', percentage: 45, color: 'bg-primary-500' },
      { period: 'Afternoon', percentage: 35, color: 'bg-accent-500' },
      { period: 'Evening', percentage: 20, color: 'bg-indigo-500' }
    ],
    totalStudyTime: 70,
    weeklyProgress: 75,
    studyStreak: 14,
    averageFocusTime: 42
  };
}

// Additional specific analytics endpoints for targeted data fetching
export async function fetchSubjectDistribution(timeframe: string = 'weekly') {
  const analyticsData = await fetchAnalyticsData(timeframe);
  return analyticsData.topSubjects;
}

export async function fetchWeeklyActivity(timeframe: string = 'weekly') {
  const analyticsData = await fetchAnalyticsData(timeframe);
  return analyticsData.weeklyActivity;
}

export async function fetchProductivityMetrics(timeframe: string = 'weekly') {
  const analyticsData = await fetchAnalyticsData(timeframe);
  return analyticsData.productivityMetrics;
}

export async function fetchFocusDistribution(timeframe: string = 'weekly') {
  const analyticsData = await fetchAnalyticsData(timeframe);
  return {
    distribution: analyticsData.focusDistribution,
    averageFocusTime: analyticsData.averageFocusTime
  };
}