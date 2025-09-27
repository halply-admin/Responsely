"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@workspace/ui/components/chart";
import { LineChart, Line, XAxis, YAxis, ReferenceLine } from "recharts";
import { useEffect, useState } from "react";
import { ReportFilters, ResponseTimeTrendsReport, ResponseTimeTrendsData } from "@/modules/reports/lib/reports";
import { Badge } from "@workspace/ui/components/badge";
import { TrendingDown, TrendingUp } from "lucide-react";

interface ResponseTimeTrendsChartProps {
  filters: ReportFilters;
}

const chartConfig = {
  responseTime: {
    label: "Response Time",
    color: "#3b82f6",
  },
} as const;

export const ResponseTimeTrendsChart = ({ filters }: ResponseTimeTrendsChartProps) => {
  const [data, setData] = useState<ResponseTimeTrendsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const report = new ResponseTimeTrendsReport(filters);
        const result = await report.fetchData();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch response time trends:', error);
        setError('Failed to load chart data.');
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
          <CardTitle>Response Time Trends</CardTitle>
          <CardDescription>Average first response time over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response Time Trends</CardTitle>
          <CardDescription>Average first response time over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">
              {error || 'Failed to load chart data'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = data.trends.map((item) => ({
    ...item,
    date: formatDate(item.timestamp),
    responseTime: Math.round(item.value * 10) / 10,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Time Trends</CardTitle>
        <CardDescription>
          Average first response time over the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-2xl font-bold">{data.avgResponseTime}m</div>
              <div className="text-sm text-muted-foreground">Average Response Time</div>
            </div>
            <div className="flex items-center gap-2">
              {data.improvement < 0 ? (
                <TrendingDown className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-600" />
              )}
              <Badge variant={data.improvement < 0 ? "default" : "destructive"}>
                {Math.abs(data.improvement)}% {data.improvement < 0 ? 'Improvement' : 'Decline'}
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
            
            {/* Target line at 15 minutes */}
            <ReferenceLine 
              y={15} 
              stroke="#22c55e" 
              strokeDasharray="5 5"
              label={{ value: "Target (15m)", position: "right" }}
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
      </CardContent>
    </Card>
  );
}; 