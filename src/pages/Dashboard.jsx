import React, { useState, useEffect } from 'react';
import { Plus, FileText, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import TemplateGallery from '@/components/dashboard/TemplateGallery';

export default function Dashboard() {
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await base44.entities.Resume.list('-updated_date', 3);
      setResumes(data);
    } catch (error) {
      console.error('Failed to load resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const templates = [
    { id: 'professional', name: 'Professional', color: 'bg-blue-500', popular: true },
    { id: 'modern', name: 'Modern', color: 'bg-gradient-to-br from-purple-500 to-blue-500', popular: true },
    { id: 'creative', name: 'Creative', color: 'bg-gradient-to-br from-pink-500 to-orange-500', popular: false },
    { id: 'minimalist', name: 'Minimalist', color: 'bg-gray-700', popular: false },
    { id: 'executive', name: 'Executive', color: 'bg-gray-900', popular: true },
  ];

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">Create a professional resume in minutes</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card
            className="border-2 border-dashed border-blue-300 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
            onClick={() => setShowTemplateGallery(true)}
          >
            <CardContent className="flex flex-col items-center justify-center py-8">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">Start New Resume</h3>
              <p className="text-sm text-gray-600 mt-1">Choose from templates</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{resumes.length}</p>
                <p className="text-sm text-gray-600">Saved Resumes</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 py-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Downloads</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Resume Templates</h2>
            <Button variant="ghost" className="text-blue-600">View All</Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setShowTemplateGallery(true)}
              >
                <CardContent className="p-4">
                  <div className={`${template.color} h-32 rounded-lg mb-3 relative`}>
                    {template.popular && (
                      <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded">
                        Popular
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600">
                    {template.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading...</div>
              ) : resumes.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No resumes yet. Create your first resume to get started!</p>
                  <Button onClick={() => setShowTemplateGallery(true)} className="mt-4">
                    Create Resume
                  </Button>
                </div>
              ) : (
                resumes.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      index !== resumes.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">Updated {getTimeAgo(item.updated_date)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">Open</Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <TemplateGallery open={showTemplateGallery} onClose={() => setShowTemplateGallery(false)} />
    </div>
  );
}