import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Calendar, Building2, Clock, FileText, Video, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function EnhancedJobTracker() {
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [showAppDialog, setShowAppDialog] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  
  const [appFormData, setAppFormData] = useState({
    jobTitle: '',
    company: '',
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    resumeId: '',
    coverLetter: '',
    location: '',
    notes: '',
    nextStep: ''
  });

  const [interviewFormData, setInterviewFormData] = useState({
    jobApplicationId: '',
    type: 'Phone Screen',
    scheduledDate: '',
    duration: 60,
    location: '',
    interviewers: '',
    notes: '',
    reminderTime: 60
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [apps, ints, resms] = await Promise.all([
        base44.entities.JobApplication.list('-appliedDate'),
        base44.entities.Interview.list('-scheduledDate'),
        base44.entities.Resume.list()
      ]);
      setApplications(apps);
      setInterviews(ints);
      setResumes(resms);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleAddApplication = async (e) => {
    e.preventDefault();
    try {
      await base44.entities.JobApplication.create(appFormData);
      toast.success('Application added!');
      setShowAppDialog(false);
      setAppFormData({
        jobTitle: '',
        company: '',
        status: 'Applied',
        appliedDate: new Date().toISOString().split('T')[0],
        resumeId: '',
        coverLetter: '',
        location: '',
        notes: '',
        nextStep: ''
      });
      loadData();
    } catch (error) {
      toast.error('Failed to add application');
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      await base44.entities.Interview.create({
        ...interviewFormData,
        interviewers: interviewFormData.interviewers.split(',').map(i => i.trim())
      });
      toast.success('Interview scheduled!');
      setShowInterviewDialog(false);
      setInterviewFormData({
        jobApplicationId: '',
        type: 'Phone Screen',
        scheduledDate: '',
        duration: 60,
        location: '',
        interviewers: '',
        notes: '',
        reminderTime: 60
      });
      loadData();
    } catch (error) {
      toast.error('Failed to schedule interview');
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
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-primary" />
              Job Applications & Interviews
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setShowAppDialog(true)} className="flex-1 md:flex-none">
              <Plus className="w-4 h-4 md:mr-1" />
              <span className="md:inline">Add App</span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowInterviewDialog(true)} className="flex-1 md:flex-none">
              <Calendar className="w-4 h-4 md:mr-1" />
              <span className="md:inline">Schedule</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 md:px-6">
        <Tabs defaultValue="applications">
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="applications" className="text-xs md:text-sm">
              Applications ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="interviews" className="text-xs md:text-sm">
              Interviews ({interviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-2 mt-3">
            {applications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No applications yet</p>
              </div>
            ) : (
              applications.slice(0, 5).map((app) => (
                <div key={app.id} className="p-2 md:p-3 rounded-lg border dark:border-border hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs md:text-sm dark:text-foreground truncate">{app.jobTitle}</h4>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{app.company}</span>
                        </div>
                        {app.resumeId && (
                          <div className="flex items-center gap-1">
                            <span>•</span>
                            <FileText className="w-3 h-3" />
                            <span className="hidden md:inline">Resume</span>
                          </div>
                        )}
                      </div>
                      {app.nextStep && (
                        <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 mt-1">
                          <Clock className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{app.nextStep}</span>
                        </div>
                      )}
                    </div>
                    <span className={`px-1.5 md:px-2 py-0.5 md:py-1 text-xs font-medium rounded whitespace-nowrap ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="interviews" className="space-y-2 mt-3">
            {interviews.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Video className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No interviews scheduled</p>
              </div>
            ) : (
              interviews.slice(0, 5).map((interview) => (
                <div key={interview.id} className="p-2 md:p-3 rounded-lg border dark:border-border hover:bg-accent transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Video className="w-3 h-3 md:w-4 md:h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                    <h4 className="font-semibold text-xs md:text-sm dark:text-foreground truncate">{interview.type}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{new Date(interview.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{interview.duration}min</span>
                    </div>
                  </div>
                  {interview.location && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">{interview.location}</p>
                  )}
                  {interview.reminder && (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 mt-1">
                      <Bell className="w-3 h-3 flex-shrink-0" />
                      <span className="hidden md:inline">Reminder ({interview.reminderTime}min)</span>
                      <span className="md:hidden">Reminder</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Application Dialog */}
      <Dialog open={showAppDialog} onOpenChange={setShowAppDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Job Application</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddApplication} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Job Title *</Label>
                <Input value={appFormData.jobTitle} onChange={(e) => setAppFormData({...appFormData, jobTitle: e.target.value})} required />
              </div>
              <div>
                <Label>Company *</Label>
                <Input value={appFormData.company} onChange={(e) => setAppFormData({...appFormData, company: e.target.value})} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select value={appFormData.status} onValueChange={(value) => setAppFormData({...appFormData, status: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                <Input type="date" value={appFormData.appliedDate} onChange={(e) => setAppFormData({...appFormData, appliedDate: e.target.value})} />
              </div>
            </div>

            <div>
              <Label>Resume Used</Label>
              <Select value={appFormData.resumeId} onValueChange={(value) => setAppFormData({...appFormData, resumeId: value})}>
                <SelectTrigger><SelectValue placeholder="Select resume" /></SelectTrigger>
                <SelectContent>
                  {resumes.map((resume) => (
                    <SelectItem key={resume.id} value={resume.id}>{resume.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Cover Letter</Label>
              <Textarea value={appFormData.coverLetter} onChange={(e) => setAppFormData({...appFormData, coverLetter: e.target.value})} rows={4} placeholder="Paste cover letter..." />
            </div>

            <div>
              <Label>Next Step / Follow-up</Label>
              <Input value={appFormData.nextStep} onChange={(e) => setAppFormData({...appFormData, nextStep: e.target.value})} placeholder="e.g., Follow up on Feb 20" />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAppDialog(false)} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1">Add Application</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Interview Dialog */}
      <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleScheduleInterview} className="space-y-4">
            <div>
              <Label>Job Application *</Label>
              <Select value={interviewFormData.jobApplicationId} onValueChange={(value) => setInterviewFormData({...interviewFormData, jobApplicationId: value})} required>
                <SelectTrigger><SelectValue placeholder="Select application" /></SelectTrigger>
                <SelectContent>
                  {applications.map((app) => (
                    <SelectItem key={app.id} value={app.id}>{app.jobTitle} - {app.company}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Interview Type *</Label>
                <Select value={interviewFormData.type} onValueChange={(value) => setInterviewFormData({...interviewFormData, type: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Phone Screen">Phone Screen</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Behavioral">Behavioral</SelectItem>
                    <SelectItem value="Panel">Panel</SelectItem>
                    <SelectItem value="Final">Final</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input type="number" value={interviewFormData.duration} onChange={(e) => setInterviewFormData({...interviewFormData, duration: parseInt(e.target.value)})} />
              </div>
            </div>

            <div>
              <Label>Date & Time *</Label>
              <Input type="datetime-local" value={interviewFormData.scheduledDate} onChange={(e) => setInterviewFormData({...interviewFormData, scheduledDate: e.target.value})} required />
            </div>

            <div>
              <Label>Location / Meeting Link</Label>
              <Input value={interviewFormData.location} onChange={(e) => setInterviewFormData({...interviewFormData, location: e.target.value})} placeholder="Office address or Zoom link" />
            </div>

            <div>
              <Label>Interviewers (comma-separated)</Label>
              <Input value={interviewFormData.interviewers} onChange={(e) => setInterviewFormData({...interviewFormData, interviewers: e.target.value})} placeholder="John Doe, Jane Smith" />
            </div>

            <div>
              <Label>Reminder (minutes before)</Label>
              <Input type="number" value={interviewFormData.reminderTime} onChange={(e) => setInterviewFormData({...interviewFormData, reminderTime: parseInt(e.target.value)})} />
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowInterviewDialog(false)} className="flex-1">Cancel</Button>
              <Button type="submit" className="flex-1">Schedule Interview</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}