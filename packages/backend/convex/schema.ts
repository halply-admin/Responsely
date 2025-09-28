// packages/backend/convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // Email logging for reporting and analytics
  emailLogs: defineTable({
    emailId: v.string(), // Resend email ID
    userId: v.optional(v.string()),
    organizationId: v.optional(v.string()),
    emailType: v.string(), // "welcome", "escalation", "summary"
    recipientEmail: v.optional(v.string()), // Made optional to handle existing records
    event: v.string(), // "sent", "delivered", "bounced", "failed", "opened", "clicked"
    timestamp: v.number(),
    metadata: v.optional(v.any()), // Store email details, conversation ID, etc.
    errorMessage: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_organization", ["organizationId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_email_type", ["emailType"])
    .index("by_event", ["event"]),

  // Email settings per organization
  emailSettings: defineTable({
    organizationId: v.string(),
    fromEmail: v.string(),
    fromName: v.string(),
    replyToEmail: v.optional(v.string()),
    enableWelcomeEmails: v.boolean(),
    enableEscalationEmails: v.boolean(),
    enableSummaryEmails: v.boolean(),
    summaryFrequency: v.optional(v.string()), // "daily", "weekly"
    escalationNotifyEmails: v.array(v.string()), // Support team emails
  }).index("by_organization", ["organizationId"]),
  
  subscriptions: defineTable({
    organizationId: v.string(),
    status: v.string(),
  })
    .index("by_organization_id", ["organizationId"]),

  widgetSettings: defineTable({
    organizationId: v.string(),
    greetMessage: v.string(),
    
    // Quick Suggestions
    defaultSuggestions: v.optional(
      v.object({
        suggestion1: v.optional(v.string()),
        suggestion2: v.optional(v.string()),
        suggestion3: v.optional(v.string()),
      })
    ),
    
    // Appearance Settings - NEW ADDITION
    appearance: v.optional(
      v.object({
        primaryColor: v.string(),
        position: v.union(v.literal("bottom-right"), v.literal("bottom-left")),
        theme: v.union(v.literal("light"), v.literal("dark"), v.literal("auto")),
      })
    ),
    
    // Voice Assistant Settings
    vapiSettings: v.optional(
      v.object({
        assistantId: v.optional(v.string()),
        phoneNumber: v.optional(v.string()),
      })
    ),
  })
    .index("by_organization_id", ["organizationId"]),

  plugins: defineTable({
    organizationId: v.string(),
    service: v.union(v.literal("vapi")),
    secretName: v.string(),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_organization_id_and_service", ["organizationId", "service"]),

  conversations: defineTable({
    threadId: v.string(),
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
    status: v.union(
      v.literal("unresolved"),
      v.literal("escalated"),
      v.literal("resolved")
    ),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_contact_session_id", ["contactSessionId"])
    .index("by_thread_id", ["threadId"])
    .index("by_status_and_organization_id", ["status", "organizationId"]),

  contactSessions: defineTable({
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    expiresAt: v.number(),
    metadata: v.optional(v.object({
      userAgent: v.optional(v.string()),
      language: v.optional(v.string()),
      languages: v.optional(v.string()),
      platform: v.optional(v.string()),
      vendor: v.optional(v.string()),
      screenResolution: v.optional(v.string()),
      viewportSize: v.optional(v.string()),
      timezone: v.optional(v.string()),
      timezoneOffset: v.optional(v.number()),
      cookieEnabled: v.optional(v.boolean()),
      referrer: v.optional(v.string()),
      currentUrl: v.optional(v.string()),
    }))
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_expires_at", ["expiresAt"]),

  users: defineTable({
    name: v.string(),
  }),
});