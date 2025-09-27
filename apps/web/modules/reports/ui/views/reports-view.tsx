"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Download, RefreshCw, TrendingUp, Zap, AlertTriangle, BarChart3Icon } from "lucide-react";
import { ReportsFilters } from "../components/reports-filters";
import { OverviewCards } from "../components/overview-cards";
import { StatusDistributionChart } from "../components/status-distribution-chart";
import { AIHumanComparisonChart } from "../components/ai-human-comparison-chart";
import { ResponseTimeTrendsChart } from "../components/response-time-trends-chart";
import { EscalationAnalyticsChart } from "../components/escalation-analytics-chart";
import { PlanPerformanceChart } from "../components/plan-performance-chart";
import { VolumeTrendsChart } from "../components/volume-trends-chart";
import { FCRChart } from "../components/fcr-chart";
import { SessionAnalyticsChart } from "../components/session-analytics-chart";
import { AIEffectivenessChart } from "../components/ai-effectiveness-chart";
import { ReportFilters } from "@/modules/reports/lib/reports";
import { PremiumFeatureOverlay } from "@/modules/billing/ui/components/premium-feature-overlay";
import { MobileAwareLayout } from "@/modules/dashboard/ui/layouts/mobile-aware-layout";
import { useSubscriptionStatus } from "@/modules/billing/hooks/use-subscription-status";

export const ReportsView = () => {
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString()
    },
    status: 'all',
    subscriptionStatus: 'all'
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isActive: hasActiveSubscription } = useSubscriptionStatus();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleExport = () => {
    console.log('Exporting reports...');
  };

  const reportsContent = (
    <div className="flex-1 space-y-6 p-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for your customer support operations
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ReportsFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
      />

      {/* Overview Cards */}
      <OverviewCards filters={filters} />

      {/* Main Dashboard Grid */}
      <div className="grid gap-4 md:gap-6 lg:gap-8">
        {/* Top Row - Primary Charts */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-7">
          {/* Main Chart - Response Time Trends */}
          <div className="lg:col-span-4">
            <ResponseTimeTrendsChart filters={filters} />
          </div>
          
          {/* Side Charts */}
          <div className="lg:col-span-3 grid gap-4">
            <StatusDistributionChart filters={filters} />
            <EscalationAnalyticsChart filters={filters} />
          </div>
        </div>

        {/* Second Row - Performance Comparison */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
          <AIHumanComparisonChart filters={filters} />
          <VolumeTrendsChart filters={filters} />
        </div>

        {/* Third Row - Three Column Layout */}
        <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
          <PlanPerformanceChart filters={filters} />
          <FCRChart filters={filters} />
          <SessionAnalyticsChart filters={filters} />
        </div>

        {/* Bottom Row - Full Width AI Effectiveness */}
        <AIEffectivenessChart filters={filters} />
      </div>

      {/* Quick Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Insights
          </CardTitle>
          <CardDescription>
            Key trends and recommendations based on your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  Resolution Rate Improving
                </h4>
                <p className="text-sm text-green-700 dark:text-green-200">
                  Up 8.7% from last period, approaching 90% target
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  AI Efficiency Gains
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  AI resolution time 82% faster than human agents
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-900 dark:text-orange-100">
                  Escalation Spike
                </h4>
                <p className="text-sm text-orange-700 dark:text-orange-200">
                  Technical issues causing 38% of escalations
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Show reports with premium overlay if subscription is not active
  return (
    <MobileAwareLayout title="Reports">
      {hasActiveSubscription ? (
        reportsContent
      ) : (
        <PremiumFeatureOverlay>
          {reportsContent}
        </PremiumFeatureOverlay>
      )}
    </MobileAwareLayout>
  );
}; 