"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Download, RefreshCw, TrendingUp, Zap, AlertTriangle, MessageSquare, Clock, CheckCircle, Bot, BarChart3Icon } from "lucide-react";
import { MobileAwareLayout } from "@/modules/dashboard/ui/layouts/mobile-aware-layout";

export const StaticReportsPlaceholder = () => {
  return (
    <MobileAwareLayout title="Reports">
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
              disabled
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters Placeholder */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 w-full sm:w-48" />
              <Skeleton className="h-10 w-full sm:w-32" />
              <Skeleton className="h-10 w-full sm:w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Conversations", icon: MessageSquare, value: "1,234" },
            { title: "Avg Response Time", icon: Clock, value: "2m 30s" },
            { title: "Resolution Rate", icon: CheckCircle, value: "87%" },
            { title: "AI Resolution Rate", icon: Bot, value: "73%" }
          ].map((card) => (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground/50">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">↗ 8.2%</span> vs last period
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid gap-4 md:gap-6 lg:gap-8">
          {/* Top Row - Primary Charts */}
          <div className="grid gap-4 md:gap-6 lg:grid-cols-7">
            {/* Main Chart - Response Time Trends */}
            <div className="lg:col-span-4">
              <Card>
                <CardHeader>
                  <CardTitle>Response Time Trends</CardTitle>
                  <CardDescription>Average response times over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <BarChart3Icon className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                      <Skeleton className="h-4 w-32 mx-auto" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Side Charts */}
            <div className="lg:col-span-3 grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                  <CardDescription>Conversation status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[140px] flex items-center justify-center">
                    <Skeleton className="h-20 w-20 rounded-full" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Escalation Analytics</CardTitle>
                  <CardDescription>Escalation patterns and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[140px] flex items-center justify-center">
                    <Skeleton className="h-16 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Second Row - Performance Comparison */}
          <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
            {["AI vs Human Performance", "Volume Trends"].map((title) => (
              <Card key={title}>
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>Performance comparison metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <BarChart3Icon className="h-8 w-8 text-muted-foreground/30 mx-auto" />
                      <Skeleton className="h-4 w-24 mx-auto" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Third Row - Three Column Layout */}
          <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
            {["Plan Performance", "First Contact Resolution", "Session Analytics"].map((title) => (
              <Card key={title}>
                <CardHeader>
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription>Key performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <BarChart3Icon className="h-6 w-6 text-muted-foreground/30 mx-auto" />
                      <Skeleton className="h-3 w-16 mx-auto" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom Row - Full Width AI Effectiveness */}
          <Card>
            <CardHeader>
              <CardTitle>AI Effectiveness Analysis</CardTitle>
              <CardDescription>Comprehensive AI performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <BarChart3Icon className="h-12 w-12 text-muted-foreground/30 mx-auto" />
                  <Skeleton className="h-4 w-40 mx-auto" />
                </div>
              </div>
            </CardContent>
          </Card>
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
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg opacity-60">
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
              
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg opacity-60">
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
              
              <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg opacity-60">
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
    </MobileAwareLayout>
  );
}; 