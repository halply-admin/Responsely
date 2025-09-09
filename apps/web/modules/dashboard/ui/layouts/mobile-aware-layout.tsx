"use client";

import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";

interface MobileAwareLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const MobileAwareLayout = ({ children, title }: MobileAwareLayoutProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        {/* Mobile Header with Dashboard Sidebar Trigger */}
        <div className="h-14 border-b bg-background flex items-center px-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h1 className="font-medium text-lg">{title}</h1>
          </div>
        </div>

        {/* Mobile Content with proper spacing */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  // Desktop - just return children as-is
  return <>{children}</>;
};