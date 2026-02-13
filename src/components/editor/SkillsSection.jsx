import React, { useState } from 'react';
import { Zap, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SkillsSection({ data, onChange }) {
  const [inputValue, setInputValue] = useState('');

  const addSkill = () => {
    if (inputValue.trim() && !data.includes(inputValue.trim())) {
      onChange([...data, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeSkill = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          <CardTitle>Skills</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a skill (e.g., JavaScript, Project Management)"
          />
          <Button onClick={addSkill} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {data.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                {skill}
                <button
                  onClick={() => removeSkill(index)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-500 text-sm">
            No skills added yet. Start typing to add skills.
          </p>
        )}
      </CardContent>
    </Card>
  );
}