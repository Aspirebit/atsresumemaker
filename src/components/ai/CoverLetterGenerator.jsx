import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Copy, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function CoverLetterGenerator({ resumeData, onSave }) {
  const [jobDescription, setJobDescription] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [jobAppId, setJobAppId] = useState('');
  const [jobApplications, setJobApplications] = useState([]);

  useEffect(() => {
    loadJobApplications();
  }, []);

  const loadJobApplications = async () => {
    try {
      const apps = await base44.entities.JobApplication.list('-appliedDate', 50);
      setJobApplications(apps);
    } catch (error) {
      console.error('Failed to load applications');
    }
  };

  const saveCoverLetter = async () => {
    if (!jobAppId) {
      toast.error('Please select a job application');
      return;
    }
    
    try {
      await base44.entities.JobApplication.update(jobAppId, {
        coverLetter: coverLetter
      });
      toast.success('Cover letter saved to application!');
      if (onSave) onSave();
    } catch (error) {
      toast.error('Failed to save cover letter');
    }
  };

  const generateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter the job description');
      return;
    }

    setGenerating(true);
    try {
      // First, analyze the job description for keywords and requirements
      const analysisResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this job description and extract key information:

JOB DESCRIPTION:
${jobDescription}

Extract and return a JSON object with:
1. requiredSkills: array of technical skills required
2. preferredSkills: array of nice-to-have skills
3. keyResponsibilities: array of main job duties
4. companyValues: array of company culture/values mentioned
5. experienceLevel: seniority level (entry/mid/senior)
6. keywords: array of important keywords to emphasize`,
        response_json_schema: {
          type: "object",
          properties: {
            requiredSkills: { type: "array", items: { type: "string" } },
            preferredSkills: { type: "array", items: { type: "string" } },
            keyResponsibilities: { type: "array", items: { type: "string" } },
            companyValues: { type: "array", items: { type: "string" } },
            experienceLevel: { type: "string" },
            keywords: { type: "array", items: { type: "string" } }
          }
        }
      });

      // Match resume data with job requirements
      const resumeExperience = resumeData.experience?.map(e => 
        `${e.position} at ${e.company} (${e.startDate} - ${e.endDate || 'Present'}): ${e.description}`
      ).join('\n') || 'No experience listed';

      const resumeEducation = resumeData.education?.map(e => 
        `${e.degree} in ${e.field} from ${e.school} (${e.startDate} - ${e.endDate})`
      ).join('\n') || 'No education listed';

      const resumeProjects = resumeData.projects?.map(p => 
        `${p.name}: ${p.description}${p.link ? ` (${p.link})` : ''}`
      ).join('\n') || '';

      // Generate tailored cover letter
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a highly tailored professional cover letter using this analysis:

JOB ANALYSIS:
Required Skills: ${analysisResponse.requiredSkills?.join(', ')}
Preferred Skills: ${analysisResponse.preferredSkills?.join(', ')}
Key Responsibilities: ${analysisResponse.keyResponsibilities?.join(', ')}
Company Values: ${analysisResponse.companyValues?.join(', ')}
Experience Level: ${analysisResponse.experienceLevel}
Important Keywords: ${analysisResponse.keywords?.join(', ')}

CANDIDATE INFORMATION:
Name: ${resumeData.contact?.fullName || 'Candidate'}
Email: ${resumeData.contact?.email || ''}
Phone: ${resumeData.contact?.phone || ''}
Location: ${resumeData.contact?.location || ''}

Professional Summary: ${resumeData.summary || 'No summary provided'}

Experience:
${resumeExperience}

Education:
${resumeEducation}

Skills: ${resumeData.skills?.join(', ') || 'No skills listed'}

${resumeProjects ? `Projects:\n${resumeProjects}` : ''}

KEY POINTS TO EMPHASIZE:
${keyPoints || 'Match the candidate\'s strongest skills and experience to the job requirements'}

INSTRUCTIONS:
1. Analyze which of the candidate's skills and experiences best match the job requirements
2. Open with specific enthusiasm about the role/company, mentioning why it's a good fit
3. In the body paragraphs, highlight 2-3 specific achievements that align with job responsibilities
4. Use the important keywords naturally throughout the letter
5. Connect the candidate's experience to the company values if mentioned
6. Show understanding of the role's challenges and how the candidate can address them
7. Close with confidence and clear call to action for next steps
8. Maintain professional yet personable tone appropriate for the experience level
9. Keep to 3-4 well-structured paragraphs (350-400 words)
10. Format as a business letter with proper date and salutation

Start with today's date, then "Dear Hiring Manager," (or use company name if mentioned in job description).`,
        add_context_from_internet: false
      });

      setCoverLetter(response);
      toast.success('Cover letter generated with keyword optimization!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate cover letter');
    } finally {
      setGenerating(false);
    }
  };

  const copyCoverLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    toast.success('Copied to clipboard');
  };

  const downloadCoverLetter = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${resumeData.contact?.fullName?.replace(/\s+/g, '_') || 'Document'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Downloaded cover letter');
  };

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="w-5 h-5 text-blue-600" />
          Cover Letter Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div>
          <Label className="text-xs mb-1">Job Description *</Label>
          <Textarea
            placeholder="Paste the complete job posting here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="h-32 text-sm"
          />
        </div>

        <div>
          <Label className="text-xs mb-1">Key Points to Highlight (Optional)</Label>
          <Textarea
            placeholder="e.g., Led team of 5 engineers, increased revenue by 40%, expertise in React..."
            value={keyPoints}
            onChange={(e) => setKeyPoints(e.target.value)}
            className="h-24 text-sm"
          />
        </div>

        <Button 
          onClick={generateCoverLetter} 
          disabled={generating}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Generate Cover Letter
            </>
          )}
        </Button>

        {coverLetter && (
          <div className="space-y-3 border-t pt-3">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">
                {coverLetter}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={copyCoverLetter} className="flex-1">
                <Copy className="w-3 h-3 mr-2" />
                Copy
              </Button>
              <Button size="sm" variant="outline" onClick={downloadCoverLetter} className="flex-1">
                <Download className="w-3 h-3 mr-2" />
                Download
              </Button>
            </div>
            
            <div className="border-t pt-3 space-y-2">
              <Label className="text-xs">Save to Job Application</Label>
              <Select value={jobAppId} onValueChange={setJobAppId}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Select application" />
                </SelectTrigger>
                <SelectContent>
                  {jobApplications.map((app) => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.jobTitle} - {app.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" onClick={saveCoverLetter} className="w-full" variant="secondary">
                <Save className="w-3 h-3 mr-2" />
                Save to Application
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}