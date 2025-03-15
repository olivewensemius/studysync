"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, PlusCircle, Expand, Trash2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchStudyGroups, deleteStudyGroup } from "./actions";

export default function StudyGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<{ allGroups: any[], myGroups: any[], createdGroups: any[], userId: string | null }>({
    allGroups: [],
    myGroups: [],
    createdGroups: [],
    userId: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filtering function for search input
  const filteredGroups = groups.allGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Study Groups</h1>
        <Button variant="default" onClick={() => router.push("/study-groups/create")}>
          <PlusCircle className="h-5 w-5 mr-2" /> Create Group
        </Button>
      </div>

      {/* My Groups Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Groups</h2>
        {groups.myGroups.length === 0 ? (
          <div className="text-gray-500">You are not part of any study groups yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.myGroups.map((group) => (
              <GroupCard key={group.id} group={group} userId={groups.userId} router={router} showDelete={false} />
            ))}
          </div>
        )}
      </div>

      {/* Created Groups Dashboard Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Groups You Created</h2>
        {groups.createdGroups.length === 0 ? (
          <div className="text-gray-500">You haven't created any study groups.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.createdGroups.map((group) => (
              <GroupCard key={group.id} group={group} userId={groups.userId} router={router} showDelete={true} />
            ))}
          </div>
        )}
      </div>

      {/* Find a Group Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Find a Group</h2>
        <div className="mb-4 flex items-center space-x-2">
          <Search className="h-5 w-5" />
          <input
            type="text"
            placeholder="Search groups..."
            className="p-2 border rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredGroups.length === 0 ? (
          <div className="text-gray-500">No study groups found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard key={group.id} group={group} userId={groups.userId} router={router} showDelete={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const GroupCard = ({ group, userId, router, showDelete }: { group: any; userId: string | null; router: any; showDelete: boolean }) => (
  <Card key={group.id} className="p-4 dark-card">
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-lg font-bold">{group.name}</h2>
      <Badge variant="outline">
        <Users className="h-4 w-4 mr-1" /> {group.members.length} Members
      </Badge>
    </div>

    <p className="text-sm text-gray-500">{group.description}</p>

    <div className="mt-4 flex space-x-2">
      <Button variant="outline" size="icon" onClick={() => router.push(`/study-groups/${group.id}`)}>
        <Expand className="h-4 w-4" />
      </Button>

      {/* Show delete button only for creators */}
      {showDelete && userId === group.created_by && (
        <Button variant="destructive" size="icon" onClick={() => handleDeleteGroup(group.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  </Card>
);

const handleDeleteGroup = async (groupId: string) => {
  const confirmDelete = confirm("Are you sure you want to delete this group?");
  if (!confirmDelete) return;

  try {
      await deleteStudyGroup(groupId);
      alert("Group deleted successfully.");
      window.location.reload(); // Refresh the page after deletion
  } catch (error: any) {
      alert(error.message);
  }
};
