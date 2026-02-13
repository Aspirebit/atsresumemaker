import React from 'react';
import { Palette, Type, Space, Layout } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TemplateCustomizer({ customization, onChange }) {
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

  const sections = [
    { id: 'summary', name: 'Summary' },
    { id: 'experience', name: 'Experience' },
    { id: 'education', name: 'Education' },
    { id: 'skills', name: 'Skills' },
    { id: 'projects', name: 'Projects' },
    { id: 'awards', name: 'Awards' }
  ];

  const handleUpdate = (field, value) => {
    onChange({
      ...customization,
      [field]: value
    });
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Palette className="w-5 h-5" />
          Customize Template
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Font Family */}
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

        {/* Font Size */}
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

        {/* Primary Color */}
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
              placeholder="#3B82F6"
            />
          </div>
        </div>

        {/* Spacing */}
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

        {/* Section Order */}
        <div>
          <Label className="text-xs flex items-center gap-2 mb-2">
            <Layout className="w-3 h-3" />
            Section Order
          </Label>
          <div className="space-y-1">
            {customization.sectionOrder.map((sectionId, index) => {
              const section = sections.find(s => s.id === sectionId);
              return (
                <div key={sectionId} className="flex items-center gap-2 bg-gray-50 rounded p-2">
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
      </CardContent>
    </Card>
  );
}