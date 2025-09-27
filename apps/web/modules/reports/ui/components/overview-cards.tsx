"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { MessageSquare, Clock, CheckCircle, Bot } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { ReportFilters, OverviewMetrics } from "@/modules/reports/lib/reports";

interface OverviewCardsProps {
  filters: ReportFilters;
}

interface MetricCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  description?: string;
  positiveTrendDirection?: 'up' | 'down';
  isLoading?: boolean;
}

const MetricCard = ({ 
  title, 
  icon: Icon, 
  value, 
  change, 
  trend, 
  description, 
  positiveTrendDirection = 'up',
  isLoading = false 
}: MetricCardProps) => {
  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'stable') return 'text-muted-foreground';
    
    // Use the explicit positiveTrendDirection instead of hardcoded logic
    const isPositiveTrend = trend === positiveTrendDirection;
    return isPositiveTrend ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'stable') return '→';
    return trend === 'up' ? '↗' : '↘';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-32" />
          </CardTitle>
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && trend && (
          <p className="text-xs text-muted-foreground">
            <span className={getTrendColor(trend)}>
              {getTrendIcon(trend)} {Math.abs(change)}%
            </span>
            {description && ` ${description}`}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export const OverviewCards = ({ filters }: OverviewCardsProps) => {
  const metrics = useQuery(api.private.reports.getOverviewMetrics, {
    startDate: filters.dateRange.start,
    endDate: filters.dateRange.end,
  });
  const isLoading = metrics === undefined;
  const error = metrics === null;

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Failed to load metrics
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatValue = (value: number, unit?: string) => {
    switch (unit) {
      case 'time': {
        const totalMinutes = Math.round(value);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        if (hours > 0) {
          return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
      }
      case 'percentage':
        return `${value}%`;
      case 'currency':
        return `$${value.toLocaleString()}`;
      default:
        return value.toLocaleString();
    }
  };

  const cards = [
    {
      title: "Total Conversations",
      icon: MessageSquare,
      value: isLoading ? '' : formatValue(metrics.totalConversations.current, metrics.totalConversations.unit),
      change: metrics?.totalConversations.change,
      trend: metrics?.totalConversations.trend,
      positiveTrendDirection: metrics?.totalConversations.positiveTrendDirection,
      description: "vs last period",
      isLoading
    },
    {
      title: "Avg Response Time", 
      icon: Clock,
      value: isLoading ? '' : formatValue(metrics.avgFirstResponseTime.current, metrics.avgFirstResponseTime.unit),
      change: metrics?.avgFirstResponseTime.change,
      trend: metrics?.avgFirstResponseTime.trend,
      positiveTrendDirection: metrics?.avgFirstResponseTime.positiveTrendDirection,
      description: "first response",
      isLoading
    },
    {
      title: "Resolution Rate",
      icon: CheckCircle, 
      value: isLoading ? '' : formatValue(metrics.resolutionRate.current, metrics.resolutionRate.unit),
      change: metrics?.resolutionRate.change,
      trend: metrics?.resolutionRate.trend,
      positiveTrendDirection: metrics?.resolutionRate.positiveTrendDirection,
      description: "successfully resolved",
      isLoading
    },
    {
      title: "AI Resolution Rate",
      icon: Bot,
      value: isLoading ? '' : formatValue(metrics.aiResolutionRate.current, metrics.aiResolutionRate.unit),
      change: metrics?.aiResolutionRate.change,
      trend: metrics?.aiResolutionRate.trend,
      positiveTrendDirection: metrics?.aiResolutionRate.positiveTrendDirection,
      description: "automated resolution",
      isLoading
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <MetricCard key={card.title} {...card} />
      ))}
    </div>
  );
}; 
