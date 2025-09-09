"use client";

import { useIsMobile } from "@workspace/ui/hooks/use-mobile";

export default function ConversationsPage() {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-muted-foreground">
          Select a conversation
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          {isMobile 
            ? "Choose a conversation from the sidebar to start viewing messages." 
            : "Choose a conversation from the left panel to start viewing messages."
          }
        </p>
      </div>
    </div>
  );
}