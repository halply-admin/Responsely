// packages/backend/convex/emails.ts
// Fixed import path and inline template to avoid module issues

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";

// Create Resend instance
export const resend = new Resend(components.resend, {
  testMode: false, // Set to true for development
});

// Base email template function (inline to avoid import issues)
const baseEmailTemplate = ({ title, content, buttonText, buttonUrl }: {
  title: string;
  content: string;
  buttonText?: string;
  buttonUrl?: string;
}): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      ${content}
      
      ${buttonText && buttonUrl ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${buttonUrl}" 
           style="background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
          ${buttonText}
        </a>
      </div>
      ` : ''}
      
      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; color: #64748b; font-size: 14px;">
        <p>Need help? Reply to this email or check out our documentation.</p>
        <p style="margin-top: 10px;">
          Best regards,<br>
          The Responsely Team
        </p>
      </div>
    </body>
    </html>
  `;
};

// Welcome email template function (inline to avoid import issues)
const welcomeEmailTemplate = ({ userName, dashboardUrl }: { userName: string; dashboardUrl: string }): string => {
  const content = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2563eb; margin-bottom: 10px;">Welcome to Responsely!</h1>
      <p style="font-size: 18px; color: #666; margin: 0;">Let's get you started with AI-powered customer support</p>
    </div>
    
    <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin: 20px 0;">
      <h2 style="color: #1e293b; margin-top: 0;">Hi ${userName}!</h2>
      <p>Your account has been created successfully. Here's what you can do next:</p>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #2563eb; margin-bottom: 10px;">🚀 Quick Setup (5 minutes)</h3>
        <ul style="color: #475569; margin: 0; padding-left: 20px;">
          <li>Create your first organization</li>
          <li>Upload your knowledge base documents</li>
          <li>Customize your chat widget</li>
          <li>Copy the widget code to your website</li>
        </ul>
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #2563eb; margin-bottom: 10px;">💡 Key Features</h3>
        <ul style="color: #475569; margin: 0; padding-left: 20px;">
          <li><strong>AI-Powered Support:</strong> Automated responses using your knowledge base</li>
          <li><strong>Smart Escalation:</strong> Seamless handoff to human agents when needed</li>
          <li><strong>Real-time Dashboard:</strong> Monitor all conversations in one place</li>
          <li><strong>Analytics:</strong> Track response times and resolution rates</li>
        </ul>
      </div>
    </div>
  `;

  return baseEmailTemplate({
    title: "Welcome to Responsely",
    content,
    buttonText: "Get Started Now →",
    buttonUrl: dashboardUrl
  });
};

// Welcome email for new users
export const sendWelcomeEmail = internalAction({
  args: {
    userEmail: v.string(),
    userName: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      await resend.sendEmail(ctx, {
        from: "responsely@outlook.com",
        to: args.userEmail,
        subject: "Welcome to Responsely! 🎉",
        html: welcomeEmailTemplate({
          userName: args.userName,
          dashboardUrl: "https://responsely.com/dashboard"
        }),
      });
      
      console.log(`Welcome email sent to ${args.userEmail}`);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      throw error;
    }
  },
});