import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'Quran Oasis — Memorize the Quran',
  description: 'AI-powered Quran memorization app with personalized lessons, spaced repetition, and beautiful recitations. Start your journey to becoming a Hafiz today.',
  manifest: '/manifest.json',
  keywords: ['Quran', 'Hifz', 'memorization', 'Islam', 'Muslim', 'Arabic', 'Tajweed', 'spaced repetition'],
  authors: [{ name: 'Quran Oasis' }],
  creator: 'Quran Oasis',
  publisher: 'Quran Oasis',
  openGraph: {
    title: 'Quran Oasis — Memorize the Quran',
    description: 'AI-powered Quran memorization app with personalized lessons and spaced repetition.',
    url: 'https://quranoasis.app',
    siteName: 'Quran Oasis',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quran Oasis — Memorize the Quran',
    description: 'AI-powered Quran memorization app with personalized lessons and spaced repetition.',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Quran Oasis',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f1419' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1419' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#c9a227',
          colorBackground: '#0f1419',
          colorText: '#e5e5e5',
          colorInputBackground: '#1a1f25',
          colorInputText: '#e5e5e5',
          borderRadius: '1rem',
        },
        elements: {
          formButtonPrimary: 'bg-gold-500 hover:bg-gold-400 text-night-950',
          card: 'bg-night-900/90 backdrop-blur-xl border border-night-800',
          headerTitle: 'text-night-100',
          headerSubtitle: 'text-night-400',
          socialButtonsBlockButton: 'bg-night-800 border-night-700 hover:bg-night-700',
          formFieldLabel: 'text-night-300',
          formFieldInput: 'bg-night-800 border-night-700 text-night-100',
          footerActionLink: 'text-gold-400 hover:text-gold-300',
        },
      }}
    >
      <html lang="en" dir="ltr" className="dark">
        <head>
          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/icon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          
          {/* Preconnect to external resources */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://everyayah.com" />
        </head>
        <body className="bg-night-950 text-night-100 antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
