"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
// import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
// import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
// import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll";
// import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { contactSessionIdAtomFamily, conversationIdAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Form, FormField } from "@workspace/ui/components/form";
// import {
//   AIConversation,
//   AIConversationContent,
//   AIConversationScrollButton,
// } from "@workspace/ui/components/ai/conversation";
// import {
//   AIInput,
//   AIInputSubmit,
//   AIInputTextarea,
//   AIInputToolbar,
//   AIInputTools,
// } from "@workspace/ui/components/ai/input";
// import {
//   AIMessage,
//   AIMessageContent,
// } from "@workspace/ui/components/ai/message";
// import { AIResponse } from "@workspace/ui/components/ai/response";
// import {
//   AISuggestion,
//   AISuggestions,
// } from "@workspace/ui/components/ai/suggestion";

const formSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);

  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId,
        } 
      : "skip"
  );

  // const messages = useThreadMessages(
  //   api.public.messages.getMany,
  //   conversation?.threadId && contactSessionId
  //     ? {
  //         threadId: conversation.threadId,
  //         contactSessionId,
  //       }
  //     : "skip",
  //   { initialNumItems: 10 },
  // );

  // const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } = useInfiniteScroll({
  //   status: messages.status,
  //   loadMore: messages.loadMore,
  //   loadSize: 10,
  // });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  // const createMessage = useAction(api.public.messages.create);
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) {
      return;
    }

    form.reset();

    // await createMessage({
    //   threadId: conversation.threadId,
    //   prompt: values.message,
    //   contactSessionId,
    // });
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
      <div className="flex-1 flex flex-col gay-y-4 p-4">
        {JSON.stringify(conversation)}
      </div>
    
    </>
  );
};
