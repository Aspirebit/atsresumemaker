import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Check, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CommentsPanel({ resumeId, currentSection }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedSection, setSelectedSection] = useState(currentSection || 'general');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    loadComments();
  }, [resumeId]);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user');
    }
  };

  const loadComments = async () => {
    try {
      const data = await base44.entities.Comment.filter({ resume_id: resumeId }, '-created_date');
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to comment');
      return;
    }

    setLoading(true);
    try {
      const comment = await base44.entities.Comment.create({
        resume_id: resumeId,
        section: selectedSection,
        content: newComment,
        author_email: user.email,
        author_name: user.full_name || user.email,
        resolved: false
      });

      setComments([comment, ...comments]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveComment = async (commentId) => {
    try {
      const comment = comments.find(c => c.id === commentId);
      await base44.entities.Comment.update(commentId, { resolved: !comment.resolved });
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, resolved: !c.resolved } : c
      ));
      toast.success(comment.resolved ? 'Comment reopened' : 'Comment resolved');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await base44.entities.Comment.delete(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const sections = [
    { value: 'general', label: 'General' },
    { value: 'summary', label: 'Summary' },
    { value: 'experience', label: 'Experience' },
    { value: 'education', label: 'Education' },
    { value: 'skills', label: 'Skills' },
    { value: 'projects', label: 'Projects' },
    { value: 'awards', label: 'Awards' }
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="w-5 h-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
        {/* Add Comment */}
        <div className="space-y-2">
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sections.map(section => (
                <SelectItem key={section.value} value={section.value}>
                  {section.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="h-20 text-sm resize-none"
          />
          <Button 
            onClick={handleAddComment} 
            disabled={loading}
            size="sm"
            className="w-full"
          >
            <Send className="w-3 h-3 mr-2" />
            Add Comment
          </Button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No comments yet</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div 
                key={comment.id} 
                className={`bg-gray-50 rounded-lg p-3 space-y-2 ${
                  comment.resolved ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {comment.author_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {sections.find(s => s.value === comment.section)?.label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResolveComment(comment.id)}
                    className="h-7 text-xs"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    {comment.resolved ? 'Reopen' : 'Resolve'}
                  </Button>
                  {user && user.email === comment.author_email && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="h-7 text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}