import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function SummarySection({ data, onChange }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          <CardTitle>Professional Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}