import { EmailConfig, DEFAULT_EMAIL_CONFIG, EmailType } from "./types";

// Idempotency key window in milliseconds (5 minutes)
const IDEMPOTENCY_KEY_WINDOW_MS = 5 * 60 * 1000;

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
  
  // ✅ FIX: Handle edge case where maxLength <= 3
  if (maxLength <= 3) {
    return text.slice(0, maxLength);
  }
  
  return text.substring(0, maxLength - 3) + "...";
};

/**
 * Generate tracking headers
 */
export const getTrackingHeaders = (
  entityId: string,
  emailType: EmailType
): Array<{ name: string; value: string }> => {
  return [
    { name: "X-Entity-Ref-ID", value: entityId },
    { name: "X-Email-Type", value: emailType },
    { name: "X-Mailer", value: "Responsely" },
  ];
};

/**
 * Generate idempotency key for email sending
 * This helps prevent duplicate emails when retries occur
 */
export const generateIdempotencyKey = (
  emailType: EmailType,
  recipientEmail: string,
  entityId: string,
  timestamp?: number
): string => {
  const time = timestamp || Date.now();
  const baseString = `${emailType}-${recipientEmail}-${entityId}-${Math.floor(time / IDEMPOTENCY_KEY_WINDOW_MS)}`;
  
  // Simple hash function for consistent key generation
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `resp-${Math.abs(hash).toString(36)}`;
}; 