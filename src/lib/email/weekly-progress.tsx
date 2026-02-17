import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Img,
  Preview,
  Font,
} from '@react-email/components';

export interface WeeklyProgressData {
  userName: string;
  versesReviewed: number;
  currentStreak: number;
  averageAccuracy: number;
  accuracyTrend: 'up' | 'down' | 'stable';
  surahsPracticed: string[];
  totalMinutes: number;
  unsubscribeUrl: string;
  appUrl: string;
}

function getEncouragementMessage(data: WeeklyProgressData): string {
  if (data.versesReviewed === 0) {
    return "We missed you this week! Even a few minutes of review keeps your memorization strong. Come back and pick up where you left off — every ayah counts.";
  }
  if (data.currentStreak >= 7) {
    return `MashaAllah! ${data.currentStreak}-day streak! Your consistency is truly inspiring. The Prophet ﷺ said the most beloved deeds to Allah are the most consistent, even if small.`;
  }
  if (data.averageAccuracy >= 90) {
    return "SubhanAllah, your accuracy is outstanding! Your dedication to precision honors every letter of the Quran. Keep going — you're building something beautiful.";
  }
  if (data.accuracyTrend === 'up') {
    return "Your accuracy is improving — that's the fruit of consistent review! Keep this momentum going and watch your memorization solidify.";
  }
  if (data.versesReviewed >= 50) {
    return `${data.versesReviewed} verses reviewed this week — that's incredible effort! You're making real progress on your Hifz journey.`;
  }
  return "Alhamdulillah for another week of Quran. Every verse you review is a light on the Day of Judgment. Keep going, you're doing great!";
}

export function WeeklyProgressEmail(data: WeeklyProgressData) {
  const encouragement = getEncouragementMessage(data);
  const trendEmoji = data.accuracyTrend === 'up' ? '📈' : data.accuracyTrend === 'down' ? '📉' : '➡️';

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Amiri"
          fallbackFontFamily="serif"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Amiri&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{`Your weekly Hifz progress: ${data.versesReviewed} verses reviewed${data.currentStreak > 0 ? ` • ${data.currentStreak}-day streak` : ''}`}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Text style={styles.logo}>☪ HIFZ</Text>
            <Text style={styles.subtitle}>Weekly Progress Report</Text>
          </Section>

          {/* Greeting */}
          <Section style={styles.section}>
            <Text style={styles.greeting}>
              Assalamu Alaikum{data.userName ? `, ${data.userName}` : ''}! 👋
            </Text>
            <Text style={styles.text}>
              Here&apos;s your Hifz progress for the past week:
            </Text>
          </Section>

          {/* Stats Grid */}
          <Section style={styles.statsContainer}>
            <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' as const }}>
              <tbody>
                <tr>
                  <td style={styles.statCell}>
                    <Text style={styles.statNumber}>{data.versesReviewed}</Text>
                    <Text style={styles.statLabel}>Verses Reviewed</Text>
                  </td>
                  <td style={styles.statCell}>
                    <Text style={styles.statNumber}>{data.currentStreak}🔥</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                  </td>
                </tr>
                <tr>
                  <td style={styles.statCell}>
                    <Text style={styles.statNumber}>{data.averageAccuracy}% {trendEmoji}</Text>
                    <Text style={styles.statLabel}>Avg Accuracy</Text>
                  </td>
                  <td style={styles.statCell}>
                    <Text style={styles.statNumber}>{data.totalMinutes}</Text>
                    <Text style={styles.statLabel}>Minutes Studied</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Surahs Practiced */}
          {data.surahsPracticed.length > 0 && (
            <Section style={styles.section}>
              <Text style={styles.sectionTitle}>📖 Surahs Practiced</Text>
              <Text style={styles.surahList}>
                {data.surahsPracticed.join(' • ')}
              </Text>
            </Section>
          )}

          <Hr style={styles.divider} />

          {/* Encouragement */}
          <Section style={styles.encouragementSection}>
            <Text style={styles.encouragementText}>
              {encouragement}
            </Text>
          </Section>

          {/* CTA */}
          <Section style={styles.ctaSection}>
            <Button href={data.appUrl} style={styles.ctaButton}>
              Continue Your Journey →
            </Button>
          </Section>

          <Hr style={styles.divider} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              You&apos;re receiving this because you have email notifications enabled in HIFZ.
            </Text>
            <Text style={styles.footerText}>
              <a href={data.unsubscribeUrl} style={styles.unsubscribeLink}>
                Unsubscribe from weekly progress emails
              </a>
            </Text>
            <Text style={styles.bismillah} dir="rtl" lang="ar">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#0a0a0f',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    margin: '0',
    padding: '0',
  } as React.CSSProperties,
  container: {
    maxWidth: '560px',
    margin: '0 auto',
    padding: '20px',
  } as React.CSSProperties,
  header: {
    textAlign: 'center' as const,
    padding: '32px 0 16px',
  } as React.CSSProperties,
  logo: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#d4a647',
    letterSpacing: '4px',
    margin: '0',
  } as React.CSSProperties,
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '4px 0 0',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  } as React.CSSProperties,
  section: {
    padding: '16px 0',
  } as React.CSSProperties,
  greeting: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#e5e7eb',
    margin: '0 0 8px',
  } as React.CSSProperties,
  text: {
    fontSize: '15px',
    color: '#9ca3af',
    lineHeight: '1.6',
    margin: '0',
  } as React.CSSProperties,
  statsContainer: {
    padding: '16px 0',
  } as React.CSSProperties,
  statCell: {
    textAlign: 'center' as const,
    padding: '16px 8px',
    backgroundColor: '#141420',
    borderRadius: '12px',
    border: '1px solid #1f1f2e',
    width: '50%',
  } as React.CSSProperties,
  statNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#d4a647',
    margin: '0',
  } as React.CSSProperties,
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '4px 0 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#e5e7eb',
    margin: '0 0 8px',
  } as React.CSSProperties,
  surahList: {
    fontSize: '14px',
    color: '#d4a647',
    lineHeight: '1.8',
    margin: '0',
  } as React.CSSProperties,
  divider: {
    borderColor: '#1f1f2e',
    margin: '24px 0',
  } as React.CSSProperties,
  encouragementSection: {
    padding: '20px',
    backgroundColor: '#141420',
    borderRadius: '12px',
    border: '1px solid #1f1f2e',
    borderLeft: '4px solid #d4a647',
  } as React.CSSProperties,
  encouragementText: {
    fontSize: '15px',
    color: '#d1d5db',
    lineHeight: '1.7',
    margin: '0',
    fontStyle: 'italic' as const,
  } as React.CSSProperties,
  ctaSection: {
    textAlign: 'center' as const,
    padding: '24px 0',
  } as React.CSSProperties,
  ctaButton: {
    backgroundColor: '#d4a647',
    color: '#0a0a0f',
    padding: '14px 32px',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    display: 'inline-block',
  } as React.CSSProperties,
  footer: {
    textAlign: 'center' as const,
    padding: '16px 0',
  } as React.CSSProperties,
  footerText: {
    fontSize: '12px',
    color: '#4b5563',
    margin: '4px 0',
  } as React.CSSProperties,
  unsubscribeLink: {
    color: '#6b7280',
    textDecoration: 'underline',
  } as React.CSSProperties,
  bismillah: {
    fontFamily: 'Amiri, serif',
    fontSize: '18px',
    color: '#d4a647',
    opacity: 0.5,
    margin: '16px 0 0',
  } as React.CSSProperties,
};

export default WeeklyProgressEmail;
