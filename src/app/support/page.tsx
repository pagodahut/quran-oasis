import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Help & Support',
  description: 'Get help with HIFZ.',
};

export default function SupportPage() {
  return (
    <LegalPage title="Help & Support" updated="June 13, 2026">
      <p>
        We&rsquo;re here to help you on your journey of memorizing the Quran. Most questions are answered
        below — if you need more, reach out any time.
      </p>

      <h2>Contact us</h2>
      <p>
        Email <a href="mailto:support@gethifz.com">support@gethifz.com</a> and we&rsquo;ll get back to you.
        For bug reports, please include your device and a short description of what happened.
      </p>

      <h2>Getting started</h2>
      <ul>
        <li><strong>Begin memorizing:</strong> open the Home tab and tap &ldquo;Continue&rdquo; (or &ldquo;Begin Your Journey&rdquo; if you&rsquo;re new) to start with Al-Fatihah or any surah you choose.</li>
        <li><strong>The method:</strong> each verse guides you through listening, reading along, repetition, and recall from memory — the time-tested way hifz is taught.</li>
        <li><strong>Review:</strong> the Practice tab schedules your memorized verses for review using spaced repetition (Sabaq, Sabqi, Manzil), so you don&rsquo;t forget what you&rsquo;ve learned.</li>
      </ul>

      <h2>Recitation &amp; microphone</h2>
      <ul>
        <li>Recitation feedback needs microphone permission. If it isn&rsquo;t working, check that you&rsquo;ve allowed microphone access in your device settings.</li>
        <li>Voice features work best with a stable internet connection. If recognition is unavailable, you can always continue in manual mode.</li>
      </ul>

      <h2>Your data</h2>
      <ul>
        <li><strong>Guest mode:</strong> your progress is saved on your device. Create a free account to sync across devices.</li>
        <li><strong>Delete account:</strong> Settings → Data &amp; Privacy → Delete Account removes your account and all server-side data.</li>
        <li><strong>Privacy:</strong> see our <a href="/privacy">Privacy Policy</a> for how data is handled.</li>
      </ul>

      <h2>A note on learning</h2>
      <p>
        This app is a companion to your hifz, not a replacement for a teacher. Wherever you can, pair it with
        a qualified teacher or a hifz circle who can correct your recitation and connect you to the living
        chain of the Quran. May Allah make it easy for you and accept it from you.
      </p>
    </LegalPage>
  );
}
