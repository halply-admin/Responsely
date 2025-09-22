# Responsely - AI Customer Support Platform

## Project Overview
Responsely is an AI-powered customer support platform that provides intelligent chat support, voice agents, and team collaboration tools. The platform enables businesses to automate customer service while maintaining high-quality interactions.

## Architecture

### Frontend (Next.js App Router)
- **Location**: `apps/web/`
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **State Management**: Jotai atoms
- **UI Components**: Custom design system in `@workspace/ui`

### Backend (Convex)
- **Location**: `packages/backend/`
- **Platform**: Convex (serverless TypeScript backend)
- **Real-time**: Built-in real-time subscriptions
- **Database**: Convex's built-in database
- **AI Integration**: OpenAI GPT-4, Google AI, AWS integrations

### Widget (Embeddable Chat)
- **Location**: `apps/widget/`
- **Type**: Embeddable JavaScript widget for customer websites
- **Features**: Chat interface, voice calls (Vapi integration), screenshot capture

### Shared Packages
- `packages/ui/` - Shared UI components and design system
- `packages/typescript-config/` - Shared TypeScript configurations
- `packages/eslint-config/` - Shared ESLint configurations

## Key Features

### 1. AI Customer Support
- **AI Agent**: Powered by GPT-4o-mini and Gemini models
- **Knowledge Base**: Vector search with RAG (Retrieval-Augmented Generation)
- **Smart Escalation**: Automatic detection when human support is needed
- **Tools**: Search knowledge base, escalate conversations, resolve tickets

### 2. Voice Integration (Vapi)
- **Web Voice Calls**: In-browser voice conversations
- **Phone System**: Dedicated business phone numbers
- **AI Voice Agent**: Natural language phone support
- **Outbound Calls**: Automated customer outreach

### 3. Team Collaboration
- **Multi-tenant**: Organization-based access control
- **Real-time Dashboard**: Live conversation monitoring
- **Status Management**: Unresolved → Escalated → Resolved workflow
- **Email Notifications**: Escalation alerts and welcome emails

### 4. Widget Customization
- **Appearance**: Custom colors, themes (light/dark/auto), positioning
- **Greet Messages**: Customizable welcome messages
- **Suggestions**: Default conversation starters
- **Voice Integration**: Optional voice call button

## Technology Stack

### Core Technologies
- **TypeScript**: Strict typing throughout
- **pnpm**: Package manager with workspaces
- **Turborepo**: Monorepo build system
- **Convex**: Backend-as-a-Service
- **Clerk**: Authentication and user management
- **Tailwind CSS**: Utility-first styling

### AI & ML
- **OpenAI**: GPT-4o-mini for chat support
- **Google AI**: Gemini models for advanced reasoning
- **Convex Vector Search**: For knowledge base RAG
- **AI SDK**: Unified AI provider interface

### Communication
- **Vapi**: Voice AI platform integration
- **Resend**: Email delivery service
- **Real-time**: Convex subscriptions for live updates

### Monitoring & Analytics
- **Sentry**: Error tracking and performance monitoring
- **AWS Secrets Manager**: Secure credential storage

## Coding Standards

### TypeScript Best Practices
- Use strict mode with proper type definitions
- Prefer `type` over `interface` for object shapes
- Use const assertions for literal types
- Avoid `any`, use `unknown` for dynamic content
- Proper error handling with typed exceptions

### React/Next.js Patterns
- Functional components with hooks
- Server Components by default, Client Components when needed
- Proper error boundaries and loading states
- Next.js App Router conventions (`page.tsx`, `layout.tsx`)
- Custom hooks for reusable logic

### Convex Backend Patterns
- Separate `queries` (read), `mutations` (write), `actions` (external APIs)
- Use `v.` validators for all function arguments
- Implement proper error handling in actions
- Use internal functions for cross-function calls
- Real-time subscriptions for live data

### UI/Component Guidelines
- Consistent component API patterns
- Proper prop typing with TypeScript
- Responsive design with Tailwind breakpoints
- Accessible components with ARIA labels
- Design system consistency via `@workspace/ui`

## Review Focus Areas

### Security
- **Authentication**: Clerk integration and session management
- **API Security**: Convex function permissions and validation
- **Secrets Management**: Proper handling of API keys (AWS Secrets Manager)
- **Input Validation**: Zod schemas for all user inputs
- **XSS Prevention**: Proper content sanitization

### Performance
- **Bundle Optimization**: Next.js optimization and code splitting
- **Database Queries**: Efficient Convex query patterns
- **Real-time Updates**: Optimized subscription patterns
- **AI Response Times**: Efficient knowledge base search
- **Widget Performance**: Minimal impact on host websites

### AI/ML Specific
- **Prompt Engineering**: Effective AI agent prompts and context
- **Knowledge Base**: RAG implementation and vector search
- **Model Selection**: Appropriate model choice for different tasks
- **Error Handling**: Graceful AI failure modes
- **Cost Optimization**: Efficient token usage

### Customer Experience
- **Widget Integration**: Seamless embedding experience
- **Voice Quality**: Clear audio and low latency
- **Mobile Responsiveness**: Consistent experience across devices
- **Accessibility**: WCAG compliance for chat interfaces
- **Loading States**: Smooth transitions and feedback

## Common Patterns

### Convex Functions
```typescript
// Query pattern
export const getSomething = query({
  args: { id: v.id("table") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutation pattern  
export const updateSomething = mutation({
  args: { id: v.id("table"), data: v.object({}) },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, args.data);
  },
});
```

### React Component Pattern
```typescript
interface ComponentProps {
  prop: string;
}

export const Component = ({ prop }: ComponentProps) => {
  // Component logic
  return <div>{prop}</div>;
};
```

### AI Agent Tools
```typescript
export const toolName = createTool({
  description: "Clear description of what the tool does",
  args: z.object({ param: z.string() }),
  handler: async (ctx) => {
    // Tool implementation
  },
});
```

## Environment & Configuration
- **Development**: Local Convex dev environment
- **Production**: Convex cloud deployment
- **Secrets**: AWS Secrets Manager for sensitive data
- **Environment Variables**: Next.js environment configuration
- **Build**: Turborepo for monorepo builds

This is a production SaaS application serving customers with mission-critical support needs. Code quality, security, and reliability are paramount.