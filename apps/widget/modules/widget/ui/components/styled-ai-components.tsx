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
        // Use CSS classes for better performance and consistency
        isUserMessage ? "widget-primary-bg text-white border-transparent" : "bg-background text-foreground border-border",
        className
      )}
      // Fallback inline styles in case CSS variables aren't loaded yet
      style={isUserMessage ? {
        backgroundColor: primaryColor,
        color: "white",
        borderColor: "transparent",
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
      className={cn(
        "gap-1.5 rounded-md rounded-br-lg widget-submit-button",
        className
      )}
      variant={variant}
      // Inline styles as fallback - CSS classes will override these
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