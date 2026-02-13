import React, { useState } from 'react';
import { Download, FileText, File, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { exportResumeToPDF } from '@/components/utils/pdfExport';
import { exportResumeToWord } from '@/components/utils/wordExport';
import { exportResumeToTXT } from '@/components/utils/txtExport';
import { exportResumeToJSON } from '@/components/utils/jsonExport';

export default function ExportDialog({ open, onClose, resumeData }) {
  const [exporting, setExporting] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('pdf');

  const formats = [
    { id: 'pdf', name: 'PDF', icon: FileText, description: 'Best for printing and sharing' },
    { id: 'docx', name: 'Word (DOCX)', icon: File, description: 'Editable document format' },
    { id: 'txt', name: 'Plain Text', icon: FileText, description: 'Simple text format' },
    { id: 'json', name: 'JSON', icon: File, description: 'Raw data format' }
  ];

  const handleExport = async () => {
    setExporting(true);
    try {
      switch (selectedFormat) {
        case 'pdf':
          await exportResumeToPDF(resumeData);
          break;
        case 'docx':
          await exportResumeToWord(resumeData);
          break;
        case 'txt':
          await exportResumeToTXT(resumeData);
          break;
        case 'json':
          await exportResumeToJSON(resumeData);
          break;
        default:
          throw new Error('Unsupported format');
      }
      toast.success(`Resume exported as ${selectedFormat.toUpperCase()}`);
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export resume');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Resume
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm mb-3 block">Choose Export Format</Label>
            <div className="space-y-2">
              {formats.map((format) => {
                const Icon = format.icon;
                return (
                  <div
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedFormat === format.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${selectedFormat === format.id ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{format.name}</p>
                      <p className="text-xs text-gray-500">{format.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={exporting} className="flex-1">
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}