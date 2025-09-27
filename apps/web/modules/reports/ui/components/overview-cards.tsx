"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { MessageSquare, Clock, CheckCircle, Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { ReportFilters, OverviewDashboardReport, OverviewMetrics } from "@/modules/reports/lib/reports";

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
}

const MetricCard = ({ title, icon: Icon, value, change, trend, description }: MetricCardProps) => {
  const getTrendColor = (trend: 'up' | 'down' | 'stable', isPositiveMetric: boolean = true) => {
    if (trend === 'stable') return 'text-muted-foreground';
    
    if (isPositiveMetric) {
      return trend === 'up' ? 'text-green-600' : 'text-red-600';
    } else {
      return trend === 'down' ? 'text-green-600' : 'text-red-600';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↙';
    return '→';
  };

  const isPositiveMetric = !title.toLowerCase().includes('escalation') && 
                          !title.toLowerCase().includes('response time');

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className={`text-xs flex items-center gap-1 ${getTrendColor(trend!, isPositiveMetric)}`}>
            <span>{getTrendIcon(trend!)}</span>
            {Math.abs(change)}% {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export const OverviewCards = ({ filters }: OverviewCardsProps) => {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        const report = new OverviewDashboardReport(filters);
        const data = await report.fetchData();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch overview metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [filters]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-20 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) {
    return <div>Error loading metrics</div>;
  }

  const formatValue = (value: number, unit?: string) => {
    switch (unit) {
      case 'time':
        return value < 60 ? `${Math.round(value)}m` : `${Math.floor(value / 60)}h ${Math.round(value % 60)}m`;
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
      value: formatValue(metrics.totalConversations.current, metrics.totalConversations.unit),
      change: metrics.totalConversations.change,
      trend: metrics.totalConversations.trend,
      description: "vs last period"
    },
    {
      title: "Avg Response Time", 
      icon: Clock,
      value: formatValue(metrics.avgFirstResponseTime.current, metrics.avgFirstResponseTime.unit),
      change: metrics.avgFirstResponseTime.change,
      trend: metrics.avgFirstResponseTime.trend,
      description: "first response"
    },
    {
      title: "Resolution Rate",
      icon: CheckCircle, 
      value: formatValue(metrics.resolutionRate.current, metrics.resolutionRate.unit),
      change: metrics.resolutionRate.change,
      trend: metrics.resolutionRate.trend,
      description: "successfully resolved"
    },
    {
      title: "AI Resolution Rate",
      icon: Bot,
      value: formatValue(metrics.aiResolutionRate.current, metrics.aiResolutionRate.unit),
      change: metrics.aiResolutionRate.change,
      trend: metrics.aiResolutionRate.trend,
      description: "automated resolution"
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