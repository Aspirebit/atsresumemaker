import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Lightbulb, TrendingUp } from 'lucide-react';
import JobApplicationTips from '@/components/jobs/JobApplicationTips';

export default function Resources() {
  const guides = [
    {
      title: 'Resume Writing Best Practices',
      description: 'Learn how to write a compelling resume that gets noticed by recruiters.',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      title: 'Interview Preparation',
      description: 'Master common interview questions and presentation techniques.',
      icon: Lightbulb,
      color: 'text-yellow-600'
    },
    {
      title: 'Salary Negotiation Tips',
      description: 'Maximize your earning potential with proven negotiation strategies.',
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Career Resources</h1>
          <p className="text-muted-foreground">Expert tips and guides to accelerate your job search</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-1">
            <JobApplicationTips />
          </div>

          <div className="space-y-4">
            {guides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${guide.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-base">{guide.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{guide.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}