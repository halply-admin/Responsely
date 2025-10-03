import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from 'next'

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@workspace/ui/components/sonner";

export const metadata: Metadata = {
  title: 'Responsely - AI Customer Support',
  description: 'Intelligent AI customer support with voice agents, smart escalation, and team collaboration.',
  icons: {
    icon: '/responsely-logo.png',
    shortcut: '/responsely-logo.png',
    apple: '/responsely-logo.png',
  },
};

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#3C82F6"
            }
          }}
        >
          <Providers>
            <Toaster />
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
