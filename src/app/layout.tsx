// Force dynamic rendering for all pages - Clerk needs runtime context
export const dynamic = 'force-dynamic';

import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import { SyncProvider, SyncIndicator } from '@/components/SyncProvider';
import { ToastProvider } from '@/components/Toast';
import InstallPrompt from '@/components/InstallPrompt';
import OfflineIndicator from '@/components/OfflineIndicator';
import SkipToContent from '@/components/SkipToContent';
import { fontVariables } from '@/lib/fonts';
import JsonLd from '@/components/JsonLd';
import { 
  SITE_URL, 
  SITE_NAME, 
  defaultMeta, 
  organizationSchema, 
  webApplicationSchema, 
  courseSchema 
} from '@/lib/seo';
import './globals.css';

// Check if Clerk is configured
const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultMeta.title,
    template: '%s | HIFZ',
  },
  description: defaultMeta.description,
  manifest: '/manifest.json',
  keywords: defaultMeta.keywords,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: defaultMeta.title,
    description: defaultMeta.description,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'HIFZ - Memorize the Quran with AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultMeta.title,
    description: defaultMeta.description,
    images: ['/twitter-image'],
    creator: '@hifzapp',
  },
  alternates: {
    canonical: SITE_URL,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  category: 'education',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true, // WCAG 2.1 AA: Allow zooming up to 200%+
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f1419' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1419' },
  ],
};

// Clerk appearance config
const clerkAppearance = {
  baseTheme: undefined,
  variables: {
    colorPrimary: '#c9a227',
    colorBackground: '#0f1419',
    colorText: '#e5e5e5',
    colorTextSecondary: '#a3a3a3',
    colorInputBackground: '#1a1f25',
    colorInputText: '#e5e5e5',
    borderRadius: '1rem',
  },
  elements: {
    // General
    rootBox: 'text-night-100',
    card: 'bg-night-900/95 backdrop-blur-xl border border-night-800',
    
    // Headers
    headerTitle: 'text-night-100',
    headerSubtitle: 'text-night-400',
    
    // Form elements
    formButtonPrimary: 'bg-gold-500 hover:bg-gold-400 text-night-950',
    formFieldLabel: 'text-night-300',
    formFieldInput: 'bg-night-800 border-night-700 text-night-100',
    
    // Social buttons (Apple/Google)
    socialButtonsBlockButton: 'bg-night-800 border-night-700 hover:bg-night-700 text-night-100',
    socialButtonsBlockButtonText: 'text-night-100',
    socialButtonsBlockButtonArrow: 'text-night-100',
    
    // User button dropdown menu
    userButtonPopoverCard: 'bg-night-900/95 backdrop-blur-xl border border-night-800',
    userButtonPopoverMain: 'text-night-100',
    userButtonPopoverActions: 'text-night-100',
    userButtonPopoverActionButton: 'text-night-100 hover:bg-night-800',
    userButtonPopoverActionButtonText: 'text-night-100',
    userButtonPopoverActionButtonIcon: 'text-night-300',
    userButtonPopoverFooter: 'text-night-400',
    userPreviewMainIdentifier: 'text-night-100',
    userPreviewSecondaryIdentifier: 'text-night-400',
    
    // Menu items
    menuButton: 'text-night-100',
    menuItem: 'text-night-100 hover:bg-night-800',
    menuList: 'bg-night-900 border-night-800',
    
    // Footer
    footer: 'text-night-400',
    footerAction: 'text-night-400',
    footerActionLink: 'text-gold-400 hover:text-gold-300',
    footerPages: 'text-night-400',
    footerPagesLink: 'text-night-400 hover:text-night-300',
    
    // Badge (Development mode)
    badge: 'text-gold-400 bg-night-800/50',
    
    // Identifiers
    identityPreviewText: 'text-night-100',
    identityPreviewEditButton: 'text-gold-400',
  },
};

// Structured data for the site
const structuredData = [organizationSchema, webApplicationSchema, courseSchema];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = (
    <html lang="en" dir="ltr" className={`dark ${fontVariables}`} data-scroll-behavior="smooth">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://everyayah.com" />
        
        {/* Structured Data (JSON-LD) */}
        <JsonLd data={structuredData} />
      </head>
      <body className="bg-night-950 text-night-100 antialiased standalone-tweaks">
        <SkipToContent />
        <ToastProvider>
          <SyncProvider>
            <ServiceWorkerRegistration />
            <OfflineIndicator />
            <main id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </main>
            <InstallPrompt />
            <SyncIndicator />
          </SyncProvider>
        </ToastProvider>
      </body>
    </html>
  );

  // Only wrap with ClerkProvider if configured
  if (clerkPubKey) {
    return (
      <ClerkProvider appearance={clerkAppearance}>
        {content}
      </ClerkProvider>
    );
  }

  return content;
}
