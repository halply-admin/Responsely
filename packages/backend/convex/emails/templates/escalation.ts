export interface EscalationEmailData {
  customerName: string;
  customerEmail: string;
  conversationId: string;
  lastMessage: string;
  dashboardUrl: string;
}

export const escalationEmailTemplate = (data: EscalationEmailData): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Support Escalation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #fef2f2;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #dc2626;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .alert-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .title {
          color: #dc2626;
          font-size: 24px;
          font-weight: 600;
          margin: 20px 0;
        }
        .customer-info {
          background-color: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border: 1px solid #e5e7eb;
        }
        .info-row {
          margin: 10px 0;
        }
        .label {
          font-weight: 600;
          color: #374151;
        }
        .message-box {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
          font-style: italic;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          text-align: center;
          transition: transform 0.2s ease;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
        }
        .priority {
          background-color: #fee2e2;
          color: #b91c1c;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="alert-icon">🚨</div>
          <div class="priority">High Priority</div>
        </div>
        
        <h2 class="title">Support Escalation Required</h2>
        
        <p>A customer conversation has been escalated and requires immediate attention.</p>
        
        <div class="customer-info">
          <div class="info-row">
            <span class="label">Customer:</span> ${data.customerName}
          </div>
          <div class="info-row">
            <span class="label">Email:</span> ${data.customerEmail}
          </div>
          <div class="info-row">
            <span class="label">Conversation ID:</span> ${data.conversationId}
          </div>
        </div>
        
        <div>
          <span class="label">Last Message:</span>
          <div class="message-box">
            ${data.lastMessage}
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.dashboardUrl}" class="button">View in Dashboard</a>
        </div>
        
        <div class="footer">
          <p>This is an automated escalation notification from Responsely.</p>
          <p>Please respond to this customer as soon as possible.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const escalationEmailSubject = (customerName: string): string => {
  return `🚨 Support Escalation - ${customerName}`;
}; 