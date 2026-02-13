import React from 'react';
import { Shield, Lock, Eye, FileText, Database, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Privacy & Security
            </h1>
          </div>
          <p className="text-muted-foreground">
            Your privacy and data security are our top priorities. Learn how we protect your information.
          </p>
        </div>

        {/* Data Collection */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              </div>
              <CardTitle>Data We Collect</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <p className="text-sm text-muted-foreground">
                We collect information you provide when creating your account, including your name, email address, 
                and any information you include in your resumes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Usage Data</h3>
              <p className="text-sm text-muted-foreground">
                We collect information about how you use our service, including pages visited, features used, 
                and actions taken to improve our service.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Device Information</h3>
              <p className="text-sm text-muted-foreground">
                We collect device information such as browser type, operating system, and IP address for 
                security and optimization purposes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Data */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <CardTitle>How We Use Your Data</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>To provide, maintain, and improve our resume building services</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>To personalize your experience and recommend relevant templates</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>To communicate with you about updates, features, and important notices</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>To ensure security and prevent fraud or unauthorized access</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>To analyze usage patterns and improve our services</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Security Measures */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-green-600 dark:text-green-300" />
              </div>
              <CardTitle>Security Measures</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Encryption</h3>
              <p className="text-sm text-muted-foreground">
                All data transmitted between your device and our servers is encrypted using industry-standard 
                SSL/TLS protocols.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Secure Storage</h3>
              <p className="text-sm text-muted-foreground">
                Your resume data is stored in secure, encrypted databases with regular backups to prevent data loss.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Access Controls</h3>
              <p className="text-sm text-muted-foreground">
                We implement strict access controls to ensure only authorized personnel can access user data, 
                and only when necessary for support or maintenance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Controls */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-orange-600 dark:text-orange-300" />
              </div>
              <CardTitle>Your Privacy Controls</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Access and download your personal data at any time</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Update or correct your information through account settings</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Control who can view your shared resumes</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Opt-out of marketing communications at any time</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Request deletion of your account and associated data</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Deletion */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <UserX className="w-5 h-5 text-red-600 dark:text-red-300" />
              </div>
              <CardTitle>Data Deletion</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You have the right to request deletion of your account and all associated data at any time. 
              When you delete your account:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground ml-4">
              <li>• All your resumes and personal data will be permanently deleted</li>
              <li>• Shared resume links will become inactive</li>
              <li>• Your email will be removed from our mailing list</li>
              <li>• This action cannot be undone</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Note: Some data may be retained for a limited period as required by law or for legitimate business purposes.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Questions About Privacy?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions or concerns about our privacy practices, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium">Email: privacy@resumebuilder.com</p>
              <p className="text-sm text-muted-foreground mt-1">
                We'll respond to your inquiry within 48 hours.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Last updated: January 2026</p>
        </div>
      </div>
    </div>
  );
}