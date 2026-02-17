-- CreateTable
CREATE TABLE "VerseDifficulty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "surahNumber" INTEGER NOT NULL,
    "ayahNumber" INTEGER NOT NULL,
    "difficultyScore" REAL NOT NULL DEFAULT 0.5,
    "lastAttemptAccuracy" REAL NOT NULL DEFAULT 0,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextReviewAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "VerseDifficulty_userId_nextReviewAt_idx" ON "VerseDifficulty"("userId", "nextReviewAt");

-- CreateIndex
CREATE UNIQUE INDEX "VerseDifficulty_userId_surahNumber_ayahNumber_key" ON "VerseDifficulty"("userId", "surahNumber", "ayahNumber");
