import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  description: string;
  isLoading: boolean;
  error?: boolean;
  height?: string;
  children: ReactNode;
}

export const ChartCard = ({ 
  title, 
  description, 
  isLoading, 
  error = false, 
  height = "h-[300px]", 
  children 
}: ChartCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`${height} flex items-center justify-center`}>
            <div className="animate-pulse">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`${height} flex items-center justify-center`}>
            <div className="text-muted-foreground">
              Failed to load chart data
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}; 