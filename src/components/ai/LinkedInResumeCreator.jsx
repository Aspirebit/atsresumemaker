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
      let prompt;
      
      if (linkedinUrl.trim()) {
        prompt = `Access and scrape this LinkedIn profile URL: ${linkedinUrl}

YOUR TASK: Extract ALL visible information from the LinkedIn profile page.

WHAT TO EXTRACT:
1. Person's full name (displayed prominently at top)
2. Headline/current role (below name)
3. Location (city, state, country)
4. About section - the full text from About/Summary
5. ALL work experience entries:
   - Company name
   - Job title/role
   - Employment dates (start - end, or "Present")
   - Location
   - Job description/responsibilities
6. ALL education entries:
   - Institution name
   - Degree type
   - Field of study
   - Years attended
7. ALL skills listed in the skills section
8. Projects and certifications if available

IMPORTANT:
- Use web search to access the actual LinkedIn page
- Extract real data from the page, don't make assumptions
- If you cannot access the profile, return placeholder text "Profile access limited"
- Preserve exact formatting of dates and names`;
      } else {
        prompt = `Parse the following LinkedIn profile text and extract structured resume data:

${profileData}

Extract these fields:
- Full name
- Current job title and company
- Location
- Professional summary (from About section, 2-3 sentences)
- Work experience (all jobs with company, title, dates, location, description)
- Education (schools, degrees, fields, years)
- Skills (complete list)
- Projects/certifications

Return accurate data from the text provided.`;
      }

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
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
            },
            projects: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  link: { type: "string" }
                }
              }
            }
          }
        }
      });

      // Create resume from LinkedIn data
      const newResume = await base44.entities.Resume.create({
        title: `${result.contact?.fullName || 'LinkedIn'} Resume`,
        template: 'professional',
        contact: {
          fullName: result.contact?.fullName || '',
          email: result.contact?.email || '',
          phone: result.contact?.phone || '',
          location: result.contact?.location || '',
          linkedin: result.contact?.linkedin || linkedinUrl
        },
        summary: result.summary || '',
        experience: (result.experience || []).map(exp => ({
          company: exp.company || '',
          position: exp.position || '',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.current ? 'Present' : (exp.endDate || ''),
          current: exp.current || false,
          description: exp.description || ''
        })),
        education: (result.education || []).map(edu => ({
          school: edu.school || '',
          degree: edu.degree || '',
          field: edu.field || '',
          startDate: edu.startDate || '',
          endDate: edu.endDate || ''
        })),
        skills: result.skills || [],
        projects: result.projects || [],
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
                className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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