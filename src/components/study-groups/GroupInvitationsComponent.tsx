import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, X, ChevronRight } from 'lucide-react';
import { acceptGroupInvitation, declineGroupInvitation, getPendingInvitations } from '@/app/(protected)/study-groups/actions';
import Link from 'next/link';

const GroupInvitationsComponent = () => {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const loadInvitations = async () => {
      try {
        setLoading(true);
        const data = await getPendingInvitations();
        setInvitations(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load invitations');
      } finally {
        setLoading(false);
      }
    };

    loadInvitations();
  }, []);

  const handleAccept = async (invitationId: string) => {
    setProcessing(prev => ({ ...prev, [invitationId]: true }));
    try {
      await acceptGroupInvitation(invitationId);
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (err: any) {
      setError(err.message || 'Failed to accept invitation');
    } finally {
      setProcessing(prev => ({ ...prev, [invitationId]: false }));
    }
  };

  const handleDecline = async (invitationId: string) => {
    setProcessing(prev => ({ ...prev, [invitationId]: true }));
    try {
      await declineGroupInvitation(invitationId);
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (err: any) {
      setError(err.message || 'Failed to decline invitation');
    } finally {
      setProcessing(prev => ({ ...prev, [invitationId]: false }));
    }
  };

  if (loading) {
    return (
      <Card className="dark-card p-4">
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
        </div>
      </Card>
    );
  }

  if (invitations.length === 0) {
    return null; // Don't show anything if there are no invitations
  }

  return (
    <Card className="dark-card mb-6">
      <div className="p-4 border-b border-card-border flex items-center">
        <Bell className="mr-2 text-primary-400" />
        <h2 className="text-lg font-medium text-text-primary">Group Invitations</h2>
        <Badge variant="primary" className="ml-2">{invitations.length}</Badge>
      </div>

      {error && (
        <div className="p-3 m-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded">
          {error}
        </div>
      )}

      <div className="divide-y divide-card-border">
        {invitations.map(invitation => (
          <div key={invitation.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="mb-3 sm:mb-0">
              <div className="flex items-center">
                <span className="text-primary-400 font-medium">{invitation.study_groups.name}</span>
              </div>
              
              {invitation.study_groups.description && (
                <p className="text-text-secondary text-sm mt-1">
                  {invitation.study_groups.description.length > 100 
                    ? `${invitation.study_groups.description.substring(0, 100)}...` 
                    : invitation.study_groups.description}
                </p>
              )}
            </div>
            
            <div className="flex space-x-2 ml-10 sm:ml-0">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<X className="h-4 w-4" />}
                onClick={() => handleDecline(invitation.id)}
                disabled={processing[invitation.id]}
              >
                Decline
              </Button>
              <Button
                variant="default"
                size="sm"
                leftIcon={<Check className="h-4 w-4" />}
                onClick={() => handleAccept(invitation.id)}
                disabled={processing[invitation.id]}
              >
                {processing[invitation.id] ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : 'Accept'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-card-border">
        <Link href="/study-groups">
          <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="h-4 w-4" />} className="w-full text-center justify-center">
            View All Groups
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default GroupInvitationsComponent;