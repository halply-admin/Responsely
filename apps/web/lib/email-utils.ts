// Email utility functions for the frontend

// Import shared constants from backend
import { EMAIL_CONSTANTS } from "@workspace/backend/emails/types";

// Email generation constants
const SUBJECT_MAX_LENGTH = 50;
const ASSISTANT_SENDER_NAME = "Support";
const MAILTO_BODY_MAX_LENGTH = 3000; // Safe limit for mailto links
const HISTORY_TRUNCATION_MESSAGE = "\n\n[Conversation history truncated for email length limits]";

/**
 * Get the display email address for the "From" field in the UI
 * Shows what email will actually be used when sending
 */
export const getDisplayFromEmail = (userEmail?: string): string => {
  if (!userEmail) return "Your organization email";
  
  const emailParts = userEmail.split('@');
  const domain = emailParts[1];
  
  if (domain && (EMAIL_CONSTANTS.UNVERIFIED_DOMAINS as readonly string[]).includes(domain)) {
    const username = emailParts[0];
    return `${username}@resend.dev (verified domain)`;
  }
  
  return userEmail;
};

/**
 * Message interface to match the conversation message structure
 */
interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/**
 * Generate mailto link with conversation history
 */
export const generateMailtoLink = (
  customerEmail: string,
  customerName: string,
  messages: ConversationMessage[] = []
): string => {
  // Get the first customer message as the subject
  const firstCustomerMessage = messages.find(msg => msg.role === "user");
  const subject = firstCustomerMessage 
    ? `Re: ${firstCustomerMessage.content.substring(0, SUBJECT_MAX_LENGTH)}${firstCustomerMessage.content.length > SUBJECT_MAX_LENGTH ? '...' : ''}`
    : `Re: Your support inquiry`;

  // Build conversation history
  let conversationHistory = messages
    .map(msg => {
      const sender = msg.role === "user" ? customerName : ASSISTANT_SENDER_NAME;
      return `${sender}: ${msg.content}`;
    })
    .join('\n\n');

  // Truncate history if it's too long for mailto links
  if (conversationHistory.length > MAILTO_BODY_MAX_LENGTH) {
    conversationHistory = conversationHistory.substring(0, MAILTO_BODY_MAX_LENGTH - HISTORY_TRUNCATION_MESSAGE.length) + HISTORY_TRUNCATION_MESSAGE;
  }

  const body = `Hi ${customerName},

Thank you for reaching out to us. I'm following up on our conversation.

--- Original Conversation ---
${conversationHistory}
--- End of Conversation ---

Best regards,
Support Team`;

  // Encode the mailto parameters
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  return `mailto:${customerEmail}?subject=${encodedSubject}&body=${encodedBody}`;
}; 