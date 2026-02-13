import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function CoinPacks() {
  const packs = [
    { coins: 100, price: 0.99, bonus: 0, label: 'Starter' },
    { coins: 500, price: 4.99, bonus: 50, label: 'Popular', popular: true },
    { coins: 1000, price: 9.99, bonus: 150, label: 'Value' },
    { coins: 5000, price: 39.99, bonus: 1000, label: 'Pro', badge: 'Best Value' }
  ];

  const handlePurchase = async (pack) => {
    try {
      const user = await base44.auth.me();
      const userCredits = await base44.entities.UserCredits.filter({ userId: user.email });
      
      if (userCredits.length > 0) {
        await base44.entities.UserCredits.update(userCredits[0].id, {
          coins: userCredits[0].coins + pack.coins + pack.bonus,
          earnedTotal: (userCredits[0].earnedTotal || 0) + pack.coins + pack.bonus
        });
      }
      
      toast.success(`Purchased ${pack.coins + pack.bonus} coins!`);
    } catch (error) {
      toast.error('Purchase failed');
    }
  };

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {packs.map((pack, index) => (
        <Card key={index} className={pack.popular ? 'border-yellow-400 shadow-lg' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-base">{pack.label}</CardTitle>
              {pack.badge && <Badge className="bg-yellow-500">{pack.badge}</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold">{pack.coins}</div>
                {pack.bonus > 0 && (
                  <div className="text-xs text-green-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    +{pack.bonus} bonus
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-3 text-center">
              <span className="text-xl font-bold">${pack.price}</span>
            </div>
            <Button 
              onClick={() => handlePurchase(pack)}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500"
            >
              Buy Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}