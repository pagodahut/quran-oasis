import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRecommendedStartLesson, getLessonsByPath } from '@/lib/lesson-content';

// Types for onboarding data
interface OnboardingData {
  arabicLevel: 'none' | 'letters' | 'basic' | 'intermediate' | 'fluent';
  priorMemorization: 'none' | 'juz_amma' | 'multiple_juz' | 'significant';
  dailyTimeMinutes: 10 | 15 | 20 | 30 | 45 | 60;
  goal: 'full_hifz' | 'selected_surahs' | 'juz_amma' | 'daily_connection';
  preferredReciter: string;
}

// Generate personalized study plan based on onboarding answers
function generateStudyPlan(data: OnboardingData) {
  // Determine the user's path (beginner, intermediate, or advanced)
  let currentLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
  
  if ((data.arabicLevel === 'fluent' || data.arabicLevel === 'intermediate') && 
      (data.priorMemorization === 'multiple_juz' || data.priorMemorization === 'significant')) {
    currentLevel = 'advanced';
  } else if (data.arabicLevel === 'intermediate' || data.arabicLevel === 'fluent' || 
             (data.arabicLevel === 'basic' && data.priorMemorization !== 'none')) {
    currentLevel = 'intermediate';
  }
  
  // Get the starting lesson
  const startLesson = getRecommendedStartLesson(data.arabicLevel, data.priorMemorization);
  
  // Calculate daily verses based on time commitment and experience
  let dailyNewVerses = 1;
  let dailyReviewVerses = 3;
  
  // Base on time available
  switch (data.dailyTimeMinutes) {
    case 10:
      dailyNewVerses = 1;
      dailyReviewVerses = 3;
      break;
    case 15:
      dailyNewVerses = 2;
      dailyReviewVerses = 5;
      break;
    case 20:
      dailyNewVerses = 3;
      dailyReviewVerses = 7;
      break;
    case 30:
      dailyNewVerses = 4;
      dailyReviewVerses = 10;
      break;
    case 45:
      dailyNewVerses = 5;
      dailyReviewVerses = 15;
      break;
    case 60:
      dailyNewVerses = 7;
      dailyReviewVerses = 20;
      break;
  }
  
  // Adjust based on experience level
  if (data.priorMemorization === 'multiple_juz' || data.priorMemorization === 'significant') {
    // Experienced users can handle more
    dailyNewVerses = Math.ceil(dailyNewVerses * 1.5);
    dailyReviewVerses = Math.ceil(dailyReviewVerses * 1.5);
  } else if (data.arabicLevel === 'none' || data.arabicLevel === 'letters') {
    // Beginners should focus on fewer verses with more repetition
    dailyNewVerses = Math.max(1, Math.floor(dailyNewVerses * 0.7));
    dailyReviewVerses = Math.ceil(dailyReviewVerses * 0.8);
  }
  
  // Determine starting surah based on goal and experience
  let currentSurah = 1; // Al-Fatiha
  let currentAyah = 1;
  
  if (data.goal === 'full_hifz') {
    // Start from Al-Fatiha for full hifz
    currentSurah = 1;
  } else if (data.goal === 'juz_amma') {
    // Start from the end of Juz Amma (shortest surahs)
    currentSurah = 114; // An-Nas
  } else if (data.goal === 'selected_surahs') {
    // Start with commonly recited surahs
    currentSurah = 112; // Al-Ikhlas
  } else {
    // Daily connection - start with Al-Fatiha
    currentSurah = 1;
  }
  
  // If they already know Juz Amma, start elsewhere
  if (data.priorMemorization === 'juz_amma' && data.goal !== 'juz_amma') {
    currentSurah = 36; // Ya-Sin or another commonly requested surah
  }
  
  return {
    currentLevel,
    dailyNewVerses,
    dailyReviewVerses,
    currentSurah,
    currentAyah,
    currentLesson: startLesson.id,
    lessonsCompleted: JSON.stringify([]),
  };
}

// POST - Save onboarding data and create study plan
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: OnboardingData = await request.json();
    
    // Validate required fields
    if (!body.arabicLevel || !body.priorMemorization || !body.dailyTimeMinutes || !body.goal || !body.preferredReciter) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { clerkId },
      });
    }

    // Map priorMemorization to database format
    const memorizedBefore = body.priorMemorization !== 'none';
    let currentMemorized: string | null = null;
    switch (body.priorMemorization) {
      case 'juz_amma':
        currentMemorized = 'Juz Amma (30th Juz)';
        break;
      case 'multiple_juz':
        currentMemorized = 'Multiple Juz';
        break;
      case 'significant':
        currentMemorized = 'Significant portion (10+ Juz)';
        break;
    }

    // Save onboarding data
    await prisma.onboarding.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        arabicLevel: body.arabicLevel,
        memorizedBefore,
        currentMemorized,
        dailyTimeMinutes: body.dailyTimeMinutes,
        goal: body.goal,
        selectedReciter: body.preferredReciter,
      },
      update: {
        arabicLevel: body.arabicLevel,
        memorizedBefore,
        currentMemorized,
        dailyTimeMinutes: body.dailyTimeMinutes,
        goal: body.goal,
        selectedReciter: body.preferredReciter,
      },
    });

    // Generate and save study plan
    const studyPlanData = generateStudyPlan(body);
    
    const studyPlan = await prisma.studyPlan.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...studyPlanData,
      },
      update: studyPlanData,
    });

    // Create/update user preferences
    await prisma.userPreferences.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        reciter: body.preferredReciter,
      },
      update: {
        reciter: body.preferredReciter,
      },
    });

    // Get the starting lesson info
    const startLesson = getRecommendedStartLesson(body.arabicLevel, body.priorMemorization);
    const pathLessons = getLessonsByPath(studyPlanData.currentLevel);

    return NextResponse.json({
      success: true,
      studyPlan: {
        ...studyPlan,
        lessonsCompleted: JSON.parse(studyPlan.lessonsCompleted || '[]'),
      },
      recommendation: {
        level: studyPlanData.currentLevel,
        startingLesson: {
          id: startLesson.id,
          title: startLesson.title,
          description: startLesson.description,
        },
        totalLessonsInPath: pathLessons.length,
        dailyGoal: {
          newVerses: studyPlanData.dailyNewVerses,
          reviewVerses: studyPlanData.dailyReviewVerses,
        },
      },
    });
  } catch (error) {
    console.error('Onboarding POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Get current onboarding status
export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        onboarding: true,
        studyPlan: true,
      },
    });

    if (!user) {
      return NextResponse.json({ 
        completed: false,
        onboarding: null,
        studyPlan: null,
      });
    }

    return NextResponse.json({
      completed: !!user.onboarding,
      onboarding: user.onboarding,
      studyPlan: user.studyPlan ? {
        ...user.studyPlan,
        lessonsCompleted: JSON.parse(user.studyPlan.lessonsCompleted || '[]'),
      } : null,
    });
  } catch (error) {
    console.error('Onboarding GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
