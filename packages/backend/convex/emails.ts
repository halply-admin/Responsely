// packages/backend/convex/emails.ts
import { internalAction, internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { Resend, vOnEmailEventArgs } from "@convex-dev/resend";
import { internal } from "./_generated/api";

/**
 * NOTE:
 * - We DO NOT pass `internal.emails.handleEmailEvent` into the Resend constructor
 * to avoid circular type dependencies.
 * - The Resend instance uses `testMode` in development, which simulates email sending
 * without dispatching real emails. Set NODE_ENV to "production" in your Convex
 * dashboard to send real emails.
 */
export const resend: Resend = new Resend(components.resend, {
  testMode: process.env.NODE_ENV === "development",
});

// -----------------------------
// Schemas / helper mutations
// -----------------------------

export const logEmailSent = internalMutation({
  args: {
    emailId: v.string(),
    userId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    emailType: v.string(),
    recipientEmail: v.string(),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("emailLogs", {
      emailId: args.emailId,
      userId: args.userId,
      organizationId: args.organizationId,
      emailType: args.emailType,
      event: args.errorMessage ? "failed" : "sent",
      timestamp: Date.now(),
      metadata: {
        recipientEmail: args.recipientEmail,
        errorMessage: args.errorMessage,
      },
    });
  },
});

export const getEmailSettings = internalQuery({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("emailSettings")
      .withIndex("by_organization", (q) => q.eq("organizationId", args.organizationId))
      .unique();
  },
});

// -----------------------------
// Webhook / event handler
// -----------------------------

export const handleEmailEvent = internalMutation({
  args: vOnEmailEventArgs,
  handler: async (ctx, args) => {
    try {
      const emailIdString = String(args.id);
      const emailType = (args.event.data && (args.event.data as any).email_type) ?? "unknown";

      await ctx.db.insert("emailLogs", {
        emailId: emailIdString,
        emailType: String(emailType),
        event: args.event.type,
        timestamp: Date.now(),
        metadata: {
          data: args.event.data,
          createdAt: args.event.created_at,
        },
      });
    } catch (error) {
      console.error("Failed to handle email event:", error);
    }
  },
});

// -----------------------------
// Actions that send emails
// -----------------------------

export const sendWelcomeEmail = internalAction({
  args: {
    userEmail: v.string(),
    userName: v.string(),
    userId: v.string(),
    organizationId: v.optional(v.string()), // Kept for logging context
  },
  handler: async (ctx, args) => {
    try {
      // ✅ ADDED: Log the environment to confirm if testMode is active.
      console.log(`Sending welcome email in environment: ${process.env.NODE_ENV}`);

      // ✅ CHANGED: Simplified to always use Resend's verified domain for reliability.
      const fromAddress = "Responsely <onboarding@resend.dev>";

      const emailId = await resend.sendEmail(ctx, {
        from: fromAddress,
        to: args.userEmail,
        subject: "Welcome to Responsely! 🎉",
        html: welcomeEmailTemplate({
          userName: args.userName,
          dashboardUrl: "https://responsely.com/dashboard",
        }),
        headers: [{ name: "X-Entity-Ref-ID", value: args.userId }],
      });

      const emailIdString = String(emailId);
      // ✅ ADDED: Log the ID returned by Resend for easier debugging.
      console.log(`Welcome email request sent. Resend ID: ${emailIdString}`);

      await ctx.runMutation(internal.emails.logEmailSent, {
        emailId: emailIdString,
        userId: args.userId,
        organizationId: args.organizationId,
        emailType: "welcome",
        recipientEmail: args.userEmail,
      });

      return emailIdString;
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // ✅ IMPROVED: Ensure error details are logged on failure.
      const errorMessage = error instanceof Error ? error.stack || error.message : "Unknown error";
      await ctx.runMutation(internal.emails.logEmailSent, {
        emailId: "failed",
        userId: args.userId,
        organizationId: args.organizationId,
        emailType: "welcome",
        recipientEmail: args.userEmail,
        errorMessage,
      });
      throw error;
    }
  },
});

export const sendEscalationEmail = internalAction({
  args: {
    conversationId: v.string(),
    organizationId: v.string(),
    customerEmail: v.string(),
    customerName: v.optional(v.string()),
    lastMessage: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const emailSettings = await ctx.runQuery(internal.emails.getEmailSettings, {
        organizationId: args.organizationId,
      });

      if (!emailSettings?.enableEscalationEmails || !emailSettings.escalationNotifyEmails?.length) {
        console.log(`Escalation emails disabled for organization: ${args.organizationId}`);
        return;
      }

      // ✅ CHANGED: Use a reliable default "from" address but allow override from settings if present.
      const fromName = emailSettings.fromName ?? "Responsely Alerts";
      // Use the verified domain as a fallback to prevent delivery failures.
      const fromEmail = emailSettings.fromEmail ?? "alerts@resend.dev";

      const emailPromises = emailSettings.escalationNotifyEmails.map(async (supportEmail: string) => {
        try {
          const emailId = await resend.sendEmail(ctx, {
            from: `${fromName} <${fromEmail}>`,
            to: supportEmail,
            subject: `🚨 Support Escalation - ${args.customerName || args.customerEmail}`,
            html: escalationEmailTemplate({
              customerName: args.customerName || args.customerEmail,
              customerEmail: args.customerEmail,
              conversationId: args.conversationId,
              lastMessage: args.lastMessage,
              dashboardUrl: `https://responsely.com/dashboard/conversations/${args.conversationId}`,
            }),
            headers: [{ name: "X-Entity-Ref-ID", value: args.conversationId }],
          });

          const emailIdString = String(emailId);
          await ctx.runMutation(internal.emails.logEmailSent, {
            emailId: emailIdString,
            organizationId: args.organizationId,
            emailType: "escalation",
            recipientEmail: supportEmail,
          });
        } catch (error) {
          console.error(`Failed to send escalation to ${supportEmail}:`, error);
          const errorMessage = error instanceof Error ? error.stack || error.message : "Unknown error";
          await ctx.runMutation(internal.emails.logEmailSent, {
            emailId: "failed",
            organizationId: args.organizationId,
            emailType: "escalation",
            recipientEmail: supportEmail,
            errorMessage,
          });
        }
      });

      await Promise.all(emailPromises);
      console.log(`Finished sending escalation emails for conversation: ${args.conversationId}`);
    } catch (error) {
      console.error("Critical error in sendEscalationEmail action:", error);
      throw error;
    }
  },
});

// -----------------------------
// Analytics / cleanup queries
// -----------------------------

export const getEmailAnalytics = query({
  // ... (This function is correct, no changes needed)
  args: {
    organizationId: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    emailType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const q = args.organizationId
      ? ctx.db.query("emailLogs").withIndex("by_organization", (qq) => qq.eq("organizationId", args.organizationId))
      : ctx.db.query("emailLogs");
    const logs = await q.collect();
    const filteredLogs = logs.filter((log) => {
      if (args.startDate && log.timestamp < args.startDate) return false;
      if (args.endDate && log.timestamp > args.endDate) return false;
      if (args.emailType && log.emailType !== args.emailType) return false;
      return true;
    });
    const analytics = {
      totalSent: filteredLogs.filter((l) => l.event === "sent").length,
      totalDelivered: filteredLogs.filter((l) => l.event === "delivered").length,
      totalBounced: filteredLogs.filter((l) => l.event === "bounced").length,
      totalFailed: filteredLogs.filter((l) => l.event === "failed").length,
      totalOpened: filteredLogs.filter((l) => l.event === "opened").length,
      totalClicked: filteredLogs.filter((l) => l.event === "clicked").length,
      deliveryRate: 0,
      openRate: 0,
      clickRate: 0,
      byType: {} as Record<string, number>,
    };
    if (analytics.totalSent > 0) {
      analytics.deliveryRate = (analytics.totalDelivered / analytics.totalSent) * 100;
      analytics.openRate = (analytics.totalOpened / analytics.totalDelivered) * 100;
      analytics.clickRate = (analytics.totalClicked / analytics.totalDelivered) * 100;
    }
    filteredLogs.forEach((log) => {
      if (log.event === "sent") {
        analytics.byType[log.emailType] = (analytics.byType[log.emailType] || 0) + 1;
      }
    });
    return analytics;
  },
});

export const cleanupOldEmailLogs = internalMutation({
  // ... (This function is correct, no changes needed)
  args: { olderThanDays: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const cutoffDays = args.olderThanDays ?? 90;
    const cutoffTime = Date.now() - cutoffDays * 24 * 60 * 60 * 1000;
    const oldLogs = await ctx.db
      .query("emailLogs")
      .withIndex("by_timestamp", (q) => q.lt("timestamp", cutoffTime))
      .collect();
    for (const l of oldLogs) {
      await ctx.db.delete(l._id);
    }
    console.log(`Cleaned up ${oldLogs.length} old email logs`);
  },
});

// -----------------------------
// HTML templates
// -----------------------------

const welcomeEmailTemplate = ({ userName, dashboardUrl }: { userName: string; dashboardUrl: string }) => {
  // ... (This function is correct, no changes needed)
  return `
    <!DOCTYPE html><html><head><meta charset="utf-8"><title>Welcome to Responsely</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563eb;">Welcome to Responsely! 🎉</h1>
        <p>Hi ${userName},</p>
        <p>We're excited to have you on board! Your customer support AI is ready to help you provide amazing customer experiences.</p>
        <a href="${dashboardUrl}" style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">Get Started</a>
    </body></html>`;
};

const escalationEmailTemplate = ({
  customerName, customerEmail, conversationId, lastMessage, dashboardUrl,
}: {
  customerName: string; customerEmail: string; conversationId: string; lastMessage: string; dashboardUrl: string;
}) => {
  // ... (This function is correct, no changes needed)
  return `
    <!DOCTYPE html><html><head><title>Support Escalation</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626;">🚨 Support Escalation Required</h2>
        <p><strong>Customer:</strong> ${customerName}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
        <p><strong>Last Message:</strong></p>
        <blockquote style="border-left: 4px solid #e5e7eb; padding-left: 15px; margin: 10px 0;">${lastMessage}</blockquote>
        <a href="${dashboardUrl}" style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px;">View in Dashboard</a>
    </body></html>`;
};