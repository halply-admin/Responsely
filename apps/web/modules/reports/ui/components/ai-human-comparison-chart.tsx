"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@workspace/ui/components/chart";
import { BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { ReportFilters, AIHumanComparison } from "@/modules/reports/lib/reports";
import { Badge } from "@workspace/ui/components/badge";
import { ChartCard } from "./chart-card";

interface AIHumanComparisonChartProps {
  filters: ReportFilters;
}

const chartConfig = {
  ai: {
    label: "AI Agent",
    color: "#3b82f6",
  },
  human: {
    label: "Human Agent",
    color: "#22c55e",
  },
} as const;

export const AIHumanComparisonChart = ({ filters }: AIHumanComparisonChartProps) => {
  const data = useQuery(api.private.reports.getAIHumanComparison, {
    startDate: filters.dateRange.start,
    endDate: filters.dateRange.end,
  });

  const isLoading = data === undefined;
  const error = data === null;

  const chartData = data?.comparison.map((item) => ({
    metric: item.metric,
    ai: item.ai,
    human: item.human,
  })) || [];

  return (
    <ChartCard
      title="AI vs Human Performance"
      description="Comparative analysis of resolution effectiveness"
      isLoading={isLoading}
      error={error}
      height="h-[400px]"
    >
      <div className="space-y-6">
        {/* Performance Summary */}
        {data && (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{data.ai.totalResolved}</div>
              <div className="text-sm text-blue-600">AI Resolutions</div>
              <div className="text-xs text-muted-foreground">{data.ai.resolutionRate}% success rate</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{data.human.totalResolved}</div>
              <div className="text-sm text-green-600">Human Resolutions</div>
              <div className="text-xs text-muted-foreground">{data.human.resolutionRate}% success rate</div>
            </div>
          </div>
        )}

        <ChartContainer
          config={chartConfig}
          className="h-[300px]"
        >
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="metric" 
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar 
              dataKey="ai" 
              fill={chartConfig.ai.color}
              name={chartConfig.ai.label}
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="human" 
              fill={chartConfig.human.color}
              name={chartConfig.human.label}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        {/* Key Insights */}
        {data && (
          <div>
            <h4 className="text-sm font-medium mb-2">Key Insights</h4>
            <div className="grid gap-2">
              {data.comparison.map((item) => (
                <div key={item.metric} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.metric}</span>
                  <Badge variant={item.better === 'ai' ? 'default' : 'secondary'}>
                    {item.better === 'ai' ? 'AI Better' : 'Human Better'} ({Math.abs(item.difference)}%)
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ChartCard>
  );
}; 
