import React, { useState, useEffect } from 'react';
import { Store, Star, Download, Search, TrendingUp, Upload, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function TemplateMarketplace() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await base44.entities.TemplateMarketplace.list('-rating', 50);
      setTemplates(data);
    } catch (error) {
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || template.category === category;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'popular') return (b.downloads || 0) - (a.downloads || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'newest') return new Date(b.created_date) - new Date(a.created_date);
    return 0;
  });

  const applyTemplate = async (template) => {
    try {
      // Increment download count
      await base44.entities.TemplateMarketplace.update(template.id, {
        downloads: (template.downloads || 0) + 1
      });

      // Apply to a new resume
      const newResume = await base44.entities.Resume.create({
        title: `Resume from ${template.name}`,
        template: template.templateData.baseTemplate || 'professional',
        customization: template.templateData.customization,
        contact: {},
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        awards: [],
        sharedWith: []
      });

      toast.success('Template applied!');
      navigate(`${createPageUrl('Editor')}?id=${newResume.id}`);
    } catch (error) {
      toast.error('Failed to apply template');
    }
  };

  const rateTemplate = async (templateId, rating) => {
    try {
      const template = templates.find(t => t.id === templateId);
      const user = await base44.auth.me();
      
      const newRatingCount = (template.ratingCount || 0) + 1;
      const newRating = ((template.rating || 0) * (template.ratingCount || 0) + rating) / newRatingCount;

      await base44.entities.TemplateMarketplace.update(templateId, {
        rating: newRating,
        ratingCount: newRatingCount,
        reviews: [
          ...(template.reviews || []),
          {
            user: user.email,
            userName: user.full_name || user.email,
            rating,
            date: new Date().toISOString()
          }
        ]
      });

      toast.success('Rating submitted!');
      loadTemplates();
    } catch (error) {
      toast.error('Failed to submit rating');
    }
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Store className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-foreground">Template Marketplace</h1>
              <p className="text-sm text-muted-foreground">Discover and share templates</p>
            </div>
          </div>
          <Button onClick={() => setShowUploadDialog(true)} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
            <Upload className="w-4 h-4 mr-2" />
            Upload Template
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4 mb-6">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="minimalist">Minimalist</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No templates found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {template.featured && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 text-xs font-semibold text-white">
                    ⭐ Featured
                  </div>
                )}
                
                {template.previewImage && (
                  <div className="h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <img src={template.previewImage} alt={template.name} className="w-full h-full object-cover" />
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">{template.category}</Badge>
                    {template.tags?.slice(0, 2).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description || 'Professional resume template'}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{(template.rating || 0).toFixed(1)}</span>
                      <span className="text-muted-foreground">({template.ratingCount || 0})</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Download className="w-4 h-4" />
                      <span>{template.downloads || 0}</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    by {template.authorName}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setSelectedTemplate(template)}
                      className="flex-1"
                    >
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => applyTemplate(template)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Template Preview Dialog */}
        {selectedTemplate && (
          <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>{selectedTemplate.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedTemplate.previewImage && (
                  <img src={selectedTemplate.previewImage} alt={selectedTemplate.name} className="w-full rounded-lg" />
                )}
                <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => rateTemplate(selectedTemplate.id, rating)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    </button>
                  ))}
                </div>

                <Button 
                  onClick={() => applyTemplate(selectedTemplate)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Use This Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Upload Template Dialog */}
        <UploadTemplateDialog 
          open={showUploadDialog} 
          onClose={() => setShowUploadDialog(false)}
          onUploaded={loadTemplates}
        />
        </div>
      </div>
    </PullToRefresh>
  );
}

function UploadTemplateDialog({ open, onClose, onUploaded }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'professional',
    tags: ''
  });
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a template name');
      return;
    }

    setUploading(true);
    try {
      const user = await base44.auth.me();
      
      await base44.entities.TemplateMarketplace.create({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        author: user.email,
        authorName: user.full_name || user.email,
        templateData: {
          baseTemplate: formData.category,
          customization: {
            fontFamily: 'Inter',
            fontSize: 'base',
            primaryColor: '#3B82F6',
            spacing: 'normal',
            sectionOrder: ['summary', 'experience', 'education', 'skills']
          }
        },
        downloads: 0,
        rating: 0,
        ratingCount: 0
      });

      toast.success('Template uploaded to marketplace!');
      onUploaded();
      onClose();
    } catch (error) {
      toast.error('Failed to upload template');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Template to Marketplace</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Template Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Modern Tech Resume"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your template..."
              className="h-24"
            />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="minimalist">Minimalist</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tags (comma-separated)</Label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="e.g., tech, minimal, blue"
            />
          </div>
          <Button onClick={handleUpload} disabled={uploading} className="w-full">
            {uploading ? 'Uploading...' : 'Upload Template'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}