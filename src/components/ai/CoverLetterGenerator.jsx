import React, { useState } from 'react';
import { FileText, Loader2, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function CoverLetterGenerator({ resumeData }) {
  const [jobDescription, setJobDescription] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const generateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter the job description');
      return;
    }

    setGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Generate a professional cover letter based on:

JOB DESCRIPTION:
${jobDescription}

RESUME SUMMARY:
Name: ${resumeData.contact?.fullName}
Summary: ${resumeData.summary}
Experience: ${resumeData.experience?.map(e => `${e.position} at ${e.company}`).join(', ')}
Skills: ${resumeData.skills?.join(', ')}

KEY POINTS TO HIGHLIGHT:
${keyPoints || 'Focus on most relevant experience and skills'}

Write a compelling cover letter that:
1. Opens with enthusiasm for the specific role
2. Highlights 2-3 relevant achievements from the resume
3. Connects skills to job requirements
4. Shows understanding of the company/role
5. Closes with a strong call to action
6. Maintains a professional yet personable tone
7. Keeps it to 3-4 paragraphs

Format with proper business letter structure (no addresses needed, just date and greeting).`,
        add_context_from_internet: false
      });

      setCoverLetter(response);
      toast.success('Cover letter generated!');
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}