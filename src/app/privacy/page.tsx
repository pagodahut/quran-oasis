import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How HIFZ handles your data.',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="June 13, 2026">
      <p>
        HIFZ (&ldquo;the app,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) helps you read, understand, and
        memorize the Quran. We are committed to protecting your privacy and collecting only what we need
        to provide the service. This policy explains what we collect, why, and the choices you have.
      </p>

      <h2>Privacy at a glance</h2>
      <ul>
        <li><strong>Local-first.</strong> Your memorization progress, bookmarks, and preferences are stored on your own device by default. You can use most of the app without an account.</li>
        <li><strong>We do not sell your data</strong> and we do not use it for advertising.</li>
        <li><strong>You can delete your account and all server-side data at any time</strong> from within the app (Settings → Data &amp; Privacy → Delete Account).</li>
      </ul>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Account information (optional).</strong> If you create an account, our authentication provider (Clerk) stores your email address and name. You can use the app as a guest without this.</li>
        <li><strong>Learning data.</strong> Verses memorized, review schedule, streaks, goals, and settings. Stored locally, and synced to our database only if you are signed in.</li>
        <li><strong>Voice recordings.</strong> When you use recitation or tajweed-feedback features, your microphone audio is recorded and sent to a speech-recognition service to transcribe and score it. Audio is processed to give you feedback; we do not retain recordings beyond what is needed to return your result.</li>
        <li><strong>AI conversations.</strong> When you chat with the AI teacher (&ldquo;Sheikh&rdquo;), your messages — and context such as the verse you are studying, your level, and your first name — are sent to the AI provider to generate a response.</li>
        <li><strong>Notifications.</strong> If you enable push notifications, we store a device push token to deliver them.</li>
        <li><strong>Referral source.</strong> If you arrive via a marketing link, we may store the campaign source on your device to understand how people find the app.</li>
      </ul>

      <h2>Third-party processors</h2>
      <p>We share the minimum necessary data with trusted services that help operate the app:</p>
      <ul>
        <li><strong>Clerk</strong> — account authentication (email, name).</li>
        <li><strong>Anthropic (Claude)</strong> — powers the AI teacher; receives your messages and study context.</li>
        <li><strong>Speech-recognition providers</strong> (such as OpenAI Whisper or our hosted transcription) — receive recitation audio to transcribe it.</li>
        <li><strong>EveryAyah.com</strong> — serves Quran recitation audio; your IP address is visible to it when audio plays, as with any web request.</li>
        <li><strong>Hosting &amp; database</strong> — our infrastructure providers store synced account data.</li>
      </ul>
      <p>
        Each provider processes data under its own terms. We select providers that do not use your
        content to train their models where that option is available to us.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To provide memorization, review scheduling, recitation feedback, and AI guidance.</li>
        <li>To sync your progress across your devices when you are signed in.</li>
        <li>To send notifications you have opted into.</li>
        <li>To diagnose problems and improve the app.</li>
      </ul>

      <h2>Your choices and rights</h2>
      <ul>
        <li><strong>Use without an account.</strong> Guest mode keeps your data on your device.</li>
        <li><strong>Delete your account.</strong> Settings → Data &amp; Privacy → Delete Account removes your authentication account and all associated server-side data permanently.</li>
        <li><strong>Clear local data.</strong> Settings → Data &amp; Privacy → Clear Local Data wipes data stored on this device.</li>
        <li><strong>Control permissions.</strong> Microphone and notifications are only used with your consent and can be revoked in your device settings.</li>
      </ul>

      <h2>Children</h2>
      <p>
        HIFZ is suitable for all ages and contains no objectionable content. We do not knowingly collect
        more personal information than necessary from children. Where an account is created for a child,
        a parent or guardian is responsible for that account.
      </p>

      <h2>Data retention</h2>
      <p>
        We keep synced account data for as long as your account exists. When you delete your account, the
        associated data is removed. Local data persists on your device until you clear it or uninstall.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy as the app evolves. Material changes will be reflected by the date above.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Email <a href="mailto:support@gethifz.com">support@gethifz.com</a>.
      </p>
    </LegalPage>
  );
}
