import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionPlans() {
  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      features: ['5 AI generations/month', '3 basic templates', 'Email support'],
      popular: false
    },
    {
      name: 'Basic',
      price: 9.99,
      period: 'month',
      features: ['50 AI generations/month', 'All templates', 'Priority support', '100 bonus coins'],
      popular: false
    },
    {
      name: 'Pro',
      price: 19.99,
      period: 'month',
      features: ['Unlimited AI generations', 'All premium templates', 'Priority support', 'Advanced analytics', '300 bonus coins', 'ATS optimization'],
      popular: true
    },
    {
      name: 'Premium',
      price: 49.99,
      period: 'month',
      features: ['Everything in Pro', 'Personal career coach', 'Resume review service', 'Interview prep sessions', '1000 bonus coins', 'Direct recruiter connections'],
      popular: false
    }
  ];

  const handleSubscribe = (plan) => {
    toast.success(`Subscribing to ${plan.name} plan...`);
  };

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {plans.map((plan, index) => (
        <Card key={index} className={plan.popular ? 'border-primary shadow-lg' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              {plan.popular && <Badge className="bg-primary">Popular</Badge>}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">${plan.price}</span>
              <span className="text-muted-foreground">/{plan.period}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              onClick={() => handleSubscribe(plan)}
              variant={plan.popular ? 'default' : 'outline'}
              className="w-full"
            >
              {plan.price === 0 ? 'Current Plan' : 'Subscribe'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}