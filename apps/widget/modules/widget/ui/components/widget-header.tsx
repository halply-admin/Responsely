import { cn } from "@workspace/ui/lib/utils";
import { useAtomValue } from "jotai";
import { widgetSettingsAtom } from "../../atoms/widget-atoms";

export const WidgetHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  
  // Get the primary color from widget settings, fallback to default blue
  const primaryColor = widgetSettings?.appearance?.primaryColor || "#3b82f6";
  
  // Generate a darker shade for the gradient
  const darkenColor = (hex: string, percent: number = 15) => {
    // Remove the hash if present
    hex = hex.replace('#', '');
    
    // Parse the hex color
    const num = parseInt(hex, 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const gradientTo = darkenColor(primaryColor);

  return (
    <header 
      className={cn("p-4 text-white", className)}
      style={{
        background: `linear-gradient(to bottom, ${primaryColor}, ${gradientTo})`,
      }}
    >
      {children}
    </header>
  );
};