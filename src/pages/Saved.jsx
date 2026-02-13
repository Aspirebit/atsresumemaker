import React, { useState } from 'react';
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

export default function Saved() {
  const [searchQuery, setSearchQuery] = useState('');

  const savedResumes = [
    { id: 1, title: 'Software Engineer Resume', template: 'Professional', updated: '2 hours ago', color: 'bg-blue-500' },
    { id: 2, title: 'Marketing Manager CV', template: 'Modern', updated: '1 day ago', color: 'bg-purple-500' },
    { id: 3, title: 'Product Designer Resume', template: 'Creative', updated: '3 days ago', color: 'bg-pink-500' },
    { id: 4, title: 'Sales Executive CV', template: 'Classic', updated: '5 days ago', color: 'bg-gray-700' },
    { id: 5, title: 'Data Analyst Resume', template: 'Executive', updated: '1 week ago', color: 'bg-indigo-600' },
  ];

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
              <p className="text-3xl font-bold text-gray-900">{savedResumes.length}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedResumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-lg transition-shadow group cursor-pointer">
              <CardContent className="p-0">
                {/* Preview */}
                <div className={`${resume.color} h-48 rounded-t-lg relative`}>
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white/90 hover:bg-white text-gray-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
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
                    <span>{resume.template}</span>
                    <span>{resume.updated}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (hidden when there are resumes) */}
        {savedResumes.length === 0 && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved resumes yet</h3>
              <p className="text-gray-600 mb-6">Create your first resume to get started</p>
              <Button>Create New Resume</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}