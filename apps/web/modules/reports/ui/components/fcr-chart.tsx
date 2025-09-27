"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ReportFilters } from "@/modules/reports/lib/reports";

interface FCRChartProps {
  filters: ReportFilters;
}

export const FCRChart = ({ filters }: FCRChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>First Contact Resolution</CardTitle>
        <CardDescription>FCR rate and trends</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Chart implementation coming soon...
        </div>
      </CardContent>
    </Card>
  );
}; 