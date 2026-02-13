import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function DirectMessaging({ resumeId, collaborators }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadUser();
    loadMessages();
  }, [resumeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user');
    }
  };

  const loadMessages = async () => {
    try {
      const data = await base44.entities.Message.filter(
        { resume_id: resumeId },
        'created_date',
        100
      );
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      const message = await base44.entities.Message.create({
        resume_id: resumeId,
        sender_email: user.email,
        sender_name: user.full_name || user.email,
        content: newMessage,
        read: false
      });

      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          Team Chat
          {collaborators?.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {collaborators.length} online
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = user && message.sender_email === user.email;
              return (
                <div
                  key={message.id}
                  className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className={`flex-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={`text-xs font-medium ${isOwn ? 'order-2' : 'order-1'}`}>
                        {isOwn ? 'You' : message.sender_name}
                      </span>
                      <span className={`text-xs text-muted-foreground ${isOwn ? 'order-1' : 'order-2'}`}>
                        {new Date(message.created_date).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div
                      className={`inline-block rounded-lg px-3 py-2 max-w-[85%] ${
                        isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-3 bg-background">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={sendMessage} size="icon" disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}