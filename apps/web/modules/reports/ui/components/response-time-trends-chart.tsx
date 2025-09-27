"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@workspace/ui/components/chart";
import { LineChart, Line, XAxis, YAxis, ReferenceLine } from "recharts";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { ReportFilters, ResponseTimeTrendsData } from "@/modules/reports/lib/reports";
import { Badge } from "@workspace/ui/components/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
import { ChartCard } from "./chart-card";

interface ResponseTimeTrendsChartProps {
  filters: ReportFilters;
}

const RESPONSE_TIME_TARGET_MINUTES = 15;

const chartConfig = {
  responseTime: {
    label: "Response Time",
    color: "#3b82f6",
  },
} as const;

export const ResponseTimeTrendsChart = ({ filters }: ResponseTimeTrendsChartProps) => {
  const data = useQuery(api.private.reports.getResponseTimeTrends, {
    startDate: filters.dateRange.start,
    endDate: filters.dateRange.end,
  });

  const isLoading = data === undefined;
  const error = data === null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = data?.trends.map((item) => ({
    ...item,
    date: formatDate(item.timestamp),
    responseTime: Math.round(item.value * 10) / 10,
  })) || [];

  return (
    <ChartCard
      title="Response Time Trends"
      description="Average first response time over the selected period"
      isLoading={isLoading}
      error={error}
    >
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-2xl font-bold">{data?.avgResponseTime}m</div>
              <div className="text-sm text-muted-foreground">Average Response Time</div>
            </div>
            <div className="flex items-center gap-2">
              {data && data.improvement < 0 ? (
                <TrendingDown className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-600" />
              )}
              <Badge variant={data && data.improvement < 0 ? "default" : "destructive"}>
                {data && Math.abs(data.improvement)}% {data && data.improvement < 0 ? 'Improvement' : 'Decline'}
              </Badge>
            </div>
          </div>
        </div>

        <ChartContainer
          config={chartConfig}
          className="h-[300px]"
        >
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
            />
            
            {/* Target line */}
            <ReferenceLine 
              y={RESPONSE_TIME_TARGET_MINUTES} 
              stroke="#22c55e" 
              strokeDasharray="5 5"
              label={{ value: `Target (${RESPONSE_TIME_TARGET_MINUTES}m)`, position: "right" }}
            />
            
            <ChartTooltip content={<ChartTooltipContent />} />
            
            <Line 
              type="monotone" 
              dataKey="responseTime" 
              stroke={chartConfig.responseTime.color}
              strokeWidth={2}
              dot={{ fill: chartConfig.responseTime.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: chartConfig.responseTime.color, strokeWidth: 2 }}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </ChartCard>
  );
}; 
