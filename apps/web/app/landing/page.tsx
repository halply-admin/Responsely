import type { Metadata } from 'next';
import { LandingPage } from './landing-page';

export const metadata: Metadata = {
  title: 'AI Customer Service that saves you time - Responsely',
  description: 'AI Customer Service that saves you time. Affordable AI support for small businesses. Stop answering the same questions over and over.',
  keywords: ['AI customer service', 'small business support', 'affordable AI', 'time saving', 'customer support', 'chatbot', 'voice agent'],
  openGraph: {
    title: 'AI Customer Service that saves you time - Responsely',
    description: 'AI Customer Service that saves you time. Affordable AI support for small businesses. Stop answering the same questions over and over.',
    images: ['/illustration.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Customer Service that saves you time - Responsely',
    description: 'AI Customer Service that saves you time. Affordable AI support for small businesses. Stop answering the same questions over and over.',
    images: ['/illustration.png'],
  },
};

export default function Page() {
  return <LandingPage />;
}