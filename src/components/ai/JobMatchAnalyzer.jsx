import React, { useState } from 'react';
import { Target, Loader2, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function JobMatchAnalyzer({ resumeData, onSuggestionApply }) {
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyzeMatch = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please paste a job description');
      return;
    }

    setAnalyzing(true);
    try {
      const resumeText = `
        Summary: ${resumeData.summary}
        Experience: ${resumeData.experience?.map(e => `${e.position} at ${e.company}: ${e.description}`).join(' ')}
        Skills: ${resumeData.skills?.join(', ')}
        Education: ${resumeData.education?.map(e => `${e.degree} in ${e.field} from ${e.school}`).join(' ')}
      `;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this resume against the job description and provide detailed feedback.

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Provide a comprehensive analysis in JSON format with:
1. matchScore (0-100): Overall match percentage
2. keywordMatch: { matched: [keywords], missing: [keywords] }
3. strengthAreas: Array of strong alignment areas
4. improvementAreas: Array of areas needing improvement
5. experienceSuggestions: Array of {section: string, current: string, suggested: string, reason: string}
6. skillsToAdd: Array of skills from job description missing in resume
7. summaryRewrite: Suggested new summary optimized for this job
8. specificFeedback: Detailed paragraph of actionable feedback`,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            matchScore: { type: "number" },
            keywordMatch: {
              type: "object",
              properties: {
                matched: { type: "array", items: { type: "string" } },
                missing: { type: "array", items: { type: "string" } }
              }
            },
            strengthAreas: { type: "array", items: { type: "string" } },
            improvementAreas: { type: "array", items: { type: "string" } },
            experienceSuggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  section: { type: "string" },
                  current: { type: "string" },
                  suggested: { type: "string" },
                  reason: { type: "string" }
                }
              }
            },
            skillsToAdd: { type: "array", items: { type: "string" } },
            summaryRewrite: { type: "string" },
            specificFeedback: { type: "string" }
          }
        }
      });

      setAnalysis(response);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze job match');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="w-5 h-5 text-blue-600" />
            Job Match Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div>
            <Label className="text-xs">Job Description</Label>
            <Textarea
              placeholder="Paste the complete job posting here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="mt-1 h-40 text-sm"
            />
          </div>
          <Button 
            onClick={analyzeMatch} 
            disabled={analyzing}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Analyze Match
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-4">
          {/* Match Score */}
          <Card className={getScoreBg(analysis.matchScore)}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Match Score</span>
                <span className={`text-2xl font-bold ${getScoreColor(analysis.matchScore)}`}>
                  {analysis.matchScore}%
                </span>
              </div>
              <Progress value={analysis.matchScore} className="h-2" />
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Keyword Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {analysis.keywordMatch.matched.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium">Matched Keywords</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.keywordMatch.matched.map((keyword, idx) => (
                      <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {analysis.keywordMatch.missing.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-medium">Missing Keywords</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.keywordMatch.missing.map((keyword, idx) => (
                      <Badge key={idx} variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-1">
                  {analysis.strengthAreas.map((area, idx) => (
                    <li key={idx} className="text-xs text-gray-700">• {area}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  Improvements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-1">
                  {analysis.improvementAreas.map((area, idx) => (
                    <li key={idx} className="text-xs text-gray-700">• {area}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Experience Suggestions */}
          {analysis.experienceSuggestions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Experience Rephrasing Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {analysis.experienceSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="border rounded-lg p-3 space-y-2">
                    <p className="text-xs font-medium text-blue-600">{suggestion.section}</p>
                    <div className="space-y-1">
                      <div className="bg-red-50 border border-red-200 rounded p-2">
                        <p className="text-xs text-gray-600 mb-1">Current:</p>
                        <p className="text-xs text-gray-800">{suggestion.current}</p>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded p-2">
                        <p className="text-xs text-gray-600 mb-1">Suggested:</p>
                        <p className="text-xs text-gray-800">{suggestion.suggested}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 italic">{suggestion.reason}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Summary Rewrite */}
          {analysis.summaryRewrite && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Optimized Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-gray-800">{analysis.summaryRewrite}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onSuggestionApply('summary', analysis.summaryRewrite)}
                  className="w-full"
                >
                  Apply to Resume
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Feedback */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Detailed Feedback</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-xs text-gray-700 leading-relaxed">{analysis.specificFeedback}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}