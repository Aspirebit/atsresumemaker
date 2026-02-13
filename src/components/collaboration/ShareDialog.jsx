import React, { useState } from 'react';
import { Share2, Mail, Users, Trash2, Eye, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function ShareDialog({ open, onClose, resume, onUpdate }) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const updatedShares = [
        ...(resume.sharedWith || []),
        {
          email,
          permission,
          sharedAt: new Date().toISOString()
        }
      ];

      await onUpdate({ sharedWith: updatedShares });
      
      // Send email notification
      await base44.integrations.Core.SendEmail({
        to: email,
        subject: `Resume Shared: ${resume.title}`,
        body: `You've been given ${permission} access to the resume "${resume.title}". Log in to view it.`
      });

      setEmail('');
      setPermission('view');
      toast.success(`Resume shared with ${email}`);
    } catch (error) {
      toast.error('Failed to share resume');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveShare = async (emailToRemove) => {
    try {
      const updatedShares = resume.sharedWith.filter(s => s.email !== emailToRemove);
      await onUpdate({ sharedWith: updatedShares });
      toast.success('Access removed');
    } catch (error) {
      toast.error('Failed to remove access');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Resume
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm">Email Address</Label>
            <Input
              type="email"
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm">Permission Level</Label>
            <Select value={permission} onValueChange={setPermission}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>Can View</span>
                  </div>
                </SelectItem>
                <SelectItem value="edit">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Can Edit</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleShare} 
            disabled={loading}
            className="w-full"
          >
            <Mail className="w-4 h-4 mr-2" />
            Share Resume
          </Button>

          {resume.sharedWith && resume.sharedWith.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Shared with</span>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {resume.sharedWith.map((share, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{share.email}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(share.sharedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={share.permission === 'edit' ? 'default' : 'secondary'} className="text-xs">
                        {share.permission}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 ml-2"
                      onClick={() => handleRemoveShare(share.email)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}