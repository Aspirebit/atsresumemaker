import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Save, Eye, EyeOff, Share2, MessageSquare, Sparkles, Palette, History, Menu, X, Target, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ContactSection from '@/components/editor/ContactSection';
import SummarySection from '@/components/editor/SummarySection';
import ExperienceSection from '@/components/editor/ExperienceSection';
import EducationSection from '@/components/editor/EducationSection';
import SkillsSection from '@/components/editor/SkillsSection';
import OptionalSections from '@/components/editor/OptionalSections';
import ResumePreview from '@/components/resume/ResumePreview';
import { exportResumeToPDF } from '@/components/utils/pdfExport';
import { createPageUrl } from '@/utils';
import AIAssistant from '@/components/ai/AIAssistant';
import AIOutput from '@/components/ai/AIOutput';
import AIProofreader from '@/components/ai/AIProofreader';
import CoverLetterGenerator from '@/components/ai/CoverLetterGenerator';
import AITemplateGenerator from '@/components/ai/AITemplateGenerator';
import DirectMessaging from '@/components/collaboration/DirectMessaging';
import ShareDialog from '@/components/collaboration/ShareDialog';
import CommentsPanel from '@/components/collaboration/CommentsPanel';
import ChangeHistory from '@/components/collaboration/ChangeHistory';
import PresenceIndicators from '@/components/collaboration/PresenceIndicators';
import TemplateCustomizer from '@/components/customization/TemplateCustomizer.jsx';
import AdvancedCustomizer from '@/components/customization/AdvancedCustomizer';
import JobMatchAnalyzer from '@/components/ai/JobMatchAnalyzer';
import ExportDialog from '@/components/export/ExportDialog';

export default function Editor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeId = searchParams.get('id');
  const template = searchParams.get('template') || 'professional';

  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showJobMatch, setShowJobMatch] = useState(false);
  const [showProofread, setShowProofread] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [showTemplateGen, setShowTemplateGen] = useState(false);
  const [showDirectMsg, setShowDirectMsg] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [aiOutput, setAIOutput] = useState(null);
  const [user, setUser] = useState(null);
  const [resumeData, setResumeData] = useState({
    title: 'Untitled Resume',
    template: template,
    contact: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    awards: [],
    customization: {
      fontFamily: 'Inter',
      fontSize: 'base',
      primaryColor: '#3B82F6',
      spacing: 'normal',
      sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'awards']
    },
    sharedWith: []
  });

  useEffect(() => {
    loadUser();
    if (resumeId) {
      loadResume();
    }
  }, [resumeId]);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user');
    }
  };

  const loadResume = async () => {
    try {
      const resumes = await base44.entities.Resume.filter({ id: resumeId });
      if (resumes.length > 0) {
        setResumeData(resumes[0]);
      }
    } catch (error) {
      toast.error('Failed to load resume');
    }
  };

  const handleSave = async (skipToast = false) => {
    setSaving(true);
    try {
      if (resumeId) {
        await base44.entities.Resume.update(resumeId, resumeData);
        
        // Log change
        if (user) {
          await base44.entities.ChangeLog.create({
            resume_id: resumeId,
            section: 'general',
            action: 'updated',
            changed_by_email: user.email,
            changed_by_name: user.full_name || user.email
          });
        }
        
        if (!skipToast) toast.success('Resume saved successfully');
      } else {
        const created = await base44.entities.Resume.create(resumeData);
        navigate(`${createPageUrl('Editor')}?id=${created.id}`, { replace: true });
        toast.success('Resume created successfully');
      }
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({ ...prev, [section]: data }));
  };

  const handleAIGenerate = (type, content) => {
    setAIOutput({ type, content });
  };

  const handleAIApply = () => {
    if (!aiOutput) return;
    
    if (aiOutput.type === 'summary') {
      updateResumeData('summary', aiOutput.content);
      toast.success('Summary applied to resume');
    } else if (aiOutput.type === 'experience') {
      toast.info('Copy and paste the content into an experience entry');
    } else if (aiOutput.type === 'tailoring') {
      toast.info('Review the suggestions and apply manually');
    }
    
    setAIOutput(null);
  };

  const handleUpdateResume = async (updates) => {
    setResumeData(prev => ({ ...prev, ...updates }));
    if (resumeId) {
      try {
        await base44.entities.Resume.update(resumeId, { ...resumeData, ...updates });
      } catch (error) {
        toast.error('Failed to update resume');
      }
    }
  };

  const togglePanel = (panel) => {
    setShowAI(panel === 'ai' ? !showAI : false);
    setShowComments(panel === 'comments' ? !showComments : false);
    setShowCustomize(panel === 'customize' ? !showCustomize : false);
    setShowHistory(panel === 'history' ? !showHistory : false);
    setShowJobMatch(panel === 'jobmatch' ? !showJobMatch : false);
    setShowProofread(panel === 'proofread' ? !showProofread : false);
    setShowCoverLetter(panel === 'coverletter' ? !showCoverLetter : false);
    setShowTemplateGen(panel === 'templategen' ? !showTemplateGen : false);
    setShowDirectMsg(panel === 'directmsg' ? !showDirectMsg : false);
    setShowMobileMenu(false);
  };

  const handleJobMatchSuggestion = (field, value) => {
    updateResumeData(field, value);
    toast.success('Suggestion applied');
  };

  return (
    <div className="min-h-screen bg-background overscroll-none">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-20 safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(createPageUrl('Saved'))}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <input
                type="text"
                value={resumeData.title}
                onChange={(e) => updateResumeData('title', e.target.value)}
                className="text-lg md:text-xl font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 min-w-0 flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div className="hidden lg:flex items-center gap-2">
                <Button
                  variant={showAI ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => togglePanel('ai')}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI
                </Button>
                <Button
                  variant={showJobMatch ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => togglePanel('jobmatch')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Match
                </Button>
                <Button
                  variant={showProofread ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => togglePanel('proofread')}
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Proofread
                </Button>
                <Button
                  variant={showComments ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => togglePanel('comments')}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Comments
                </Button>
                {resumeId && <PresenceIndicators resumeId={resumeId} />}
                <Button
                  variant={showCustomize ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => togglePanel('customize')}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Style
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowShare(true)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport} className="hidden md:flex">
                <Download className="w-4 h-4 mr-2" />
                <span>Export</span>
              </Button>
              <Button size="sm" onClick={() => handleSave()} disabled={saving}>
                <Save className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">{saving ? 'Saving...' : 'Save'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <Button
                variant={showAI ? 'default' : 'outline'}
                size="sm"
                onClick={() => togglePanel('ai')}
                className="w-full justify-start"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Assistant
              </Button>
              <Button
                variant={showComments ? 'default' : 'outline'}
                size="sm"
                onClick={() => togglePanel('comments')}
                className="w-full justify-start"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Comments
              </Button>
              <Button
                variant={showCustomize ? 'default' : 'outline'}
                size="sm"
                onClick={() => togglePanel('customize')}
                className="w-full justify-start"
              >
                <Palette className="w-4 h-4 mr-2" />
                Customize Style
              </Button>
              <Button
                variant={showHistory ? 'default' : 'outline'}
                size="sm"
                onClick={() => togglePanel('history')}
                className="w-full justify-start"
              >
                <History className="w-4 h-4 mr-2" />
                Change History
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setShowShare(true); setShowMobileMenu(false); }}
                className="w-full justify-start"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Resume
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left Sidebar - AI/Tools */}
          <div className="lg:col-span-3 space-y-4">
            {showAI && (
              <div className="sticky top-20">
                <AIAssistant onApply={handleAIGenerate} />
              </div>
            )}
            {showJobMatch && (
              <div className="sticky top-20">
                <JobMatchAnalyzer 
                  resumeData={resumeData}
                  onSuggestionApply={handleJobMatchSuggestion}
                />
              </div>
            )}
            {showProofread && (
              <div className="sticky top-20">
                <AIProofreader onApply={handleAIGenerate} />
              </div>
            )}
            {showCoverLetter && (
              <div className="sticky top-20">
                <CoverLetterGenerator resumeData={resumeData} />
              </div>
            )}
            {showTemplateGen && (
              <div className="sticky top-20">
                <AITemplateGenerator />
              </div>
            )}
            {showDirectMsg && resumeId && (
              <div className="sticky top-20">
                <DirectMessaging resumeId={resumeId} collaborators={resumeData.sharedWith} />
              </div>
            )}
            {showComments && resumeId && (
              <div className="sticky top-20">
                <CommentsPanel resumeId={resumeId} />
              </div>
            )}
            {showCustomize && (
              <div className="sticky top-20">
                <AdvancedCustomizer
                  customization={resumeData.customization}
                  onChange={(data) => updateResumeData('customization', data)}
                  currentTemplate={resumeData.template}
                />
              </div>
            )}
            {showHistory && resumeId && (
              <div className="sticky top-20">
                <ChangeHistory resumeId={resumeId} />
              </div>
            )}
          </div>

          {/* Main Editor */}
          <div className={`${showAI || showJobMatch || showProofread || showCoverLetter || showTemplateGen || showDirectMsg || showComments || showCustomize || showHistory ? 'lg:col-span-5' : showPreview ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4 md:space-y-6`}>
            {aiOutput && (
              <AIOutput
                content={aiOutput.content}
                type={aiOutput.type}
                onApply={handleAIApply}
                onClose={() => setAIOutput(null)}
              />
            )}

            <ContactSection
              data={resumeData.contact}
              onChange={(data) => updateResumeData('contact', data)}
            />
            <SummarySection
              data={resumeData.summary}
              onChange={(data) => updateResumeData('summary', data)}
            />
            <ExperienceSection
              data={resumeData.experience}
              onChange={(data) => updateResumeData('experience', data)}
            />
            <EducationSection
              data={resumeData.education}
              onChange={(data) => updateResumeData('education', data)}
            />
            <SkillsSection
              data={resumeData.skills}
              onChange={(data) => updateResumeData('skills', data)}
            />
            <OptionalSections
              projects={resumeData.projects}
              awards={resumeData.awards}
              onProjectsChange={(data) => updateResumeData('projects', data)}
              onAwardsChange={(data) => updateResumeData('awards', data)}
            />
          </div>

          {/* Right Sidebar - Preview */}
          {showPreview && (
            <div className={`${showAI || showJobMatch || showProofread || showCoverLetter || showTemplateGen || showDirectMsg || showComments || showCustomize || showHistory ? 'lg:col-span-4' : 'lg:col-span-6'} hidden lg:block`}>
              <div className="sticky top-20">
                <ResumePreview data={resumeData} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      {resumeId && (
        <ShareDialog
          open={showShare}
          onClose={() => setShowShare(false)}
          resume={resumeData}
          onUpdate={handleUpdateResume}
        />
      )}
      
      <ExportDialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        resumeData={resumeData}
      />
    </div>
  );
}