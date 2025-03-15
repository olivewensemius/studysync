import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Search, UserPlus, Check } from 'lucide-react';

interface UserSearchProps {
  groupId: string;
  onInviteUser: (userId: string) => Promise<any>;
  existingMembers?: string[];
}

const UserSearchComponent: React.FC<UserSearchProps> = ({ 
  groupId, 
  onInviteUser, 
  existingMembers = [] 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [invitingUsers, setInvitingUsers] = useState<{[key: string]: boolean}>({});
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      searchUsers(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const searchUsers = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      
      const data = await response.json();
      
      // Filter out users who are already members or already invited
      const filteredResults = data.filter((user: any) => 
        !existingMembers.includes(user.id) && !invitedUsers.includes(user.id)
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search for users');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (userId: string) => {
    setInvitingUsers(prev => ({ ...prev, [userId]: true }));
    setError('');
    
    try {
      await onInviteUser(userId);
      setInvitedUsers(prev => [...prev, userId]);
      // Remove from search results
      setSearchResults(prev => prev.filter(user => user.id !== userId));
    } catch (err: any) {
      setError(err.message || 'Failed to invite user');
    } finally {
      setInvitingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-text-secondary" size={18} />
        <Input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {error && (
        <div className="p-2 text-red-500 bg-red-500/10 border border-red-500/30 rounded-md text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="rounded-md border border-card-border">
          <div className="max-h-60 overflow-y-auto">
            {searchResults.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 hover:bg-card-border/10">
                <div className="flex items-center">
                  <Avatar 
                    fallback={user.display_name?.charAt(0) || 'U'} 
                    size="sm"
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-text-primary">{user.display_name}</p>
                    <p className="text-text-secondary text-sm">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={invitingUsers[user.id] ? undefined : <UserPlus className="h-4 w-4" />}
                  onClick={() => handleInvite(user.id)}
                  disabled={invitingUsers[user.id]}
                >
                  {invitingUsers[user.id] ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                  ) : 'Invite'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchQuery.length >= 2 && searchResults.length === 0 && !loading && (
        <div className="text-center p-4 text-text-secondary">
          No users found matching '{searchQuery}'
        </div>
      )}

      {invitedUsers.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-text-secondary mb-2">Invited in this session:</h3>
          <div className="flex flex-wrap gap-2">
            {invitedUsers.map(userId => {
              const user = searchResults.find(u => u.id === userId) || { display_name: 'User' };
              return (
                <div key={userId} className="flex items-center bg-primary-500/20 text-primary-400 rounded-full px-3 py-1 text-sm">
                  <Check className="h-3.5 w-3.5 mr-1" />
                  <span>{user.display_name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSearchComponent;