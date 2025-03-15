"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Star, Clock, BarChart3, Users } from "lucide-react";
import { fetchAnalyticsData } from "@/app/(protected)/analytics/actions";

export default function StatsCardsSection() {
  const [stats, setStats] = useState({
    studyStreak: 0,
    totalStudyTime: 0,
    weeklyProgress: 0,
    studyGroups: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const analyticsData = await fetchAnalyticsData("weekly");
        setStats({
          studyStreak: analyticsData.studyStreak || 0,
          totalStudyTime: analyticsData.totalStudyTime || 0,
          weeklyProgress: analyticsData.weeklyProgress || 0,
          studyGroups: analyticsData.topSubjects.length || 0,
        });
      } catch (err) {
        setError("Failed to load stats.");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {loading ? (
        <p className="text-text-secondary">Loading stats...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <Card className="dark-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-500/20 mr-4">
                <Star className="text-primary-400" size={20} />
              </div>
              <div>
                <p className="text-text-secondary text-sm">Study Streak</p>
                <p className="text-text-primary text-xl font-bold">{stats.studyStreak} days</p>
              </div>
            </div>
          </Card>

          <Card className="dark-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-500/20 mr-4">
                <Clock className="text-primary-400" size={20} />
              </div>
              <div>
                <p className="text-text-secondary text-sm">Total Study Time</p>
                <p className="text-text-primary text-xl font-bold">{stats.totalStudyTime} hours</p>
              </div>
            </div>
          </Card>

          <Card className="dark-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-500/20 mr-4">
                <BarChart3 className="text-primary-400" size={20} />
              </div>
              <div>
                <p className="text-text-secondary text-sm">Weekly Goal</p>
                <div className="flex items-center">
                  <p className="text-text-primary text-xl font-bold mr-2">{stats.weeklyProgress}%</p>
                  <div className="w-20 h-2 bg-card-border/50 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${stats.weeklyProgress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="dark-card">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-500/20 mr-4">
                <Users className="text-primary-400" size={20} />
              </div>
              <div>
                <p className="text-text-secondary text-sm">Study Groups</p>
                <p className="text-text-primary text-xl font-bold">{stats.studyGroups} active</p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
