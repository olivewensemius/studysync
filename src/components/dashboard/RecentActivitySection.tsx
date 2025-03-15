"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, Star, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import { fetchAnalyticsData } from "@/app/analytics/actions";

export default function RecentActivitySection() {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const analyticsData = await fetchAnalyticsData("weekly");
        setActivity(analyticsData.productivityMetrics || []);
      } catch (err) {
        setError("Failed to load recent activity.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  return (
    <Card className="dark-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-text-primary">Recent Activity</h2>
      </div>

      {loading ? (
        <p className="text-text-secondary">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : activity.length === 0 ? (
        <p className="text-text-secondary">No recent activity.</p>
      ) : (
        <div className="space-y-4">
          {activity.map((item, index) => {
            let Icon = BookOpen;
            let iconColor = "text-primary-400";
            let bgColor = "bg-primary-500/20";

            if (item.label === "Completion Rate") {
              Icon = Star;
              iconColor = "text-yellow-400";
              bgColor = "bg-yellow-500/20";
            } else if (item.label === "Study Efficiency") {
              Icon = Users;
              iconColor = "text-accent-400";
              bgColor = "bg-accent-500/20";
            }

            return (
              <div key={index} className="flex items-start">
                <div className={`p-2 rounded-full ${bgColor} mr-3`}>
                  <Icon className={iconColor} size={16} />
                </div>
                <div>
                  <p className="text-text-primary text-sm">
                    {item.label}: <span className="font-medium">{item.value}</span>
                  </p>
                  <p className="text-text-secondary text-xs">
                    {item.change} ({item.trend === "up" ? "📈" : "📉"})
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-card-border">
        <Link href="/analytics">
          <button className="w-full flex justify-between text-text-primary hover:text-primary-500 transition">
            View all analytics
            <ChevronRight className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </Card>
  );
}