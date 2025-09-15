// packages/backend/convex/emails.ts
import { internalAction, internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { Resend, vOnEmailEventArgs } from "@convex-dev/resend";
import { internal } from "./_generated/api";

/**
 * NOTE:
 * - We DO NOT pass `internal.emails.handleEmailEvent` into the Resend constructor.
 *   Passing internal.* function references here creates a circular/self reference
 *   in the generated types which leads to the error you saw:
 *   "Type 'FunctionReference<...>' is not assignable to type 'FunctionReference<...>'".
 *
 * - Instead, construct Resend plainly and use your webhook route to call the
 *   Convex mutation `internal.emails.handleEmailEvent` (example in http.ts).
 */

// Create Resend instance (no onEmailEvent to avoid circular typing)
export const resend: Resend = new Resend(components.resend, {
  testMode: process.env.NODE_ENV === "development",
});

// -----------------------------
// Schemas / helper mutations
// -----------------------------

// Log email sending attempts (used by actions)
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

// Get email settings for an organization - CHANGED TO internalQuery
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

// Use the helper vOnEmailEventArgs from @convex-dev/resend so the arg types line up
export const handleEmailEvent = internalMutation({
  args: vOnEmailEventArgs,
  handler: async (ctx, args) => {
    // args will match the Resend webhook event shapes (typed by the package)
    try {
      // Coerce EmailId opaque type to string when writing to db
      // (Resend may expose EmailId as an opaque branded type)
      const emailIdString = String(args.id);

      // Try to derive an emailType from payload, fallback to 'unknown'
      const emailType =
        // many resend payloads include something like data.email_type or metadata
        // adjust this extraction depending on the actual payload you receive
        (args.event.data && (args.event.data as any).email_type) ??
        (args.event.data && (args.event.data as any).template_name) ??
        "unknown";

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

      // Example targeted handling
      switch (args.event.type) {
        case "email.bounced":
          console.error(`Email bounced: ${emailIdString}`, args.event.data);
          break;
        case "email.delivery_delayed":
          console.warn(`Email delivery delayed: ${emailIdString}`);
          break;
        case "email.delivered":
          console.log(`Email delivered successfully: ${emailIdString}`);
          break;
        case "email.failed":
          console.error(`Email failed: ${emailIdString}`, args.event.data);
          break;
        default:
        // other events: email.sent, email.opened, email.clicked, etc.
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to handle email event:", error.message);
      } else {
        console.error("Unknown error in email event handler:", error);
      }
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
    organizationId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Default from
      let fromEmail = "hello@responsely.com";
      let fromName = "Responsely Team";

      if (args.organizationId) {
        // Use ctx.runQuery to call the internal query
        const emailSettings = await ctx.runQuery(internal.emails.getEmailSettings, {
          organizationId: args.organizationId,
        });
        if (emailSettings) {
          fromEmail = emailSettings.fromEmail ?? fromEmail;
          fromName = emailSettings.fromName ?? fromName;
        }
      }

      // NOTE: Resend's sendEmail interface may differ; adapt fields as needed for your version.
      const emailId = await resend.sendEmail(ctx, {
        from: `${fromName} <${fromEmail}>`,
        to: args.userEmail,
        subject: "Welcome to Responsely! 🎉",
        html: welcomeEmailTemplate({
          userName: args.userName,
          dashboardUrl: "https://responsely.com/dashboard",
        }),
        // FIXED: headers now uses array format
        headers: [
          { name: "X-Entity-Ref-ID", value: args.userId },
        ],
      });

      // Coerce emailId to string for logging if it's an opaque EmailId
      const emailIdString = String(emailId);

      await ctx.runMutation(internal.emails.logEmailSent, {
        emailId: emailIdString,
        userId: args.userId,
        organizationId: args.organizationId,
        emailType: "welcome",
        recipientEmail: args.userEmail,
      });

      console.log(`Welcome email sent to ${args.userEmail}, ID: ${emailIdString}`);
      return emailIdString;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to send welcome email:", error.message);
        // Always try to persist the failure
        await ctx.runMutation(internal.emails.logEmailSent, {
          emailId: "failed",
          userId: args.userId,
          organizationId: args.organizationId,
          emailType: "welcome",
          recipientEmail: args.userEmail,
          errorMessage: error.message,
        });
      } else {
        console.error("Unknown error sending welcome email:", error);
      }
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
        console.log("Escalation emails disabled or no recipients configured");
        return;
      }

      const emailPromises = emailSettings.escalationNotifyEmails.map(async (supportEmail: string) => {
        const emailId = await resend.sendEmail(ctx, {
          from: `${emailSettings.fromName} <${emailSettings.fromEmail}>`,
          to: supportEmail,
          subject: `🚨 Support Escalation - ${args.customerName || args.customerEmail}`,
          html: escalationEmailTemplate({
            customerName: args.customerName || args.customerEmail,
            customerEmail: args.customerEmail,
            conversationId: args.conversationId,
            lastMessage: args.lastMessage,
            dashboardUrl: `https://responsely.com/dashboard/conversations/${args.conversationId}`,
          }),
          // FIXED: headers now uses array format
          headers: [
            { name: "X-Entity-Ref-ID", value: args.conversationId },
          ],
        });

        const emailIdString = String(emailId);

        await ctx.runMutation(internal.emails.logEmailSent, {
          emailId: emailIdString,
          organizationId: args.organizationId,
          emailType: "escalation",
          recipientEmail: supportEmail,
        });

        return emailIdString;
      });

      await Promise.all(emailPromises);
      console.log(`Escalation emails sent for conversation: ${args.conversationId}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to send escalation emails:", error.message);
      } else {
        console.error("Unknown error sending escalation emails:", error);
      }
      throw error;
    }
  },
});

// -----------------------------
// Analytics / cleanup queries
// -----------------------------
export const getEmailAnalytics = query({
  args: {
    organizationId: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    emailType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const q = args.organizationId
    ? ctx.db.query("emailLogs")
        .withIndex("by_organization", (qq) =>
          qq.eq("organizationId", args.organizationId)
        )
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
  args: { olderThanDays: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const cutoffDays = args.olderThanDays ?? 90;
    const cutoffTime = Date.now() - cutoffDays * 24 * 60 * 60 * 1000;

    // ✅ Fixed: Use the index properly to filter by timestamp
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
// Simple HTML templates (move to files if desired)
// -----------------------------
const welcomeEmailTemplate = ({ userName, dashboardUrl }: { userName: string; dashboardUrl: string }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Responsely</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #2563eb; margin-bottom: 20px;">Welcome to Responsely! 🎉</h1>
            <p style="font-size: 18px; margin-bottom: 25px;">Hi ${userName},</p>
            <p style="margin-bottom: 25px;">We're excited to have you on board! Your customer support AI is ready to help you provide amazing customer experiences.</p>
            <a href="${dashboardUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Get Started</a>
            <p style="margin-top: 30px; font-size: 14px; color: #666;">If you have any questions, just reply to this email. We're here to help!</p>
        </div>
    </body>
    </html>
  `;
};

const escalationEmailTemplate = ({
  customerName,
  customerEmail,
  conversationId,
  lastMessage,
  dashboardUrl,
}: {
  customerName: string;
  customerEmail: string;
  conversationId: string;
  lastMessage: string;
  dashboardUrl: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Support Escalation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 10px;">
            <h2 style="color: #dc2626; margin-bottom: 20px;">🚨 Support Escalation Required</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p><strong>Customer:</strong> ${customerName}</p>
                <p><strong>Email:</strong> ${customerEmail}</p>
                <p><strong>Conversation ID:</strong> ${conversationId}</p>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p><strong>Last Message:</strong></p>
                <blockquote style="border-left: 4px solid #e5e7eb; padding-left: 15px; margin: 10px 0; font-style: italic;">
                    ${lastMessage}
                </blockquote>
            </div>
            <a href="${dashboardUrl}" style="display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View in Dashboard</a>
        </div>
    </body>
    </html>
  `;
};