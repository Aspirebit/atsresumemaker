import React, { useState } from 'react';
import { User, Bell, Globe, Palette, Download, Lock, HelpCircle, LogOut, ChevronRight, Trash2, AlertTriangle, Moon, Sun, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [portfolio, setPortfolio] = useState({
    selectedResumes: [],
    selectedCoverLetters: []
  });

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, resumeData, letterData] = await Promise.all([
        base44.auth.me(),
        base44.entities.Resume.list(),
        base44.entities.CoverLetter.list()
      ]);
      setUser(userData);
      setResumes(resumeData);
      setCoverLetters(letterData);
      
      if (userData.portfolio) {
        setPortfolio(userData.portfolio);
      }

      const userCredits = await base44.entities.UserCredits.filter({ userId: userData.email });
      if (userCredits.length > 0) {
        setCredits(userCredits[0]);
      } else {
        const newCredits = await base44.entities.UserCredits.create({
          userId: userData.email,
          coins: 100,
          earnedTotal: 100,
          spentTotal: 0
        });
        setCredits(newCredits);
      }
    } catch (error) {
      console.error('Failed to load data');
    }
  };

  const savePortfolio = async () => {
    try {
      await base44.auth.updateMe({ portfolio });
      toast.success('Portfolio updated');
    } catch (error) {
      toast.error('Failed to update portfolio');
    }
  };

  const toggleResumeSelection = (resumeId) => {
    setPortfolio(prev => ({
      ...prev,
      selectedResumes: prev.selectedResumes.includes(resumeId)
        ? prev.selectedResumes.filter(id => id !== resumeId)
        : [...prev.selectedResumes, resumeId]
    }));
  };

  const handleDeleteAccount = async () => {
    try {
      toast.success('Account deletion requested. Check your email for confirmation.');
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
      toast.success('Light mode enabled');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
      toast.success('Dark mode enabled');
    }
  };

  const settingsSections = [
    {
      title: 'Profile',
      icon: User,
      items: [
        { label: 'Full Name', type: 'input', value: 'John Doe' },
        { label: 'Email', type: 'input', value: 'john.doe@email.com' },
        { label: 'Phone', type: 'input', value: '+1 (555) 123-4567' },
      ],
    },
    {
      title: 'Preferences',
      icon: Palette,
      items: [
        { label: 'Language', type: 'select', options: ['English', 'Spanish', 'French'] },
        { label: 'Default Template', type: 'select', options: ['Professional', 'Modern', 'Creative'] },
        { label: 'Export Format', type: 'select', options: ['PDF', 'Word', 'Both'] },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background overscroll-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <CardTitle>Profile Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input id="name" defaultValue="John Doe" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input id="email" type="email" defaultValue="john.doe@email.com" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
              <Input id="phone" defaultValue="+1 (555) 123-4567" className="mt-1" />
            </div>
            <Button className="w-full md:w-auto">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <CardTitle>Preferences</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="language" className="text-sm font-medium">Language</Label>
              <Select defaultValue="english">
                <SelectTrigger id="language" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="template" className="text-sm font-medium">Default Template</Label>
              <Select defaultValue="professional">
                <SelectTrigger id="template" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="export" className="text-sm font-medium">Export Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger id="export" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="word">Word</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <CardTitle>Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about your resumes</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-save</p>
                <p className="text-sm text-muted-foreground">Automatically save changes</p>
              </div>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Toggle dark/light theme</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <button className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors border-b">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5" />
                <span className="font-medium">Export All Data</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              onClick={() => window.location.href = createPageUrl('Privacy')}
              className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors border-b"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5" />
                <span className="font-medium">Privacy & Security</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button 
              onClick={() => window.location.href = createPageUrl('Help')}
              className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">Help & Support</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="mb-6 border-destructive">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="w-full md:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* Portfolio Section */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <CardTitle>Portfolio Showcase</CardTitle>
              </div>
              <Button size="sm" onClick={savePortfolio}>Save Portfolio</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Featured Resumes</Label>
              <div className="grid gap-2">
                {resumes.slice(0, 5).map(resume => (
                  <div
                    key={resume.id}
                    onClick={() => toggleResumeSelection(resume.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      portfolio.selectedResumes.includes(resume.id)
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{resume.title}</span>
                      {portfolio.selectedResumes.includes(resume.id) && (
                        <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded">Selected</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Button variant="outline" className="w-full hover:bg-red-50 border-red-200 text-red-600 hover:text-red-700">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers, including all your resumes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}