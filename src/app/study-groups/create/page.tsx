// src/app/study-groups/create/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createStudyGroup } from './actions';

export default function CreateStudyGroup() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateGroup = async () => {
    setLoading(true);
    try {
      await createStudyGroup({ name, description });
      router.push('/study-groups');
    } catch (err: any) {
      if (err.message.includes('logged in')) {
        router.push('/login'); // clearly redirect if no authenticated user
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex justify-center">
      <Card className="p-6 max-w-xl w-full space-y-4">
        <h1 className="text-xl font-bold">Create New Study Group</h1>

        <Input
          placeholder="Group Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          className="w-full px-3 py-2 border rounded-md text-sm"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {error && <div className="text-red-500">{error}</div>}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.push('/study-groups')}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleCreateGroup} disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
