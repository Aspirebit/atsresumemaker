import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MoreVertical, Download, Trash2, Copy, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { exportResumeToPDF } from '@/components/utils/pdfExport';
import { createPageUrl } from '@/utils';
import ProfessionalTemplate from '@/components/resume/templates/ProfessionalTemplate';
import ModernTemplate from '@/components/resume/templates/ModernTemplate';
import CreativeTemplate from '@/components/resume/templates/CreativeTemplate';
import MinimalistTemplate from '@/components/resume/templates/MinimalistTemplate';
import ExecutiveTemplate from '@/components/resume/templates/ExecutiveTemplate';

export default function Saved() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const templateComponents = {
    professional: ProfessionalTemplate,
    modern: ModernTemplate,
    creative: CreativeTemplate,
    minimalist: MinimalistTemplate,
    executive: ExecutiveTemplate,
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await base44.entities.Resume.list('-updated_date');
      setResumes(data);
    } catch (error) {
      console.error('Failed to load resumes:', error);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (resume) => {
    try {
      await exportResumeToPDF(resume);
      toast.success('Resume exported successfully');
    } catch (error) {
      toast.error('Failed to export resume');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      await base44.entities.Resume.delete(id);
      setResumes(resumes.filter(r => r.id !== id));
      toast.success('Resume deleted');
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  const handleDuplicate = async (resume) => {
    try {
      const { id, created_date, updated_date, ...data } = resume;
      const duplicated = await base44.entities.Resume.create({
        ...data,
        title: `${data.title} (Copy)`
      });
      setResumes([duplicated, ...resumes]);
      toast.success('Resume duplicated');
    } catch (error) {
      toast.error('Failed to duplicate resume');
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  const filteredResumes = resumes.filter(resume =>
    resume.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Saved Resumes
          </h1>
          <p className="text-gray-600">Manage and access your resume collection</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 text-base"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-3xl font-bold text-gray-900">{resumes.length}</p>
              <p className="text-sm text-gray-600 mt-1">Total Resumes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-600 mt-1">This Month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600 mt-1">Downloads</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-3xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-600 mt-1">Shared</p>
            </CardContent>
          </Card>
        </div>

        {/* Resume Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading your resumes...</div>
        ) : filteredResumes.length === 0 ? (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No resumes found' : 'No saved resumes yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Try a different search term' : 'Create your first resume to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={() => navigate(createPageUrl('Dashboard'))}>
                  Create New Resume
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => {
              const TemplateComponent = templateComponents[resume.template] || ProfessionalTemplate;
              return (
                <Card key={resume.id} className="hover:shadow-lg transition-shadow group cursor-pointer overflow-hidden">
                  <CardContent className="p-0">
                    {/* Preview */}
                    <div
                      className="h-48 bg-white relative overflow-hidden"
                      onClick={() => navigate(`${createPageUrl('Editor')}?id=${resume.id}`)}
                    >
                      <div className="scale-[0.2] origin-top-left w-[500%] h-[500%] pointer-events-none">
                        <TemplateComponent data={resume} />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />
                      
                      <div className="absolute top-3 right-3 z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-white/90 hover:bg-white text-gray-700 shadow-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleExport(resume)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(resume)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(resume.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600">
                        {resume.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="capitalize">{resume.template}</span>
                        <span>{getTimeAgo(resume.updated_date)}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          className="flex-1"
                          size="sm"
                          onClick={() => navigate(`${createPageUrl('Editor')}?id=${resume.id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExport(resume)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}