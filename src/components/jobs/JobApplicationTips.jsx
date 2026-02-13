import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Clock, Target, Zap, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function JobApplicationTips() {
  const tips = [
    {
      icon: Clock,
      title: 'Apply Within 24 Hours',
      description: 'Companies receive 75% of applications in the first 24 hours. Apply early to stand out.',
      priority: 'High',
      color: 'text-red-600'
    },
    {
      icon: Target,
      title: 'Customize Your Resume',
      description: 'Tailor your resume for each job. Use keywords from the job description.',
      priority: 'High',
      color: 'text-orange-600'
    },
    {
      icon: Zap,
      title: 'Follow Up After 1 Week',
      description: 'Send a polite follow-up email 5-7 days after applying to show continued interest.',
      priority: 'Medium',
      color: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      title: 'Apply on Tuesday-Thursday',
      description: 'Studies show applications submitted mid-week get 30% more responses.',
      priority: 'Low',
      color: 'text-green-600'
    }
  ];

  const priorityColors = {
    High: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    Low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          Application Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <div key={index} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center flex-shrink-0 ${tip.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{tip.title}</h4>
                      <Badge className={`text-xs ${priorityColors[tip.priority]}`}>
                        {tip.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-900 dark:text-blue-300">
            <strong>Pro Tip:</strong> Set up job alerts on LinkedIn and Indeed to get notifications within minutes of new postings!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}