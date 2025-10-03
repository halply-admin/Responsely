"use client";

import { AISuggestion, AISuggestions } from "@workspace/ui/components/ai/suggestion";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, MenuIcon, UserIcon } from "lucide-react";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { contactSessionIdAtomFamily, conversationIdAtom, organizationIdAtom, screenAtom, widgetSettingsAtom } from "../../atoms/widget-atoms";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Form, FormField } from "@workspace/ui/components/form";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
  StyledAIMessage as AIMessage,
  StyledAIMessageContent as AIMessageContent,
} from "../components/styled-ai-components";
import { AIResponse } from "@workspace/ui/components/ai/response";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

// Minimum number of messages required before showing escalation button
const MIN_MESSAGES_BEFORE_ESCALATION = 2;

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const [isEscalating, setIsEscalating] = useState(false);
  const escalateConversation = useMutation(api.public.conversations.escalateConversation);

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  const suggestions = useMemo(() => {
    if (!widgetSettings?.defaultSuggestions) {
      return [];
    }

    return Object.values(widgetSettings.defaultSuggestions).filter((suggestion): suggestion is string => 
      Boolean(suggestion)
    );
  }, [widgetSettings]);

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId,
        } 
      : "skip"
  );

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId,
        }
      : "skip",
    { initialNumItems: 10 },
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } = useInfiniteScroll({
    status: messages.status,
    loadMore: messages.loadMore,
    loadSize: 10,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createMessage = useAction(api.public.messages.create);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) {
      return;
    }

    form.reset();

    await createMessage({
      threadId: conversation.threadId,
      prompt: values.message,
      contactSessionId,
    });
  };

  const handleEscalate = async () => {
    if (!conversationId || !contactSessionId) {
      toast.error("An error occurred. Please try again later.");
      return;
    }

    setIsEscalating(true);
    try {
      const result = await escalateConversation({
        conversationId,
        contactSessionId,
      });

      if (result.alreadyEscalated) {
        toast.info("You are already connected with our support team.");
      } else if (result.success) {
        toast.success("Successfully connected with the support team. They will respond shortly.");
      } else {
        toast.error("Failed to connect with support. Please try again.");
      }
    } catch (error) {
      console.error("Failed to escalate:", error);
      toast.error("Failed to connect with support. Please try again.");
    } finally {
      setIsEscalating(false);
    }
  };

  return (
    <>
      <WidgetHeader className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Button
            onClick={onBack}
            size="icon"
            variant="transparent"
          >
            <ArrowLeftIcon />
          </Button>
          <p>Chat</p>
        </div>
        <Button
          size="icon"
          variant="transparent"
        >
          <MenuIcon />
        </Button>
      </WidgetHeader>
      <AIConversation>
        <AIConversationContent>
          <InfiniteScrollTrigger
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
            ref={topElementRef}
          />
          {toUIMessages(messages.results ?? [])?.map((message) => {
            return (
              <AIMessage
                from={message.role === "user" ? "user" : "assistant"}
                key={message.id}
              >
                <AIMessageContent from={message.role === "user" ? "user" : "assistant"}>
                  <AIResponse>{message.content}</AIResponse>
                </AIMessageContent>
                {message.role === "assistant" && (
                  <DicebearAvatar
                    imageUrl="/responsely-logo.png"
                    seed="assistant"
                    size={32}
                  />
                )}
              </AIMessage>
            )
          })}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>
      {toUIMessages(messages.results ?? [])?.length === 1 && (
        <AISuggestions className="flex w-full flex-col items-end p-2">
          {suggestions.map((suggestion) => {
            if (!suggestion) {
              return null;
            }

            return (
              <AISuggestion
                key={suggestion}
                onClick={() => {
                  form.setValue("message", suggestion, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  form.handleSubmit(onSubmit)();
                }}
                suggestion={suggestion}
              />
            )
          })}
        </AISuggestions>
      )}
      
      {/* Escalation button and status */}
      <div className="border-t bg-background">
        {/* Show escalation button when conversation active and not already escalated */}
        {conversation?.status === "unresolved" && toUIMessages(messages.results ?? [])?.length > MIN_MESSAGES_BEFORE_ESCALATION && (
          <div className="px-4 pt-3 pb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEscalate}
              disabled={isEscalating}
              className="w-full text-xs text-muted-foreground hover:text-foreground"
            >
              <UserIcon className="mr-2 size-3" />
              {isEscalating ? "Connecting..." : "Talk to a human"}
            </Button>
          </div>
        )}

        {/* Show status when escalated */}
        {conversation?.status === "escalated" && (
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <div className="size-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Support team will respond soon</span>
            </div>
          </div>
        )}

        {/* Chat input */}
        <div className="p-4 pt-2">
          <Form {...form}>
            <AIInput
              className="rounded-none border-x-0 border-b-0"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                disabled={conversation?.status === "resolved" || conversation?.status === "escalated"}
                name="message"
                render={({ field }) => (
                  <AIInputTextarea
                    disabled={conversation?.status === "resolved" || conversation?.status === "escalated"}
                    onChange={field.onChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    placeholder={
                      conversation?.status === "resolved"
                        ? "This conversation has been resolved."
                        : conversation?.status === "escalated"
                        ? "Support team will respond soon..."
                        : "Type your message..."
                    }
                    value={field.value}
                  />
                )}
              />
              <AIInputToolbar>
                <AIInputTools />
                <AIInputSubmit
                  disabled={conversation?.status === "resolved" || conversation?.status === "escalated" || !form.formState.isValid}
                  status="ready"
                  type="submit"
                />
              </AIInputToolbar>
            </AIInput>
          </Form>
        </div>
      </div>
    </>
  );
};