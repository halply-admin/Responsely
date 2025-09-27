import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import React from "react";

interface ChartCardProps {
  title: string;
  description: string;
  isLoading: boolean;
  error?: boolean;
  height?: string; // Tailwind height class, e.g., "h-[300px]"
  children: React.ReactNode;
}

export const ChartCard = ({
  title,
  description,
  isLoading,
  error = false,
  height = "h-[300px]",
  children
}: ChartCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isLoading ? <Skeleton className="h-6 w-48" /> : title}
        </CardTitle>
        <CardDescription>
          {isLoading ? <Skeleton className="h-4 w-64" /> : description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className={`${height} space-y-4`}>
            {/* Chart area skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
            
            {/* Chart visualization skeleton */}
            <div className="flex items-end justify-center space-x-2 pt-4">
              <Skeleton className="h-12 w-8" />
              <Skeleton className="h-20 w-8" />
              <Skeleton className="h-16 w-8" />
              <Skeleton className="h-24 w-8" />
              <Skeleton className="h-14 w-8" />
              <Skeleton className="h-18 w-8" />
            </div>
            
            {/* Legend/summary skeleton */}
            <div className="flex justify-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className={`${height} flex items-center justify-center`}>
            <div className="text-center">
              <div className="text-muted-foreground mb-2">
                Failed to load chart data
              </div>
              <div className="text-sm text-muted-foreground">
                Please try refreshing the page
              </div>
            </div>
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}; 