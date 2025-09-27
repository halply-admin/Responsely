"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@workspace/ui/components/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";
import { ReportFilters, AIHumanComparisonReport, AIHumanComparison } from "@/modules/reports/lib/reports";
import { Badge } from "@workspace/ui/components/badge";

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
    color: "#8b5cf6",
  },
} as const;

export const AIHumanComparisonChart = ({ filters }: AIHumanComparisonChartProps) => {
  const [data, setData] = useState<AIHumanComparison | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const report = new AIHumanComparisonReport(filters);
        const result = await report.fetchData();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch AI vs Human comparison:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI vs Human Performance</CardTitle>
          <CardDescription>Comparative analysis of resolution effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="animate-pulse">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for the chart
  const chartData = [
    {
      metric: "Total Resolved",
      ai: data.ai.totalResolved,
      human: data.human.totalResolved,
    },
    {
      metric: "Resolution Rate (%)",
      ai: data.ai.resolutionRate,
      human: data.human.resolutionRate,
    },
    {
      metric: "Avg Time (min)",
      ai: data.ai.avgResolutionTime,
      human: data.human.avgResolutionTime,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI vs Human Performance</CardTitle>
        <CardDescription>
          Comparing effectiveness across key metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="h-[350px]"
        >
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="metric" 
              tick={{ fontSize: 12 }}
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
              name="AI Agent"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="human" 
              fill={chartConfig.human.color}
              name="Human Agent"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {data.comparison.map((item, index) => (
            <div key={index} className="p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium mb-1">{item.metric}</div>
              <div className="flex items-center gap-2">
                <Badge variant={item.better === 'ai' ? 'default' : 'secondary'}>
                  {item.better === 'ai' ? 'AI Better' : 'Human Better'}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {Math.abs(item.difference)}% difference
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 