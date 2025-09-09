"use client";

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import {
  CreditCardIcon,
  InboxIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
  Mic,
  PaletteIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import { useState } from "react";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeftIcon } from "lucide-react";
import { ConversationsPanel } from "./conversations-panel";

const customerSupportItems = [
  {
    title: "Conversations",
    url: "/conversations",
    icon: InboxIcon,
  },
  {
    title: "Knowledge Base",
    url: "/files",
    icon: LibraryBigIcon,
  },
];

const configurationItems = [
  {
    title: "Widget Customization",
    url: "/customization",
    icon: PaletteIcon,
  },
  {
    title: "Integrations",
    url: "/integrations",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Voice Assistant",
    url: "/plugins/vapi",
    icon: Mic,
  },
];

const accountItems = [
  {
    title: "Plans & Billing",
    url: "/billing",
    icon: CreditCardIcon,
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isConversationsRoute = pathname.startsWith('/conversations');
  
  // Mobile navigation state
  const [mobileView, setMobileView] = useState<'nav' | 'conversations'>(() => {
    return isMobile && isConversationsRoute ? 'conversations' : 'nav';
  });

  const isActive = (url: string) => {
    if (url === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(url);
  };

  const handleBackToNav = () => setMobileView('nav');
  const handleShowConversations = () => setMobileView('conversations');

  // Control what to show
  const showMainNavigation = !isMobile || mobileView === 'nav';
  const showConversations = isMobile && mobileView === 'conversations';

  return (
    <Sidebar className="group" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Mobile back button when not in main nav */}
            {isMobile && mobileView !== 'nav' && (
              <div className="flex items-center gap-2 p-2 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToNav}
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {mobileView === 'conversations' ? 'Conversations' : 'Back'}
                </span>
              </div>
            )}
            
            {/* Organization Switcher - only show in nav view */}
            {showMainNavigation && (
              <SidebarMenuButton asChild size="lg">
                <OrganizationSwitcher 
                  hidePersonal 
                  skipInvitationScreen
                  appearance={{
                    elements: {
                      rootBox: "w-full! h-8!",
                      avatarBox: "size-4! rounded-sm!",
                      organizationSwitcherTrigger: "w-full! justify-start! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                      organizationPreview: "group-data-[collapsible=icon]:justify-center! gap-2!",
                      organizationPreviewTextContainer: "group-data-[collapsible=icon]:hidden! text-xs! font-medium! text-sidebar-foreground!",
                      organizationSwitcherTriggerIcon: "group-data-[collapsible=icon]:hidden! ml-auto! text-sidebar-foreground!"
                    }
                  }}
                />
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        {showMainNavigation && (
          <>
            {/* Customer Support */}
            <SidebarGroup>
              <SidebarGroupLabel>Customer Support</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {customerSupportItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild={!isMobile || item.url !== '/conversations'}
                        isActive={isActive(item.url)}
                        className={cn(
                          isActive(item.url) && "bg-gradient-to-b from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90!"
                        )}
                        tooltip={item.title}
                        onClick={isMobile && item.url === '/conversations' ? handleShowConversations : undefined}
                      >
                        {isMobile && item.url === '/conversations' ? (
                          <>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </>
                        ) : (
                          <Link href={item.url}>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Configuration */}
            <SidebarGroup>
              <SidebarGroupLabel>Configuration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {configurationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                        className={cn(
                          isActive(item.url) && "bg-gradient-to-b from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90!"
                        )}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Account */}
            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {accountItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                        className={cn(
                          isActive(item.url) && "bg-gradient-to-b from-sidebar-primary to-[#0b63f3]! text-sidebar-primary-foreground! hover:to-[#0b63f3]/90!"
                        )}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Conversations List - Mobile only */}
        {showConversations && (
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="px-2">
                <ConversationsPanel />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserButton
              showName
              appearance={{
                elements: {
                  rootBox: "w-full! h-8!",
                  userButtonTrigger: "w-full! p-2! hover:bg-sidebar-accent! hover:text-sidebar-accent-foreground! group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
                  userButtonBox: "w-full! flex-row-reverse! justify-end! gap-2! group-data-[collapsible=icon]:justify-center! text-sidebar-foreground!",
                  userButtonOuterIdentifier: "pl-0! group-data-[collapsible=icon]:hidden!",
                  avatarBox: "size-4!"
                }
              }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};