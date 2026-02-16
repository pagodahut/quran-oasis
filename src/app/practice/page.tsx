'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import SheikhButton from '@/components/ui/SheikhButton';
import { SheikhCardSkeleton } from '@/components/SheikhErrorBoundary';
import SheikhReviewSession from '@/components/SheikhReviewSession';
import { useSheikh } from '@/contexts/SheikhContext';
import { loadUserProfile, isCalibrationComplete } from '@/lib/user-profile-sync';
import { srs, srsStateToDueRefs, type ReviewQuality } from '@/lib/spaced-repetition';
import { enrichSRSRefs } from '@/lib/ayah-service';
import type { ReviewType, SessionResult, ReviewAyah } from '@/hooks/useSheikhReview';

// ─── Types ─────────────────────────────────────────────────────────

type ViewState = 'dashboard' | 'review' | 'add-ayahs';

// ─── Practice Page ─────────────────────────────────────────────────

export default function PracticePage() {
  const { user } = useUser();
  const router = useRouter();
  const { setPageContext, userLevel, setUserLevel } = useSheikh();

  const [view, setView] = useState<ViewState>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [dueCount, setDueCount] = useState({ sabaq: 0, sabqi: 0, manzil: 0, total: 0 });
  const [stats, setStats] = useState(srs.getStats());

  // Add ayahs form state
  const [addSurah, setAddSurah] = useState('');
  const [addStart, setAddStart] = useState('');
  const [addEnd, setAddEnd] = useState('');
  
  // Review ayahs (enriched with full data)
  const [reviewAyahs, setReviewAyahs] = useState<{
    sabaq: ReviewAyah[];
    sabqi: ReviewAyah[];
    manzil: ReviewAyah[];
  } | null>(null);
  const [loadingReview, setLoadingReview] = useState(false);

  // Load profile and SRS state
  useEffect(() => {
    setPageContext({ page: 'practice' });

    async function init() {
      // Check calibration
      const calibrated = await isCalibrationComplete();
      if (!calibrated) {
        router.push('/onboarding/welcome');
        return;
      }

      // Load user level from profile
      const profile = await loadUserProfile();
      if (profile?.level) {
        setUserLevel(profile.level);
      }

      // Refresh SRS counts
      srs.reload();
      setDueCount(srs.getDueCount());
      setStats(srs.getStats());
      setIsLoading(false);
    }

    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshCounts = useCallback(() => {
    setDueCount(srs.getDueCount());
    setStats(srs.getStats());
  }, []);

  // Handle review session completion
  const handleReviewComplete = useCallback(
    (type: ReviewType, result: SessionResult) => {
      // Record results back to SRS
      // The session result gives us overall performance — map to quality
      const qualityMap: Record<string, ReviewQuality> = {
        excellent: 'easy',
        good: 'good',
        needs_work: 'hard',
      };
      const quality = qualityMap[result.overallPerformance] || 'good';

      // Get the due ayahs for this type to know which ones were reviewed
      const due = srs.getDueAyahs();
      const reviewed = due[type].slice(0, result.ayahsCovered);

      for (const ayah of reviewed) {
        srs.recordReview(ayah.surahNumber, ayah.ayahNumber, quality);
      }

      refreshCounts();
    },
    [refreshCounts]
  );

  const handleReviewExit = useCallback(() => {
    setView('dashboard');
    setReviewAyahs(null);
    refreshCounts();
  }, [refreshCounts]);
  
  const startReview = useCallback(async () => {
    setLoadingReview(true);
    try {
      const due = srs.getDueAyahs();
      const refs = srsStateToDueRefs(due);
      
      const [sabaq, sabqi, manzil] = await Promise.all([
        enrichSRSRefs(refs.sabaq),
        enrichSRSRefs(refs.sabqi),
        enrichSRSRefs(refs.manzil),
      ]);
      
      setReviewAyahs({ sabaq, sabqi, manzil });
      setView('review');
    } catch (error) {
      console.error('Failed to load review ayahs:', error);
    } finally {
      setLoadingReview(false);
    }
  }, []);

  const handleAddAyahs = () => {
    const surah = parseInt(addSurah);
    const start = parseInt(addStart);
    const end = parseInt(addEnd || addStart);

    if (!surah || !start || surah < 1 || surah > 114 || start < 1) return;

    srs.addAyahs(surah, start, end);
    setAddSurah('');
    setAddStart('');
    setAddEnd('');
    setView('dashboard');
    refreshCounts();
  };

  // ─── Review View ─────────────────────────────────────────────────

  if (view === 'review' && reviewAyahs) {
    return (
      <SheikhReviewSession
        sabaqAyahs={reviewAyahs.sabaq}
        sabqiAyahs={reviewAyahs.sabqi}
        manzilAyahs={reviewAyahs.manzil}
        userLevel={userLevel}
        userName={user?.firstName || undefined}
        onComplete={handleReviewComplete}
        onExit={handleReviewExit}
      />
    );
  }

  // ─── Add Ayahs View ──────────────────────────────────────────────

  if (view === 'add-ayahs') {
    return (
      <div className="practice practice--add">
        <div className="practice__add-header">
          <SheikhButton variant="ghost" size="sm" onClick={() => setView('dashboard')}>
            ← Back
          </SheikhButton>
          <h2 className="practice__add-title">Add Ayahs to Memorize</h2>
        </div>

        <div className="practice__add-form">
          <div className="practice__add-sheikh">
            <div className="practice__add-sheikh-avatar">🕌</div>
            <p className="practice__add-sheikh-msg">
              Which ayahs are you working on? I&apos;ll schedule them into your daily review cycle.
            </p>
          </div>

          <div className="practice__add-field">
            <label>Surah Number (1-114)</label>
            <input
              type="number"
              min="1"
              max="114"
              value={addSurah}
              onChange={(e) => setAddSurah(e.target.value)}
              placeholder="e.g. 67 (Al-Mulk)"
              className="practice__add-input"
            />
          </div>

          <div className="practice__add-row">
            <div className="practice__add-field" style={{ flex: 1 }}>
              <label>Start Ayah</label>
              <input
                type="number"
                min="1"
                value={addStart}
                onChange={(e) => setAddStart(e.target.value)}
                placeholder="1"
                className="practice__add-input"
              />
            </div>
            <div className="practice__add-field" style={{ flex: 1 }}>
              <label>End Ayah</label>
              <input
                type="number"
                min="1"
                value={addEnd}
                onChange={(e) => setAddEnd(e.target.value)}
                placeholder="(same)"
                className="practice__add-input"
              />
            </div>
          </div>

          <SheikhButton
            variant="primary"
            size="lg"
            onClick={handleAddAyahs}
            disabled={!addSurah || !addStart}
            style={{ width: '100%', marginTop: 8 }}
          >
            Add to Review Queue
          </SheikhButton>
        </div>

        {/* Quick Add Presets */}
        <div className="practice__presets">
          <p className="practice__presets-label">Quick add popular surahs:</p>
          <div className="practice__presets-grid">
            {[
              { name: 'Al-Fatiha', surah: 1, start: 1, end: 7 },
              { name: 'Al-Ikhlas', surah: 112, start: 1, end: 4 },
              { name: 'Al-Falaq', surah: 113, start: 1, end: 5 },
              { name: 'An-Nas', surah: 114, start: 1, end: 6 },
              { name: 'Al-Mulk', surah: 67, start: 1, end: 30 },
              { name: 'Ya-Sin', surah: 36, start: 1, end: 83 },
            ].map((preset) => (
              <SheikhButton
                key={preset.surah}
                variant="chip"
                onClick={() => {
                  srs.addAyahs(preset.surah, preset.start, preset.end);
                  refreshCounts();
                  setView('dashboard');
                }}
              >
                {preset.name}
              </SheikhButton>
            ))}
          </div>
        </div>

        <style jsx>{`${addStyles}`}</style>
      </div>
    );
  }

  // ─── Dashboard View ──────────────────────────────────────────────

  return (
    <div className="practice">
      {/* Header */}
      <div className="practice__header">
        <div>
          <h1 className="practice__title">
            {getGreeting()}, {user?.firstName || 'Student'}
          </h1>
          <p className="practice__subtitle">
            {dueCount.total > 0
              ? `${dueCount.total} ayah${dueCount.total !== 1 ? 's' : ''} waiting for review`
              : 'All caught up! Add more ayahs to memorize.'}
          </p>
        </div>
        <div className="practice__streak">
          <span className="practice__streak-num">{stats.longestStreak}</span>
          <span className="practice__streak-label">day streak</span>
        </div>
      </div>

      {isLoading ? (
        <div style={{ padding: '0 20px' }}>
          <SheikhCardSkeleton />
          <SheikhCardSkeleton />
        </div>
      ) : (
        <>
          {/* Review Cards */}
          {dueCount.total > 0 && (
            <div className="practice__section">
              <h2 className="practice__section-title">Today&apos;s Review</h2>
              <div className="practice__review-cards">
                {dueCount.sabaq > 0 && (
                  <ReviewCard
                    emoji="🌱"
                    label="Sabaq"
                    description="New lesson review"
                    count={dueCount.sabaq}
                    color="#2dd496"
                  />
                )}
                {dueCount.sabqi > 0 && (
                  <ReviewCard
                    emoji="🌿"
                    label="Sabqi"
                    description="Recent review"
                    count={dueCount.sabqi}
                    color="#40b8e0"
                  />
                )}
                {dueCount.manzil > 0 && (
                  <ReviewCard
                    emoji="🌳"
                    label="Manzil"
                    description="Long-term review"
                    count={dueCount.manzil}
                    color="#d4a844"
                  />
                )}
              </div>

              <SheikhButton
                variant="primary"
                size="lg"
                breathe
                onClick={startReview}
                disabled={loadingReview}
                style={{ width: '100%', marginTop: 16 }}
              >
                {loadingReview ? 'Loading...' : `Start Review Session (${dueCount.total} ayahs)`}
              </SheikhButton>
            </div>
          )}

          {/* Stats */}
          <div className="practice__section">
            <h2 className="practice__section-title">Your Progress</h2>
            <div className="practice__stats-grid">
              <StatCard label="Total Ayahs" value={stats.totalAyahs} icon="📖" />
              <StatCard label="In Manzil" value={stats.manzilCount} icon="🌳" />
              <StatCard label="Accuracy" value={`${Math.round(stats.averageAccuracy * 100)}%`} icon="🎯" />
              <StatCard label="Days Active" value={stats.daysSinceStart} icon="📅" />
            </div>
          </div>

          {/* Add More */}
          <div className="practice__section">
            <SheikhButton
              variant="secondary"
              size="lg"
              onClick={() => setView('add-ayahs')}
              style={{ width: '100%' }}
            >
              + Add Ayahs to Memorize
            </SheikhButton>
          </div>

          {/* Sheikh Nudge */}
          {dueCount.total === 0 && stats.totalAyahs > 0 && (
            <div className="practice__sheikh-nudge">
              <div className="practice__sheikh-nudge-avatar">🕌</div>
              <p>
                Masha&apos;Allah, you&apos;re all caught up! Consider adding new ayahs
                or reviewing your manzil for extra retention.
              </p>
            </div>
          )}

          {stats.totalAyahs === 0 && (
            <div className="practice__empty-state">
              <div className="practice__empty-icon">📖</div>
              <h3>Start Your Memorization Journey</h3>
              <p>
                Add the ayahs you&apos;re working on, and Sheikh HIFZ will schedule
                daily reviews using proven spaced repetition techniques.
              </p>
              <SheikhButton
                variant="primary"
                size="lg"
                breathe
                onClick={() => setView('add-ayahs')}
                style={{ marginTop: 16 }}
              >
                Add Your First Ayahs
              </SheikhButton>
            </div>
          )}
        </>
      )}

      <style jsx>{`${dashboardStyles}`}</style>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function ReviewCard({ emoji, label, description, count, color }: {
  emoji: string; label: string; description: string; count: number; color: string;
}) {
  return (
    <div className="review-card">
      <div className="review-card__left">
        <span className="review-card__emoji">{emoji}</span>
        <div>
          <span className="review-card__label" style={{ color }}>{label}</span>
          <span className="review-card__desc">{description}</span>
        </div>
      </div>
      <div className="review-card__count">
        <span className="review-card__num" style={{ color }}>{count}</span>
        <span className="review-card__unit">due</span>
      </div>

      <style jsx>{`
        .review-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: linear-gradient(135deg, #0c1f1a, #132e25);
          border: 1px solid rgba(45, 212, 150, 0.08);
          border-radius: 14px;
        }
        .review-card__left { display: flex; align-items: center; gap: 12px; }
        .review-card__emoji { font-size: 24px; }
        .review-card__label { display: block; font-size: 14px; font-weight: 600; }
        .review-card__desc { display: block; font-size: 11px; color: #6bb89a; margin-top: 1px; }
        .review-card__count { text-align: center; }
        .review-card__num { display: block; font-size: 20px; font-weight: 700; }
        .review-card__unit { font-size: 10px; color: #4a7a66; text-transform: uppercase; }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="stat-card">
      <span className="stat-card__icon">{icon}</span>
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>

      <style jsx>{`
        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 16px 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(45, 212, 150, 0.06);
          border-radius: 14px;
        }
        .stat-card__icon { font-size: 20px; }
        .stat-card__value { font-size: 18px; font-weight: 700; color: #2dd496; }
        .stat-card__label { font-size: 11px; color: #4a7a66; text-transform: uppercase; letter-spacing: 0.5px; }
      `}</style>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'Tahajjud blessings';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Assalamu alaikum';
}

// ─── Styles ────────────────────────────────────────────────────────

const dashboardStyles = `
  .practice {
    min-height: 100vh;
    min-height: 100dvh;
    max-width: 520px;
    margin: 0 auto;
    background: #080f0c;
    padding-bottom: 40px;
  }

  .practice__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 24px 20px 16px;
  }
  .practice__title {
    font-size: 20px;
    font-weight: 700;
    color: #e8f5f0;
    margin: 0 0 4px;
  }
  .practice__subtitle {
    font-size: 13px;
    color: #6bb89a;
    margin: 0;
  }
  .practice__streak {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 14px;
    background: linear-gradient(135deg, rgba(45, 212, 150, 0.1), rgba(45, 212, 150, 0.05));
    border: 1px solid rgba(45, 212, 150, 0.15);
    border-radius: 14px;
  }
  .practice__streak-num {
    font-size: 20px;
    font-weight: 800;
    color: #2dd496;
  }
  .practice__streak-label {
    font-size: 9px;
    color: #4a7a66;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .practice__section {
    padding: 0 20px;
    margin-bottom: 24px;
  }
  .practice__section-title {
    font-size: 14px;
    font-weight: 600;
    color: #8ab8a4;
    margin: 0 0 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .practice__review-cards {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .practice__stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .practice__sheikh-nudge {
    display: flex;
    gap: 12px;
    margin: 0 20px;
    padding: 16px;
    background: linear-gradient(135deg, #0c1f1a, #132e25);
    border: 1px solid rgba(45, 212, 150, 0.12);
    border-radius: 16px;
  }
  .practice__sheikh-nudge-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2dd496, #1a7a54);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .practice__sheikh-nudge p {
    margin: 0;
    font-size: 13px;
    color: #a8c8bc;
    line-height: 1.55;
  }

  .practice__empty-state {
    text-align: center;
    padding: 40px 32px;
  }
  .practice__empty-icon { font-size: 48px; margin-bottom: 12px; }
  .practice__empty-state h3 {
    font-size: 18px;
    font-weight: 700;
    color: #e8f5f0;
    margin: 0 0 8px;
  }
  .practice__empty-state p {
    font-size: 14px;
    color: #6bb89a;
    line-height: 1.55;
    margin: 0;
  }
`;

const addStyles = `
  .practice--add {
    min-height: 100vh;
    min-height: 100dvh;
    max-width: 520px;
    margin: 0 auto;
    background: #080f0c;
    padding: 16px 20px;
  }

  .practice__add-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  .practice__add-title {
    font-size: 18px;
    font-weight: 700;
    color: #e8f5f0;
    margin: 0;
  }

  .practice__add-sheikh {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
  }
  .practice__add-sheikh-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2dd496, #1a7a54);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }
  .practice__add-sheikh-msg {
    margin: 0;
    font-size: 14px;
    color: #c8e6dc;
    line-height: 1.55;
    padding: 12px 16px;
    background: linear-gradient(135deg, #0c1f1a, #132e25);
    border: 1px solid rgba(45, 212, 150, 0.12);
    border-radius: 16px;
    border-top-left-radius: 4px;
  }

  .practice__add-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;
  }

  .practice__add-field label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #6bb89a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
  }

  .practice__add-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(45, 212, 150, 0.12);
    border-radius: 12px;
    padding: 12px 14px;
    font-size: 15px;
    color: #e8f5f0;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s ease;
    box-sizing: border-box;
  }
  .practice__add-input::placeholder { color: #4a7a66; }
  .practice__add-input:focus {
    border-color: rgba(45, 212, 150, 0.35);
    box-shadow: 0 0 12px rgba(45, 212, 150, 0.1);
  }

  .practice__add-row {
    display: flex;
    gap: 12px;
  }

  .practice__presets {
    padding-top: 8px;
    border-top: 1px solid rgba(45, 212, 150, 0.06);
  }
  .practice__presets-label {
    font-size: 12px;
    color: #4a7a66;
    margin: 0 0 10px;
  }
  .practice__presets-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
`;
