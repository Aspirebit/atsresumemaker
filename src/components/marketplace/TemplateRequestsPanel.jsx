import React, { useState, useEffect } from 'react';
import { Lightbulb, Plus, ThumbsUp, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function TemplateRequestsPanel() {
  const [requests, setRequests] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'professional',
    features: ''
  });

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await base44.entities.TemplateRequest.list('-votes', 20);
      setRequests(data);
    } catch (error) {
      console.error('Failed to load requests');
    }
  };

  const submitRequest = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      const user = await base44.auth.me();
      await base44.entities.TemplateRequest.create({
        ...formData,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        votes: 0,
        requestedBy: user.email,
        requestedByName: user.full_name || user.email
      });

      toast.success('Template request submitted!');
      setShowDialog(false);
      setFormData({ title: '', description: '', category: 'professional', features: '' });
      loadRequests();
    } catch (error) {
      toast.error('Failed to submit request');
    }
  };

  const voteForRequest = async (requestId) => {
    try {
      const request = requests.find(r => r.id === requestId);
      await base44.entities.TemplateRequest.update(requestId, {
        votes: (request.votes || 0) + 1
      });
      loadRequests();
      toast.success('Vote recorded!');
    } catch (error) {
      toast.error('Failed to vote');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    'in-progress': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    completed: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    rejected: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Template Requests
          </CardTitle>
          <Button size="sm" onClick={() => setShowDialog(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Request
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {requests.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No template requests yet. Be the first to suggest one!
          </p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="p-3 border dark:border-border rounded-lg space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm dark:text-foreground">{request.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{request.description}</p>
                  {request.features && request.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {request.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Badge className={statusColors[request.status] || statusColors.pending}>
                  {request.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">by {request.requestedByName}</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => voteForRequest(request.id)}
                  className="h-7"
                >
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  {request.votes || 0}
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Tech Startup CV"
              />
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                placeholder="Describe the template you'd like to see..."
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Desired Features (comma-separated)</Label>
              <Input
                value={formData.features}
                onChange={(e) => setFormData({...formData, features: e.target.value})}
                placeholder="e.g., sidebar, icons, color sections"
              />
            </div>
            <Button onClick={submitRequest} className="w-full">
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}