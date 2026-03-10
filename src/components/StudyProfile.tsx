'use client';

import { useStudyInsights, getPageLabel, type StudyPage } from '@/lib/studyTracker';

const PAGE_ICONS: Record<StudyPage, string> = {
  mushaf: '📖',
  recite: '🎙️',
  practice: '✍️',
  lessons: '📚',
  flashcards: '🃏',
  dashboard: '🏠',
  profile: '👤',
  settings: '⚙️',
};

export default function StudyProfile() {
  const insights = useStudyInsights();

  if (!insights || insights.totalVisits === 0) {
    return (
      <div className="liquid-glass rounded-2xl p-6 text-center">
        <p className="text-white/60 text-sm">
          Start studying to see your personalized insights here. Open the Mushaf, try a lesson, or practice your recitation!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Study Streak */}
      {insights.streakDays > 0 && (
        <div className="liquid-glass-gold rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-gold-400 font-semibold text-lg">
                {insights.streakDays} Day Streak
              </p>
              <p className="text-white/60 text-sm">
                {insights.streakDays >= 7
                  ? 'MashaAllah, your consistency is beautiful!'
                  : insights.streakDays >= 3
                  ? 'Keep it going, consistency is the key to memorization'
                  : 'Every day counts. Build your habit!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Most Used Feature */}
      {insights.mostUsedFeature && (
        <div className="liquid-glass rounded-2xl p-5">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Your Focus</p>
          <div className="flex items-center gap-3">
            <span className="text-xl">{PAGE_ICONS[insights.mostUsedFeature.page]}</span>
            <div>
              <p className="text-white/90 font-medium">
                {getPageLabel(insights.mostUsedFeature.page)}
              </p>
              <p className="text-white/50 text-sm">
                {insights.mostUsedFeature.count} visits · Your most-used study tool
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Surahs */}
      {insights.topSurahs.length > 0 && (
        <div className="liquid-glass rounded-2xl p-5">
          <p className="text-white/50 text-xs uppercase tracking-wider mb-3">Most Studied Surahs</p>
          <div className="space-y-2">
            {insights.topSurahs.map(({ surah, count }) => (
              <div key={surah} className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Surah {surah}</span>
                <span className="text-gold-400/80 text-xs">{count} sessions</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestion */}
      <div className="liquid-glass rounded-2xl p-5 border-l-2 border-gold-400/30">
        <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Suggestion</p>
        <p className="text-white/70 text-sm">{insights.suggestion}</p>
      </div>

      {/* Stats Footer */}
      <div className="text-center text-white/30 text-xs">
        {insights.totalVisits} total study sessions tracked
      </div>
    </div>
  );
}
