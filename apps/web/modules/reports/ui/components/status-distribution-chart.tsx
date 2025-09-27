"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@workspace/ui/components/chart";
import { PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";
import { ReportFilters, ConversationStatusReport, StatusDistribution } from "@/modules/reports/lib/reports";

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
  const [data, setData] = useState<StatusDistribution | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const report = new ConversationStatusReport(filters);
        const result = await report.fetchData();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch status distribution:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversation Status</CardTitle>
          <CardDescription>Distribution by current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversation Status</CardTitle>
          <CardDescription>Distribution by current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation Status</CardTitle>
        <CardDescription>
          Total: {data.total} conversations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[300px]"
        >
          <PieChart>
            <Pie
              data={data.distribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="count"
            >
              {data.distribution.map((entry, index) => (
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
      </CardContent>
    </Card>
  );
}; 