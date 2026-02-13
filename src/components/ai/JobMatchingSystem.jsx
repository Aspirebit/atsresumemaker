import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Loader2, MapPin, DollarSign, ExternalLink, Star } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

export default function JobMatchingSystem({ resumeData }) {
  const [searching, setSearching] = useState(false);
  const [jobMatches, setJobMatches] = useState([]);
  const [criteria, setCriteria] = useState({
    industries: '',
    roles: '',
    locations: '',
    keywords: '',
    remote: false
  });

  const searchJobs = async () => {
    if (!criteria.roles.trim()) {
      toast.error('Please enter target job roles');
      return;
    }

    setSearching(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a job search AI. Based on this resume and job criteria, search the web for relevant job openings and analyze match quality:

RESUME SUMMARY:
Name: ${resumeData?.contact?.fullName}
Summary: ${resumeData?.summary}
Skills: ${resumeData?.skills?.join(', ')}
Experience: ${JSON.stringify(resumeData?.experience?.slice(0, 3))}

JOB SEARCH CRITERIA:
Target Roles: ${criteria.roles}
Industries: ${criteria.industries || 'Any'}
Locations: ${criteria.locations || 'Any'}
Keywords: ${criteria.keywords || 'N/A'}
Remote Work: ${criteria.remote ? 'Yes' : 'No preference'}

TASK:
1. Search for real, current job openings that match the criteria
2. For each job, analyze the match score (1-100) based on skills, experience, and requirements alignment
3. Extract key information: title, company, location, salary (if available), job description summary, application URL
4. Provide match reasoning explaining why it's a good fit

Return 10-15 highly relevant jobs with detailed information.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            jobs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  company: { type: "string" },
                  location: { type: "string" },
                  salary: { type: "string" },
                  jobType: { type: "string" },
                  description: { type: "string" },
                  url: { type: "string" },
                  matchScore: { type: "number" },
                  matchReasoning: { type: "string" },
                  requiredSkills: { type: "array", items: { type: "string" } },
                  yourMatchingSkills: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });

      setJobMatches(result.jobs || []);
      toast.success(`Found ${result.jobs?.length} matching jobs!`);
    } catch (error) {
      console.error('Job search error:', error);
      toast.error('Failed to search for jobs');
    } finally {
      setSearching(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            AI Job Matching
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Target Roles *</label>
              <Input
                placeholder="e.g., Software Engineer, Data Analyst"
                value={criteria.roles}
                onChange={(e) => setCriteria({ ...criteria, roles: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industries</label>
              <Input
                placeholder="e.g., Tech, Finance, Healthcare"
                value={criteria.industries}
                onChange={(e) => setCriteria({ ...criteria, industries: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Locations</label>
              <Input
                placeholder="e.g., New York, San Francisco, Remote"
                value={criteria.locations}
                onChange={(e) => setCriteria({ ...criteria, locations: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Keywords</label>
              <Input
                placeholder="e.g., React, Python, Machine Learning"
                value={criteria.keywords}
                onChange={(e) => setCriteria({ ...criteria, keywords: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remote"
              checked={criteria.remote}
              onCheckedChange={(checked) => setCriteria({ ...criteria, remote: checked })}
            />
            <label htmlFor="remote" className="text-sm cursor-pointer">
              Prioritize remote positions
            </label>
          </div>

          <Button
            onClick={searchJobs}
            disabled={searching}
            className="w-full"
          >
            {searching ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching Jobs...
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4 mr-2" />
                Find Matching Jobs
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {jobMatches.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">
            {jobMatches.length} Jobs Found
          </h3>
          {jobMatches
            .sort((a, b) => b.matchScore - a.matchScore)
            .map((job, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge className={`${getMatchColor(job.matchScore)} text-lg px-3 py-1`}>
                      {job.matchScore}% Match
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.location && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </Badge>
                    )}
                    {job.salary && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {job.salary}
                      </Badge>
                    )}
                    {job.jobType && (
                      <Badge variant="outline">{job.jobType}</Badge>
                    )}
                  </div>

                  <p className="text-sm mb-3">{job.description}</p>

                  <div className="mb-3">
                    <p className="text-sm font-semibold mb-1">Why You're a Great Match:</p>
                    <p className="text-sm text-muted-foreground">{job.matchReasoning}</p>
                  </div>

                  {job.yourMatchingSkills?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-semibold mb-1">Your Matching Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {job.yourMatchingSkills.map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {job.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(job.url, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Job & Apply
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}