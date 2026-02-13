import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Mail, Phone, MapPin, Linkedin, Globe, Plus, Trash2, Eye, Share2, Settings, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';

export default function Portfolio() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [portfolio, setPortfolio] = useState({
    title: '',
    tagline: '',
    about: '',
    contact: {},
    selectedResumes: [],
    selectedCoverLetters: [],
    theme: 'modern'
  });
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);

      const [resumesData, lettersData] = await Promise.all([
        base44.entities.Resume.list(),
        base44.entities.CoverLetter.list()
      ]);

      setResumes(resumesData);
      setCoverLetters(lettersData);

      // Load portfolio if exists
      const existingPortfolio = userData.portfolio;
      if (existingPortfolio) {
        setPortfolio(existingPortfolio);
      } else {
        setPortfolio({
          title: userData.full_name || 'My Portfolio',
          tagline: 'Professional Portfolio',
          about: '',
          contact: {
            email: userData.email,
            phone: '',
            location: '',
            linkedin: '',
            website: ''
          },
          selectedResumes: [],
          selectedCoverLetters: [],
          theme: 'modern'
        });
      }
    } catch (error) {
      toast.error('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await base44.auth.updateMe({ portfolio });
      toast.success('Portfolio saved successfully');
    } catch (error) {
      toast.error('Failed to save portfolio');
    }
  };

  const toggleResume = (resumeId) => {
    setPortfolio(prev => ({
      ...prev,
      selectedResumes: prev.selectedResumes.includes(resumeId)
        ? prev.selectedResumes.filter(id => id !== resumeId)
        : [...prev.selectedResumes, resumeId]
    }));
  };

  const toggleCoverLetter = (letterId) => {
    setPortfolio(prev => ({
      ...prev,
      selectedCoverLetters: prev.selectedCoverLetters.includes(letterId)
        ? prev.selectedCoverLetters.filter(id => id !== letterId)
        : [...prev.selectedCoverLetters, letterId]
    }));
  };

  const sharePortfolio = () => {
    const portfolioUrl = `${window.location.origin}${createPageUrl('PublicPortfolio')}?user=${user.email}`;
    navigator.clipboard.writeText(portfolioUrl);
    toast.success('Portfolio link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Portfolio</h1>
            <p className="text-muted-foreground">Showcase your best work</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={sharePortfolio}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleSave}>
              <Settings className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Portfolio Title</Label>
                <Input
                  value={portfolio.title}
                  onChange={(e) => setPortfolio({ ...portfolio, title: e.target.value })}
                  placeholder="Your Name"
                />
              </div>
              <div>
                <Label>Tagline</Label>
                <Input
                  value={portfolio.tagline}
                  onChange={(e) => setPortfolio({ ...portfolio, tagline: e.target.value })}
                  placeholder="Software Engineer | Designer | Creator"
                />
              </div>
              <div>
                <Label>About</Label>
                <Textarea
                  value={portfolio.about}
                  onChange={(e) => setPortfolio({ ...portfolio, about: e.target.value })}
                  placeholder="Tell visitors about yourself..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  value={portfolio.contact.email}
                  onChange={(e) => setPortfolio({ ...portfolio, contact: { ...portfolio.contact, email: e.target.value } })}
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                <Input
                  value={portfolio.contact.phone}
                  onChange={(e) => setPortfolio({ ...portfolio, contact: { ...portfolio.contact, phone: e.target.value } })}
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <Input
                  value={portfolio.contact.location}
                  onChange={(e) => setPortfolio({ ...portfolio, contact: { ...portfolio.contact, location: e.target.value } })}
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Label>
                <Input
                  value={portfolio.contact.linkedin}
                  onChange={(e) => setPortfolio({ ...portfolio, contact: { ...portfolio.contact, linkedin: e.target.value } })}
                />
              </div>
              <div>
                <Label className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </Label>
                <Input
                  value={portfolio.contact.website}
                  onChange={(e) => setPortfolio({ ...portfolio, contact: { ...portfolio.contact, website: e.target.value } })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Select Resumes */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Featured Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {resumes.map(resume => (
                <div
                  key={resume.id}
                  onClick={() => toggleResume(resume.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    portfolio.selectedResumes.includes(resume.id)
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <h3 className="font-medium">{resume.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {resume.template} • {new Date(resume.updated_date).toLocaleDateString()}
                      </p>
                    </div>
                    {portfolio.selectedResumes.includes(resume.id) && (
                      <Badge>Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Select Cover Letters */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Featured Cover Letters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {coverLetters.map(letter => (
                <div
                  key={letter.id}
                  onClick={() => toggleCoverLetter(letter.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    portfolio.selectedCoverLetters.includes(letter.id)
                      ? 'border-primary bg-primary/5'
                      : 'hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <div className="flex-1">
                      <h3 className="font-medium">{letter.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {letter.company} • {new Date(letter.updated_date).toLocaleDateString()}
                      </p>
                    </div>
                    {portfolio.selectedCoverLetters.includes(letter.id) && (
                      <Badge>Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}