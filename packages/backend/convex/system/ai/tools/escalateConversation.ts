import { createTool } from "@convex-dev/agent";
import z from "zod";
import { internal } from "../../../_generated/api";
import { supportAgent } from "../agents/supportAgent";

export const escalateConversation = createTool({
  description: "Escalate conversation to human support when AI cannot help or customer requests it",
  args: z.object({}),
  handler: async (ctx) => {
    if (!ctx.threadId) {
      return "Missing thread ID";
    }

    // Get conversation
    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      { threadId: ctx.threadId }
    );

    if (!conversation) {
      return "Conversation not found";
    }

    // Update status and metadata in one go
    await ctx.runMutation(internal.system.conversations.updateEscalationMetadata, {
      conversationId: conversation._id,
      escalatedAt: Date.now(),
      escalationReason: "ai_detected",
    });

    // Send confirmation to customer
    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: "I've escalated your request to our support team. They'll respond shortly.",
      }
    });

    // Schedule email notification
    ctx.scheduler.runAfter(0, internal.emails.sendEscalationEmailForConversation, {
      conversationId: conversation._id,
    });

    return "Conversation escalated successfully";
  },
});
