"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, PlusCircle, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { fetchStudySessions } from "@/app/study-session/actions"; 

export default function StudySessionsSection() {
  const [studySessions, setStudySessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStudySessions = async () => {
      try {
        const data = await fetchStudySessions();
        setStudySessions(data);
      } catch (err) {
        setError("Failed to load study sessions.");
      } finally {
        setLoading(false);
      }
    };
    loadStudySessions();
  }, []);

  return (
    <Card className="dark-card lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-text-primary">Upcoming Study Sessions</h2>
        <Link href="/study-session">
          <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>View All</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-text-secondary">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : studySessions.length === 0 ? (
        <p className="text-text-secondary">No upcoming study sessions.</p>
      ) : (
        <div className="space-y-3">
          {studySessions.slice(0, 3).map((session) => {
            const sessionDate = new Date(session.date);
            const formattedDate = sessionDate.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            });
            const formattedTime = sessionDate.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true
            });
            return (
              <div key={session.id} className="p-3 rounded-lg border border-card-border/30 hover:border-primary-500/30 transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-text-primary">{session.title}</h3>
                  <Badge variant="primary" size="sm">{session.subject}</Badge>
                </div>
                <div className="flex items-center mt-1 text-text-secondary text-sm">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span>{formattedDate} at {formattedTime}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  <span>{session.duration} mins</span>
                </div>
                <div className="flex items-center mt-2">
                  <Link href={`/study-session/${session.id}`} className="ml-auto">
                    <Button variant="outline" size="sm">Details</Button>
                  </Link>
                </div>
              </div>
            );
          })}
          <Link href="/study-session/create">
            <Button variant="ghost" className="w-full border border-dashed border-card-border mt-3 py-2" leftIcon={<PlusCircle className="h-4 w-4" />}>Schedule New Session</Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
