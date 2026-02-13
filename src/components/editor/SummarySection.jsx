import React, { useState } from 'react';
import { FileText, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import SectionAISuggestions from '@/components/ai/SectionAISuggestions';

export default function SummarySection({ data, onChange }) {
  const [showAI, setShowAI] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <CardTitle>Professional Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label htmlFor="summary">Summary or Objective</Label>
          <Textarea
            id="summary"
            value={data || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write a brief professional summary highlighting your experience, skills, and career objectives..."
            rows={5}
            className="mt-2"
          />
          <p className="text-sm text-gray-500 mt-2">
            Tip: Keep it concise (2-4 sentences) and focus on your unique value proposition.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAI(!showAI)}
          className="w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {showAI ? 'Hide' : 'Get'} AI Suggestions
          {showAI ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
        </Button>

        {showAI && (
          <SectionAISuggestions
            section="Summary"
            content={data}
            onApplySuggestion={(improved) => onChange(improved)}
          />
        )}
      </CardContent>
    </Card>
  );
}