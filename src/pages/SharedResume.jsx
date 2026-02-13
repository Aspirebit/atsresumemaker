import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { exportResumeToPDF } from '@/components/utils/pdfExport';
import ProfessionalTemplate from '@/components/resume/templates/ProfessionalTemplate';
import ModernTemplate from '@/components/resume/templates/ModernTemplate';
import CreativeTemplate from '@/components/resume/templates/CreativeTemplate';
import MinimalistTemplate from '@/components/resume/templates/MinimalistTemplate';
import ExecutiveTemplate from '@/components/resume/templates/ExecutiveTemplate';

export default function SharedResume() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const templateComponents = {
    professional: ProfessionalTemplate,
    modern: ModernTemplate,
    creative: CreativeTemplate,
    minimalist: MinimalistTemplate,
    executive: ExecutiveTemplate,
  };

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    try {
      const data = await base44.entities.Resume.get(id);
      setResume(data);
    } catch (error) {
      console.error('Failed to load resume:', error);
      setError('Resume not found or not accessible');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportResumeToPDF(resume);
      toast.success('Resume exported successfully');
    } catch (error) {
      toast.error('Failed to export resume');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-foreground mb-2">
              Resume Not Available
            </h2>
            <p className="text-gray-600 dark:text-muted-foreground">
              {error || 'This resume could not be found.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const TemplateComponent = templateComponents[resume.template] || ProfessionalTemplate;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-1">
                {resume.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">
                Shared resume • {resume.template} template
              </p>
            </div>
            <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Resume Preview */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-white dark:bg-gray-100 p-8">
              <TemplateComponent data={resume} />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500 dark:text-muted-foreground">
          <p>Created with Resume Builder</p>
        </div>
      </div>
    </div>
  );
}