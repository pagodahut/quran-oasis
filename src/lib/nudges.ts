// import { prisma } from './prisma';

export type NudgeType =
  | 'streak'
  | 'milestone'
  | 'comeback'
  | 'encouragement'
  | 'celebration';

export interface Nudge {
  type: NudgeType;
  key: string;
  message: string;
}

const NUDGE_VARIANTS: Record<NudgeType, Nudge[]> = {
  streak: [
    { type: 'streak', key: 'streak-1', message: 'Consistency is key. The Prophet ﷺ said: "The most beloved deeds to Allah are the most consistent, even if small."' },
    { type: 'streak', key: 'streak-2', message: "You're building a beautiful habit. Every day you show up is a day closer to your goal." },
    { type: 'streak', key: 'streak-3', message: 'SubhanAllah, your dedication is inspiring. Keep this momentum going!' },
    { type: 'streak', key: 'streak-4', message: '"Whoever recites the Quran and acts upon it, his parents will be crowned on the Day of Judgment." Keep going!' },
    { type: 'streak', key: 'streak-5', message: 'Day after day, letter by letter — the Quran is becoming part of you.' },
    { type: 'streak', key: 'streak-6', message: 'Your streak shows real commitment. Allah does not let the reward of the doers of good be lost.' },
  ],
  milestone: [
    { type: 'milestone', key: 'milestone-1', message: 'A new milestone reached! SubhanAllah, every verse you memorize is a light on the Day of Judgment.' },
    { type: 'milestone', key: 'milestone-2', message: "Look how far you've come. The one who recites the Quran skillfully will be with the noble angels." },
    { type: 'milestone', key: 'milestone-3', message: 'Another step forward in your journey. The Quran will intercede for its companion on the Day of Resurrection.' },
    { type: 'milestone', key: 'milestone-4', message: 'MashaAllah! Your progress is a testament to your sincerity. Keep striving.' },
    { type: 'milestone', key: 'milestone-5', message: 'You just unlocked another milestone. "Read, for your status will be at the last verse you recite."' },
    { type: 'milestone', key: 'milestone-6', message: 'Each verse memorized raises your rank in Jannah. What a beautiful investment.' },
  ],
  comeback: [
    { type: 'comeback', key: 'comeback-1', message: 'Welcome back! Even a few minutes of review preserves your progress. Allah loves the one who returns.' },
    { type: 'comeback', key: 'comeback-2', message: "It's wonderful to see you again. Pick up where you left off — the Quran is patient with its people." },
    { type: 'comeback', key: 'comeback-3', message: "Every return is a new beginning. The Prophet ﷺ said: \"Keep refreshing your knowledge of the Quran.\"" },
    { type: 'comeback', key: 'comeback-4', message: 'No time away is wasted if you come back. Start with what you remember — it will come flooding back.' },
    { type: 'comeback', key: 'comeback-5', message: "You're here, and that's what matters. Let's review together and rebuild that connection." },
  ],
  encouragement: [
    { type: 'encouragement', key: 'encourage-1', message: 'Struggling is part of the journey. "The one who recites with difficulty gets double the reward."' },
    { type: 'encouragement', key: 'encourage-2', message: 'Every letter of the Quran you recite earns you a reward, and each reward is multiplied tenfold.' },
    { type: 'encouragement', key: 'encourage-3', message: 'Difficult day? Even listening to the Quran counts. Be gentle with yourself.' },
    { type: 'encouragement', key: 'encourage-4', message: "Remember: the Quran was revealed over 23 years. There's no rush — only sincerity." },
    { type: 'encouragement', key: 'encourage-5', message: '"Verily, with hardship comes ease." Your effort today is not lost.' },
    { type: 'encouragement', key: 'encourage-6', message: 'Small steps still move you forward. Even one verse today is a victory.' },
    { type: 'encouragement', key: 'encourage-7', message: 'The best of you are those who learn the Quran and teach it. You are among the best.' },
  ],
  celebration: [
    { type: 'celebration', key: 'celebrate-1', message: "🎉 You did it! Goal complete for today. May Allah bless your efforts." },
    { type: 'celebration', key: 'celebrate-2', message: "MashaAllah! Today's goal is done. Rest knowing your effort is recorded." },
    { type: 'celebration', key: 'celebrate-3', message: 'SubhanAllah, another day of dedication! The angels are recording your every word.' },
    { type: 'celebration', key: 'celebrate-4', message: "🌟 Goal achieved! You're writing a beautiful story with the Quran." },
    { type: 'celebration', key: 'celebrate-5', message: 'AlhamdulillAh! You completed your daily goal. Consistency like this changes lives.' },
    { type: 'celebration', key: 'celebrate-6', message: "Today's mission: accomplished. Tomorrow's reward: multiplied. Keep shining!" },
  ],
};

const NUDGE_COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours between nudges

interface NudgeContext {
  streakDays: number;
  totalVerses: number;
  daysSinceLastVisit: number;
  goalComplete: boolean;
}

/** Pick the right nudge type based on user context */
function selectNudgeType(ctx: NudgeContext): NudgeType {
  if (ctx.goalComplete) return 'celebration';
  if (ctx.daysSinceLastVisit > 2) return 'comeback';
  if (ctx.streakDays >= 3) return 'streak';
  if (ctx.totalVerses > 0 && ctx.totalVerses % 10 === 0) return 'milestone';
  return 'encouragement';
}

/** Get a nudge for the user, respecting cooldown */
export async function getNudge(
  _userId: string,
  context: NudgeContext
): Promise<Nudge | null> {
  // TODO: Re-enable DB tracking when nudgeHistory model is added
  // For now, just use the client-side fallback
  return getClientNudge(context);
}

/** Get nudge without DB (client-side fallback) */
export function getClientNudge(context: NudgeContext): Nudge {
  const type = selectNudgeType(context);
  const variants = NUDGE_VARIANTS[type];
  return variants[Math.floor(Math.random() * variants.length)];
}
