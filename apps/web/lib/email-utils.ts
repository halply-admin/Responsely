// Email utility functions for the frontend

// Common unverified domains that need to use Resend's default domain
const UNVERIFIED_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'] as const;

/**
 * Get the display email address for the "From" field in the UI
 * Shows what email will actually be used when sending
 */
export const getDisplayFromEmail = (userEmail?: string): string => {
  if (!userEmail) return "Your organization email";
  
  const emailParts = userEmail.split('@');
  const domain = emailParts[1];
  
  if (domain && (UNVERIFIED_DOMAINS as readonly string[]).includes(domain)) {
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
    ? `Re: ${firstCustomerMessage.content.substring(0, 50)}${firstCustomerMessage.content.length > 50 ? '...' : ''}`
    : `Re: Your support inquiry`;

  // Build conversation history
  const conversationHistory = messages
    .map(msg => {
      const sender = msg.role === "user" ? customerName : "Support";
      return `${sender}: ${msg.content}`;
    })
    .join('\n\n');

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