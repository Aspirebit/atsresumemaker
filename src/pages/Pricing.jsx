import React, { useState, useEffect } from 'react';
import { Check, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SubscriptionPlans from '@/components/subscription/SubscriptionPlans';
import CoinPacks from '@/components/subscription/CoinPacks';
import ReferralSystem from '@/components/referral/ReferralSystem';

export default function Pricing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
      
      // Check if user has active subscription
      const subs = await base44.entities.Subscription.filter({
        userId: userData.email,
        status: 'active'
      });
      if (subs.length > 0) {
        setSubscription(subs[0]);
      }
    } catch (error) {
      console.error('Failed to load user data');
    }
  };

  const plans = [
    {
      id: 'daily',
      name: '1-Day Pass',
      price: 1,
      period: 'day',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Unlimited resume downloads',
        'All AI features',
        'All templates',
        'Export to PDF/Word/TXT',
        '24-hour access',
        'Premium support'
      ],
      popular: false
    },
    {
      id: 'monthly',
      name: 'Monthly Pro',
      price: 19,
      period: 'month',
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      features: [
        'Everything in 1-Day Pass',
        'Priority AI processing',
        'Custom templates',
        'Advanced analytics',
        'Collaboration features',
        'Remove watermarks'
      ],
      popular: true
    },
    {
      id: 'yearly',
      name: 'Yearly Pro',
      price: 49,
      period: 'year',
      icon: Crown,
      color: 'from-green-500 to-green-600',
      badge: 'Save 78%',
      features: [
        'Everything in Monthly Pro',
        'Lifetime template access',
        'Premium AI models',
        'API access',
        'White-label option',
        'Dedicated support'
      ],
      popular: false
    }
  ];

  const handleSubscribe = async (planId) => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setLoading(true);
    try {
      // Here you would integrate with Stripe
      // For now, we'll create a mock subscription
      const plan = plans.find(p => p.id === planId);
      const endDate = new Date();
      
      if (planId === 'daily') {
        endDate.setDate(endDate.getDate() + 1);
      } else if (planId === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (planId === 'yearly') {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      await base44.entities.Subscription.create({
        userId: user.email,
        plan: planId,
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: endDate.toISOString(),
        amount: plan.price
      });

      toast.success('Subscription activated!');
      navigate(createPageUrl('Dashboard'));
    } catch (error) {
      toast.error('Failed to process subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-600 text-white">Upgrade to Pro</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-foreground mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
            Unlock premium features and create unlimited professional resumes
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-6">Subscription Tiers</h2>
          <SubscriptionPlans />
        </div>

        {/* Coin Packs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-2">Buy Coin Packs</h2>
          <p className="text-center text-muted-foreground mb-6">Use coins for templates, AI features, and more</p>
          <CoinPacks />
        </div>

        {/* Referral System */}
        <div className="mb-12 max-w-xl mx-auto">
          <ReferralSystem />
        </div>

        <h2 className="text-2xl font-bold text-center mb-8">Quick Access Plans</h2>

        {/* Current Subscription */}
        {subscription && (
          <Card className="mb-8 bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold text-lg">Active Subscription</h3>
                  <p className="text-sm opacity-90">
                    {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} plan • 
                    Expires on {new Date(subscription.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden ${plan.popular ? 'ring-2 ring-purple-500 shadow-xl scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                {plan.badge && (
                  <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                    {plan.badge}
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${plan.color} mx-auto mb-4 flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-600 dark:text-muted-foreground">/{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading || (subscription?.plan === plan.id)}
                    className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                  >
                    {subscription?.plan === plan.id ? 'Current Plan' : 
                     loading ? 'Processing...' : 
                     'Subscribe Now'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto space-y-4 text-left">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                  Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                  We accept all major credit cards, debit cards, and digital wallets through our secure payment processor Stripe.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Is my data stored securely?</h3>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                  Yes! All your data is encrypted and stored securely. We use industry-standard security practices to protect your information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}