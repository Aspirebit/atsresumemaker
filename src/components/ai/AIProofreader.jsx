import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AIProofreader({ onApply }) {
  const [text, setText] = useState('');
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState(null);

  const checkText = async () => {
    if (!text.trim()) {
      toast.error('Please enter text to proofread');
      return;
    }

    setChecking(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Proofread and analyze this resume text. Check for:
1. Grammar errors
2. Spelling mistakes
3. Punctuation issues
4. Clarity improvements
5. Conciseness suggestions
6. Professional tone

Text to check:
${text}

Return detailed feedback in JSON format with:
- errorCount: total number of issues
- errors: array of {type, issue, suggestion, position}
- overallScore: 0-100 quality score
- improvedVersion: the corrected and improved text
- generalFeedback: paragraph of overall recommendations`,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            errorCount: { type: "number" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  issue: { type: "string" },
                  suggestion: { type: "string" },
                  position: { type: "string" }
                }
              }
            },
            overallScore: { type: "number" },
            improvedVersion: { type: "string" },
            generalFeedback: { type: "string" }
          }
        }
      });

      setResults(response);
      toast.success('Proofreading complete!');
    } catch (error) {
      console.error('Proofreading error:', error);
      toast.error('Failed to proofread text');
    } finally {
      setChecking(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const errorTypeColors = {
    grammar: 'bg-red-100 text-red-700 border-red-200',
    spelling: 'bg-orange-100 text-orange-700 border-orange-200',
    punctuation: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    clarity: 'bg-blue-100 text-blue-700 border-blue-200',
    conciseness: 'bg-purple-100 text-purple-700 border-purple-200',
    tone: 'bg-pink-100 text-pink-700 border-pink-200'
  };

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Proofreader
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div>
          <Label className="text-xs mb-1">Text to Check</Label>
          <Textarea
            placeholder="Paste your resume text here for proofreading..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-32 text-sm"
          />
        </div>

        <Button 
          onClick={checkText} 
          disabled={checking}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {checking ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Check Text
            </>
          )}
        </Button>

        {results && (
          <div className="space-y-3 border-t pt-3">
            {/* Quality Score */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Quality Score</span>
                <span className={`text-2xl font-bold ${getScoreColor(results.overallScore)}`}>
                  {results.overallScore}/100
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {results.errorCount} {results.errorCount === 1 ? 'issue' : 'issues'} found
              </div>
            </div>

            {/* Errors List */}
            {results.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  Issues Found
                </h4>
                {results.errors.map((error, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-900 border rounded-lg p-3 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${errorTypeColors[error.type.toLowerCase()] || 'bg-gray-100'}`}
                      >
                        {error.type}
                      </Badge>
                      {error.position && (
                        <span className="text-xs text-muted-foreground">{error.position}</span>
                      )}
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-400">❌ {error.issue}</p>
                    <p className="text-xs text-green-700 dark:text-green-400">✓ {error.suggestion}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Improved Version */}
            {results.improvedVersion && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-green-700 dark:text-green-400">
                  Improved Version
                </h4>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                    {results.improvedVersion}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => onApply && onApply('proofread', results.improvedVersion)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Apply Improved Version
                </Button>
              </div>
            )}

            {/* General Feedback */}
            {results.generalFeedback && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">General Recommendations</h4>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {results.generalFeedback}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}