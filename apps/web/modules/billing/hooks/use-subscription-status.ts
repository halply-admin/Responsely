import { useMemo } from 'react';

// Mock subscription status hook - replace with actual auth/subscription logic
export const useSubscriptionStatus = (): {
  isActive: boolean;
  plan: 'free' | 'pro' | 'enterprise';
} => {
  // This should come from your auth/subscription provider
  // Using useMemo to make this a valid hook, as it's called as one.
  return useMemo(
    () => ({
      isActive: false, // Set to true to test without paywall
      plan: 'free' as const, // 'free', 'pro', 'enterprise'
    }),
    [],
  );
}; 