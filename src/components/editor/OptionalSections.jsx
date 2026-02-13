import React from 'react';
import { FolderOpen, Award, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function OptionalSections({ projects, awards, onProjectsChange, onAwardsChange }) {
  const addProject = () => {
    onProjectsChange([...projects, { name: '', description: '', link: '' }]);
  };

  const removeProject = (index) => {
    onProjectsChange(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onProjectsChange(updated);
  };

  const addAward = () => {
    onAwardsChange([...awards, { title: '', issuer: '', date: '' }]);
  };

  const removeAward = (index) => {
    onAwardsChange(awards.filter((_, i) => i !== index));
  };

  const updateAward = (index, field, value) => {
    const updated = [...awards];
    updated[index] = { ...updated[index], [field]: value };
    onAwardsChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optional Sections</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="projects">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="projects">
              <FolderOpen className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="awards">
              <Award className="w-4 h-4 mr-2" />
              Awards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={addProject}>
                <Plus className="w-4 h-4 mr-1" />
                Add Project
              </Button>
            </div>
            {projects.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No projects added yet.</p>
            ) : (
              projects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Project {index + 1}</h4>
                    <Button variant="ghost" size="icon" onClick={() => removeProject(index)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                  <div>
                    <Label>Project Name</Label>
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                      placeholder="E-commerce Platform"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      placeholder="Brief description of the project..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Link (Optional)</Label>
                    <Input
                      value={project.link}
                      onChange={(e) => updateProject(index, 'link', e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="awards" className="space-y-4 mt-4">
            <div className="flex justify-end">
              <Button size="sm" onClick={addAward}>
                <Plus className="w-4 h-4 mr-1" />
                Add Award
              </Button>
            </div>
            {awards.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No awards added yet.</p>
            ) : (
              awards.map((award, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Award {index + 1}</h4>
                    <Button variant="ghost" size="icon" onClick={() => removeAward(index)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                  <div>
                    <Label>Award Title</Label>
                    <Input
                      value={award.title}
                      onChange={(e) => updateAward(index, 'title', e.target.value)}
                      placeholder="Employee of the Year"
                    />
                  </div>
                  <div>
                    <Label>Issuer</Label>
                    <Input
                      value={award.issuer}
                      onChange={(e) => updateAward(index, 'issuer', e.target.value)}
                      placeholder="Company Name"
                    />
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="month"
                      value={award.date}
                      onChange={(e) => updateAward(index, 'date', e.target.value)}
                    />
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}