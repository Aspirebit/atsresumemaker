import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AIResumeEnhancer({ resumeData, onApply }) {
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzResume = async () => {
    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this resume and provide specific improvement suggestions for each section. 
        
Resume:
Summary: ${resumeData.summary}
Experience: ${JSON.stringify(resumeData.experience)}
Skills: ${resumeData.skills?.join(', ')}

Provide:
1. ATS Compatibility Score (0-100)
2. Readability Score (0-100)
3. Specific improvements for each section
4. Keywords to add
5. Structure improvements

Format as JSON with: atsScore, readabilityScore, improvements (array), keywords, structureTips`,
        response_json_schema: {
          type: "object",
          properties: {
            atsScore: { type: "number" },
            readabilityScore: { type: "number" },
            improvements: { 
              type: "array",
              items: {
                type: "object",
                properties: {
                  section: { type: "string" },
                  issue: { type: "string" },
                  suggestion: { type: "string" },
                  priority: { type: "string" }
                }
              }
            },
            keywords: { type: "array", items: { type: "string" } },
            structureTips: { type: "array", items: { type: "string" } }
          }
        }
      });
      
      setSuggestions(response);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    };
    return colors[priority?.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Resume Enhancer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!suggestions ? (
          <Button onClick={analyzResume} disabled={loading} className="w-full">
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </Button>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`text-3xl font-bold ${getScoreColor(suggestions.atsScore)}`}>
                  {suggestions.atsScore}%
                </div>
                <div className="text-xs text-muted-foreground">ATS Score</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`text-3xl font-bold ${getScoreColor(suggestions.readabilityScore)}`}>
                  {suggestions.readabilityScore}%
                </div>
                <div className="text-xs text-muted-foreground">Readability</div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Improvements</h4>
              {suggestions.improvements?.slice(0, 5).map((imp, i) => (
                <div key={i} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium text-sm">{imp.section}</span>
                    <Badge className={getPriorityColor(imp.priority)}>{imp.priority}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{imp.issue}</p>
                  <p className="text-xs text-green-700 dark:text-green-400">
                    <CheckCircle className="w-3 h-3 inline mr-1" />
                    {imp.suggestion}
                  </p>
                </div>
              ))}
            </div>

            {suggestions.keywords?.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Suggested Keywords</h4>
                <div className="flex flex-wrap gap-1">
                  {suggestions.keywords.slice(0, 8).map((kw, i) => (
                    <Badge key={i} variant="outline">{kw}</Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}