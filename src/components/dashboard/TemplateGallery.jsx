import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createPageUrl } from '@/utils';
import ProfessionalTemplate from '@/components/resume/templates/ProfessionalTemplate';
import ModernTemplate from '@/components/resume/templates/ModernTemplate';
import CreativeTemplate from '@/components/resume/templates/CreativeTemplate';
import MinimalistTemplate from '@/components/resume/templates/MinimalistTemplate';
import ExecutiveTemplate from '@/components/resume/templates/ExecutiveTemplate';

export default function TemplateGallery({ open, onClose }) {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean and traditional layout perfect for corporate roles',
      component: ProfessionalTemplate,
      popular: true,
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design with gradient accents',
      component: ModernTemplate,
      popular: true,
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Eye-catching sidebar layout for creative industries',
      component: CreativeTemplate,
      popular: false,
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Simple and elegant with maximum white space',
      component: MinimalistTemplate,
      popular: false,
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Bold and authoritative for senior positions',
      component: ExecutiveTemplate,
      popular: true,
    },
  ];

  const sampleData = {
    template: 'professional',
    contact: {
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
    },
    summary: 'Experienced professional with a proven track record in delivering exceptional results.',
    experience: [
      {
        position: 'Senior Developer',
        company: 'Tech Corp',
        startDate: 'Jan 2020',
        endDate: 'Present',
        current: true,
        description: 'Led development of key features and mentored junior developers.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        school: 'University Name',
        startDate: '2015',
        endDate: '2019',
      },
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
  };

  const handleSelectTemplate = (templateId) => {
    navigate(`${createPageUrl('Editor')}?template=${templateId}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Choose a Template</DialogTitle>
          <p className="text-gray-600">Select a template to start creating your resume</p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {templates.map((template) => {
            const TemplateComponent = template.component;
            return (
              <div
                key={template.id}
                className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl ${
                  selectedTemplate === template.id ? 'ring-4 ring-blue-500 border-blue-500' : 'border-gray-200'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                {template.popular && (
                  <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1.5 rounded-md shadow-lg z-10">
                    Popular
                  </span>
                )}
                
                {selectedTemplate === template.id && (
                  <div className="absolute top-3 left-3 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-lg z-10">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* Template Preview */}
                <div className="h-64 bg-white overflow-hidden relative">
                  <div className="scale-[0.28] origin-top-left w-[357%] h-[357%] pointer-events-none">
                    <TemplateComponent data={{ ...sampleData, template: template.id }} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none"></div>
                </div>

                <div className="p-4 bg-white border-t">
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => selectedTemplate && handleSelectTemplate(selectedTemplate)}
            disabled={!selectedTemplate}
          >
            Continue with Selected Template
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}