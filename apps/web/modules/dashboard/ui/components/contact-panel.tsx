"use client";

import Bowser from "bowser";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { useQuery } from "convex/react";
import { ClockIcon, GlobeIcon, MailIcon, MonitorIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useCallback } from "react";
import { generateMailtoLink, EMAIL_CONTEXT_MAX_MESSAGES } from "@/lib/email-utils";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { toast } from "sonner";

type InfoItem = {
  label: string;
  value: string | React.ReactNode;
  className?: string;
};

type InfoSection = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  items: InfoItem[];
};

export const ContactPanel = () => {
  const params = useParams();
  const conversationId = params.conversationId as (Id<"conversations"> | null);
  const isMobile = useIsMobile();

  const conversation = useQuery(api.private.conversations.getOne, 
    conversationId ? {
      conversationId,
    } : "skip",
  );

  const contactSession = useQuery(api.private.contactSessions.getOneByConversationId,
    conversationId ? {
      conversationId,
    } : "skip",
  );

  // Get conversation messages for the mailto link
  const messages = useThreadMessages(
    api.private.messages.getMany,
    conversation?.threadId ? { threadId: conversation.threadId } : "skip",
    { initialNumItems: EMAIL_CONTEXT_MAX_MESSAGES } // Get more messages for email context
  );

  const parseUserAgent = useMemo(() => {
    return (userAgent?: string) => {
      if (!userAgent) {
        return { browser: "Unknown", os: "Unknown", device: "Unknown" };
      }

      const browser = Bowser.getParser(userAgent);
      const result = browser.getResult();

      return {
        browser: result.browser.name || "Unknown",
        browserVersion: result.browser.version || "",
        os: result.os.name || "Unknown",
        osVersion: result.os.version || "",
        device: result.platform.type || "desktop",
        deviceVendor: result.platform.vendor || "",
        deviceModel: result.platform.model || "",
      };
    };
  }, []);

  const userAgentInfo = useMemo(() => 
    parseUserAgent(contactSession?.metadata?.userAgent), 
  [contactSession?.metadata?.userAgent, parseUserAgent]);

  const countryInfo = useMemo(() => {
    return getCountryFromTimezone(contactSession?.metadata?.timezone);
  }, [contactSession?.metadata?.timezone]);

  // Detect if we're on a mobile device (not just screen size)
  const isMobileDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  }, []);

  const handleSendEmail = useCallback(() => {
    if (!contactSession) return;
    
    const uiMessages = toUIMessages(messages.results ?? []);
    const conversationMessages = uiMessages
      .filter(msg => msg.role === "user" || msg.role === "assistant")
      .map(msg => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content
      }));
    
    const mailtoLink = generateMailtoLink(
      contactSession.email,
      contactSession.name || "Customer",
      conversationMessages
    );

    // On mobile devices, use mailto directly (works well with native email apps)
    if (isMobileDevice) {
      window.location.href = mailtoLink;
      return;
    }

    // On web browsers, try mailto first, then provide fallback
    const tryMailto = () => {
      // Always copy to clipboard as backup
      copyEmailToClipboard(mailtoLink);
      
      // Try to open mailto link
      try {
        const testLink = document.createElement('a');
        testLink.href = mailtoLink;
        testLink.target = '_blank';
        testLink.style.display = 'none';
        document.body.appendChild(testLink);
        
        testLink.click();
        document.body.removeChild(testLink);
        
        // Show success message with fallback option
        toast.success("Opening email client...", {
          description: "Email content has been copied to your clipboard as backup.",
          action: {
            label: "View Clipboard Content",
            onClick: () => {
              toast.info("Email content is in your clipboard", {
                description: "You can paste it into any email client or webmail service."
              });
            }
          }
        });
        
      } catch (error) {
        // If mailto fails, show clipboard message
        toast.info("Email content copied to clipboard", {
          description: "Paste it into your preferred email client or webmail service.",
        });
      }
    };

    tryMailto();
  }, [contactSession, messages.results, isMobileDevice]);

  const copyEmailToClipboard = useCallback((mailtoLink: string) => {
    try {
      // Extract email details from mailto link
      const url = new URL(mailtoLink);
      // For mailto links, the email is in the pathname without the 'mailto:' prefix
      const email = url.pathname || url.href.replace('mailto:', '').split('?')[0];
      const subject = url.searchParams.get('subject') || '';
      const body = url.searchParams.get('body') || '';
      
      // Format for clipboard
      const emailContent = `To: ${email}\nSubject: ${subject}\n\n${body}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(emailContent).then(() => {
        console.log('Email content copied to clipboard');
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = emailContent;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      });
    } catch (error) {
      console.error('Failed to copy email content:', error);
      toast.error("Failed to copy email content");
    }
  }, []);

  const accordionSections = useMemo<InfoSection[]>(() => {
    if (!contactSession?.metadata) {
      return [];
    }

    return [
      {
        id: "device-info",
        icon: MonitorIcon,
        title: "Device Information",
        items: [
          {
            label: "Browser",
            value:
              userAgentInfo.browser + 
                (userAgentInfo.browserVersion
                  ? ` ${userAgentInfo.browserVersion}`
                  : ""
                ),
          },
          {
            label: "OS",
            value:
              userAgentInfo.os +
                (userAgentInfo.osVersion ? ` ${userAgentInfo.osVersion}` : ""),
          },
          {
            label: "Device",
            value:
              userAgentInfo.device +
                (
                  userAgentInfo.deviceModel
                    ? ` - ${userAgentInfo.deviceModel}`
                    : ""
                ),
              className: "capitalize"
          },
          {
            label: "Screen",
            value: contactSession.metadata.screenResolution,
          },
          {
            label: "Viewport",
            value: contactSession.metadata.viewportSize,
          },
          {
            label: "Cookies",
            value: contactSession.metadata.cookieEnabled ? "Enabled" : "Disabled"
          },
        ],
      },
      {
        id: "location-info",
        icon: GlobeIcon,
        title: "Location & Language",
        items: [
          ...(countryInfo
            ? [
              {
                label: "Country",
                value: (
                  <span>
                    {countryInfo.name}
                  </span>
                )
              }
            ]
            : []
          ),
          {
            label: "Language",
            value: contactSession.metadata.language,
          },
          {
            label: "Timezone",
            value: contactSession.metadata.timezone,
          },
          {
            label: "UTC Offset",
            value: contactSession.metadata.timezoneOffset,
          }
        ]
      },
      {
        id: "section-details",
        title: "Section details",
        icon: ClockIcon,
        items: [
          {
            label: "Session Started",
            value: new Date(
              contactSession._creationTime
            ).toLocaleString(),
          }
        ],
      }
    ];
  }, [contactSession, userAgentInfo, countryInfo]);

  if (contactSession === undefined || contactSession === null) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-col bg-background text-foreground">
      <div className="flex flex-col gap-y-4 p-4">
        <div className="flex items-center gap-x-2">
          <DicebearAvatar
            badgeImageUrl={
              countryInfo?.code
                ? getCountryFlagUrl(countryInfo.code)
                : undefined
            }
            seed={contactSession._id}
            size={42}
          />
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-x-2">
              <h4 className="line-clamp-1">
                {contactSession.name}
              </h4>
            </div>
            <p className="line-clamp-1 text-muted-foreground text-sm">
              {contactSession.email}
            </p>
          </div>
        </div>
        {conversation && contactSession && (
          <Button
            onClick={handleSendEmail}
            className="w-full"
            size="lg"
          >
            <MailIcon className="mr-2 h-4 w-4" />
            Send Email
          </Button>
        )}
      </div>

      <div>
        {contactSession.metadata && (
          <Accordion
            className="w-full rounded-none border-y"
            collapsible
            type="single"
          >
            {accordionSections.map((section) => (
              <AccordionItem
                className="rounded-none outline-none has-focus-visible:z-10 has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
                key={section.id}
                value={section.id}
              >
                <AccordionTrigger
                  className="flex w-full flex-1 items-start justify-between gap-4 rounded-none bg-accent px-5 py-4 text-left font-medium text-sm outline-none transition-all hover:no-underline disabled:pointer-events-none disabled:opacity-50"
                >
                  <div className="flex items-center gap-4">
                    <section.icon className="size-4 shrink-0" />
                    <span>{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-5 py-4">
                  <div className="space-y-2 text-sm">
                    {section.items.map((item) => (
                      <div className="flex justify-between" key={`${section.id}-${item.label}`}>
                        <span className="text-muted-foreground">
                          {item.label}:
                        </span>
                        <span className={item.className}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};
