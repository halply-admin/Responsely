// packages/backend/convex/emails.ts
import { internalAction, internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { Resend, vOnEmailEventArgs } from "@convex-dev/resend";
import { internal } from "./_generated/api";
import { createClerkClient } from "@clerk/backend";
import { 
  welcomeEmailTemplate, 
  welcomeEmailSubject
} from "./emails/templates/welcome";
import {
  escalationEmailTemplate,
  escalationEmailSubject
} from "./emails/templates/escalation";
import {
  getEmailConfig,
  formatEmailAddress,
  getTrackingHeaders,
  sanitizeForEmail,
  truncateText
} from "./emails/utils";
import { EMAIL_CONSTANTS } from "./emails/types";

/**
 * The Resend instance uses `testMode` in development, which simulates email sending
 * without dispatching real emails. Set NODE_ENV to "production" in your Convex
 * dashboard to send real emails.
 */
export const resend: Resend = new Resend(components.resend, {
  testMode: process.env.NODE_ENV === "development",
});

// Clerk client for organization member access
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
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

      // ✅ CHANGED: Use reusable email configuration
      const emailConfig = getEmailConfig();
      const fromAddress = formatEmailAddress(emailConfig.fromEmail, emailConfig.fromName);

      // ✅ FIX: Sanitize userName once and reuse
      const sanitizedUserName = sanitizeForEmail(args.userName);

      const emailId = await resend.sendEmail(ctx, {
        from: fromAddress,
        to: args.userEmail,
        subject: welcomeEmailSubject(sanitizedUserName),
        html: welcomeEmailTemplate({
          userName: sanitizedUserName,
          dashboardUrl: EMAIL_CONSTANTS.DASHBOARD_URL,
        }),
        headers: getTrackingHeaders(args.userId, "welcome"),
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
    threadId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Get conversation with contact session details
      const conversation = await ctx.runQuery(internal.system.conversations.getByThreadId, {
        threadId: args.threadId,
      });

      if (!conversation) {
        console.log(`Conversation not found: ${args.conversationId}`);
        return;
      }

      // Get contact session for customer details
      const contactSession = await ctx.runQuery(internal.system.contactSessions.getOne, {
        contactSessionId: conversation.contactSessionId,
      });

      if (!contactSession) {
        console.log(`Contact session not found for conversation: ${args.conversationId}`);
        return;
      }

      // Get email settings
      const emailSettings = await ctx.runQuery(internal.emails.getEmailSettings, {
        organizationId: args.organizationId,
      });

      // Skip if escalation emails are disabled
      if (emailSettings && !emailSettings.enableEscalationEmails) {
        console.log(`Escalation emails disabled for organization: ${args.organizationId}`);
        return;
      }

      // Get notification emails from Clerk organization members
      let notificationEmails: string[] = [];
      
      try {
        const orgMembers = await clerkClient.organizations.getOrganizationMembershipList({
          organizationId: args.organizationId,
        });

        notificationEmails = orgMembers.data
          .filter(member => member.publicUserData && 'emailAddress' in member.publicUserData && member.publicUserData.emailAddress)
          .map(member => (member.publicUserData as any).emailAddress as string);

        console.log(`Found ${notificationEmails.length} team members for escalation notifications`);
        
      } catch (clerkError) {
        console.error("Failed to get Clerk organization members:", clerkError);
        
        // Fallback: Use manual emails from settings if Clerk fails
        if (emailSettings?.escalationNotifyEmails?.length) {
          notificationEmails = emailSettings.escalationNotifyEmails;
          console.log("Using manual escalation emails as fallback");
        }
      }

      // Exit if no emails found
      if (notificationEmails.length === 0) {
        console.log(`No notification emails found for organization: ${args.organizationId}`);
        return;
      }

      // Use a simple message for context (can be enhanced later)
      const lastCustomerMessage = "Customer has requested human assistance";

      // Email configuration
      const emailConfig = getEmailConfig({
        fromName: emailSettings?.fromName ?? "Support Alerts",
        fromEmail: emailSettings?.fromEmail,
      });

      // Send emails to all team members
      const emailPromises = notificationEmails.map(async (supportEmail: string) => {
        try {
          const sanitizedMessage = sanitizeForEmail(truncateText(lastCustomerMessage, 500));
          const sanitizedCustomerName = sanitizeForEmail(contactSession.name || contactSession.email);
          const sanitizedCustomerEmail = sanitizeForEmail(contactSession.email);
          
          const emailId = await resend.sendEmail(ctx, {
            from: formatEmailAddress(emailConfig.fromEmail, emailConfig.fromName),
            to: supportEmail,
            subject: escalationEmailSubject(sanitizedCustomerName),
            html: escalationEmailTemplate({
              customerName: sanitizedCustomerName,
              customerEmail: sanitizedCustomerEmail,
              conversationId: args.conversationId,
              lastMessage: sanitizedMessage,
              dashboardUrl: `${EMAIL_CONSTANTS.DASHBOARD_URL}/conversations/${args.conversationId}`,
            }),
            headers: getTrackingHeaders(args.conversationId, "escalation"),
          });

          const emailIdString = String(emailId);
          await ctx.runMutation(internal.emails.logEmailSent, {
            emailId: emailIdString,
            organizationId: args.organizationId,
            emailType: "escalation",
            recipientEmail: supportEmail,
          });

          console.log(`Escalation email sent to: ${supportEmail}`);
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
// HTML templates - MOVED TO /emails/templates/
// -----------------------------
// Email templates have been moved to separate files for better organization:
// - ./emails/templates/welcome.ts
// - ./emails/templates/escalation.ts