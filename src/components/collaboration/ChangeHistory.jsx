import React, { useState, useEffect } from 'react';
import { History, User, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';

export default function ChangeHistory({ resumeId }) {
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChanges();
  }, [resumeId]);

  const loadChanges = async () => {
    try {
      const data = await base44.entities.ChangeLog.filter({ resume_id: resumeId }, '-created_date', 20);
      setChanges(data);
    } catch (error) {
      console.error('Failed to load changes');
    } finally {
      setLoading(false);
    }
  };

  const actionColors = {
    created: 'bg-green-100 text-green-800',
    updated: 'bg-blue-100 text-blue-800',
    deleted: 'bg-red-100 text-red-800'
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="w-5 h-5" />
          Change History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin" />
            <p className="text-sm">Loading history...</p>
          </div>
        ) : changes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No changes yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {changes.map((change) => (
              <div key={change.id} className="border-l-2 border-gray-200 pl-3 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-gray-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-900 truncate">
                      {change.changed_by_name}
                    </span>
                  </div>
                  <Badge className={`${actionColors[change.action]} text-xs`}>
                    {change.action}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  Section: <span className="font-medium capitalize">{change.section}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(change.created_date).toLocaleString()}
                </p>
                {change.before && change.after && (
                  <div className="mt-2 text-xs space-y-1">
                    <div className="bg-red-50 rounded p-1 border border-red-200">
                      <span className="text-red-700 font-medium">Before: </span>
                      <span className="text-gray-700 line-through">
                        {change.before.substring(0, 50)}...
                      </span>
                    </div>
                    <div className="bg-green-50 rounded p-1 border border-green-200">
                      <span className="text-green-700 font-medium">After: </span>
                      <span className="text-gray-700">
                        {change.after.substring(0, 50)}...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}