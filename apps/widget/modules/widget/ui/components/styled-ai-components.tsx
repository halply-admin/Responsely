// Create wrapper components that apply widget colors to AI components
// apps/widget/modules/widget/ui/components/styled-ai-components.tsx

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
  ...props
}: AIMessageContentProps) => {
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const primaryColor = widgetSettings?.appearance?.primaryColor || "#3b82f6";

  return (
    <div
      className={cn(
        "break-words",
        "flex flex-col gap-2 rounded-lg border border-border px-3 py-2 text-sm",
        "bg-background text-foreground",
        // User message styling with dynamic primary color
        "group-[.is-user]:border-transparent group-[.is-user]:text-primary-foreground",
        className
      )}
      style={{
        // Apply primary color background for user messages
        background: `var(--is-user-bg, var(--background))`,
        color: `var(--is-user-text, var(--foreground))`,
      }}
      {...props}
    >
      <div 
        className="is-user:dark"
        style={{
          // CSS variables that get applied when this is a user message
          "--is-user-bg": primaryColor,
          "--is-user-text": "white",
        } as React.CSSProperties}
      >
        {children}
      </div>
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
      className={cn("gap-1.5 rounded-md rounded-br-lg", className)}
      variant={variant}
      style={{
        backgroundColor: primaryColor,
        color: "white",
        borderColor: primaryColor,
      }}
      {...props}
    />
  );
};