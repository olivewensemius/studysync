import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, X, ChevronRight, Calendar, ExternalLink } from 'lucide-react';
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="py-8 flex flex-col items-center">
          <Bell className="h-12 w-12 text-text-secondary mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No Pending Invitations</h3>
          <p className="text-text-secondary max-w-md">
            You don't have any study group invitations at the moment. When someone invites you to join a group, you'll see it here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 mb-4 bg-red-500/10 text-red-400 border border-red-500/30 rounded">
          {error}
        </div>
      )}

      {invitations.map(invitation => (
        <Card key={invitation.id} className="overflow-hidden border border-card-border hover:border-primary-500/30 transition-all">
          <div className="p-5">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <Link href={`/study-groups/${invitation.group_id}`} className="group">
                  <h3 className="text-lg font-medium text-text-primary group-hover:text-primary-500 flex items-center">
                    {invitation.study_groups.name}
                    <ExternalLink className="h-4 w-4 ml-1 opacity-50 group-hover:opacity-100" />
                  </h3>
                </Link>
                
                <p className="text-text-secondary text-sm">
                  {invitation.study_groups.description && invitation.study_groups.description.length > 120 
                    ? `${invitation.study_groups.description.substring(0, 120)}...` 
                    : invitation.study_groups.description}
                </p>
                
                <div className="flex items-center text-xs text-text-secondary">
                  <Calendar className="h-3 w-3 mr-1" /> 
                  Invited on {formatDate(invitation.created_at)}
                </div>
              </div>
              
              <div className="flex space-x-2 md:flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDecline(invitation.id)}
                  disabled={processing[invitation.id]}
                  className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                >
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleAccept(invitation.id)}
                  disabled={processing[invitation.id]}
                >
                  {processing[invitation.id] ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GroupInvitationsComponent;