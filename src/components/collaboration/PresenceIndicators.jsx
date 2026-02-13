import React, { useState, useEffect } from 'react';
import { Users, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { base44 } from '@/api/base44Client';

export default function PresenceIndicators({ resumeId }) {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (!resumeId) return;

    // Simulate presence tracking (in real implementation, use WebSocket or real-time DB)
    const updatePresence = async () => {
      try {
        const user = await base44.auth.me();
        // In production, you'd send presence updates to a real-time service
        // For now, we'll simulate with local state
      } catch (error) {
        console.error('Failed to update presence');
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, [resumeId]);

  if (!resumeId || activeUsers.length === 0) {
    return null;
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-accent transition-colors select-none">
          <Users className="w-4 h-4 text-muted-foreground" />
          <div className="flex -space-x-2">
            {activeUsers.slice(0, 3).map((user, idx) => (
              <div
                key={idx}
                className={`w-6 h-6 rounded-full ${colors[idx % colors.length]} border-2 border-white dark:border-gray-800 flex items-center justify-center`}
              >
                <span className="text-xs font-medium text-white">
                  {getInitials(user.name)}
                </span>
              </div>
            ))}
            {activeUsers.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  +{activeUsers.length - 3}
                </span>
              </div>
            )}
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="end">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Active Users ({activeUsers.length})</h4>
          {activeUsers.map((user, idx) => (
            <div key={idx} className="flex items-center gap-2 py-1">
              <div className={`w-8 h-8 rounded-full ${colors[idx % colors.length]} flex items-center justify-center`}>
                <span className="text-xs font-medium text-white">
                  {getInitials(user.name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <div className="flex items-center gap-1">
                  <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                  <span className="text-xs text-muted-foreground">{user.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}