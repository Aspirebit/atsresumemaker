import React from 'react';
import { Copy, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AIOutput({ content, onApply, onClose, type = 'text' }) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="shadow-lg border-green-200">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">AI Generated Content</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="bg-gray-50 rounded-lg p-3 max-h-64 overflow-y-auto">
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{content}</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard}
            className="flex-1"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          {onApply && (
            <Button 
              size="sm" 
              onClick={onApply}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Apply to Resume
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}