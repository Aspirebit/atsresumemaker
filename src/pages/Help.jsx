import React, { useState } from 'react';
import { HelpCircle, FileText, Download, Share2, Palette, MessageCircle, Mail, Book, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function Help() {
  const [openFaq, setOpenFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      category: 'Getting Started',
      icon: FileText,
      questions: [
        {
          q: 'How do I create my first resume?',
          a: 'Click on "Start from Template" on the Dashboard, select a template that suits your style, and start filling in your information. You can also use the AI Resume Builder for guided assistance.'
        },
        {
          q: 'Can I use multiple templates?',
          a: 'Yes! You can create multiple resumes using different templates. Each resume is saved separately in your account.'
        },
        {
          q: 'Is there a mobile app?',
          a: 'Currently, Resume Builder is a web application optimized for both desktop and mobile browsers. You can access it from any device.'
        }
      ]
    },
    {
      category: 'Editing & Customization',
      icon: Palette,
      questions: [
        {
          q: 'How do I customize my resume design?',
          a: 'In the editor, click the "Style" button to access customization options. You can change colors, fonts, spacing, and section order.'
        },
        {
          q: 'Can I save custom templates?',
          a: 'Yes! After customizing your resume, you can save it as a custom template for future use or share it on the Template Marketplace.'
        },
        {
          q: 'How do I reorder sections?',
          a: 'Use the Advanced Customizer to drag and drop sections into your preferred order.'
        }
      ]
    },
    {
      category: 'Exporting & Sharing',
      icon: Download,
      questions: [
        {
          q: 'What export formats are available?',
          a: 'You can export your resume as PDF, Word (.docx), plain text (.txt), or JSON format.'
        },
        {
          q: 'How do I share my resume with others?',
          a: 'Click the "Share" button in the editor to invite others via email. You can grant view or edit permissions.'
        },
        {
          q: 'Can I print my resume directly?',
          a: 'Yes! Export as PDF and use your browser\'s print function, or print directly from the preview.'
        }
      ]
    },
    {
      category: 'AI Features',
      icon: MessageCircle,
      questions: [
        {
          q: 'How does the AI Resume Builder work?',
          a: 'The AI analyzes your input and generates professional content for your resume, including summaries and work descriptions.'
        },
        {
          q: 'What is Job Match Analysis?',
          a: 'Paste a job description and our AI will analyze how well your resume matches the position, providing suggestions for improvement.'
        },
        {
          q: 'Can AI write my entire resume?',
          a: 'AI can assist with content generation, but you should always review and personalize the content to ensure it accurately represents your experience.'
        }
      ]
    },
    {
      category: 'Account & Billing',
      icon: HelpCircle,
      questions: [
        {
          q: 'Is Resume Builder free?',
          a: 'We offer a free tier with basic features. Premium plans unlock additional templates, AI features, and export options.'
        },
        {
          q: 'How do I delete my account?',
          a: 'Go to Settings > Danger Zone and click "Delete Account". This action is permanent and cannot be undone.'
        },
        {
          q: 'Can I cancel my subscription?',
          a: 'Yes, you can cancel your subscription at any time from the Settings page. You\'ll retain access until the end of your billing period.'
        }
      ]
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the form to your backend
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-10 h-10 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Help & Support
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex flex-col items-center text-center py-6">
              <Book className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground">
                Detailed guides and tutorials
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex flex-col items-center text-center py-6">
              <MessageCircle className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">
                Connect with other users
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex flex-col items-center text-center py-6">
              <Mail className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground">
                Get help from our team
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          {faqs.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <div key={categoryIndex} className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">{category.category}</h3>
                </div>
                
                <div className="space-y-3">
                  {category.questions.map((item, qIndex) => {
                    const isOpen = openFaq === `${categoryIndex}-${qIndex}`;
                    return (
                      <Card key={qIndex} className="overflow-hidden">
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : `${categoryIndex}-${qIndex}`)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-accent transition-colors"
                        >
                          <span className="font-medium">{item.q}</span>
                          <ChevronDown 
                            className={`w-5 h-5 text-muted-foreground transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-sm text-muted-foreground">
                            {item.a}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <p className="text-sm text-muted-foreground">
              Send us a message and we'll get back to you within 24 hours
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <Input
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <Input
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="What can we help you with?"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <Textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Describe your issue or question..."
                  rows={5}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full md:w-auto">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Additional Resources</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• <a href="#" className="hover:text-primary">Video Tutorials</a></li>
            <li>• <a href="#" className="hover:text-primary">Resume Writing Tips</a></li>
            <li>• <a href="#" className="hover:text-primary">Template Gallery</a></li>
            <li>• <a href="#" className="hover:text-primary">Feature Updates & Changelog</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}