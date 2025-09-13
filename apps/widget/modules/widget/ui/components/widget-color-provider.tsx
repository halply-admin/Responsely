"use client";

import { useAtomValue } from "jotai";
import { widgetSettingsAtom } from "../../atoms/widget-atoms";
import { useEffect } from "react";

export const WidgetColorProvider = ({ children }: { children: React.ReactNode }) => {
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const primaryColor = widgetSettings?.appearance?.primaryColor || "#3b82f6";

  useEffect(() => {
    // Update CSS variables when color changes
    const root = document.documentElement;
    root.style.setProperty('--widget-primary-color', primaryColor);
    
    // Convert hex to RGB for RGB variable
    const hex = primaryColor.replace('#', '');
    if (hex.length === 6 && /^[0-9A-Fa-f]{6}$/.test(hex)) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      root.style.setProperty('--widget-primary-rgb', `${r}, ${g}, ${b}`);
    } else {
      // Fallback to default blue RGB values
      root.style.setProperty('--widget-primary-rgb', '59, 130, 246');
    }
  }, [primaryColor]);

  return <>{children}</>;
};