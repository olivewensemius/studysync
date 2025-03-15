"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Users, PlusCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { fetchStudyGroups } from "@/app/study-groups/actions"; 

export default function DashboardStudyGroups() {
  const [studyGroups, setStudyGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await fetchStudyGroups();
        setStudyGroups(data.myGroups); 
      } catch (err) {
        setError("Failed to load study groups.");
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  return (
    <Card className="dark-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-text-primary">My Study Groups</h2>
        <Link href="/study-groups">
          <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />}>View All</Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-text-secondary">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : studyGroups.length === 0 ? (
        <p className="text-text-secondary">You're not part of any study groups yet.</p>
      ) : (
        <div className="space-y-3">
          {studyGroups.slice(0, 3).map((group) => (
            <div key={group.id} className="p-3 rounded-lg border border-card-border/30 hover:border-primary-500/30 transition-colors">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-text-primary">{group.name}</h3>
                <Badge variant="outline" size="sm">{group.members.length} members</Badge>
              </div>
              <div className="flex items-center mt-2">
                <div className="flex -space-x-2">
                  {Array.from({ length: Math.min(3, group.members.length) }).map((_, i) => (
                    <Avatar key={i} fallback={`M${i + 1}`} size="xs" className="border border-card-bg" />
                  ))}
                </div>
                {group.members.length > 3 && (
                  <span className="text-xs text-text-secondary ml-1">+{group.members.length - 3} more</span>
                )}

              </div>
            </div>
          ))}
          <Link href="/study-groups">
            <Button variant="ghost" className="w-full border border-dashed border-card-border mt-3 py-2" leftIcon={<PlusCircle className="h-4 w-4" />}>Create New Group</Button>
          </Link>
        </div>
      )}
    </Card>
  );
}
