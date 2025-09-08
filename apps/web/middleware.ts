// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/",  
    "/landing",
    "/sign-in(.*)",
    "/sign-up(.*)",
])

const isOrgFreeRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/org-selection(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  // If user is authenticated and tries to access landing, redirect to app
  if (userId && (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/landing')) {
    return NextResponse.redirect(new URL('/conversations', req.url));
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  if (userId && !orgId && !isOrgFreeRoute(req)) {
    const searchParams = new URLSearchParams({ redirectUrl: req.url });

    const orgSelection = new URL(
      `/org-selection?${searchParams.toString()}`,
      req.url,
    );

    return NextResponse.redirect(orgSelection);
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}