import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from 'next'

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { LOGO_PATH } from "@/constants";

export const metadata: Metadata = {
  title: 'Responsely Widget',
  description: 'AI Customer Support Widget',
  icons: {
    icon: LOGO_PATH,
    shortcut: LOGO_PATH,
    apple: LOGO_PATH,
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
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased widget-app`}
      >
        <Providers>
          <div className="w-screen h-screen">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
