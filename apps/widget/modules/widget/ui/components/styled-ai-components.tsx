"use client";

import { useAtomValue } from "jotai";
import { widgetSettingsAtom } from "@/modules/widget/atoms/widget-atoms";
import {
  AIMessage as BaseAIMessage,
  AIMessageContent as BaseAIMessageContent,
  AIMessageProps,
  AIMessageContentProps,
} from "@workspace/ui/components/ai/message";
import {
  AIInputSubmit as BaseAIInputSubmit,
  AIInputSubmitProps,
} from "@workspace/ui/components/ai/input";
import { cn } from "@workspace/ui/lib/utils";

// Styled AI Message for user messages (will use primary color)
export const StyledAIMessage = ({ className, from, ...props }: AIMessageProps) => {
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const primaryColor = widgetSettings?.appearance?.primaryColor || "#3b82f6";

  return (
    <BaseAIMessage
      className={cn(className)}
      from={from}
      style={
        from === "user"
          ? {
              // Apply primary color to user messages via CSS variables
              "--tw-gradient-from": primaryColor,
              "--tw-gradient-to": primaryColor,
            } as React.CSSProperties
          : {}
      }
      {...props}
    />
  );
};

// Styled AI Message Content that uses primary color for user messages
export const StyledAIMessageContent = ({
  children,
  className,
  from, // Add this prop to detect user messages
  ...props
}: AIMessageContentProps & { from?: "user" | "assistant" }) => {
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const primaryColor = widgetSettings?.appearance?.primaryColor || "#3b82f6";
  
  // Check if this is a user message
  const isUserMessage = from === "user" || className?.includes('is-user');

  return (
    <div
      className={cn(
        "break-words",
        "flex flex-col gap-2 rounded-lg border px-3 py-2 text-sm",
        !isUserMessage && "bg-background text-foreground border-border",
        isUserMessage && "widget-primary-bg text-white border-transparent", // Use CSS class
        className
      )}
      style={isUserMessage ? {
        backgroundColor: primaryColor, // Fallback
        color: "white",
        border: "none",
      } : {}}
      {...props}
    >
      {children}
    </div>
  );
};

// Styled AI Input Submit button with primary color
export const StyledAIInputSubmit = ({
  className,
  variant = "default",
  ...props
}: AIInputSubmitProps) => {
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const primaryColor = widgetSettings?.appearance?.primaryColor || "#3b82f6";

  return (
    <BaseAIInputSubmit
      className={cn("gap-1.5 rounded-md rounded-br-lg widget-submit-button", className)}
      variant={variant}
      style={{
        backgroundColor: primaryColor,
        color: "white",
        borderColor: primaryColor,
      }}
      data-submit-button="true"
      {...props}
    />
  );
};
