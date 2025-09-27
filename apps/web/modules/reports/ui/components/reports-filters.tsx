"use client";

import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { DateRange } from "react-day-picker";
import { cn } from "@workspace/ui/lib/utils";
import { ReportFilters } from "@/modules/reports/lib/reports";

interface ReportsFiltersProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
}

export const ReportsFilters = ({ filters, onFiltersChange }: ReportsFiltersProps) => {
  const [date, setDate] = useState<DateRange | undefined>();

  // Sync internal state with prop changes
  useEffect(() => {
    setDate({
      from: new Date(filters.dateRange.start),
      to: new Date(filters.dateRange.end),
    });
  }, [filters.dateRange.start, filters.dateRange.end]);

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (newDate?.from && newDate?.to) {
      onFiltersChange({
        ...filters,
        dateRange: {
          start: newDate.from.toISOString(),
          end: newDate.to.toISOString(),
        },
      });
    }
  };

  const handleQuickDateRange = (days: number) => {
    const end = new Date();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    setDate({ from: start, to: end });
    onFiltersChange({
      ...filters,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Range Picker */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Date Range:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Quick Date Ranges */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Quick:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickDateRange(7)}
            >
              Last 7 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickDateRange(30)}
            >
              Last 30 days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickDateRange(90)}
            >
              Last 90 days
            </Button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  status: value as ReportFilters['status'],
                })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unresolved">Unresolved</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Plan:</span>
            <Select
              value={filters.subscriptionStatus || 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  subscriptionStatus: value as ReportFilters['subscriptionStatus'],
                })
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 