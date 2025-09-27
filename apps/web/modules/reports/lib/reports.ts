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
  positiveTrendDirection?: 'up' | 'down'; // For metrics where down trend is positive (e.g., escalation rate)
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
  options: Record<string, unknown>;
}

// ============================================================================
// BASE REPORT ABSTRACT CLASS
// ============================================================================

export abstract class BaseReport<T = unknown> {
  protected filters: ReportFilters;

  constructor(filters: ReportFilters) {
    this.filters = filters;
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
    // This will be handled by the React component
    return {
      totalConversations: {
        current: 1247,
        previous: 1098,
        change: 13.6,
        trend: 'up',
        target: 1200,
        unit: 'number',
      },
      avgFirstResponseTime: {
        current: 18.5,
        previous: 22.3,
        change: -17.0,
        trend: 'down',
        target: 15.0,
        unit: 'time',
        positiveTrendDirection: 'down',
      },
      resolutionRate: {
        current: 87.3,
        previous: 84.1,
        change: 3.8,
        trend: 'up',
        target: 90.0,
        unit: 'percentage',
      },
      escalationRate: {
        current: 8.7,
        previous: 11.2,
        change: -22.3,
        trend: 'down',
        target: 8.0,
        unit: 'percentage',
        positiveTrendDirection: 'down',
      },
      aiResolutionRate: {
        current: 76.4,
        previous: 72.1,
        change: 6.0,
        trend: 'up',
        target: 80.0,
        unit: 'percentage',
      },
      activeUsers: {
        current: 156,
        previous: 142,
        change: 9.9,
        trend: 'up',
        unit: 'number',
      },
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
    // This will be handled by the React component
    return {
      unresolved: 0,
      escalated: 0,
      resolved: 0,
      total: 0,
      distribution: [],
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
    // This will be handled by the React component
    return {
      ai: {
        totalResolved: 0,
        avgResolutionTime: 0,
        resolutionRate: 0,
        costPerResolution: 0,
      },
      human: {
        totalResolved: 0,
        avgResolutionTime: 0,
        resolutionRate: 0,
        costPerResolution: 0,
      },
      comparison: [],
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

// ============================================================================
// RESPONSE TIME TRENDS
// ============================================================================

export interface ResponseTimeTrendsData {
  trends: { timestamp: string; value: number }[];
  avgResponseTime: number;
  improvement: number;
}

export class ResponseTimeTrendsReport extends BaseReport<ResponseTimeTrendsData> {
  getTitle(): string {
    return "Response Time Trends";
  }

  getDescription(): string {
    return "Average first response time trends over time";
  }

  getCategory(): 'performance' {
    return 'performance';
  }

  async fetchData(): Promise<ResponseTimeTrendsData> {
    // This will be handled by the React component
    return {
      trends: [],
      avgResponseTime: 0,
      improvement: 0,
    };
  }

  getChartConfig(): ChartConfig {
    return {
      type: 'line',
      height: 300,
      responsive: true,
      options: {}
    };
  }
} 