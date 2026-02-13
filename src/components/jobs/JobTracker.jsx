import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Calendar, Building2, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function JobTracker() {
  const [applications, setApplications] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    resumeId: '',
    location: '',
    notes: ''
  });

  useEffect(() => {
    loadApplications();
    loadResumes();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await base44.entities.JobApplication.list('-appliedDate');
      setApplications(data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    }
  };

  const loadResumes = async () => {
    try {
      const data = await base44.entities.Resume.list();
      setResumes(data);
    } catch (error) {
      console.error('Failed to load resumes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await base44.entities.JobApplication.create(formData);
      toast.success('Application added!');
      setShowDialog(false);
      setFormData({
        jobTitle: '',
        company: '',
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        resumeId: '',
        location: '',
        notes: ''
      });
      loadApplications();
    } catch (error) {
      toast.error('Failed to add application');
    }
  };

  const statusColors = {
    Applied: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    Interviewing: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    Offered: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    Rejected: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    Withdrawn: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600 dark:text-primary" />
          Job Applications
        </CardTitle>
        <Button size="sm" onClick={() => setShowDialog(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No applications yet. Start tracking!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border dark:border-border hover:bg-accent transition-colors">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate dark:text-foreground">{app.jobTitle}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Building2 className="w-3 h-3" />
                    <span>{app.company}</span>
                    <span>•</span>
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(app.appliedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[app.status]}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Job Application</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Job Title *</Label>
              <Input
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Company *</Label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                required
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interviewing">Interviewing</SelectItem>
                  <SelectItem value="Offered">Offered</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Applied Date</Label>
              <Input
                type="date"
                value={formData.appliedDate}
                onChange={(e) => setFormData({...formData, appliedDate: e.target.value})}
              />
            </div>
            <div>
              <Label>Resume Used</Label>
              <Select value={formData.resumeId} onValueChange={(value) => setFormData({...formData, resumeId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((resume) => (
                    <SelectItem key={resume.id} value={resume.id}>{resume.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="City, State or Remote"
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">Add Application</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}