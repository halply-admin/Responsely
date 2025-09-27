"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ReportFilters } from "@/modules/reports/lib/reports";

interface AIEffectivenessChartProps {
  filters: ReportFilters;
}

export const AIEffectivenessChart = ({ filters }: AIEffectivenessChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Effectiveness</CardTitle>
        <CardDescription>AI performance metrics and learning progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] flex items-center justify-center text-muted-foreground">
          Chart implementation coming soon...
        </div>
      </CardContent>
    </Card>
  );
}; 