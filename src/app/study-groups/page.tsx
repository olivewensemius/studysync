// src/app/study-groups/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, PlusCircle, Expand, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { fetchStudyGroups } from './actions';

export default function StudyGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      try {
        const data = await fetchStudyGroups();
        console.log("Fetched groups:", data); 
        setGroups(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGroups();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8">Error: {error}</div>;

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Study Groups</h1>
        <Button variant="default" onClick={() => router.push('/study-groups/create')}>
          <PlusCircle className="h-5 w-5 mr-2" /> Create Group
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center text-gray-500">There are no study groups at the moment</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} className="p-4 dark-card">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{group.name}</h2>
                <Badge variant="outline">
                  <Users className="h-4 w-4 mr-1" /> {group.members.length} Members {/* Update when schema for study groups is updated to include members*/}
                </Badge>
              </div>

              <p className="text-sm text-gray-500">{group.description}</p>

              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => router.push(`/study-groups/${group.id}`)}>
                  <Expand className="h-4 w-4" /> 
                </Button>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
