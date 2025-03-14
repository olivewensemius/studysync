"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createStudyGroup } from './actions';

export default function CreateStudyGroup() {
  const router = useRouter();

  /**
   * TEMPORARY AUTH PLACEHOLDER
   * This implementation will need to be updated to handle 
   * user authentication and take in the id of the logged in user. 
   */
  const user = { id: '0348f75d-7a61-4b5e-ba79-f26b0f03ac48' }; 
  const authLoading = false; 

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleCreateGroup = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      await createStudyGroup({ name, description, created_by: user.id });
      router.push('/study-groups');
    } catch (err: any) {
      setError(err.message);
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
