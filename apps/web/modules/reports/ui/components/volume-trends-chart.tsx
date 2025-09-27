"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ReportFilters } from "@/modules/reports/lib/reports";

interface VolumeTrendsChartProps {
  filters: ReportFilters;
}

export const VolumeTrendsChart = ({ filters }: VolumeTrendsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Volume Trends</CardTitle>
        <CardDescription>Conversation volume over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Chart implementation coming soon...
        </div>
      </CardContent>
    </Card>
  );
}; 