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
        prompt = `You are analyzing a LinkedIn profile from this URL: ${linkedinUrl}

CRITICAL INSTRUCTIONS - EXTRACT EXACTLY WHAT YOU SEE:
1. NAME: Extract the exact full name shown at the top of the profile
2. HEADLINE: The professional headline/title shown under the name
3. LOCATION: The exact location text (e.g., "Surat, Gujarat, India")
4. ABOUT/SUMMARY: Copy the entire "About" section text. If long, summarize into 2-3 professional sentences
5. EXPERIENCE: For EACH job listed:
   - Exact company name as shown
   - Exact job title/position
   - Location if mentioned
   - Start date and end date (format as shown: "Jan 2020", "2020", "Present")
   - Copy the job description/bullets exactly as written
6. EDUCATION: For each entry:
   - Exact school/university name
   - Exact degree name (Bachelor's, Master's, etc.)
   - Field of study
   - Years attended (start-end or just end year)
7. SKILLS: Extract ALL skills listed in the Skills section - copy the exact skill names as shown
8. PROJECTS/CERTIFICATIONS: If present, extract name and description

DO NOT invent or assume information. Only extract what you can clearly see on the profile.`;
      } else {
        prompt = `You are parsing pasted LinkedIn profile text. Extract information EXACTLY as written:

${profileData}

EXTRACTION RULES:
1. NAME: Find the person's full name (usually at the very top or in contact info)
2. CURRENT ROLE: Extract current job title and company (usually in headline or first experience)
3. LOCATION: Find city, state/country mentioned
4. ABOUT: Look for "About" or "Summary" section - extract the full text or create a 2-3 sentence professional summary if the about section is present
5. EXPERIENCE: For EVERY job mentioned:
   - Company name (look for company names, organizations)
   - Position/title held
   - Location if mentioned
   - Dates worked (format: "Jan 2020 - Present", "2019-2021", etc.)
   - Job description or responsibilities (bullets or paragraphs)
6. EDUCATION: For each school:
   - School/University name
   - Degree obtained (BS, BA, MS, MBA, etc.)
   - Field of study (Computer Science, Business, etc.)
   - Years (graduation year or range)
7. SKILLS: Look for skills section - extract EVERY skill mentioned (technical, soft skills, tools, languages)
8. PROJECTS/CERTIFICATIONS: If mentioned, extract project names and descriptions

CRITICAL: 
- Do NOT make up or infer information
- Extract dates EXACTLY as written
- Keep company and school names EXACTLY as shown
- Include ALL skills listed, not just a sample
- If information is missing, leave that field empty`;
      }

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