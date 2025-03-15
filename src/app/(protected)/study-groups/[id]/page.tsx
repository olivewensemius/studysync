"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Users, X, Edit3, ArrowLeft } from "lucide-react";
import { fetchStudyGroupById, fetchGroupMembers, joinStudyGroup, leaveStudyGroup } from "./actions";

export default function StudyGroupDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [leaveError, setLeaveError] = useState("");

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
    setJoinError("");
    try {
      await joinStudyGroup(id);
      setGroup((prevGroup: any) => ({
        ...prevGroup,
        isMember: true,
        members: [...prevGroup.members, "currentUserPlaceholder"],
      }));
    } catch (err: any) {
      setJoinError(err.message);
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveGroup = async () => {
    setLeaving(true);
    setLeaveError("");
    try {
      await leaveStudyGroup(id);
      setGroup((prevGroup: any) => ({
        ...prevGroup,
        isMember: false,
        members: prevGroup.members.filter((memberId: string) => memberId !== "currentUserPlaceholder"),
      }));
    } catch (err: any) {
      setLeaveError(err.message);
    } finally {
      setLeaving(false);
    }
  };

  const handleFetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const membersData = await fetchGroupMembers(id);
      setMembers(membersData);
      setShowMembers(true);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoadingMembers(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8">Error: {error}</div>;
  if (!group) return <div className="p-8">Group not found.</div>;

  return (
    <div className="p-8 flex justify-center">
      <Card className="p-6 max-w-3xl w-full space-y-6 shadow-lg border border-card-border">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-text-primary">{group.name}</h1>
          {group.isCreator && (
            <Button variant="outline" leftIcon={<Edit3 className="h-4 w-4" />} onClick={() => router.push(`/study-groups/${group.id}/edit`)}>
              Edit
            </Button>
          )}
        </div>

        <p className="text-text-secondary">{group.description}</p>

        <Badge
          variant="outline"
          className="cursor-pointer hover:bg-primary-500/20 hover:text-primary-500"
          onClick={handleFetchMembers}
        >
          <Users className="h-4 w-4 mr-1" /> {group.members?.length ?? 0} Members
        </Badge>

        <div className="text-sm text-text-secondary">
          Created on: {new Date(group.created_at).toLocaleDateString()}
        </div>

        {joinError && <div className="text-red-500">{joinError}</div>}
        {leaveError && <div className="text-red-500">{leaveError}</div>}

        <div className="flex justify-between gap-2">
          <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => router.push("/study-groups")}>Back to Groups</Button>
          {group.isMember ? (
            <Button variant="destructive" onClick={handleLeaveGroup} disabled={leaving}>
              {leaving ? "Leaving..." : "Leave Group"}
            </Button>
          ) : (
            <Button variant="default" onClick={handleJoinGroup} disabled={joining}>
              {joining ? "Joining..." : "Join Group"}
            </Button>
          )}
        </div>
      </Card>

      {showMembers && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-card-bg p-6 rounded-lg max-w-md w-full shadow-lg border border-card-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-text-primary">Group Members</h2>
              <button onClick={() => setShowMembers(false)} className="text-text-secondary hover:text-text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>
            {loadingMembers ? (
              <p>Loading members...</p>
            ) : members.length === 0 ? (
              <p>No members found.</p>
            ) : (
              <ul className="space-y-2">
                {members.map(member => (
                  <li key={member.id} className="p-2 border border-card-border rounded-lg flex items-center gap-3">
                    <Avatar fallback={member.display_name.charAt(0)} size="sm" className="border border-card-bg" />
                    <div>
                      <p className="font-semibold text-text-primary">{member.display_name}</p>
                      <p className="text-sm text-text-secondary">{member.email}</p>
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
