import React, { useState } from 'react';
import { Palette, Type, Space, Layout, Plus, Save, Trash2, GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AdvancedCustomizer({ customization, onChange, currentTemplate }) {
  const [customSections, setCustomSections] = useState(customization.customSections || []);
  const [newSectionName, setNewSectionName] = useState('');
  const [savingTemplate, setSavingTemplate] = useState(false);

  const defaultSections = [
    { id: 'summary', name: 'Summary', enabled: true },
    { id: 'experience', name: 'Experience', enabled: true },
    { id: 'education', name: 'Education', enabled: true },
    { id: 'skills', name: 'Skills', enabled: true },
    { id: 'projects', name: 'Projects', enabled: true },
    { id: 'awards', name: 'Awards', enabled: true }
  ];

  const allSections = [...defaultSections, ...customSections];

  const fonts = [
    { value: 'Inter', label: 'Inter (Modern)' },
    { value: 'Georgia', label: 'Georgia (Classic)' },
    { value: 'Arial', label: 'Arial (Clean)' },
    { value: 'Times New Roman', label: 'Times (Traditional)' },
    { value: 'Roboto', label: 'Roboto (Professional)' }
  ];

  const fontSizes = [
    { value: 'sm', label: 'Small' },
    { value: 'base', label: 'Medium' },
    { value: 'lg', label: 'Large' }
  ];

  const spacingOptions = [
    { value: 'compact', label: 'Compact' },
    { value: 'normal', label: 'Normal' },
    { value: 'relaxed', label: 'Relaxed' }
  ];

  const handleUpdate = (field, value) => {
    onChange({
      ...customization,
      [field]: value
    });
  };

  const addCustomSection = () => {
    if (!newSectionName.trim()) {
      toast.error('Please enter a section name');
      return;
    }

    const newSection = {
      id: `custom_${Date.now()}`,
      name: newSectionName,
      enabled: true
    };

    const updatedSections = [...customSections, newSection];
    setCustomSections(updatedSections);
    handleUpdate('customSections', updatedSections);
    handleUpdate('sectionOrder', [...customization.sectionOrder, newSection.id]);
    setNewSectionName('');
    toast.success('Custom section added');
  };

  const removeCustomSection = (sectionId) => {
    const updatedSections = customSections.filter(s => s.id !== sectionId);
    setCustomSections(updatedSections);
    handleUpdate('customSections', updatedSections);
    handleUpdate('sectionOrder', customization.sectionOrder.filter(id => id !== sectionId));
    toast.success('Section removed');
  };

  const toggleSection = (sectionId) => {
    const section = customSections.find(s => s.id === sectionId);
    if (!section) return;

    const updatedSections = customSections.map(s =>
      s.id === sectionId ? { ...s, enabled: !s.enabled } : s
    );
    setCustomSections(updatedSections);
    handleUpdate('customSections', updatedSections);
  };

  const moveSectionUp = (index) => {
    if (index === 0) return;
    const newOrder = [...customization.sectionOrder];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    handleUpdate('sectionOrder', newOrder);
  };

  const moveSectionDown = (index) => {
    if (index === customization.sectionOrder.length - 1) return;
    const newOrder = [...customization.sectionOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    handleUpdate('sectionOrder', newOrder);
  };

  const saveAsTemplate = async () => {
    const templateName = prompt('Enter a name for this custom template:');
    if (!templateName) return;

    setSavingTemplate(true);
    try {
      await base44.entities.CustomTemplate.create({
        name: templateName,
        baseTemplate: currentTemplate,
        customization: {
          ...customization,
          customSections
        }
      });
      toast.success('Template saved successfully!');
    } catch (error) {
      toast.error('Failed to save template');
    } finally {
      setSavingTemplate(false);
    }
  };

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <Palette className="w-5 h-5" />
          Advanced Customization
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Style Options */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm">Style</h3>
          
          <div>
            <Label className="text-xs flex items-center gap-2 mb-1">
              <Type className="w-3 h-3" />
              Font Family
            </Label>
            <Select 
              value={customization.fontFamily} 
              onValueChange={(value) => handleUpdate('fontFamily', value)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fonts.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs mb-1">Font Size</Label>
            <Select 
              value={customization.fontSize} 
              onValueChange={(value) => handleUpdate('fontSize', value)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map(size => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs flex items-center gap-2 mb-1">
              <Palette className="w-3 h-3" />
              Primary Color
            </Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={customization.primaryColor}
                onChange={(e) => handleUpdate('primaryColor', e.target.value)}
                className="h-8 w-16 p-1"
              />
              <Input
                type="text"
                value={customization.primaryColor}
                onChange={(e) => handleUpdate('primaryColor', e.target.value)}
                className="h-8 flex-1 text-sm"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs flex items-center gap-2 mb-1">
              <Space className="w-3 h-3" />
              Spacing
            </Label>
            <Select 
              value={customization.spacing} 
              onValueChange={(value) => handleUpdate('spacing', value)}
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {spacingOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Custom Sections */}
        <div className="space-y-3 border-t pt-4">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Custom Sections
          </h3>
          
          <div className="flex gap-2">
            <Input
              placeholder="Section name"
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              className="h-8 text-sm"
            />
            <Button size="sm" onClick={addCustomSection} className="h-8">
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          {customSections.length > 0 && (
            <div className="space-y-1">
              {customSections.map((section) => (
                <div key={section.id} className="flex items-center gap-2 bg-gray-50 rounded p-2">
                  <Checkbox
                    checked={section.enabled}
                    onCheckedChange={() => toggleSection(section.id)}
                  />
                  <span className="text-xs font-medium flex-1">{section.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCustomSection(section.id)}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Order */}
        <div className="space-y-3 border-t pt-4">
          <h3 className="font-semibold text-sm">Section Order</h3>
          <div className="space-y-1">
            {customization.sectionOrder.map((sectionId, index) => {
              const section = allSections.find(s => s.id === sectionId);
              return (
                <div key={sectionId} className="flex items-center gap-2 bg-gray-50 rounded p-2">
                  <GripVertical className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-medium flex-1">
                    {index + 1}. {section?.name || sectionId}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSectionUp(index)}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSectionDown(index)}
                      disabled={index === customization.sectionOrder.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Template */}
        <div className="border-t pt-4">
          <Button 
            onClick={saveAsTemplate} 
            disabled={savingSavingTemplate}
            className="w-full"
            variant="outline"
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Custom Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}