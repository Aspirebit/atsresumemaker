import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Briefcase, MapPin, Trophy, Coins } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    full_name: '',
    jobTitle: '',
    location: '',
    bio: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      setProfileData({
        full_name: userData.full_name || '',
        jobTitle: userData.jobTitle || '',
        location: userData.location || '',
        bio: userData.bio || ''
      });

      const userCredits = await base44.entities.UserCredits.filter({ userId: userData.email });
      if (userCredits.length > 0) {
        setCredits(userCredits[0]);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await base44.auth.updateMe(profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input value={user?.email} disabled />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Job Title
                  </Label>
                  <Input
                    value={profileData.jobTitle}
                    onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <Input
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    placeholder="e.g., New York, USA"
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Coins */}
          <div className="space-y-6">
            {/* Coins Card */}
            <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Coins className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Available Coins</p>
                    <p className="text-3xl font-bold">{credits?.coins || 0}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-90">Total Earned:</span>
                    <span className="font-semibold">{credits?.earnedTotal || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Total Spent:</span>
                    <span className="font-semibold">{credits?.spentTotal || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge className="w-full justify-start bg-blue-100 text-blue-700 hover:bg-blue-200">
                  🎯 First Resume Created
                </Badge>
                <Badge className="w-full justify-start bg-green-100 text-green-700 hover:bg-green-200">
                  ✨ Used AI Assistant
                </Badge>
                <Badge className="w-full justify-start bg-purple-100 text-purple-700 hover:bg-purple-200">
                  📝 Applied to Jobs
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}