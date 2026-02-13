import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Briefcase, MapPin, DollarSign, ExternalLink, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function JobNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const user = await base44.auth.me();
      const data = await base44.entities.JobNotification.filter(
        { userId: user.email },
        '-postedDate',
        10
      );
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await base44.entities.JobNotification.update(id, { read: true });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAsApplied = async (id) => {
    try {
      await base44.entities.JobNotification.update(id, { applied: true });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, applied: true } : n)
      );
      toast.success('Marked as applied');
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Job Notifications
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-500">{unreadCount} new</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center py-4 text-muted-foreground">Loading...</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No job notifications yet</p>
            <p className="text-xs mt-1">We'll notify you when matching jobs are posted</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((job) => (
              <div
                key={job.id}
                className={`p-3 rounded-lg border transition-colors ${
                  job.read ? 'bg-gray-50 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <h4 className="font-semibold text-sm truncate">{job.jobTitle}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                      )}
                      {job.salary && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {job.salary}
                        </span>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {job.platform}
                      </Badge>
                    </div>
                  </div>
                  {job.applied && (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  {job.jobUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        window.open(job.jobUrl, '_blank');
                        markAsRead(job.id);
                      }}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Job
                    </Button>
                  )}
                  {!job.applied && (
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => markAsApplied(job.id)}
                    >
                      Mark Applied
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}