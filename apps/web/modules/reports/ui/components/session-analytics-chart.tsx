"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ReportFilters } from "@/modules/reports/lib/reports";

interface SessionAnalyticsChartProps {
  filters: ReportFilters;
}

export const SessionAnalyticsChart = ({ filters }: SessionAnalyticsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Analytics</CardTitle>
        <CardDescription>User session metrics and behavior</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Chart implementation coming soon...
        </div>
      </CardContent>
    </Card>
  );
}; 