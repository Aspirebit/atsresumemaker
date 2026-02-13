import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell, Plus, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function CustomJobAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    keywords: '',
    platforms: [],
    minSalary: '',
    maxSalary: '',
    locations: ''
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const user = await base44.auth.me();
      const data = await base44.entities.JobAlert.filter({ userId: user.email });
      setAlerts(data);
    } catch (error) {
      console.error('Failed to load alerts');
    }
  };

  const handleCreate = async () => {
    try {
      const user = await base44.auth.me();
      await base44.entities.JobAlert.create({
        userId: user.email,
        keywords: formData.keywords.split(',').map(k => k.trim()),
        platforms: formData.platforms,
        minSalary: formData.minSalary ? parseInt(formData.minSalary) : null,
        maxSalary: formData.maxSalary ? parseInt(formData.maxSalary) : null,
        locations: formData.locations.split(',').map(l => l.trim()),
        active: true
      });
      toast.success('Job alert created!');
      setShowDialog(false);
      loadAlerts();
      setFormData({ keywords: '', platforms: [], minSalary: '', maxSalary: '', locations: '' });
    } catch (error) {
      toast.error('Failed to create alert');
    }
  };

  const handleDelete = async (id) => {
    try {
      await base44.entities.JobAlert.delete(id);
      toast.success('Alert deleted');
      loadAlerts();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const platforms = ['LinkedIn', 'Indeed', 'Glassdoor', 'ZipRecruiter', 'Monster'];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              Custom Job Alerts
            </CardTitle>
            <Button size="sm" onClick={() => setShowDialog(true)}>
              <Plus className="w-4 h-4 mr-1" />
              New Alert
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground text-sm">No alerts yet</p>
          ) : (
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {alert.keywords.map((kw, i) => (
                          <Badge key={i} variant="secondary">{kw}</Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {alert.platforms.join(', ')}
                        {alert.minSalary && ` • $${alert.minSalary}k+`}
                        {alert.locations?.length > 0 && ` • ${alert.locations[0]}`}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(alert.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Job Alert</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Keywords (comma-separated)</Label>
              <Input
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="e.g., software engineer, react developer"
              />
            </div>
            <div>
              <Label>Platforms</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {platforms.map(platform => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.platforms.includes(platform)}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          platforms: checked
                            ? [...formData.platforms, platform]
                            : formData.platforms.filter(p => p !== platform)
                        });
                      }}
                    />
                    <label className="text-sm">{platform}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Min Salary ($k)</Label>
                <Input
                  type="number"
                  value={formData.minSalary}
                  onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                  placeholder="80"
                />
              </div>
              <div>
                <Label>Max Salary ($k)</Label>
                <Input
                  type="number"
                  value={formData.maxSalary}
                  onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
                  placeholder="150"
                />
              </div>
            </div>
            <div>
              <Label>Locations (comma-separated)</Label>
              <Input
                value={formData.locations}
                onChange={(e) => setFormData({ ...formData, locations: e.target.value })}
                placeholder="e.g., New York, San Francisco, Remote"
              />
            </div>
            <Button onClick={handleCreate} className="w-full">
              Create Alert
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}