"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ReportFilters } from "@/modules/reports/lib/reports";

interface PlanPerformanceChartProps {
  filters: ReportFilters;
}

export const PlanPerformanceChart = ({ filters }: PlanPerformanceChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Performance</CardTitle>
        <CardDescription>Performance metrics by subscription plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Chart implementation coming soon...
        </div>
      </CardContent>
    </Card>
  );
}; 