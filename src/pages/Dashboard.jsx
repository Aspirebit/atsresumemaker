import React, { useState, useEffect } from 'react';
import { Plus, FileText, TrendingUp, Clock, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import TemplateGallery from '@/components/dashboard/TemplateGallery';
import AIWorkflow from '@/components/ai/AIWorkflow';
import CoverLetterGenerator from '@/components/ai/CoverLetterGenerator';
import QuickAITools from '@/components/ai/QuickAITools';
import EnhancedJobTracker from '@/components/jobs/EnhancedJobTracker';
import LinkedInResumeCreator from '@/components/ai/LinkedInResumeCreator';
import JobApplicationAssistant from '@/components/ai/JobApplicationAssistant';
import JobNotifications from '@/components/jobs/JobNotifications';
import JobApplicationTips from '@/components/jobs/JobApplicationTips';
import CustomJobAlerts from '@/components/jobs/CustomJobAlerts';
import RecruiterCRM from '@/components/jobs/RecruiterCRM';
import ProfessionalTemplate from '@/components/resume/templates/ProfessionalTemplate';
import ModernTemplate from '@/components/resume/templates/ModernTemplate';
import CreativeTemplate from '@/components/resume/templates/CreativeTemplate';
import MinimalistTemplate from '@/components/resume/templates/MinimalistTemplate';
import ExecutiveTemplate from '@/components/resume/templates/ExecutiveTemplate';

export default function Dashboard() {
  const navigate = useNavigate();
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showAIWorkflow, setShowAIWorkflow] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resumeData, userData] = await Promise.all([
        base44.entities.Resume.list('-updated_date', 3),
        base44.auth.me()
      ]);
      setResumes(resumeData);
      setUser(userData);

      // Load or create user credits
      const userCredits = await base44.entities.UserCredits.filter({ userId: userData.email });
      if (userCredits.length === 0) {
        const newCredits = await base44.entities.UserCredits.create({
          userId: userData.email,
          coins: 100,
          earnedTotal: 100,
          spentTotal: 0,
          lastEarned: new Date().toISOString()
        });
        setCredits(newCredits);
      } else {
        setCredits(userCredits[0]);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const templates = [
    { id: 'professional', name: 'Professional', component: ProfessionalTemplate, popular: true },
    { id: 'modern', name: 'Modern', component: ModernTemplate, popular: true },
    { id: 'creative', name: 'Creative', component: CreativeTemplate, popular: false },
    { id: 'minimalist', name: 'Minimalist', component: MinimalistTemplate, popular: false },
    { id: 'executive', name: 'Executive', component: ExecutiveTemplate, popular: true },
  ];

  const sampleData = {
    template: 'professional',
    contact: {
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
    },
    summary: 'Experienced professional with a proven track record in delivering exceptional results.',
    experience: [
      {
        position: 'Senior Developer',
        company: 'Tech Corp',
        startDate: 'Jan 2020',
        endDate: 'Present',
        current: true,
        description: 'Led development of key features and mentored junior developers.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        school: 'University Name',
        startDate: '2015',
        endDate: '2019',
      },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const handleCreateResume = (template = 'professional') => {
    navigate(createPageUrl('Editor') + (template !== 'professional' ? `?template=${template}` : ''));
  };

  const timeAgo = getTimeAgo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-background dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-2">
                Welcome back, {user?.full_name || 'there'}! 👋
              </h1>
              <p className="text-gray-600 dark:text-muted-foreground">Let's build your perfect resume</p>
            </div>
            {credits && (
              <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full">
                <span className="text-2xl">🪙</span>
                <div>
                  <p className="text-sm font-medium">{credits.coins} Coins</p>
                  <p className="text-xs opacity-90">Available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Start Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0 text-white hover:shadow-xl transition-all cursor-pointer" onClick={handleCreateResume}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-xl font-bold mb-0.5 md:mb-1">AI Resume Builder</h3>
                  <p className="text-blue-100 text-xs md:text-sm">Create with AI assistance</p>
                </div>
                <Plus className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 text-white hover:shadow-xl transition-all cursor-pointer" onClick={() => setShowTemplateGallery(true)}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-xl font-bold mb-0.5 md:mb-1">Start from Template</h3>
                  <p className="text-purple-100 text-xs md:text-sm">Choose professional templates</p>
                </div>
                <Plus className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Tools */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground">AI-Powered Tools</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <QuickAITools onCoverLetterClick={() => {
              if (resumes.length > 0) {
                setSelectedResume(resumes[0]);
                setShowCoverLetter(true);
              } else {
                toast.error('Create a resume first');
              }
            }} />
            <LinkedInResumeCreator />
          </div>
        </div>

        {/* Job Applications & Interviews */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-4">
            Job Applications & Interviews
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <EnhancedJobTracker />
            </div>
            <div className="space-y-4">
              <JobNotifications />
              <CustomJobAlerts />
              <RecruiterCRM />
            </div>
          </div>
        </div>

        {/* Job Application Assistant */}
        {resumes.length > 0 && (
          <div className="mb-8">
            <JobApplicationAssistant resumeData={resumes[0]} />
          </div>
        )}



        {/* Templates Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground">Resume Templates</h2>
            <Button variant="ghost" className="text-blue-600 dark:text-primary hover:text-blue-700 dark:hover:text-primary/80" onClick={() => setShowTemplateGallery(true)}>View All</Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {templates.map((template) => {
              const TemplateComponent = template.component;
              return (
                <Card
                  key={template.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden"
                  onClick={() => navigate(`${createPageUrl('Editor')}?template=${template.id}`)}
                >
                  <CardContent className="p-3">
                    <div className="h-40 rounded-lg mb-2 relative overflow-hidden bg-white dark:bg-gray-100">
                      {template.popular && (
                        <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded z-10">
                          Popular
                        </span>
                      )}
                      <div className="scale-[0.15] origin-top-left w-[667%] h-[667%] pointer-events-none">
                        <TemplateComponent data={{ ...sampleData, template: template.id }} />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-100 pointer-events-none"></div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-foreground text-sm group-hover:text-blue-600 dark:group-hover:text-primary">
                      {template.name}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Resumes & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600 dark:text-muted-foreground" />
                Recent Resumes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-500 dark:text-muted-foreground">Loading...</div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
                  <p className="text-gray-500 dark:text-muted-foreground mb-4">No resumes yet</p>
                  <Button onClick={handleCreateResume} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Resume
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => navigate(`${createPageUrl('Editor')}?id=${item.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-primary" />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-foreground">{item.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-muted-foreground">
                            Updated {timeAgo(item.updated_date)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 capitalize">
                        {item.template}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Total Resumes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">{resumes.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {resumes.filter(r => {
                    const date = new Date(r.created_date);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Templates Used</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">
                  {new Set(resumes.map(r => r.template)).size}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TemplateGallery open={showTemplateGallery} onClose={() => setShowTemplateGallery(false)} />
      <AIWorkflow open={showAIWorkflow} onClose={() => setShowAIWorkflow(false)} />
      
      {showCoverLetter && selectedResume && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">AI Cover Letter Generator</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowCoverLetter(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <CoverLetterGenerator resumeData={selectedResume} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}