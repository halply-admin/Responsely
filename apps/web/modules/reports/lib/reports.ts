// ============================================================================
// CORE TYPES AND INTERFACES
// ============================================================================

export interface DateRange {
  start: string;
  end: string;
}

export interface ReportFilters {
  dateRange: DateRange;
  status?: 'unresolved' | 'escalated' | 'resolved' | 'all';
  organizationId?: string;
  subscriptionStatus?: 'active' | 'inactive' | 'all';
}

export interface MetricValue {
  current: number;
  previous?: number;
  change?: number;
  trend: 'up' | 'down' | 'stable';
  target?: number;
  unit?: 'number' | 'percentage' | 'currency' | 'time';
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'mixed';
  height?: number;
  responsive: boolean;
  options: any;
}

// ============================================================================
// BASE REPORT ABSTRACT CLASS
// ============================================================================

export abstract class BaseReport<T = unknown> {
  protected filters: ReportFilters;
  protected refreshInterval?: number;

  constructor(filters: ReportFilters, refreshInterval?: number) {
    this.filters = filters;
    this.refreshInterval = refreshInterval;
  }

  abstract getTitle(): string;
  abstract getDescription(): string;
  abstract getCategory(): 'operational' | 'performance' | 'business' | 'quality';
  abstract fetchData(): Promise<T>;
  abstract getChartConfig(): ChartConfig;

  // Helper methods
  protected calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100 * 10) / 10;
  }

  protected determineTrend(change: number): 'up' | 'down' | 'stable' {
    if (Math.abs(change) < 1) return 'stable';
    return change > 0 ? 'up' : 'down';
  }

  protected formatDuration(minutes: number): string {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  }
}

// ============================================================================
// OVERVIEW DASHBOARD METRICS
// ============================================================================

export interface OverviewMetrics {
  totalConversations: MetricValue;
  avgFirstResponseTime: MetricValue;
  resolutionRate: MetricValue;
  escalationRate: MetricValue;
  aiResolutionRate: MetricValue;
  activeUsers: MetricValue;
}

export class OverviewDashboardReport extends BaseReport<OverviewMetrics> {
  getTitle(): string {
    return "Support Overview";
  }

  getDescription(): string {
    return "Key performance indicators for customer support operations";
  }

  getCategory(): 'operational' {
    return 'operational';
  }

  async fetchData(): Promise<OverviewMetrics> {
    // Mock data - replace with actual Convex queries
    return {
      totalConversations: {
        current: 1247,
        previous: 1098,
        change: 13.6,
        trend: 'up',
        target: 1200,
        unit: 'number'
      },
      avgFirstResponseTime: {
        current: 18.5,
        previous: 22.3,
        change: -17.0,
        trend: 'down',
        target: 15.0,
        unit: 'time'
      },
      resolutionRate: {
        current: 87.3,
        previous: 84.1,
        change: 3.8,
        trend: 'up',
        target: 90.0,
        unit: 'percentage'
      },
      escalationRate: {
        current: 8.7,
        previous: 11.2,
        change: -22.3,
        trend: 'down',
        target: 8.0,
        unit: 'percentage'
      },
      aiResolutionRate: {
        current: 76.4,
        previous: 72.1,
        change: 6.0,
        trend: 'up',
        target: 80.0,
        unit: 'percentage'
      },
      activeUsers: {
        current: 156,
        previous: 142,
        change: 9.9,
        trend: 'up',
        unit: 'number'
      }
    };
  }

  getChartConfig(): ChartConfig {
    return {
      type: 'mixed',
      height: 400,
      responsive: true,
      options: {}
    };
  }
}

// ============================================================================
// STATUS DISTRIBUTION
// ============================================================================

export interface StatusDistribution {
  unresolved: number;
  escalated: number;
  resolved: number;
  total: number;
  distribution: {
    status: string;
    count: number;
    percentage: number;
    color: string;
  }[];
}

export class ConversationStatusReport extends BaseReport<StatusDistribution> {
  getTitle(): string {
    return "Conversation Status Distribution";
  }

  getDescription(): string {
    return "Breakdown of conversations by current status";
  }

  getCategory(): 'operational' {
    return 'operational';
  }

  async fetchData(): Promise<StatusDistribution> {
    // Mock data
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
  }

  getChartConfig(): ChartConfig {
    return {
      type: 'donut',
      height: 300,
      responsive: true,
      options: {}
    };
  }
}

// ============================================================================
// AI VS HUMAN COMPARISON
// ============================================================================

export interface AIHumanComparison {
  ai: {
    totalResolved: number;
    avgResolutionTime: number;
    resolutionRate: number;
    costPerResolution: number;
  };
  human: {
    totalResolved: number;
    avgResolutionTime: number;
    resolutionRate: number;
    costPerResolution: number;
  };
  comparison: {
    metric: string;
    ai: number;
    human: number;
    difference: number;
    better: 'ai' | 'human';
  }[];
}

export class AIHumanComparisonReport extends BaseReport<AIHumanComparison> {
  getTitle(): string {
    return "AI vs Human Agent Performance";
  }

  getDescription(): string {
    return "Comparative analysis of AI and human agent effectiveness";
  }

  getCategory(): 'performance' {
    return 'performance';
  }

  async fetchData(): Promise<AIHumanComparison> {
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
          better: 'ai'
        },
        {
          metric: 'Resolution Rate (%)',
          ai: ai.resolutionRate,
          human: human.resolutionRate,
          difference: -18.9,
          better: 'human'
        },
        {
          metric: 'Cost per Resolution ($)',
          ai: ai.costPerResolution,
          human: human.costPerResolution,
          difference: -95.4,
          better: 'ai'
        }
      ]
    };
  }

  getChartConfig(): ChartConfig {
    return {
      type: 'bar',
      height: 350,
      responsive: true,
      options: {}
    };
  }
} 