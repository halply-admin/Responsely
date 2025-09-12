"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const presetColors = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899",
  "#06b6d4", "#84cc16", "#f97316", "#6366f1", "#14b8a6", "#a855f7",
  "#1f2937", "#374151", "#6b7280", "#9ca3af", "#d1d5db", "#f3f4f6",
];

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [open, setOpen] = useState(false);

  const handleColorChange = (color: string) => {
    onChange(color);
    setOpen(false);
  };

  const isValidHex = (hex: string) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded border border-gray-300"
              style={{ backgroundColor: isValidHex(value) ? value : "#3b82f6" }}
            />
            <span>{value || "Select a color"}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Pick a color</h4>
            <p className="text-sm text-muted-foreground">
              Choose from presets or enter a custom hex value
            </p>
          </div>
          
          {/* Preset Colors Grid */}
          <div className="grid grid-cols-6 gap-2">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                className={cn(
                  "h-8 w-8 rounded border-2 transition-all hover:scale-105",
                  value === color ? "border-gray-900 ring-2 ring-gray-300" : "border-gray-300"
                )}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
                title={color}
              />
            ))}
          </div>

          {/* Interactive Color Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Color</label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={isValidHex(value) ? value : "#3b82f6"}
                onChange={(e) => onChange(e.target.value)}
                className="h-10 w-16 cursor-pointer border p-1"
              />
              <Input
                type="text"
                placeholder="#3b82f6"
                value={value}
                onChange={(e) => {
                  const hex = e.target.value;
                  if (hex.startsWith("#") && (hex.length === 4 || hex.length === 7)) {
                    onChange(hex);
                  } else if (!hex.startsWith("#") && hex.length > 0) {
                    onChange(`#${hex}`);
                  } else {
                    onChange(hex);
                  }
                }}
                className="flex-1"
              />
            </div>
            {value && !isValidHex(value) && (
              <p className="text-sm text-red-500">Please enter a valid hex color</p>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}