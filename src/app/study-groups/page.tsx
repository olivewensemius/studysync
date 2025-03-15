"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, PlusCircle, FilePlus, Search, ClipboardList, UserCheck, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchStudyGroups, deleteStudyGroup, leaveStudyGroup, joinStudyGroup, updateStudyGroup, fetchGroupMembers, createStudyGroup } from "./actions";

export default function StudyGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<{ allGroups: any[]; myGroups: any[]; createdGroups: any[]; userId: string | null }>({
    allGroups: [],
    myGroups: [],
    createdGroups: [],
    userId: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("my-groups");
 
  // State for creating a group
 const [name, setName] = useState("");
 const [description, setDescription] = useState("");
 const [creating, setCreating] = useState(false);

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

  const handleCreateGroup = async () => {
    if (!name.trim() || !description.trim()) {
      setError("Both 'Group Name' and 'Description' are required.");
      return;
    }
  
    setCreating(true);
    setError("");
    
    try {
      await createStudyGroup({ name, description });
      setName("");
      setDescription("");
      setActiveSection("my-groups"); // Switch back after creation
      window.location.reload(); // Refresh the page
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8">Error: {error}</div>;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-card-bg p-6 space-y-4 border-r border-card-border">
        <h2 className="text-xl font-bold text-text-primary">Study Groups</h2>
        <nav className="space-y-2">
          <SidebarButton label="My Groups" icon={UserCheck} active={activeSection === "my-groups"} onClick={() => setActiveSection("my-groups")} />
          <SidebarButton label="Groups You Created" icon={ClipboardList} active={activeSection === "created-groups"} onClick={() => setActiveSection("created-groups")} />
          <SidebarButton label="Find Study Groups" icon={LayoutGrid} active={activeSection === "find-groups"} onClick={() => setActiveSection("find-groups")} />
          <SidebarButton label="Create Group" icon={FilePlus} active={activeSection === "create-group"} onClick={() => setActiveSection("create-group")} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-6">
        {/* Section Titles*/}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-text-primary">
            {activeSection === "my-groups"
              ? "My Groups"
              : activeSection === "created-groups"
              ? "Groups You Created"
              : activeSection === "find-groups"
              ? "Find Study Groups"
              : "Create a Study Group"}
          </h1>
        </div>

        {activeSection === "find-groups" && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-text-secondary" size={18} />
            <input
              type="text"
              placeholder="Search groups..."
              className="pl-10 pr-4 py-3 border border-card-border rounded-md w-full bg-card-bg text-text-primary focus:ring-2 focus:ring-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {activeSection === "my-groups" && <GroupSection groups={groups.myGroups} router={router} showDelete={false} userId={groups.userId} />}
        {activeSection === "created-groups" && <GroupSection groups={groups.createdGroups} router={router} showDelete={true} userId={groups.userId} />}
        {activeSection === "find-groups" && <GroupSection groups={groups.allGroups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase()))} router={router} showDelete={false} userId={groups.userId} />}

          {/* Create Study Group Form - Inline UI */}
        {activeSection === "create-group" && (
          <Card className="p-6 w-full rounded-lg dark-card">
            <div className="space-y-4 flex pb-4">
              <h1 className="w-1/2 text-xl block font-medium">Group Name</h1>
              <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter group name" 
              required
              className="w-full px-3 py-2 border rounded-md text-sm h-12 focus:ring-2 focus:ring-primary-500 bg-card-bg text-text-primary"
              />
            </div>

              <div className="space-y-4 flex">
                <label className="w-1/2 text-xl block font-medium">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-primary-500 bg-card-bg text-text-primary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly describe your group"
                  required
                  rows={4}
                />
              </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setActiveSection("my-groups")}>Cancel</Button>
              <Button variant="default" onClick={handleCreateGroup}
              disabled={creating || !name.trim() || !description.trim()} // Disable if fields are empty
              className={`${(!name.trim() || !description.trim()) ? "opacity-50 cursor-not-allowed" : ""}`} // Greyed out button when disabled
            >
                {creating ? "Creating..." : "Create"}
              </Button>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}

/* Sidebar Button Component */
const SidebarButton: React.FC<{ label: string; icon: any; active: boolean; onClick: () => void }> = ({ label, icon: Icon, active, onClick }) => (
  <button className={`flex items-center space-x-3 px-4 py-2 rounded-md w-full text-left transition-all ${active ? "bg-primary-500 text-white" : "text-text-primary hover:bg-primary-500/20"}`} onClick={onClick}>
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </button>
);

/* Group Section Component */
const GroupSection: React.FC<{ groups: any[]; router: any; showDelete: boolean; userId: string | null }> = ({ groups, router, showDelete, userId }) => (
  <div className="space-y-4">
    {groups.length === 0 ? (
      <p className="text-text-secondary">No groups found.</p>
    ) : (
      groups.map(group => (
        <GroupCard key={group.id} group={group} router={router} showDelete={showDelete} userId={userId} />
      ))
    )}
  </div>
);

/* Group Card Component */
const GroupCard: React.FC<{ group: any; router: any; showDelete: boolean; userId: string | null }> = ({ group, router, showDelete, userId }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(group.members.includes(userId)); 
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState<{ display_name: string; email: string; avatar_url?: string }[] | null>(null);const [loadingMembers, setLoadingMembers] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState(group.name);
  const [updatedDescription, setUpdatedDescription] = useState(group.description);
  const [updating, setUpdating] = useState(false);


  const handleLeaveGroup = async () => {
    if (!confirm(`Are you sure you want to leave ${group.name}?`)) return;

    try {
      await leaveStudyGroup(group.id);
      window.location.reload(); // Refresh page to reflect changes
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to leave group due to an unexpected error.");
      }
    }
  };

  const handleJoinGroup = async () => {
    try {
      await joinStudyGroup(group.id);
      setIsMember(true); // Update UI
      window.location.reload(); // Refresh page to reflect changes
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to join group.");
    }
  };

  const handleHover = async (event: React.MouseEvent<HTMLDivElement>) => {
    setShowMembers(true);

    if (!members) {
      try {
        setLoadingMembers(true);
        const fetchedMembers = await fetchGroupMembers(group.id);
        setMembers(fetchedMembers);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Failed to fetch members.");
      } finally {
        setLoadingMembers(false);
      }
    }
  };

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

  const handleUpdateGroup = async () => {
    if (!updatedName.trim() || !updatedDescription.trim()) {
      setErrorMessage("Both 'Group Name' and 'Description' are required.");
      return;
    }

    setUpdating(true);
    setErrorMessage("");

    try {
      await updateStudyGroup(group.id, { name: updatedName, description: updatedDescription });
      setIsEditing(false);
      window.location.reload(); // Refresh to show the updated details
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update group.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className="p-5 dark-card border border-card-border/30 hover:border-primary-500/30 transition-all rounded-lg shadow-md">
      {isEditing ? (
        <div>
          <h3 className="text-xl font-semibold mb-2 text-text-primary">Edit Study Group</h3>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-2 text-sm text-red-500 bg-red-100 border border-red-400 rounded-md">
              {errorMessage}
            </div>
          )}

          <Input
            className="w-full px-3 py-2 border rounded-md text-sm bg-card-bg text-text-primary focus:ring-2 focus:ring-primary-500"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            placeholder="Enter group name"
          />

          <textarea
            className="w-full px-3 py-2 mt-3 border rounded-md text-sm bg-card-bg text-text-primary focus:ring-2 focus:ring-primary-500"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            placeholder="Enter group description"
            rows={4}
          />

          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button 
              variant="default" 
              onClick={handleUpdateGroup} 
              disabled={updating || !updatedName.trim() || !updatedDescription.trim()}
            >
              {updating ? "Updating..." : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-text-primary text-lg">{group.name}</h3>
           {/* Members Badge with Hover Effect */}
          <div className="relative" 
            onMouseEnter={handleHover} 
            onMouseLeave={() => setTimeout(() => setShowMembers(false), 200)} // Delayed hiding to prevent flickering
          >
            <Badge variant="outline" size="sm" className="cursor-pointer">
              <Users className="h-4 w-4 mr-1" /> {group.members.length} Members
            </Badge>

            {/* Floating tooltip inside the div to prevent disappearing on hover */}
            {showMembers && (
              <div 
                className="fixed bg-black shadow-lg p-3 rounded-md z-50 max-h-40 overflow-auto w-52 top-8 right-0"
                onMouseEnter={() => setShowMembers(true)} // Keep it open when hovering over tooltip
                onMouseLeave={() => setShowMembers(false)}
              >
                <h4 className="text-sm font-bold mb-2">Members</h4>
                {loadingMembers ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : members && members.length > 0 ? (
                  members.map((member, index) => (
                    <div key={index} className="flex items-center space-x-3 mb-2 last:mb-8">
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt={member.display_name} className="w-6 h-6 rounded-full" />
                      ) : (
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                      )}
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{member.display_name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No members found.</p>
                )}
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-text-secondary">{group.description}</p>

        {/* Display error message if exists */}
        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

        <div className="mt-4 flex space-x-2 justify-end">
          {showDelete && userId === group.created_by ? (
            <>
              <Button variant="default" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>        
              <Button variant="destructive" size="sm" onClick={() => handleDeleteGroup(group.id)}>Delete</Button>
            </>
          ) : isMember ? (
            <Button variant="destructive" size="sm" onClick={handleLeaveGroup}>Leave Group</Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={handleJoinGroup}>Join Group</Button>
          )}
        </div>
      </>
      )}
    </Card>
  );
};

