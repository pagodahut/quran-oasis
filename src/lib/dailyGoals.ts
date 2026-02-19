// @ts-nocheck
// import { prisma } from './prisma';

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Get or create today's goal for a user */
export async function getDailyGoal(userId: string) {
  const date = todayStr();

  let goal = await prisma.dailyGoal.findUnique({
    where: { userId_date: { userId, date } },
  });

  if (!goal) {
    // Pull targets from onboarding / study plan if available
    const [onboarding, studyPlan] = await Promise.all([
      prisma.onboarding.findUnique({ where: { userId } }),
      prisma.studyPlan.findUnique({ where: { userId } }),
    ]);

    const targetMinutes = onboarding?.dailyTimeMinutes ?? 20;
    const targetVerses = studyPlan?.dailyNewVerses ?? 5;
    const streakDay = await calculateStreak(userId);

    goal = await prisma.dailyGoal.create({
      data: { userId, date, targetMinutes, targetVerses, streakDay },
    });
  }

  return goal;
}

/** Increment progress for today */
export async function updateProgress(
  userId: string,
  minutesAdded: number,
  versesAdded: number
) {
  const goal = await getDailyGoal(userId);

  const completedMinutes = goal.completedMinutes + minutesAdded;
  const completedVerses = goal.completedVerses + versesAdded;
  const isComplete =
    completedMinutes >= goal.targetMinutes ||
    completedVerses >= goal.targetVerses;

  return prisma.dailyGoal.update({
    where: { id: goal.id },
    data: { completedMinutes, completedVerses, isComplete },
  });
}

/** Count consecutive completed days ending yesterday (or today if complete) */
export async function calculateStreak(userId: string): Promise<number> {
  // Get all completed goals ordered by date descending
  const goals = await prisma.dailyGoal.findMany({
    where: { userId, isComplete: true },
    orderBy: { date: 'desc' },
    select: { date: true },
  });

  if (goals.length === 0) return 0;

  const today = todayStr();
  let streak = 0;
  let checkDate = today;

  // If today isn't complete yet, start checking from yesterday
  if (goals[0].date !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    checkDate = yesterday.toISOString().slice(0, 10);
    if (goals[0].date !== checkDate) return 0;
  }

  const dateSet = new Set(goals.map((g) => g.date));

  const d = new Date(checkDate);
  while (dateSet.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  return streak;
}
