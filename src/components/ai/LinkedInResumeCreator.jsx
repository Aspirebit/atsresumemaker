import React, { useState } from 'react';
import { Linkedin, Upload, Loader2, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function LinkedInResumeCreator() {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [profileData, setProfileData] = useState('');
  const [generating, setGenerating] = useState(false);

  const extractFromLinkedIn = async () => {
    if (!linkedinUrl.trim() && !profileData.trim()) {
      toast.error('Please provide LinkedIn URL or paste profile data');
      return;
    }

    setGenerating(true);
    try {
      const prompt = linkedinUrl.trim() 
        ? `Extract resume information from this LinkedIn profile URL: ${linkedinUrl}. If you can't access the URL, inform the user to paste their profile text instead.`
        : `Parse this LinkedIn profile data and create a structured resume:

${profileData}

Extract: name, email (if available), phone, location, summary, work experience (with dates, company, position, description), education (school, degree, field, dates), skills, and any projects or certifications.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: !!linkedinUrl.trim(),
        response_json_schema: {
          type: "object",
          properties: {
            contact: {
              type: "object",
              properties: {
                fullName: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                location: { type: "string" },
                linkedin: { type: "string" }
              }
            },
            summary: { type: "string" },
            experience: {
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
            },
            education: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  school: { type: "string" },
                  degree: { type: "string" },
                  field: { type: "string" },
                  startDate: { type: "string" },
                  endDate: { type: "string" }
                }
              }
            },
            skills: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      // Create resume from LinkedIn data
      const newResume = await base44.entities.Resume.create({
        title: `${result.contact?.fullName || 'LinkedIn'} Resume`,
        template: 'professional',
        contact: result.contact || {},
        summary: result.summary || '',
        experience: result.experience || [],
        education: result.education || [],
        skills: result.skills || [],
        projects: [],
        awards: []
      });

      toast.success('Resume created from LinkedIn!');
      navigate(`${createPageUrl('Editor')}?id=${newResume.id}`);
      setShowDialog(false);
    } catch (error) {
      toast.error('Failed to create resume from LinkedIn');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowDialog(true)}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
              <Linkedin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-1 dark:text-foreground">LinkedIn Import</h3>
            <p className="text-sm text-muted-foreground">Create from profile</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-blue-600" />
              Create Resume from LinkedIn
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn Profile URL (Optional)</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              />
              <p className="text-xs text-muted-foreground mt-1">
                AI will attempt to extract data from the URL
              </p>
            </div>

            <div className="text-center text-sm text-muted-foreground">OR</div>

            <div>
              <label className="block text-sm font-medium mb-2">Paste Your LinkedIn Profile Text</label>
              <Textarea
                value={profileData}
                onChange={(e) => setProfileData(e.target.value)}
                rows={10}
                placeholder="Copy and paste your LinkedIn profile information here including your experience, education, skills, etc."
                className="font-mono text-sm"
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <Sparkles className="w-4 h-4 inline mr-1" />
                AI will parse your LinkedIn data and automatically create a professional resume
              </p>
            </div>

            <Button 
              onClick={extractFromLinkedIn} 
              disabled={generating}
              className="w-full"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Resume...
                </>
              ) : (
                'Create Resume'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}