import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ResumePreview from '@/components/resume/ResumePreview';

export default function AIWorkflow({ open, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedResume, setGeneratedResume] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    currentRole: '',
    yearsExperience: '',
    skills: '',
    workHistory: '',
    education: '',
    achievements: '',
    template: 'professional'
  });

  const templates = [
    { id: 'professional', name: 'Professional', color: 'bg-blue-500' },
    { id: 'modern', name: 'Modern', color: 'bg-gradient-to-br from-purple-500 to-blue-500' },
    { id: 'creative', name: 'Creative', color: 'bg-gradient-to-br from-pink-500 to-orange-500' },
    { id: 'minimalist', name: 'Minimalist', color: 'bg-gray-700' },
    { id: 'executive', name: 'Executive', color: 'bg-gray-900' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateResume = async () => {
    setLoading(true);
    try {
      // Generate Summary
      const summaryResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a professional resume summary for:
- Name: ${formData.fullName}
- Current Role: ${formData.currentRole}
- Years of Experience: ${formData.yearsExperience}
- Key Skills: ${formData.skills}
- Notable Achievements: ${formData.achievements}

Write a compelling 3-4 sentence summary that highlights their value proposition.`,
        add_context_from_internet: false
      });

      // Parse work history into structured experience
      const experienceResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Parse this work history into structured experience entries:
${formData.workHistory}

Return a JSON array of experience objects with: company, position, location, startDate, endDate, current (boolean), description (bullet points).
Format dates as "MMM YYYY". If current position, set current to true and endDate to "Present".`,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            experiences: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  company: { type: "string" },
                  position: { type: "string" },
                  location: { type: "string" },
                  startDate: { type: "string" },
                  endDate: { type: "string" },
                  current: { type: "boolean" },
                  description: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Parse education
      const educationResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Parse this education history into structured entries:
${formData.education}

Return a JSON array of education objects with: school, degree, field, location, startDate, endDate, gpa (if mentioned).
Format dates as "MMM YYYY".`,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            education: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  school: { type: "string" },
                  degree: { type: "string" },
                  field: { type: "string" },
                  location: { type: "string" },
                  startDate: { type: "string" },
                  endDate: { type: "string" },
                  gpa: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Build the resume object
      const resumeData = {
        title: `${formData.fullName} - ${formData.currentRole}`,
        template: formData.template,
        contact: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          linkedin: '',
          website: ''
        },
        summary: summaryResponse,
        experience: experienceResponse.experiences || [],
        education: educationResponse.education || [],
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
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
      };

      setGeneratedResume(resumeData);
      setStep(4);
      toast.success('Resume generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveResume = async () => {
    setLoading(true);
    try {
      const created = await base44.entities.Resume.create(generatedResume);
      toast.success('Resume saved!');
      navigate(`${createPageUrl('Editor')}?id=${created.id}`);
      onClose();
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      location: '',
      currentRole: '',
      yearsExperience: '',
      skills: '',
      workHistory: '',
      education: '',
      achievements: '',
      template: 'professional'
    });
    setGeneratedResume(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Resume Builder
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-purple-900">
                Let's create your resume together! I'll guide you through a few questions and automatically build a professional resume.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="John Doe"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="mt-1"
                />
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!formData.fullName || !formData.email}
              className="w-full"
            >
              Next: Professional Info
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step 2: Professional Info */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                Tell me about your professional background. I'll use this to create compelling content.
              </p>
            </div>

            <div>
              <Label>Current Role/Title *</Label>
              <Input
                value={formData.currentRole}
                onChange={(e) => handleInputChange('currentRole', e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Years of Experience *</Label>
              <Input
                value={formData.yearsExperience}
                onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                placeholder="e.g., 5+ years"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Key Skills (comma-separated) *</Label>
              <Input
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="e.g., React, Node.js, AWS, Leadership"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Work History *</Label>
              <Textarea
                value={formData.workHistory}
                onChange={(e) => handleInputChange('workHistory', e.target.value)}
                placeholder="Describe your work experience. Include company names, positions, dates, and key responsibilities. Be as detailed as possible."
                className="mt-1 h-32"
              />
            </div>

            <div>
              <Label>Education Background *</Label>
              <Textarea
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                placeholder="Describe your education. Include school names, degrees, fields of study, and graduation dates."
                className="mt-1 h-24"
              />
            </div>

            <div>
              <Label>Notable Achievements</Label>
              <Textarea
                value={formData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                placeholder="Any awards, certifications, or major accomplishments you want to highlight."
                className="mt-1 h-20"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!formData.currentRole || !formData.yearsExperience || !formData.skills || !formData.workHistory || !formData.education}
                className="flex-1"
              >
                Next: Choose Template
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Template Selection */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                Almost there! Choose a template style for your resume.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleInputChange('template', template.id)}
                  className={`cursor-pointer rounded-lg border-2 transition-all ${
                    formData.template === template.id
                      ? 'border-purple-500 ring-2 ring-purple-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`${template.color} h-32 rounded-t-lg`} />
                  <div className="p-3 text-center">
                    <h3 className="font-semibold text-sm">{template.name}</h3>
                    {formData.template === template.id && (
                      <Check className="w-4 h-4 text-purple-600 mx-auto mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={generateResume}
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Your Resume...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Preview & Save */}
        {step === 4 && generatedResume && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900 font-medium">
                ✨ Your resume is ready! Review it below and save to continue editing.
              </p>
            </div>

            <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
              <ResumePreview data={generatedResume} />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSaveResume}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Save & Edit Resume
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}