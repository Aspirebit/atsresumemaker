import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Gift, Copy, Users } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ReferralSystem() {
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      const user = await base44.auth.me();
      setReferralCode(user.email.split('@')[0].toUpperCase());
      const data = await base44.entities.Referral.filter({ referrerId: user.email });
      setReferrals(data);
    } catch (error) {
      console.error('Failed to load referrals');
    }
  };

  const handleInvite = async () => {
    if (!email) return;
    try {
      const user = await base44.auth.me();
      await base44.entities.Referral.create({
        referrerId: user.email,
        referredEmail: email,
        status: 'pending',
        coinsEarned: 0
      });
      toast.success('Invitation sent!');
      setEmail('');
      loadReferrals();
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://yourapp.com?ref=${referralCode}`);
    toast.success('Referral link copied!');
  };

  const completedReferrals = referrals.filter(r => r.status === 'completed').length;
  const totalCoinsEarned = referrals.reduce((sum, r) => sum + (r.coinsEarned || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-purple-600" />
          Refer & Earn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
          <p className="text-sm mb-2">Invite friends and earn 50 coins per signup!</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white/20 px-3 py-2 rounded text-sm">{referralCode}</code>
            <Button size="sm" onClick={copyReferralLink} variant="secondary">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedReferrals}</div>
            <div className="text-xs text-muted-foreground">Successful Referrals</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{totalCoinsEarned}</div>
            <div className="text-xs text-muted-foreground">Coins Earned</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@email.com"
            />
            <Button onClick={handleInvite}>Invite</Button>
          </div>
        </div>

        {referrals.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Recent Referrals</h4>
            {referrals.slice(0, 3).map((ref, i) => (
              <div key={i} className="flex items-center justify-between text-sm p-2 bg-accent rounded">
                <span>{ref.referredEmail}</span>
                <Badge variant={ref.status === 'completed' ? 'default' : 'secondary'}>
                  {ref.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}