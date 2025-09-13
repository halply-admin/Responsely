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
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    root.style.setProperty('--widget-primary-rgb', `${r}, ${g}, ${b}`);
  }, [primaryColor]);

  return <>{children}</>;
};