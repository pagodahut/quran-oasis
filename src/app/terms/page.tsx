import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms for using HIFZ.',
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="June 13, 2026">
      <p>
        Welcome to HIFZ. By using the app you agree to these terms. Please read them. If you do not agree,
        please do not use the app.
      </p>

      <h2>The service</h2>
      <p>
        HIFZ is an educational tool to help you read, understand, and memorize the Quran, with recitation
        feedback, spaced-repetition review, and AI-assisted guidance. It is a study aid and is not a
        substitute for learning from a qualified teacher (talaqqi), which remains the authentic way to
        receive the Quran with correct tajweed and an unbroken chain.
      </p>

      <h2>Religious content</h2>
      <p>
        We take the accuracy of the Quranic text seriously and source it from established editions.
        Translations, tafsir summaries, hadith, and learning material are provided for benefit and
        convenience; for rulings and detailed understanding, please consult qualified scholars. If you
        ever notice an error in the sacred text, please report it immediately to{' '}
        <a href="mailto:support@gethifz.com">support@gethifz.com</a> so we can correct it.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>You are responsible for activity under your account and for keeping your login secure.</li>
        <li>You may use the app as a guest without an account, with data stored on your device.</li>
        <li>You may delete your account at any time from within the app.</li>
      </ul>

      <h2>Acceptable use</h2>
      <ul>
        <li>Use the app lawfully and respectfully, in keeping with the sanctity of its subject.</li>
        <li>Do not attempt to disrupt, abuse, reverse-engineer, or overload the service or its AI features.</li>
        <li>Do not use the app to generate or distribute harmful, unlawful, or disrespectful content.</li>
      </ul>

      <h2>AI features</h2>
      <p>
        The AI teacher is a helpful assistant but can make mistakes. Do not rely on it as a sole source for
        religious rulings or for the precise text of the Quran. Verify important matters with authentic
        sources and qualified teachers.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The Quranic text is the word of Allah and belongs to no one. The app&rsquo;s software, design, and
        original content are owned by HIFZ. Quran translations and recitations are used courtesy of their
        respective rights holders and remain their property.
      </p>

      <h2>Subscriptions</h2>
      <p>
        Some features may be offered as part of a paid subscription in the future. Any such purchases made
        through a mobile app store are governed by that store&rsquo;s terms, and pricing and renewal details
        will be shown clearly before purchase.
      </p>

      <h2>Disclaimer &amp; limitation of liability</h2>
      <p>
        The app is provided &ldquo;as is,&rdquo; without warranties of any kind. To the maximum extent
        permitted by law, HIFZ is not liable for any indirect or consequential damages arising from your use
        of the app.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms as the app evolves. Continued use after changes constitutes acceptance.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email <a href="mailto:support@gethifz.com">support@gethifz.com</a>.
      </p>
    </LegalPage>
  );
}
