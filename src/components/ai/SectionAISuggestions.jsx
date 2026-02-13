import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function SectionAISuggestions({ section, content, onApplySuggestion }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const analyzeSectionContent = async () => {
    if (!content || content.trim() === '') {
      toast.error('Please add some content first');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this ${section} section from a resume and provide specific, actionable improvements:

CONTENT:
${content}

Provide detailed suggestions for:
1. **Action Verbs**: Identify weak verbs and suggest stronger, more impactful alternatives
2. **Quantification**: Point out statements that should include numbers, percentages, or metrics
3. **Keywords**: Suggest industry-relevant keywords to add based on common job roles
4. **Format & Length**: Advise on optimal formatting and whether content should be expanded or condensed
5. **Improved Versions**: Provide 2-3 rewritten versions of the most important bullet points with stronger impact

Be specific with examples and actionable recommendations.`,
        response_json_schema: {
          type: "object",
          properties: {
            overallScore: { type: "number", description: "Score 1-10" },
            actionVerbs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  current: { type: "string" },
                  suggested: { type: "array", items: { type: "string" } },
                  context: { type: "string" }
                }
              }
            },
            quantificationOpportunities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  statement: { type: "string" },
                  suggestion: { type: "string" }
                }
              }
            },
            keywords: {
              type: "array",
              items: { type: "string" },
              description: "Relevant keywords to add"
            },
            formatAdvice: { type: "string" },
            improvedVersions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  original: { type: "string" },
                  improved: { type: "string" },
                  reasoning: { type: "string" }
                }
              }
            }
          }
        }
      });

      setSuggestions(result);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Section analysis error:', error);
      toast.error('Failed to analyze section');
    } finally {
      setAnalyzing(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Suggestions for {section}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={analyzeSectionContent}
          disabled={analyzing}
          className="w-full"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Get AI Suggestions
            </>
          )}
        </Button>

        {suggestions && (
          <div className="mt-4 space-y-4">
            {/* Overall Score */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Overall Score:</span>
              <Badge className="text-lg px-3 py-1">
                {suggestions.overallScore}/10
              </Badge>
            </div>

            {/* Action Verbs */}
            {suggestions.actionVerbs?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-sm">🎯 Action Verb Improvements</h4>
                <div className="space-y-2">
                  {suggestions.actionVerbs.map((item, idx) => (
                    <Card key={idx} className="p-3 bg-muted/50">
                      <p className="text-sm mb-1">
                        <span className="text-destructive line-through">{item.current}</span>
                        {' → '}
                        <span className="text-primary font-medium">{item.suggested.join(', ')}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{item.context}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Quantification Opportunities */}
            {suggestions.quantificationOpportunities?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-sm">📊 Add Quantifiable Metrics</h4>
                <div className="space-y-2">
                  {suggestions.quantificationOpportunities.map((item, idx) => (
                    <Card key={idx} className="p-3 bg-muted/50">
                      <p className="text-sm mb-1 text-muted-foreground italic">"{item.statement}"</p>
                      <p className="text-sm text-primary">💡 {item.suggestion}</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {suggestions.keywords?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-sm">🔑 Suggested Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestions.keywords.map((keyword, idx) => (
                    <Badge key={idx} variant="outline" className="cursor-pointer hover:bg-primary/10">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Format Advice */}
            {suggestions.formatAdvice && (
              <div>
                <h4 className="font-semibold mb-2 text-sm">📝 Format & Length Advice</h4>
                <Card className="p-3 bg-muted/50">
                  <p className="text-sm">{suggestions.formatAdvice}</p>
                </Card>
              </div>
            )}

            {/* Improved Versions */}
            {suggestions.improvedVersions?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-sm">✨ Improved Versions</h4>
                <div className="space-y-3">
                  {suggestions.improvedVersions.map((item, idx) => (
                    <Card key={idx} className="p-4 bg-muted/50">
                      <div className="mb-2">
                        <span className="text-xs font-medium text-muted-foreground">ORIGINAL:</span>
                        <p className="text-sm text-muted-foreground mt-1">{item.original}</p>
                      </div>
                      <div className="mb-2">
                        <span className="text-xs font-medium text-primary">IMPROVED:</span>
                        <p className="text-sm font-medium mt-1">{item.improved}</p>
                      </div>
                      <p className="text-xs text-muted-foreground italic">Why: {item.reasoning}</p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(item.improved, idx)}
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3 h-3 mr-1" />
                          ) : (
                            <Copy className="w-3 h-3 mr-1" />
                          )}
                          Copy
                        </Button>
                        {onApplySuggestion && (
                          <Button
                            size="sm"
                            onClick={() => onApplySuggestion(item.improved)}
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}