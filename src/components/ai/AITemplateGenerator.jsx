import React, { useState } from 'react';
import { Sparkles, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AITemplateGenerator() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState(null);

  const generateTemplate = async () => {
    if (!description.trim()) {
      toast.error('Please describe your desired template style');
      return;
    }

    setGenerating(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Based on this template style description, generate a complete resume template configuration:

DESCRIPTION: ${description}

Return a JSON object with:
1. baseTemplate: one of "professional", "modern", "creative", "minimalist", "executive"
2. customization object with:
   - fontFamily: professional font name
   - fontSize: "sm", "base", or "lg"
   - primaryColor: hex color code
   - secondaryColor: hex color for accents
   - spacing: "compact", "normal", or "relaxed"
   - sectionOrder: array of section IDs in suggested order
3. styleDescription: brief text explaining the design choices
4. suggestedName: a catchy name for this template
5. tags: array of relevant tags (e.g., "tech", "creative", "minimalist")

Make design choices that match the description while maintaining professional appeal.`,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            baseTemplate: { type: "string" },
            customization: {
              type: "object",
              properties: {
                fontFamily: { type: "string" },
                fontSize: { type: "string" },
                primaryColor: { type: "string" },
                secondaryColor: { type: "string" },
                spacing: { type: "string" },
                sectionOrder: { type: "array", items: { type: "string" } }
              }
            },
            styleDescription: { type: "string" },
            suggestedName: { type: "string" },
            tags: { type: "array", items: { type: "string" } }
          }
        }
      });

      setGeneratedTemplate(response);
      setTemplateName(response.suggestedName || 'My Custom Template');
      toast.success('Template generated!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate template');
    } finally {
      setGenerating(false);
    }
  };

  const saveTemplate = async () => {
    if (!generatedTemplate) return;

    try {
      await base44.entities.CustomTemplate.create({
        name: templateName,
        baseTemplate: generatedTemplate.baseTemplate,
        customization: generatedTemplate.customization
      });
      
      toast.success('Template saved to your library!');
      navigate(createPageUrl('Dashboard'));
    } catch (error) {
      toast.error('Failed to save template');
    }
  };

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Template Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div>
          <Label className="text-xs mb-1">Describe Your Ideal Template *</Label>
          <Textarea
            placeholder="e.g., Modern and minimalist design with a focus on tech roles. Use a clean sans-serif font, blue color scheme, and emphasize technical skills section..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-32 text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Be specific about style, colors, fonts, and any industry focus
          </p>
        </div>

        <Button 
          onClick={generateTemplate} 
          disabled={generating}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Template...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Template
            </>
          )}
        </Button>

        {generatedTemplate && (
          <div className="space-y-3 border-t pt-3">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-sm mb-2">{generatedTemplate.suggestedName}</h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">
                {generatedTemplate.styleDescription}
              </p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Base:</span>
                  <span className="ml-1 font-medium">{generatedTemplate.baseTemplate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Font:</span>
                  <span className="ml-1 font-medium">{generatedTemplate.customization.fontFamily}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Primary:</span>
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ backgroundColor: generatedTemplate.customization.primaryColor }}
                  />
                  <span className="text-xs">{generatedTemplate.customization.primaryColor}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Spacing:</span>
                  <span className="ml-1 font-medium">{generatedTemplate.customization.spacing}</span>
                </div>
              </div>

              {generatedTemplate.tags && generatedTemplate.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {generatedTemplate.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-white dark:bg-gray-800 px-2 py-0.5 rounded border">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="text-xs mb-1">Template Name</Label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="w-3 h-3 mr-2" />
                Preview
              </Button>
              <Button size="sm" onClick={saveTemplate} className="flex-1 bg-green-600 hover:bg-green-700">
                Save Template
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}