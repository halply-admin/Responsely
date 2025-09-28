import { EmailConfig, DEFAULT_EMAIL_CONFIG, EmailType, EMAIL_CONSTANTS } from "./types";

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
export const getEmailConfig = (overrides?: {
  fromName?: string;
  fromEmail?: string;
  replyToEmail?: string;
}) => {
  const defaultFromName = DEFAULT_EMAIL_CONFIG.fromName;
  const defaultFromEmail = DEFAULT_EMAIL_CONFIG.fromEmail;

  // Use Resend's default domain for unverified domains
  const getVerifiedFromEmail = (email?: string) => {
    if (!email) return defaultFromEmail;
    
    // Check if it's a common unverified domain
    const unverifiedDomains = EMAIL_CONSTANTS.UNVERIFIED_DOMAINS;
    const emailParts = email.split('@');
    const domain = emailParts[1];
    
    if (domain && (unverifiedDomains as readonly string[]).includes(domain)) {
      // Use Resend's default domain but keep the user's name
      const username = emailParts[0];
      return `${username}@resend.dev`; // Resend's default domain
    }
    
    return email;
  };

  return {
    fromName: overrides?.fromName || defaultFromName,
    fromEmail: getVerifiedFromEmail(overrides?.fromEmail),
    replyToEmail: overrides?.replyToEmail ?? DEFAULT_EMAIL_CONFIG.replyToEmail,
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