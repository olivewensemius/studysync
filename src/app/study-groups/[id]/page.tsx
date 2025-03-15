"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, X } from 'lucide-react';
import { fetchStudyGroupById, fetchGroupMembers, joinStudyGroup } from './actions';

export default function StudyGroupDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  // Members modal state
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    const loadGroup = async () => {
      setLoading(true);
      try {
        const data = await fetchStudyGroupById(id);
        setGroup(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [id]);

  const handleJoinGroup = async () => {
    setJoining(true);
    setJoinError('');
    try {
      await joinStudyGroup(id);
      setGroup((prevGroup: any) => ({
        ...prevGroup,
        members: [...prevGroup.members, 'currentUserPlaceholder'],
      }));
    } catch (err: any) {
      setJoinError(err.message);
    } finally {
      setJoining(false);
    }
  };

  const handleFetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const membersData = await fetchGroupMembers(id);
      setMembers(membersData);
      setShowMembers(true);
    } catch (err) {
      console.error('Error fetching members:', err);
    } finally {
      setLoadingMembers(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8">Error: {error}</div>;
  if (!group) return <div className="p-8">Group not found.</div>;

  return (
    <div className="p-8 flex justify-center">
      <Card className="p-6 max-w-3xl w-full space-y-4">
        <h1 className="text-2xl font-bold">{group.name}</h1>
        <p className="text-gray-600">{group.description}</p>

        {/* Clickable Badge to View Members */}
        <Badge
          variant="outline"
          className="cursor-pointer hover:bg-gray-200 hover:text-black"
          onClick={handleFetchMembers}
        >
          <Users className="h-4 w-4 mr-1" /> {group.members?.length ?? 0} Members
        </Badge>

        <div className="text-sm text-gray-500">
          Created on: {new Date(group.created_at).toLocaleDateString()}
        </div>

        {joinError && <div className="text-red-500">{joinError}</div>}

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.push('/study-groups')}>
            Back to Groups
          </Button>
          <Button variant="default" onClick={handleJoinGroup} disabled={joining}>
            {joining ? 'Joining...' : 'Join Group'}
          </Button>
        </div>
      </Card>

      {/* Members List Modal */}
      {showMembers && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Group Members</h2>
              <button onClick={() => setShowMembers(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {loadingMembers ? (
              <p>Loading members...</p>
            ) : members.length === 0 ? (
              <p>No members found.</p>
            ) : (
              <ul className="space-y-2">
                {members.map((member) => (
                  <li key={member.id} className="p-2 border rounded-lg flex items-center gap-3">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt={member.display_name} className="h-8 w-8 rounded-full" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                        {member.display_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{member.display_name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
