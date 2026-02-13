import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Mail, Phone, Calendar } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function RecruiterCRM() {
  const [contacts, setContacts] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    recruiterName: '',
    recruiterEmail: '',
    recruiterPhone: '',
    company: '',
    notes: ''
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await base44.entities.RecruiterContact.list('-created_date', 10);
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts');
    }
  };

  const handleCreate = async () => {
    try {
      await base44.entities.RecruiterContact.create({
        ...formData,
        communications: [{
          date: new Date().toISOString(),
          type: 'email',
          notes: formData.notes || 'Initial contact'
        }]
      });
      toast.success('Recruiter contact added');
      setShowDialog(false);
      loadContacts();
      setFormData({ recruiterName: '', recruiterEmail: '', recruiterPhone: '', company: '', notes: '' });
    } catch (error) {
      toast.error('Failed to add contact');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Recruiter Contacts
            </CardTitle>
            <Button size="sm" onClick={() => setShowDialog(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground text-sm">No contacts yet</p>
          ) : (
            <div className="space-y-3">
              {contacts.map(contact => (
                <div key={contact.id} className="p-3 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{contact.recruiterName}</h4>
                      <p className="text-sm text-muted-foreground">{contact.company}</p>
                    </div>
                    <Badge variant="secondary">{contact.communications?.length || 0} contacts</Badge>
                  </div>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    {contact.recruiterEmail && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {contact.recruiterEmail}
                      </span>
                    )}
                    {contact.recruiterPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {contact.recruiterPhone}
                      </span>
                    )}
                  </div>
                  {contact.nextFollowUp && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                      <Calendar className="w-3 h-3" />
                      Follow up: {new Date(contact.nextFollowUp).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Recruiter Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Recruiter Name *</Label>
              <Input
                value={formData.recruiterName}
                onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
                placeholder="John Smith"
              />
            </div>
            <div>
              <Label>Company *</Label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Tech Corp"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.recruiterEmail}
                onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })}
                placeholder="john@techcorp.com"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={formData.recruiterPhone}
                onChange={(e) => setFormData({ ...formData, recruiterPhone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label>Initial Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Met at career fair..."
              />
            </div>
            <Button onClick={handleCreate} className="w-full">
              Add Contact
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}