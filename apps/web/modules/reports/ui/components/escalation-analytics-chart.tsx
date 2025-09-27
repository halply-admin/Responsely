"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ReportFilters } from "@/modules/reports/lib/reports";

interface EscalationAnalyticsChartProps {
  filters: ReportFilters;
}

export const EscalationAnalyticsChart = ({ filters }: EscalationAnalyticsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escalation Analytics</CardTitle>
        <CardDescription>Escalation patterns and reasons</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Chart implementation coming soon...
        </div>
      </CardContent>
    </Card>
  );
}; 