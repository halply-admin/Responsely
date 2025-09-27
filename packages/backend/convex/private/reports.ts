import { query } from "../_generated/server";
import { ConvexError, v } from "convex/values";

// Get overview metrics for the dashboard
export const getOverviewMetrics = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    // TODO: Replace with actual database queries based on orgId and date range
    // For now, return mock data but properly authenticated
    return {
      totalConversations: {
        current: 1247,
        previous: 1098,
        change: 13.6,
        trend: 'up' as const,
        target: 1200,
        unit: 'number' as const
      },
      avgFirstResponseTime: {
        current: 18.5,
        previous: 22.3,
        change: -17.0,
        trend: 'down' as const,
        target: 15.0,
        unit: 'time' as const
      },
      resolutionRate: {
        current: 87.3,
        previous: 84.1,
        change: 3.8,
        trend: 'up' as const,
        target: 90.0,
        unit: 'percentage' as const
      },
      escalationRate: {
        current: 8.7,
        previous: 11.2,
        change: -22.3,
        trend: 'down' as const,
        target: 8.0,
        unit: 'percentage' as const
      },
      aiResolutionRate: {
        current: 76.4,
        previous: 72.1,
        change: 6.0,
        trend: 'up' as const,
        target: 80.0,
        unit: 'percentage' as const
      },
      activeUsers: {
        current: 156,
        previous: 142,
        change: 9.9,
        trend: 'up' as const,
        unit: 'number' as const
      }
    };
  },
});

// Get conversation status distribution
export const getStatusDistribution = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    // TODO: Replace with actual database queries based on orgId and date range
    const unresolved = 342;
    const escalated = 89;
    const resolved = 816;
    const total = unresolved + escalated + resolved;

    return {
      unresolved,
      escalated,
      resolved,
      total,
      distribution: [
        {
          status: 'Resolved',
          count: resolved,
          percentage: Math.round((resolved / total) * 100),
          color: '#22c55e'
        },
        {
          status: 'Unresolved',
          count: unresolved,
          percentage: Math.round((unresolved / total) * 100),
          color: '#f59e0b'
        },
        {
          status: 'Escalated',
          count: escalated,
          percentage: Math.round((escalated / total) * 100),
          color: '#ef4444'
        }
      ]
    };
  },
});

// Get AI vs Human performance comparison
export const getAIHumanComparison = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    // TODO: Replace with actual database queries based on orgId and date range
    const ai = {
      totalResolved: 623,
      avgResolutionTime: 2.3,
      resolutionRate: 76.4,
      costPerResolution: 0.85
    };

    const human = {
      totalResolved: 193,
      avgResolutionTime: 12.7,
      resolutionRate: 94.2,
      costPerResolution: 18.50
    };

    return {
      ai,
      human,
      comparison: [
        {
          metric: 'Resolution Time (min)',
          ai: ai.avgResolutionTime,
          human: human.avgResolutionTime,
          difference: -81.9,
          better: 'ai' as const
        },
        {
          metric: 'Resolution Rate (%)',
          ai: ai.resolutionRate,
          human: human.resolutionRate,
          difference: -18.9,
          better: 'human' as const
        },
        {
          metric: 'Cost per Resolution ($)',
          ai: ai.costPerResolution,
          human: human.costPerResolution,
          difference: -95.4,
          better: 'ai' as const
        }
      ]
    };
  },
});

// Get response time trends
export const getResponseTimeTrends = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Organization not found",
      });
    }

    // TODO: Replace with actual database queries based on orgId and date range
    return {
      trends: [
        { timestamp: '2024-01-01', value: 22 },
        { timestamp: '2024-01-02', value: 19 },
        { timestamp: '2024-01-03', value: 17 },
        { timestamp: '2024-01-04', value: 20 },
        { timestamp: '2024-01-05', value: 15 },
        { timestamp: '2024-01-06', value: 18 },
        { timestamp: '2024-01-07', value: 16 },
      ],
      avgResponseTime: 18.5,
      improvement: -12.3
    };
  },
}); 