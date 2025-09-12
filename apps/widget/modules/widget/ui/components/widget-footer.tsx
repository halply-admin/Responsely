import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { useAtomValue, useSetAtom } from "jotai";
import { HomeIcon, InboxIcon } from "lucide-react"
import { screenAtom, widgetSettingsAtom } from "../../atoms/widget-atoms";

export const WidgetFooter = () => {
  const screen = useAtomValue(screenAtom);
  const setScreen = useSetAtom(screenAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  
  // Get the primary color from widget settings
  const primaryColor = widgetSettings?.appearance?.primaryColor || "#3b82f6";

  return (
    <footer className="flex items-center justify-between border-t bg-background">
      <Button
        className="h-14 flex-1 rounded-none"
        onClick={() => setScreen("selection")}
        size="icon"
        variant="ghost"
      >
        <HomeIcon
          className={cn("size-5")}
          style={{ 
            color: screen === "selection" ? primaryColor : undefined 
          }}
        />
      </Button>
      <Button
        className="h-14 flex-1 rounded-none"
        onClick={() => setScreen("inbox")}
        size="icon"
        variant="ghost"
      >
        <InboxIcon
          className={cn("size-5")}
          style={{ 
            color: screen === "inbox" ? primaryColor : undefined 
          }}
        />
      </Button>
    </footer>
  );
};