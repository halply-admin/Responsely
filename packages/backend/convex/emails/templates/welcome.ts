export interface WelcomeEmailData {
  userName: string;
  dashboardUrl: string;
}

export const welcomeEmailTemplate = (data: WelcomeEmailData): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Responsely</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          color: #2563eb;
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .title {
          color: #2563eb;
          font-size: 28px;
          font-weight: 600;
          margin: 20px 0;
        }
        .content {
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo"></div>
        </div>
        
        <div class="content">
          <p>Hi ${data.userName},</p>
          
          <p>We're excited to have you on board! Your customer support AI is ready to help you save time and provide a great customer experience.</p>
          
          <p>Get started by exploring your dashboard where you can:</p>
          <ul>
            <li>Configure your AI assistant</li>
            <li>Monitor customer conversations</li>
            <li>Access analytics and insights</li>
            <li>Customize your support experience</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.dashboardUrl}" class="button">Get Started</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Need help? Reply to this email or visit our support center.</p>
          <p>&copy; 2025 Responsely. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const welcomeEmailSubject = (userName: string): string => {
  return `Welcome to Responsely, ${userName}! 🎉`;
}; 