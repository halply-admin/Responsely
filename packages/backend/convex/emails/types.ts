// Shared email types and constants

export type EmailType = "welcome" | "escalation" | "summary" | "notification";

export interface BaseEmailData {
  recipientEmail: string;
  recipientName?: string;
}

export interface EmailConfig {
  fromName: string;
  fromEmail: string;
  replyToEmail?: string;
}

export const DEFAULT_EMAIL_CONFIG: EmailConfig = {
  fromName: "Halply",
  fromEmail: "send@responsely.ai",
  replyToEmail: "support@responsely.ai",
};

export const EMAIL_CONSTANTS = {
  COMPANY_NAME: "Responsely",
  DASHBOARD_URL: "https://responsely.com/dashboard",
  SUPPORT_URL: "https://responsely.com/support",
  UNSUBSCRIBE_URL: "https://responsely.com/unsubscribe",
} as const; 