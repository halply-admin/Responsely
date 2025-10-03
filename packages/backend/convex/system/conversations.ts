import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";
import { supportAgent } from "./ai/agents/supportAgent";

export const escalate = internalMutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique();

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    await ctx.db.patch(conversation._id, { status: "escalated" });
  },
});

export const resolve = internalMutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique();

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    await ctx.db.patch(conversation._id, { status: "resolved" });
  },
});

export const getByThreadId = internalQuery({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query("conversations")
      .withIndex("by_thread_id", (q) => q.eq("threadId", args.threadId))
      .unique();
    
    return conversation;
  },
});

export const get = internalQuery({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});

export const updateEscalationMetadata = internalMutation({
  args: {
    conversationId: v.id("conversations"),
    escalatedAt: v.number(),
    escalationReason: v.union(
      v.literal("customer_requested"),
      v.literal("ai_detected")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, {
      status: "escalated",
      escalatedAt: args.escalatedAt,
      escalationReason: args.escalationReason,
    });
  },
});

export const getLastMessageForThread = internalQuery({
  args: { threadId: v.string() },
  handler: async (ctx, args) => {
    const messages = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: { numItems: 10, cursor: null }, // Get more messages to find a user message
    });

    if (messages.page.length > 0) {
      // Look for the most recent user message with content (iterate backward from the end)
      for (let i = messages.page.length - 1; i >= 0; i--) {
        const message = messages.page[i];
        if (!message) continue;
        
        // Skip if not a user message or has no content
        if (message.message?.role !== 'user' || !message.message.content) {
          continue;
        }

        const messageContent = message.message.content;
        if (typeof messageContent === 'string' && messageContent.trim()) {
          return messageContent;
        }

        if (Array.isArray(messageContent)) {
          // Find the first text part in a possible multi-modal message
          const textPart = messageContent.find(
            (part): part is { type: 'text'; text: string } =>
              typeof part === 'object' && part.type === 'text' && typeof part.text === 'string'
          );

          if (textPart?.text.trim()) {
            return textPart.text;
          }

          // If no text part, but other content exists, return a placeholder.
          if (messageContent.length > 0) {
            return "[User sent a message with non-text content]";
          }
        }
      }
    }

    return null;
  },
});
