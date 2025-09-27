// Mock subscription status hook - replace with actual auth/subscription logic
export const useSubscriptionStatus = () => {
  // This should come from your auth/subscription provider
  return {
    isActive: false, // Set to true to test without paywall
    plan: 'free' as const, // 'free', 'pro', 'enterprise'
  };
}; 