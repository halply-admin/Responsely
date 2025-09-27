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
// REPORT DATA TYPES
// ============================================================================

export interface OverviewMetrics {
  totalConversations: MetricValue;
  avgFirstResponseTime: MetricValue;
  resolutionRate: MetricValue;
  escalationRate: MetricValue;
  aiResolutionRate: MetricValue;
  activeUsers: MetricValue;
}

export interface StatusDistribution {
  unresolved: number;
  escalated: number;
  resolved: number;
  total: number;
  distribution: {
    status: string;
    count: number;
    percentage: number;
  }[];
}

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

export interface ResponseTimeTrendsData {
  trends: { timestamp: string; value: number }[];
  avgResponseTime: number;
  improvement: number;
} 