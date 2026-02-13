import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Save, Eye, EyeOff } from 'lucide-react';
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

export default function Editor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeId = searchParams.get('id');
  const template = searchParams.get('template') || 'professional';

  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
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
    awards: []
  });

  useEffect(() => {
    if (resumeId) {
      loadResume();
    }
  }, [resumeId]);

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

  const handleSave = async () => {
    setSaving(true);
    try {
      if (resumeId) {
        await base44.entities.Resume.update(resumeId, resumeData);
        toast.success('Resume saved successfully');
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

  const handleExport = async () => {
    try {
      await exportResumeToPDF(resumeData);
      toast.success('Resume exported successfully');
    } catch (error) {
      toast.error('Failed to export resume');
    }
  };

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({ ...prev, [section]: data }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(createPageUrl('Saved'))}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <input
                type="text"
                value={resumeData.title}
                onChange={(e) => updateResumeData('title', e.target.value)}
                className="text-xl font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden md:flex"
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? 'Hide' : 'Preview'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Export</span>
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">{saving ? 'Saving...' : 'Save'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-6">
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

          {/* Preview */}
          {showPreview && (
            <div className="hidden lg:block sticky top-24 h-fit">
              <ResumePreview data={resumeData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}