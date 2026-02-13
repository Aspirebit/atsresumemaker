import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, Linkedin, Globe, FileText, Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PublicPortfolio() {
  const [searchParams] = useSearchParams();
  const userEmail = searchParams.get('user');
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    loadPortfolio();
  }, [userEmail]);

  const loadPortfolio = async () => {
    try {
      const users = await base44.entities.User.filter({ email: userEmail });
      if (users.length > 0 && users[0].portfolio) {
        setPortfolioData(users[0].portfolio);
      }
    } catch (error) {
      console.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!portfolioData) {
    return <div className="flex items-center justify-center min-h-screen">Portfolio not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">{portfolioData.title}</h1>
          <p className="text-xl text-blue-100 mb-8">{portfolioData.tagline}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {portfolioData.contact.email && (
              <Button variant="secondary" asChild>
                <a href={`mailto:${portfolioData.contact.email}`}>
                  <Mail className="w-4 h-4 mr-2" />
                  Email Me
                </a>
              </Button>
            )}
            {portfolioData.contact.linkedin && (
              <Button variant="secondary" asChild>
                <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* About Section */}
        {portfolioData.about && (
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">About Me</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{portfolioData.about}</p>
            </CardContent>
          </Card>
        )}

        {/* Contact Info */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {portfolioData.contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>{portfolioData.contact.email}</span>
                </div>
              )}
              {portfolioData.contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  <span>{portfolioData.contact.phone}</span>
                </div>
              )}
              {portfolioData.contact.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span>{portfolioData.contact.location}</span>
                </div>
              )}
              {portfolioData.contact.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <a href={portfolioData.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {portfolioData.contact.website}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Featured Work */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Featured Work</h2>
            <p className="text-muted-foreground mb-4">
              {portfolioData.selectedResumes.length} Resume(s) • {portfolioData.selectedCoverLetters.length} Cover Letter(s)
            </p>
            <Badge className="bg-blue-600">Professional Portfolio</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}