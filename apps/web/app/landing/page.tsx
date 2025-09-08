import type { Metadata } from 'next';
import { LandingPage } from './landing-page';

export const metadata: Metadata = {
  title: 'AI Customer Service That Actually Works - Responsely',
  description: 'Resolve 90% of customer issues instantly with AI that understands context, speaks naturally, and escalates intelligently.',
  keywords: ['AI customer service', 'customer support', 'chatbot', 'voice agent', 'customer success'],
  openGraph: {
    title: 'AI Customer Service That Actually Works - Responsely',
    description: 'Resolve 90% of customer issues instantly with AI that understands context, speaks naturally, and escalates intelligently.',
    images: ['/illustration.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Customer Service That Actually Works - Responsely',
    description: 'Resolve 90% of customer issues instantly with AI that understands context, speaks naturally, and escalates intelligently.',
    images: ['/illustration.png'],
  },
};

export default function Page() {
  return <LandingPage />;
}