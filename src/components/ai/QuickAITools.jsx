import React, { useState } from 'react';
import { Sparkles, FileText, Upload, BarChart3, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function QuickAITools({ onCoverLetterClick }) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showATSDialog, setShowATSDialog] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyzeResume = async () => {
    if (!resumeFile) {
      toast.error('Please upload a resume file');
      return;
    }

    setAnalyzing(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: resumeFile });
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this resume and provide detailed feedback on:
1. Key skills identified
2. Experience level and highlights
3. Areas for improvement
4. Suggestions for better ATS compatibility
5. Overall strength rating (1-10)

Be specific and actionable in your feedback.`,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            keySkills: { type: "array", items: { type: "string" } },
            experienceLevel: { type: "string" },
            highlights: { type: "array", items: { type: "string" } },
            improvements: { type: "array", items: { type: "string" } },
            atsCompatibility: { type: "string" },
            overallRating: { type: "number" },
            summary: { type: "string" }
          }
        }
      });

      setAnalysis(result);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const checkATSScore = async () => {
    if (!jobDesc.trim()) {
      toast.error('Please enter job description');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this job description and provide ATS optimization tips:

${jobDesc}

Return:
1. Key keywords to include in resume
2. ATS-friendly formatting tips
3. Common ATS pitfalls to avoid
4. Skill match requirements`,
        response_json_schema: {
          type: "object",
          properties: {
            keywords: { type: "array", items: { type: "string" } },
            formattingTips: { type: "array", items: { type: "string" } },
            pitfalls: { type: "array", items: { type: "string" } },
            skillRequirements: { type: "array", items: { type: "string" } }
          }
        }
      });

      setAnalysis(result);
      toast.success('ATS analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze job description');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onCoverLetterClick}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold mb-1 dark:text-foreground">AI Cover Letter</h3>
            <p className="text-sm text-muted-foreground">Generate tailored letters</p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowUploadDialog(true)}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold mb-1 dark:text-foreground">Resume Analysis</h3>
            <p className="text-sm text-muted-foreground">AI-powered feedback</p>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowATSDialog(true)}>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-3">
              <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold mb-1 dark:text-foreground">ATS Scanner</h3>
            <p className="text-sm text-muted-foreground">Check compatibility</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Resume Analysis</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Upload Resume (PDF, DOCX)</label>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="w-full"
              />
            </div>
            <Button onClick={analyzeResume} disabled={analyzing} className="w-full">
              {analyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : 'Analyze Resume'}
            </Button>
            
            {analysis && (
              <div className="space-y-4 border-t pt-4">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Overall Rating: {analysis.overallRating}/10</h4>
                  <p className="text-sm">{analysis.summary}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Key Skills Identified</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keySkills?.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Areas for Improvement</h4>
                  <ul className="space-y-1">
                    {analysis.improvements?.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-orange-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showATSDialog} onOpenChange={setShowATSDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ATS Scanner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Job Description</label>
              <Textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={6}
                placeholder="Paste the complete job posting..."
              />
            </div>
            <Button onClick={checkATSScore} disabled={analyzing} className="w-full">
              {analyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</> : 'Analyze for ATS'}
            </Button>
            
            {analysis && (
              <div className="space-y-4 border-t pt-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Keywords to Include</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords?.map((keyword, i) => (
                      <span key={i} className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Formatting Tips</h4>
                  <ul className="space-y-1">
                    {analysis.formattingTips?.map((tip, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-blue-500">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Common Pitfalls to Avoid</h4>
                  <ul className="space-y-1">
                    {analysis.pitfalls?.map((pitfall, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-red-500">✗</span>
                        <span>{pitfall}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}