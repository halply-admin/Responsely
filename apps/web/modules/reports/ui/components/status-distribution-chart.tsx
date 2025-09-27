"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@workspace/ui/components/chart";
import { PieChart, Pie, Cell } from "recharts";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { ReportFilters, StatusDistribution } from "@/modules/reports/lib/reports";
import { ChartCard } from "./chart-card";

interface StatusDistributionChartProps {
  filters: ReportFilters;
}

const chartConfig = {
  resolved: {
    label: "Resolved",
    color: "#22c55e",
  },
  unresolved: {
    label: "Unresolved", 
    color: "#f59e0b",
  },
  escalated: {
    label: "Escalated",
    color: "#ef4444",
  },
} as const;

export const StatusDistributionChart = ({ filters }: StatusDistributionChartProps) => {
  const data = useQuery(api.private.reports.getStatusDistribution, {
    startDate: filters.dateRange.start,
    endDate: filters.dateRange.end,
  });

  const isLoading = data === undefined;
  const error = data === null;

  return (
    <ChartCard
      title="Conversation Status"
      description={data ? `Total: ${data.total} conversations` : "Distribution by current status"}
      isLoading={isLoading}
      error={error}
    >
      <ChartContainer
        config={chartConfig}
        className="h-[300px]"
      >
        <PieChart>
          <Pie
            data={data?.distribution || []}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="count"
          >
            {data?.distribution.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
              />
            ))}
          </Pie>
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length && payload[0]) {
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {data.status}
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {data.count} ({data.percentage}%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ChartContainer>
      
      {/* Status Summary */}
      {data && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {data.distribution.map((item) => (
            <div key={item.status} className="text-center">
              <div 
                className="w-3 h-3 rounded-full mx-auto mb-1"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-sm font-medium">{item.count}</div>
              <div className="text-xs text-muted-foreground">{item.status}</div>
            </div>
          ))}
        </div>
      )}
    </ChartCard>
  );
}; 
