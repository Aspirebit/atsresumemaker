import React, { useState } from 'react';
import { Sparkles, Loader2, RefreshCw, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AIAssistant({ onApply }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  
  // Summary generation
  const [summaryInput, setSummaryInput] = useState({
    role: '',
    experience: '',
    skills: '',
    achievements: ''
  });
  
  // Experience generation
  const [experienceInput, setExperienceInput] = useState({
    position: '',
    company: '',
    responsibilities: '',
    achievements: ''
  });
  
  // Job tailoring
  const [jobDescription, setJobDescription] = useState('');
  const [currentResume, setCurrentResume] = useState('');

  const generateSummary = async () => {
    if (!summaryInput.role || !summaryInput.experience) {
      toast.error('Please fill in at least role and years of experience');
      return;
    }

    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a professional resume summary for someone with the following details:
- Role/Title: ${summaryInput.role}
- Years of Experience: ${summaryInput.experience}
- Key Skills: ${summaryInput.skills || 'Not specified'}
- Notable Achievements: ${summaryInput.achievements || 'Not specified'}

Write a compelling 3-4 sentence professional summary that highlights their expertise, value proposition, and career goals. Make it impactful and keyword-rich.`,
        add_context_from_internet: false
      });

      onApply('summary', response);
      toast.success('Summary generated! Review and apply below.');
    } catch (error) {
      toast.error('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const generateExperience = async () => {
    if (!experienceInput.position || !experienceInput.company) {
      toast.error('Please fill in position and company');
      return;
    }

    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a professional work experience description for:
- Position: ${experienceInput.position}
- Company: ${experienceInput.company}
- Responsibilities: ${experienceInput.responsibilities || 'General responsibilities for this role'}
- Achievements: ${experienceInput.achievements || 'Not specified'}

Write 4-5 bullet points using strong action verbs and quantifiable achievements where possible. Focus on impact and results. Format as plain text bullet points separated by newlines.`,
        add_context_from_internet: false
      });

      onApply('experience', response);
      toast.success('Experience description generated!');
    } catch (error) {
      toast.error('Failed to generate experience');
    } finally {
      setLoading(false);
    }
  };

  const tailorToJob = async () => {
    if (!jobDescription) {
      toast.error('Please paste the job description');
      return;
    }

    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this job description and provide tailored resume suggestions:

JOB DESCRIPTION:
${jobDescription}

${currentResume ? `CURRENT RESUME CONTENT:\n${currentResume}\n\n` : ''}

Provide:
1. Key skills and keywords to include
2. Suggested summary adjustments
3. How to reframe experience to match requirements
4. Specific achievements to highlight

Be specific and actionable.`,
        add_context_from_internet: false
      });

      onApply('tailoring', response);
      toast.success('Job tailoring suggestions generated!');
    } catch (error) {
      toast.error('Failed to generate suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-purple-200">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Resume Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="summary" className="text-xs">Summary</TabsTrigger>
            <TabsTrigger value="experience" className="text-xs">Experience</TabsTrigger>
            <TabsTrigger value="tailor" className="text-xs">Job Match</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-3">
            <div>
              <Label className="text-xs">Current Role/Title *</Label>
              <Input
                placeholder="e.g., Senior Software Engineer"
                value={summaryInput.role}
                onChange={(e) => setSummaryInput({ ...summaryInput, role: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Years of Experience *</Label>
              <Input
                placeholder="e.g., 5+ years"
                value={summaryInput.experience}
                onChange={(e) => setSummaryInput({ ...summaryInput, experience: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Key Skills</Label>
              <Input
                placeholder="e.g., React, Node.js, AWS"
                value={summaryInput.skills}
                onChange={(e) => setSummaryInput({ ...summaryInput, skills: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Notable Achievements</Label>
              <Textarea
                placeholder="e.g., Led team of 10, built scalable systems..."
                value={summaryInput.achievements}
                onChange={(e) => setSummaryInput({ ...summaryInput, achievements: e.target.value })}
                className="mt-1 h-20"
              />
            </div>
            <Button 
              onClick={generateSummary} 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
              Generate Summary
            </Button>
          </TabsContent>

          <TabsContent value="experience" className="space-y-3">
            <div>
              <Label className="text-xs">Position Title *</Label>
              <Input
                placeholder="e.g., Software Engineer"
                value={experienceInput.position}
                onChange={(e) => setExperienceInput({ ...experienceInput, position: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Company Name *</Label>
              <Input
                placeholder="e.g., Tech Corp"
                value={experienceInput.company}
                onChange={(e) => setExperienceInput({ ...experienceInput, company: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Main Responsibilities</Label>
              <Textarea
                placeholder="What did you do in this role?"
                value={experienceInput.responsibilities}
                onChange={(e) => setExperienceInput({ ...experienceInput, responsibilities: e.target.value })}
                className="mt-1 h-20"
              />
            </div>
            <div>
              <Label className="text-xs">Key Achievements</Label>
              <Textarea
                placeholder="Quantifiable results and impact..."
                value={experienceInput.achievements}
                onChange={(e) => setExperienceInput({ ...experienceInput, achievements: e.target.value })}
                className="mt-1 h-20"
              />
            </div>
            <Button 
              onClick={generateExperience} 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
              Generate Description
            </Button>
          </TabsContent>

          <TabsContent value="tailor" className="space-y-3">
            <div>
              <Label className="text-xs">Job Description *</Label>
              <Textarea
                placeholder="Paste the full job posting here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="mt-1 h-32"
              />
            </div>
            <div>
              <Label className="text-xs">Your Current Resume Summary (Optional)</Label>
              <Textarea
                placeholder="Paste your current summary to get improvement suggestions..."
                value={currentResume}
                onChange={(e) => setCurrentResume(e.target.value)}
                className="mt-1 h-24"
              />
            </div>
            <Button 
              onClick={tailorToJob} 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Analyze & Suggest
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}