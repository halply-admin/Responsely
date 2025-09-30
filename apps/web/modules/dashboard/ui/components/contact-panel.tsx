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

    // On web browsers, provide multiple options for better UX
    const handleWebEmail = () => {
      // Always copy to clipboard first as backup
      copyEmailToClipboard(mailtoLink);
      
      // Try to open mailto link properly (without target="_blank")
      try {
        // Use window.location.href for better compatibility
        window.location.href = mailtoLink;
        
        // Show success message with smart suggestions
        const suggestedProvider = detectEmailProvider(contactSession.email);
        const providerLabels = {
          gmail: "Gmail",
          outlook: "Outlook", 
          yahoo: "Yahoo Mail",
          apple: "Apple Mail"
        };
        
        toast.success("Opening email client...", {
          description: "Email content copied to clipboard as backup.",
          action: {
            label: `Try ${providerLabels[suggestedProvider]}`,
            onClick: () => {
              const actions = {
                gmail: () => openGmailCompose(contactSession.email, conversationMessages),
                outlook: () => openOutlookCompose(contactSession.email, conversationMessages),
                yahoo: () => openYahooCompose(contactSession.email, conversationMessages),
                apple: () => openAppleMailCompose(contactSession.email, conversationMessages)
              };
              actions[suggestedProvider]();
            }
          }
        });
        
      } catch (error) {
        // If mailto fails completely, show options
        showEmailOptions(contactSession.email, conversationMessages);
      }
    };

    handleWebEmail();
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

  // Helper function to build email content
  const buildEmailContent = useCallback((conversationMessages: any[]) => {
    const firstCustomerMessage = conversationMessages.find(msg => msg.role === "user");
    const subject = firstCustomerMessage 
      ? `Re: ${firstCustomerMessage.content.substring(0, 50)}...`
      : "Re: Your support inquiry";

    const conversationHistory = conversationMessages
      .map(msg => {
        const sender = msg.role === "user" ? contactSession?.name || "Customer" : "Support";
        return `${sender}: ${msg.content}`;
      })
      .join('\n\n');

    const body = `Hi ${contactSession?.name || "Customer"},

Thank you for reaching out to us. I'm following up on our conversation.

--- Original Conversation ---
${conversationHistory}
--- End of Conversation ---

Best regards,
Support Team`;

    return { subject, body };
  }, [contactSession]);

  const openGmailCompose = useCallback((email: string, conversationMessages: any[]) => {
    try {
      const { subject, body } = buildEmailContent(conversationMessages);
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open Gmail:', error);
      toast.error("Failed to open Gmail");
    }
  }, [buildEmailContent]);

  const openOutlookCompose = useCallback((email: string, conversationMessages: any[]) => {
    try {
      const { subject, body } = buildEmailContent(conversationMessages);
      const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(outlookUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open Outlook:', error);
      toast.error("Failed to open Outlook");
    }
  }, [buildEmailContent]);

  const openYahooCompose = useCallback((email: string, conversationMessages: any[]) => {
    try {
      const { subject, body } = buildEmailContent(conversationMessages);
      const yahooUrl = `https://compose.mail.yahoo.com/?to=${encodeURIComponent(email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(yahooUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to open Yahoo Mail:', error);
      toast.error("Failed to open Yahoo Mail");
    }
  }, [buildEmailContent]);

  const openAppleMailCompose = useCallback((email: string, conversationMessages: any[]) => {
    try {
      const { subject, body } = buildEmailContent(conversationMessages);
      // Apple Mail uses the standard mailto protocol
      const appleMailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = appleMailUrl;
    } catch (error) {
      console.error('Failed to open Apple Mail:', error);
      toast.error("Failed to open Apple Mail");
    }
  }, [buildEmailContent]);

  // Detect user's likely email provider based on common patterns
  const detectEmailProvider = useCallback((userEmail: string) => {
    const domain = userEmail.toLowerCase().split('@')[1];
    if (domain?.includes('gmail')) return 'gmail';
    if (domain?.includes('outlook') || domain?.includes('hotmail') || domain?.includes('live')) return 'outlook';
    if (domain?.includes('yahoo')) return 'yahoo';
    if (domain?.includes('icloud') || domain?.includes('me.com') || domain?.includes('mac.com')) return 'apple';
    return 'gmail'; // Default fallback
  }, []);

  const showEmailOptions = useCallback((email: string, conversationMessages: any[]) => {
    const suggestedProvider = detectEmailProvider(email);
    
    // Show primary suggestion based on email domain
    const primaryAction = {
      gmail: { label: "Open Gmail", action: () => openGmailCompose(email, conversationMessages) },
      outlook: { label: "Open Outlook", action: () => openOutlookCompose(email, conversationMessages) },
      yahoo: { label: "Open Yahoo Mail", action: () => openYahooCompose(email, conversationMessages) },
      apple: { label: "Open Apple Mail", action: () => openAppleMailCompose(email, conversationMessages) }
    }[suggestedProvider];

    toast.success("Email options available", {
      description: "Content copied to clipboard. Choose your preferred email service:",
      action: {
        label: primaryAction.label,
        onClick: primaryAction.action
      }
    });

    // Show all available options
    setTimeout(() => {
      toast.info("All email services", {
        description: "Click to open in your preferred service",
        action: {
          label: "More Options",
          onClick: () => showAllEmailProviders(email, conversationMessages)
        }
      });
    }, 1500);
  }, [detectEmailProvider, openGmailCompose, openOutlookCompose, openYahooCompose, openAppleMailCompose]);

  const showAllEmailProviders = useCallback((email: string, conversationMessages: any[]) => {
    // Show Gmail option
    toast.info("Gmail", {
      description: "Open in Gmail web interface",
      action: {
        label: "Open Gmail",
        onClick: () => openGmailCompose(email, conversationMessages)
      }
    });

    // Show Outlook option
    setTimeout(() => {
      toast.info("Outlook", {
        description: "Open in Outlook web interface",
        action: {
          label: "Open Outlook",
          onClick: () => openOutlookCompose(email, conversationMessages)
        }
      });
    }, 500);

    // Show Yahoo option
    setTimeout(() => {
      toast.info("Yahoo Mail", {
        description: "Open in Yahoo Mail web interface",
        action: {
          label: "Open Yahoo",
          onClick: () => openYahooCompose(email, conversationMessages)
        }
      });
    }, 1000);

    // Show Apple Mail option
    setTimeout(() => {
      toast.info("Apple Mail", {
        description: "Open in default mail app (macOS/iOS)",
        action: {
          label: "Open Apple Mail",
          onClick: () => openAppleMailCompose(email, conversationMessages)
        }
      });
    }, 1500);
  }, [openGmailCompose, openOutlookCompose, openYahooCompose, openAppleMailCompose]);

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
