import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function JobApplicationAssistant({ resumeData }) {
  const [loading, setLoading] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    jobUrl: '',
    formFields: ''
  });
  const [generatedAnswers, setGeneratedAnswers] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const handleGenerate = async () => {
    if (!applicationForm.formFields.trim()) {
      toast.error('Please enter the form fields');
      return;
    }

    setLoading(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert job application assistant. Based on the following resume data and form fields, generate professional responses for each field.

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Form Fields to Fill:
${applicationForm.formFields}

For each field, provide a concise, professional answer that highlights relevant experience from the resume. Format your response as a JSON object where keys are field names and values are the suggested answers.

Example format:
{
  "Why do you want to work here": "I am excited about...",
  "Describe your experience": "I have X years of experience in..."
}`,
        response_json_schema: {
          type: "object",
          properties: {
            answers: {
              type: "object",
              additionalProperties: { type: "string" }
            }
          }
        }
      });

      setGeneratedAnswers(response.answers);
      toast.success('Application form filled successfully!');
    } catch (error) {
      toast.error('Failed to generate answers');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (field, value) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Job Application Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Job Application URL (optional)</Label>
          <Input
            value={applicationForm.jobUrl}
            onChange={(e) => setApplicationForm({ ...applicationForm, jobUrl: e.target.value })}
            placeholder="https://company.com/apply"
          />
        </div>

        <div>
          <Label>Application Form Fields</Label>
          <Textarea
            value={applicationForm.formFields}
            onChange={(e) => setApplicationForm({ ...applicationForm, formFields: e.target.value })}
            placeholder="List each question/field on a new line:&#10;- Why do you want to work here?&#10;- Describe your relevant experience&#10;- What are your salary expectations?"
            rows={6}
          />
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Answers...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Answers
            </>
          )}
        </Button>

        {generatedAnswers && (
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Generated Answers:</h3>
            {Object.entries(generatedAnswers).map(([field, answer]) => (
              <div key={field} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{field}</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCopy(field, answer)}
                  >
                    {copiedField === field ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{answer}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}