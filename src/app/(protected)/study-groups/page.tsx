"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Users, PlusCircle, ChevronRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchStudyGroups, deleteStudyGroup } from "./actions";

export default function StudyGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<{ allGroups: any[]; myGroups: any[]; createdGroups: any[]; userId: string | null }>({ allGroups: [], myGroups: [], createdGroups: [], userId: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadGroups = async () => {
      setLoading(true);
      try {
        const data = await fetchStudyGroups();
        setGroups(data);
      } catch (err) {
        setError("Failed to load study groups.");
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8">Error: {error}</div>;

  const filteredGroups = groups.allGroups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Study Groups</h1>
        <Button variant="outline" leftIcon={<PlusCircle className="h-5 w-5" />} onClick={() => router.push("/study-groups/create")}>Create Group</Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 text-text-secondary" size={18} />
        <input
          type="text"
          placeholder="Search groups..."
          className="pl-10 pr-4 py-2 border border-card-border rounded-md w-full bg-card-bg text-text-primary focus:ring-2 focus:ring-primary-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <GroupSection title="My Groups" groups={groups.myGroups} router={router} showDelete={false} userId={groups.userId} />
      <GroupSection title="Groups You Created" groups={groups.createdGroups} router={router} showDelete={true} userId={groups.userId} />
      <GroupSection title="Find a Group" groups={filteredGroups} router={router} showDelete={false} userId={groups.userId} />
    </div>
  );
}

const GroupSection: React.FC<{ title: string; groups: any[]; router: any; showDelete: boolean; userId: string | null }> = ({ title, groups, router, showDelete, userId }) => (
  <Card className="dark-card mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold text-text-primary">{title}</h2>
    </div>
    {groups.length === 0 ? (
      <p className="text-text-secondary">No groups found.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <GroupCard key={group.id} group={group} router={router} showDelete={showDelete} userId={userId} />
        ))}
      </div>
    )}
  </Card>
);

const GroupCard: React.FC<{ group: any; router: any; showDelete: boolean; userId: string | null }> = ({ group, router, showDelete, userId }) => (
  <Card className="p-4 dark-card border border-card-border/30 hover:border-primary-500/30 transition-colors">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-medium text-text-primary">{group.name}</h3>
      <Badge variant="outline" size="sm">
        <Users className="h-4 w-4 mr-1" /> {group.members.length} Members
      </Badge>
    </div>
    <p className="text-sm text-text-secondary">{group.description}</p>
    <div className="mt-3 flex items-center">
      <Avatar fallback="G" size="xs" className="border border-card-bg" />
      <span className="text-xs text-text-secondary ml-2">Created by {group.creatorName}</span>
    </div>
    <div className="mt-4 flex space-x-2">
      <Button variant="outline" size="sm" onClick={() => router.push(`/study-groups/${group.id}`)}>View</Button>
      {showDelete && userId === group.created_by && (
        <Button variant="destructive" size="sm" onClick={() => handleDeleteGroup(group.id)}>Delete</Button>
      )}
    </div>
  </Card>
);

const handleDeleteGroup = async (groupId: string) => {
  if (!confirm("Are you sure you want to delete this group?")) return;
  try {
    await deleteStudyGroup(groupId);
    alert("Group deleted successfully.");
    window.location.reload();
  } catch (error) {
    alert("Failed to delete group.");
  }
};
