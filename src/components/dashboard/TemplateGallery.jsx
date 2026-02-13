import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createPageUrl } from '@/utils';

export default function TemplateGallery({ open, onClose }) {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean and traditional layout perfect for corporate roles',
      color: 'bg-blue-500',
      popular: true,
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design with gradient accents',
      color: 'bg-gradient-to-br from-purple-500 to-blue-500',
      popular: true,
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Eye-catching sidebar layout for creative industries',
      color: 'bg-gradient-to-br from-pink-500 to-orange-500',
      popular: false,
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      description: 'Simple and elegant with maximum white space',
      color: 'bg-gray-700',
      popular: false,
    },
    {
      id: 'executive',
      name: 'Executive',
      description: 'Bold and authoritative for senior positions',
      color: 'bg-gray-900',
      popular: true,
    },
  ];

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                selectedTemplate === template.id ? 'ring-2 ring-blue-600' : ''
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              {template.popular && (
                <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded z-10">
                  Popular
                </span>
              )}
              
              {selectedTemplate === template.id && (
                <div className="absolute top-3 left-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center z-10">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              <div className={`${template.color} h-48 relative`}>
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              <div className="p-4 bg-white">
                <h3 className="font-bold text-gray-900 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </div>
          ))}
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