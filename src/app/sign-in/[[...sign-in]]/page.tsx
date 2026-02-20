'use client';

import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { HifzLogo } from '@/components/brand/HifzLogo';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <Link href="/" className="mb-8">
        <HifzLogo iconSize={40} wordmarkSize={24} animated={false} />
      </Link>

      {/* Sign In Component */}
      <SignIn
        appearance={{
          layout: {
            socialButtonsPlacement: 'top',
            logoPlacement: 'none',
          },
          elements: {
            rootBox: 'w-full max-w-md',
            card: 'bg-night-900/95 backdrop-blur-xl border border-night-800 shadow-xl',
            headerTitle: 'text-night-100',
            headerSubtitle: 'text-night-400',
            formButtonPrimary: 'bg-gold-500 hover:bg-gold-400 text-night-950',
            formFieldLabel: 'text-night-300',
            formFieldInput: 'bg-night-800 border-night-700 text-night-100',
            socialButtonsBlockButton: 'bg-night-800 border-night-700 hover:bg-night-700 text-night-100',
            socialButtonsBlockButtonText: 'text-night-100',
            footerActionLink: 'text-gold-400 hover:text-gold-300',
            badge: 'text-gold-400 bg-night-800/50',
          },
          variables: {
            colorPrimary: '#c9a227',
            colorBackground: '#0f1419',
            colorText: '#e5e5e5',
            colorTextSecondary: '#a3a3a3',
            colorInputBackground: '#1a1f25',
            colorInputText: '#e5e5e5',
            borderRadius: '1rem',
          },
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard"
      />

      {/* Footer */}
      <p className="mt-8 text-night-400 text-sm text-center">
        By continuing, you agree to our Terms of Service
      </p>
    </div>
  );
}
