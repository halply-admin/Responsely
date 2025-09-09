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
    return (
      <div className="h-full flex flex-col">
        {/* Mobile Header */}
        <div className="h-14 border-b bg-background flex items-center px-4">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="mr-3">
                <MenuIcon className="h-5 w-5" />
                <span className="ml-2">Conversations</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              {/* Add accessibility components */}
              <SheetTitle className="sr-only">
                Conversations List
              </SheetTitle>
              <SheetDescription className="sr-only">
                Browse and select conversations to view messages
              </SheetDescription>
              
              <ConversationsPanel onConversationSelect={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Content */}
        <div className="flex-1">
          {children}
        </div>
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