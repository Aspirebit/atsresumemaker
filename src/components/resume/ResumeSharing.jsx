import React, { useState } from 'react';
import { Share2, Copy, Check, Link as LinkIcon, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ResumeSharing({ resume, open, onClose }) {
  const [shareEmail, setShareEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  const generateShareLink = () => {
    const link = `${window.location.origin}/shared-resume/${resume.id}`;
    setShareLink(link);
    return link;
  };

  const copyLink = () => {
    const link = generateShareLink();
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const shareViaEmail = async () => {
    if (!shareEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      const user = await base44.auth.me();
      
      // Update resume with sharing info
      const sharedWith = resume.sharedWith || [];
      if (!sharedWith.find(s => s.email === shareEmail)) {
        await base44.entities.Resume.update(resume.id, {
          sharedWith: [
            ...sharedWith,
            {
              email: shareEmail,
              permission: permission,
              sharedAt: new Date().toISOString()
            }
          ]
        });
      }

      // Send email notification
      const link = generateShareLink();
      await base44.integrations.Core.SendEmail({
        to: shareEmail,
        subject: `${user.full_name} shared a resume with you`,
        body: `
          <h2>Resume Shared</h2>
          <p>${user.full_name} has shared their resume "${resume.title}" with you.</p>
          <p>Permission: ${permission}</p>
          <p><a href="${link}">View Resume</a></p>
        `
      });

      toast.success('Resume shared successfully!');
      setShareEmail('');
    } catch (error) {
      toast.error('Failed to share resume');
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
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm font-medium dark:text-foreground">{resume.title}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Share this resume with others via link or email
            </p>
          </div>

          <div>
            <Label className="mb-2 block">Share via Link</Label>
            <div className="flex gap-2">
              <Input 
                value={shareLink || generateShareLink()} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button onClick={copyLink} variant="outline">
                {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Anyone with this link can view your resume
            </p>
          </div>

          <div className="border-t pt-4">
            <Label className="mb-2 block">Share via Email</Label>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="recipient@email.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
              
              <div>
                <Label className="text-xs">Permission</Label>
                <Select value={permission} onValueChange={setPermission}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">View Only</SelectItem>
                    <SelectItem value="edit">Can Edit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={shareViaEmail} className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Send Invitation
              </Button>
            </div>
          </div>

          {resume.sharedWith && resume.sharedWith.length > 0 && (
            <div className="border-t pt-4">
              <Label className="mb-2 block">Shared With</Label>
              <div className="space-y-2">
                {resume.sharedWith.map((share, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span>{share.email}</span>
                    <span className="text-xs text-muted-foreground capitalize">{share.permission}</span>
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