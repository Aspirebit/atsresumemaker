import React, { useState, useEffect } from 'react';
import { Plus, FileText, TrendingUp, Clock, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await base44.entities.Resume.list('-updated_date', 3);
      setResumes(data);
    } catch (error) {
      console.error('Failed to load resumes:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600 dark:text-muted-foreground">Create a professional resume in minutes</p>
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
          <EnhancedJobTracker />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card
            className="border-2 border-dashed border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900 dark:hover:to-blue-900 transition-colors cursor-pointer"
            onClick={() => setShowAIWorkflow(true)}
          >
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-3">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-foreground text-lg">AI Resume Builder</h3>
              <p className="text-sm text-gray-600 dark:text-muted-foreground mt-1">Build with AI assistance</p>
            </CardContent>
          </Card>

          <Card
            className="border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
            onClick={() => setShowTemplateGallery(true)}
          >
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-foreground text-lg">Start from Template</h3>
              <p className="text-sm text-gray-600 dark:text-muted-foreground mt-1">Choose and customize</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">{resumes.length}</p>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Saved Resumes</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-foreground">12</p>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Downloads</p>
              </div>
            </CardContent>
          </Card>
        </div>

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

        {/* Recent Activity */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-600 dark:text-muted-foreground" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground">Recent Activity</h2>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-gray-500 dark:text-muted-foreground">Loading...</div>
              ) : resumes.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-muted-foreground">
                  <p>No resumes yet. Create your first resume to get started!</p>
                  <Button onClick={() => setShowTemplateGallery(true)} className="mt-4">
                    Create Resume
                  </Button>
                </div>
              ) : (
                resumes.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-accent cursor-pointer transition-colors ${
                      index !== resumes.length - 1 ? 'border-b border-gray-200 dark:border-border' : ''
                    }`}
                    onClick={() => navigate(`${createPageUrl('Editor')}?id=${item.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-foreground">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-muted-foreground">Updated {getTimeAgo(item.updated_date)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Open</Button>
                  </div>
                ))
              )}
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