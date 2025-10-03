// Email utility functions for the frontend

// Email generation constants
const SUBJECT_MAX_LENGTH = 50;
const ASSISTANT_SENDER_NAME = "Support";
const MAILTO_BODY_MAX_LENGTH = 3000; // Safe limit for mailto links
const HISTORY_TRUNCATION_MESSAGE = "\n\n[Conversation history truncated for email length limits]";
export const EMAIL_CONTEXT_MAX_MESSAGES = 50; // Maximum messages to include in email context

/**
 * Get the display email address for the "From" field in the UI
 * Shows the user's actual email since mailto uses their email client
 */
export const getDisplayFromEmail = (userEmail?: string): string => {
  return userEmail || "Your email address";
};

/**
 * Message interface to match the conversation message structure
 */
export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/**
 * Generate email subject from conversation messages
 */
function _generateEmailSubject(messages: ConversationMessage[]): string {
  const firstCustomerMessage = messages.find(msg => msg.role === "user");
  
  if (firstCustomerMessage) {
    const content = firstCustomerMessage.content;
    const truncatedContent = content.length > SUBJECT_MAX_LENGTH
      ? `${content.substring(0, SUBJECT_MAX_LENGTH)}...`
      : content;
    return `Re: ${truncatedContent}`;
  } else {
    return `Re: Your support inquiry`;
  }
}

/**
 * Build conversation history string from messages
 */
function _buildConversationHistory(messages: ConversationMessage[], customerName: string): string {
  return messages
    .map(msg => {
      const sender = msg.role === "user" ? customerName : ASSISTANT_SENDER_NAME;
      return `${sender}: ${msg.content}`;
    })
    .join('\n\n');
}

/**
 * Build email body template with conversation history
 */
function _buildEmailBody(customerName: string, conversationHistory: string): string {
  return `Hi ${customerName},

Thank you for reaching out to us. I'm following up on our conversation.

--- Original Conversation ---
${conversationHistory}
--- End of Conversation ---

Best regards,
Support Team`;
}

/**
 * Generate mailto link with conversation history
 */
export const generateMailtoLink = (
  customerEmail: string,
  customerName: string,
  messages: ConversationMessage[] = []
): string => {
  const subject = _generateEmailSubject(messages);
  let conversationHistory = _buildConversationHistory(messages, customerName);

  // Truncate history if it's too long for mailto links
  if (conversationHistory.length > MAILTO_BODY_MAX_LENGTH) {
    const truncationPoint = Math.max(0, MAILTO_BODY_MAX_LENGTH - HISTORY_TRUNCATION_MESSAGE.length);
    let truncatedHistory = conversationHistory.substring(0, truncationPoint);
    
    // Avoid cutting a word in the middle by truncating at the last space
    const lastSpaceIndex = truncatedHistory.lastIndexOf(' ');
    if (lastSpaceIndex > 0) {
      truncatedHistory = truncatedHistory.substring(0, lastSpaceIndex);
    }
    
    conversationHistory = truncatedHistory + HISTORY_TRUNCATION_MESSAGE;
  }

  const body = _buildEmailBody(customerName, conversationHistory);

  // Encode the mailto parameters
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  return `mailto:${customerEmail}?subject=${encodedSubject}&body=${encodedBody}`;
};

/**
 * Generate email content (subject and body) for clipboard copying
 * Returns the same content as generateMailtoLink but as separate subject and body
 */
export const generateEmailContent = (
  customerName: string,
  messages: ConversationMessage[] = []
): { subject: string; body: string } => {
  const subject = _generateEmailSubject(messages);
  const conversationHistory = _buildConversationHistory(messages, customerName);
  const body = _buildEmailBody(customerName, conversationHistory);

  return { subject, body };
}; 