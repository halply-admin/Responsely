import { EmailConfig, DEFAULT_EMAIL_CONFIG } from "./types";

/**
 * Format email address with name
 */
export const formatEmailAddress = (email: string, name?: string): string => {
  if (!name) return email;
  return `${name} <${email}>`;
};

/**
 * Get email configuration with fallbacks
 */
export const getEmailConfig = (
  customConfig?: Partial<EmailConfig>
): EmailConfig => {
  return {
    fromName: customConfig?.fromName ?? DEFAULT_EMAIL_CONFIG.fromName,
    fromEmail: customConfig?.fromEmail ?? DEFAULT_EMAIL_CONFIG.fromEmail,
    replyToEmail: customConfig?.replyToEmail ?? DEFAULT_EMAIL_CONFIG.replyToEmail,
  };
};

/**
 * Sanitize HTML content for email
 */
export const sanitizeForEmail = (content: string): string => {
  return content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
};

/**
 * Generate tracking headers
 */
export const getTrackingHeaders = (
  entityId: string,
  emailType: string
): Array<{ name: string; value: string }> => {
  return [
    { name: "X-Entity-Ref-ID", value: entityId },
    { name: "X-Email-Type", value: emailType },
    { name: "X-Mailer", value: "Responsely" },
  ];
}; 