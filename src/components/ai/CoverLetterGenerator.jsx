import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Copy, Download, Save, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function CoverLetterGenerator({ resumeData, onSave }) {
  const [jobDescription, setJobDescription] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [generating, setGenerating] = useState(false);
  const [improvingSuggestions, setImprovingSuggestions] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [variations, setVariations] = useState([]);
  const [activeVariation, setActiveVariation] = useState(0);
  const [improvementSuggestions, setImprovementSuggestions] = useState(null);
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [jobAppId, setJobAppId] = useState('');
  const [saveToResume, setSaveToResume] = useState(false);
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
    try {
      const promises = [];
      
      // Save to job application if selected
      if (jobAppId) {
        promises.push(
          base44.entities.JobApplication.update(jobAppId, {
            coverLetter: coverLetter
          })
        );
      }
      
      // Save to resume if enabled
      if (saveToResume && resumeData?.id) {
        promises.push(
          base44.entities.Resume.update(resumeData.id, {
            coverLetter: coverLetter
          })
        );
      }
      
      if (promises.length === 0) {
        toast.error('Please select where to save the cover letter');
        return;
      }
      
      await Promise.all(promises);
      
      const destinations = [];
      if (jobAppId) destinations.push('job application');
      if (saveToResume) destinations.push('resume');
      
      toast.success(`Cover letter saved to ${destinations.join(' and ')}!`);
      if (onSave) onSave();
    } catch (error) {
      toast.error('Failed to save cover letter');
    }
  };

  const generateVariations = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter the job description');
      return;
    }

    setGenerating(true);
    try {
      toast.info('Generating 3 variations for A/B testing...');
      
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

      // Define tone and length descriptions
      const toneDescriptions = {
        professional: 'traditional, formal, and conservative corporate language',
        modern: 'contemporary, engaging, and dynamic tone',
        balanced: 'professional yet personable, approachable but respectful',
        enthusiastic: 'energetic, passionate, and highly motivated tone'
      };

      const lengthDescriptions = {
        short: '2-3 concise paragraphs (200-250 words)',
        medium: '3-4 well-structured paragraphs (300-400 words)',
        long: '4-5 detailed paragraphs (400-500 words)'
      };

      // Generate 3 variations with slight stylistic differences
      const tones = [
        { name: 'Variation 1', desc: toneDescriptions[tone] },
        { name: 'Variation 2', desc: toneDescriptions[tone] + ' with slightly more emphasis on achievements' },
        { name: 'Variation 3', desc: toneDescriptions[tone] + ' with focus on company alignment' }
      ];

      const generatedVariations = [];

      for (const [index, tone] of tones.entries()) {
        const response = await base44.integrations.Core.InvokeLLM({
          prompt: `Generate a highly tailored professional cover letter with a ${tone.desc} using this analysis:

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
8. Maintain the specified tone: ${tone.desc}
9. Target length: ${lengthDescriptions[length]}
10. Include quantifiable achievements where possible
11. Format as a business letter with proper date and salutation

Start with today's date, then "Dear Hiring Manager," (or use company name if mentioned in job description).

IMPORTANT: This is variation ${index + 1}. ${tone.desc}. Make it distinct but high quality.`,
          add_context_from_internet: false
        });

        generatedVariations.push({
          title: tone.name,
          content: response
        });
      }

      setVariations(generatedVariations);
      setCoverLetter(generatedVariations[0].content);
      setActiveVariation(0);
      toast.success('3 variations generated! Compare and choose the best.');
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

  const getSuggestions = async () => {
    if (!coverLetter || !variations[activeVariation]) {
      toast.error('Generate a cover letter first');
      return;
    }

    setImprovingSuggestions(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this cover letter and provide specific improvement suggestions:

COVER LETTER:
${variations[activeVariation].content}

Provide detailed feedback on:
1. **Clarity Issues**: Identify sentences that are unclear, overly complex, or wordy with specific fixes
2. **Persuasiveness**: Suggest ways to make arguments more compelling and impactful
3. **Structure**: Advise on paragraph organization and flow improvements
4. **Keyword Optimization**: Suggest relevant industry keywords to add naturally
5. **Specific Edits**: Provide 3-5 concrete sentence-level improvements with before/after examples

Be specific, actionable, and provide improved versions.`,
        response_json_schema: {
          type: "object",
          properties: {
            overallScore: { type: "number", description: "Score 1-10" },
            clarityIssues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  issue: { type: "string" },
                  suggestion: { type: "string" }
                }
              }
            },
            persuasivenessImprovements: {
              type: "array",
              items: { type: "string" }
            },
            structureAdvice: { type: "string" },
            keywordSuggestions: {
              type: "array",
              items: { type: "string" }
            },
            specificEdits: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  original: { type: "string" },
                  improved: { type: "string" },
                  reason: { type: "string" }
                }
              }
            }
          }
        }
      });

      setImprovementSuggestions(result);
      toast.success('Suggestions ready!');
    } catch (error) {
      console.error('Suggestion error:', error);
      toast.error('Failed to generate suggestions');
    } finally {
      setImprovingSuggestions(false);
    }
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs mb-1">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1">Length</Label>
            <Select value={length} onValueChange={setLength}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short (200-250 words)</SelectItem>
                <SelectItem value="medium">Medium (300-400 words)</SelectItem>
                <SelectItem value="long">Long (400-500 words)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={generateVariations} 
            disabled={generating}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate 3 Variations
              </>
            )}
          </Button>
          {variations.length > 0 && (
            <Button 
              onClick={generateVariations} 
              disabled={generating}
              variant="outline"
              size="icon"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>

        {variations.length > 0 && (
          <div className="space-y-3 border-t pt-3">
            <Tabs value={activeVariation.toString()} onValueChange={(v) => {
              const idx = parseInt(v);
              setActiveVariation(idx);
              setCoverLetter(variations[idx].content);
            }}>
              <TabsList className="grid w-full grid-cols-3">
                {variations.map((v, idx) => (
                  <TabsTrigger key={idx} value={idx.toString()} className="text-xs">
                    {v.title.split('&')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {variations.map((variation, idx) => (
                <TabsContent key={idx} value={idx.toString()} className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">
                      {variation.content}
                    </pre>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {improvementSuggestions && (
              <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI Improvement Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Score:</span>
                    <Badge>{improvementSuggestions.overallScore}/10</Badge>
                  </div>

                  {improvementSuggestions.clarityIssues?.length > 0 && (
                    <div>
                      <p className="font-semibold mb-1">📝 Clarity</p>
                      <div className="space-y-1">
                        {improvementSuggestions.clarityIssues.map((item, idx) => (
                          <Card key={idx} className="p-2 bg-background">
                            <p className="text-destructive mb-1">{item.issue}</p>
                            <p className="text-primary">💡 {item.suggestion}</p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {improvementSuggestions.persuasivenessImprovements?.length > 0 && (
                    <div>
                      <p className="font-semibold mb-1">💪 Persuasiveness</p>
                      <ul className="space-y-1 list-disc list-inside">
                        {improvementSuggestions.persuasivenessImprovements.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {improvementSuggestions.structureAdvice && (
                    <div>
                      <p className="font-semibold mb-1">🏗️ Structure</p>
                      <Card className="p-2 bg-background">
                        <p>{improvementSuggestions.structureAdvice}</p>
                      </Card>
                    </div>
                  )}

                  {improvementSuggestions.keywordSuggestions?.length > 0 && (
                    <div>
                      <p className="font-semibold mb-1">🔑 Keywords</p>
                      <div className="flex flex-wrap gap-1">
                        {improvementSuggestions.keywordSuggestions.map((kw, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {improvementSuggestions.specificEdits?.length > 0 && (
                    <div>
                      <p className="font-semibold mb-1">✏️ Specific Edits</p>
                      <div className="space-y-2">
                        {improvementSuggestions.specificEdits.map((edit, idx) => (
                          <Card key={idx} className="p-2 bg-background">
                            <p className="text-muted-foreground mb-1">Before: {edit.original}</p>
                            <p className="text-primary font-medium mb-1">After: {edit.improved}</p>
                            <p className="italic">{edit.reason}</p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={copyCoverLetter} className="flex-1">
                <Copy className="w-3 h-3 mr-2" />
                Copy
              </Button>
              <Button size="sm" variant="outline" onClick={downloadCoverLetter} className="flex-1">
                <Download className="w-3 h-3 mr-2" />
                Download
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={getSuggestions}
                disabled={improvingSuggestions}
                className="flex-1"
              >
                {improvingSuggestions ? (
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 mr-2" />
                )}
                Improve
              </Button>
            </div>
            
            <div className="border-t pt-3 space-y-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Save Options</Label>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Job Application (Optional)</Label>
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
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="saveToResume"
                      checked={saveToResume}
                      onChange={(e) => setSaveToResume(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <Label htmlFor="saveToResume" className="text-xs cursor-pointer">
                      Also save to resume for future use
                    </Label>
                  </div>
                </div>
              </div>
              
              <Button size="sm" onClick={saveCoverLetter} className="w-full bg-green-600 hover:bg-green-700">
                <Save className="w-3 h-3 mr-2" />
                Save Cover Letter
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}