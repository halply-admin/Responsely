// packages/backend/convex/emails/templates/customer-communication.ts

export interface CustomerCommunicationEmailData {
  customerName: string;
  senderName: string;
  subject: string;
  message: string;
  conversationId?: string;
  dashboardUrl?: string;
}

export const customerCommunicationEmailSubject = (subject: string) => subject;

export const customerCommunicationEmailTemplate = ({
  customerName,
  senderName,
  subject,
  message,
  conversationId,
  dashboardUrl,
}: CustomerCommunicationEmailData) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header {
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #495057;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            color: #495057;
        }
        .message-content {
            background-color: #f8f9fa;
            border-left: 4px solid #007bff;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .message-content p {
            margin: 0;
            white-space: pre-wrap;
            font-size: 15px;
            line-height: 1.6;
        }
        .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 12px;
            text-align: center;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Message from Support</h1>
        </div>
        
        <div class="greeting">
            Hello ${customerName},
        </div>
        
        <div class="message-content">
            <p>${message}</p>
        </div>
        
        <div class="signature">
            <p>Best regards,<br>
            <strong>${senderName}</strong><br>
            Customer Support Team</p>
        </div>
        
        <div class="footer">
            <p>This email was sent in response to your support inquiry.</p>
            ${conversationId && dashboardUrl ? `
            <p>Reference ID: ${conversationId}</p>
            ` : ''}
            <p>If you have any questions, please don't hesitate to reach out to us.</p>
        </div>
    </div>
</body>
</html>
`; 