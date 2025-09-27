import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";

export const escalateConversation = createTool({
  description: "Escalate a conversation",
  args: z.object({}),
  handler: async (ctx) => {
    if (!ctx.threadId) {
      return "Missing thread ID";
    }

    // Get conversation details before escalation
    const conversation = await ctx.runQuery(internal.system.conversations.getByThreadId, {
      threadId: ctx.threadId,
    });

    if (!conversation) {
      return "Conversation not found";
    }

    // Check if already escalated to prevent duplicate emails
    if (conversation.status === "escalated") {
      return "Conversation already escalated";
    }

    // Escalate the conversation
    await ctx.runMutation(internal.system.conversations.escalate, {
      threadId: ctx.threadId,
    });

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: "Conversation escalated to a human operator.",
      }
    });

    // Send escalation email (fire-and-forget to avoid blocking)
    try {
      await ctx.scheduler.runAfter(0, internal.emails.sendEscalationEmail, {
        conversationId: conversation._id,
        organizationId: conversation.organizationId,
        threadId: ctx.threadId,
      });
    } catch (error) {
      console.error("Failed to schedule escalation email:", error);
      // Don't fail the escalation if email scheduling fails
    }

    return "Conversation escalated to a human operator";
  },
});
