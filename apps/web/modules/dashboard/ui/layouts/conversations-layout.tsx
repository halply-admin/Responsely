"use client";

import { useState } from "react";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@workspace/ui/components/resizable";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetDescription 
} from "@workspace/ui/components/sheet";
import { Button } from "@workspace/ui/components/button";
import { MenuIcon } from "lucide-react";
import { ConversationsPanel } from "../components/conversations-panel";

export const ConversationsLayout = ({
  children
}: { children: React.ReactNode; }) => {
  const isMobile = useIsMobile();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (isMobile) {
    // On mobile, just show the chat content
    // Conversations access is through the main sidebar
    return (
      <div className="flex h-full flex-col">
        {children}
      </div>
    );
  }

  // Desktop
  return (
    <ResizablePanelGroup className="h-full flex-1" direction="horizontal">
      <ResizablePanel defaultSize={30} maxSize={30} minSize={20}>
        <ConversationsPanel />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="h-full" defaultSize={70}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};