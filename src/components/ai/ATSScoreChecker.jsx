import React, { useState } from 'react';
import { Upload, FileText, Target, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ATSScoreChecker({ resumeData, onSuggestionApply }) {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [atsScore, setAtsScore] = useState(null);

  const analyzeResume = async (dataToAnalyze) => {
    setAnalyzing(true);
    try {
      const resumeText = JSON.stringify(dataToAnalyze, null, 2);
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this resume for ATS (Applicant Tracking System) compatibility and provide a detailed score and suggestions.

Resume Data:
${resumeText}

Provide analysis in the following JSON format:
{
  "overall_score": <number 0-100>,
  "keyword_optimization": <number 0-100>,
  "formatting_score": <number 0-100>,
  "content_quality": <number 0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "issues": [
    {"severity": "high|medium|low", "issue": "description", "fix": "how to fix"}
  ],
  "missing_keywords": ["keyword1", "keyword2"],
  "recommendations": [
    {"title": "recommendation title", "description": "detailed description", "impact": "high|medium|low"}
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            overall_score: { type: "number" },
            keyword_optimization: { type: "number" },
            formatting_score: { type: "number" },
            content_quality: { type: "number" },
            strengths: { type: "array", items: { type: "string" } },
            issues: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  severity: { type: "string" },
                  issue: { type: "string" },
                  fix: { type: "string" }
                }
              }
            },
            missing_keywords: { type: "array", items: { type: "string" } },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  impact: { type: "string" }
                }
              }
            }
          }
        }
      });

      setAtsScore(result);
      toast.success('ATS analysis complete');
    } catch (error) {
      toast.error('Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      
      const extractResult = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            contact: { type: "object" },
            summary: { type: "string" },
            experience: { type: "array" },
            education: { type: "array" },
            skills: { type: "array" }
          }
        }
      });

      if (extractResult.status === 'success') {
        await analyzeResume(extractResult.output);
      } else {
        toast.error('Failed to extract resume data');
      }
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          ATS Score Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!atsScore ? (
          <>
            <p className="text-sm text-muted-foreground">
              Check how well your resume performs with Applicant Tracking Systems
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => resumeData && analyzeResume(resumeData)}
                disabled={analyzing || !resumeData}
                className="w-full"
              >
                {analyzing ? (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Analyze Current Resume
                  </>
                )}
              </Button>

              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="ats-upload"
                  disabled={uploading}
                />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('ats-upload')?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-bounce" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Resume File
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Overall Score */}
            <div className={`${getScoreBgColor(atsScore.overall_score)} p-4 rounded-lg text-center`}>
              <div className={`text-4xl font-bold ${getScoreColor(atsScore.overall_score)}`}>
                {atsScore.overall_score}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">Overall ATS Score</p>
            </div>

            {/* Detailed Scores */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Keyword Optimization</span>
                  <span className="font-semibold">{atsScore.keyword_optimization}%</span>
                </div>
                <Progress value={atsScore.keyword_optimization} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Formatting</span>
                  <span className="font-semibold">{atsScore.formatting_score}%</span>
                </div>
                <Progress value={atsScore.formatting_score} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Content Quality</span>
                  <span className="font-semibold">{atsScore.content_quality}%</span>
                </div>
                <Progress value={atsScore.content_quality} />
              </div>
            </div>

            {/* Strengths */}
            {atsScore.strengths?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {atsScore.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Issues */}
            {atsScore.issues?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  Issues to Fix
                </h4>
                <div className="space-y-2">
                  {atsScore.issues.map((issue, idx) => (
                    <div key={idx} className="text-sm border-l-2 border-red-500 pl-3 py-1">
                      <p className="font-medium">{issue.issue}</p>
                      <p className="text-muted-foreground text-xs mt-1">{issue.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {atsScore.recommendations?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Recommendations</h4>
                <div className="space-y-2">
                  {atsScore.recommendations.map((rec, idx) => (
                    <div key={idx} className="text-sm bg-muted p-3 rounded-lg">
                      <p className="font-medium">{rec.title}</p>
                      <p className="text-muted-foreground text-xs mt-1">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setAtsScore(null)}
            >
              Analyze Another Resume
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}