"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function DashboardHeader() {
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser({ name: user.user_metadata?.full_name || "User" });
      }
    };
    fetchUser();
  }, []);

  // Get current date for greeting
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good evening";
  }

  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{greeting}, {user?.name || "Guest"}</h1>
        <p className="text-text-secondary mt-1">Here's your study overview for today</p>
      </div>
      <Button variant="outline" leftIcon={<Calendar className="h-4 w-4" />}>
        {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
      </Button>
    </div>
  );
}