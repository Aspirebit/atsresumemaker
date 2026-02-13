import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export async function checkSubscription() {
  try {
    const user = await base44.auth.me();
    if (!user) return false;

    const subscriptions = await base44.entities.Subscription.filter({
      userId: user.email,
      status: 'active'
    });

    if (subscriptions.length === 0) return false;

    const subscription = subscriptions[0];
    const endDate = new Date(subscription.endDate);
    const now = new Date();

    if (endDate < now) {
      // Subscription expired
      await base44.entities.Subscription.update(subscription.id, {
        status: 'expired'
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to check subscription:', error);
    return false;
  }
}

export async function requireSubscription(feature = 'this feature') {
  const hasSubscription = await checkSubscription();
  
  if (!hasSubscription) {
    toast.error(`Subscribe to Pro to use ${feature}`);
    return false;
  }
  
  return true;
}