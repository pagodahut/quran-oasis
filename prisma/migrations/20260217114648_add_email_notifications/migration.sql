-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserPreferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "reciter" TEXT NOT NULL DEFAULT 'alafasy',
    "translation" TEXT NOT NULL DEFAULT 'sahih',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "fontSize" INTEGER NOT NULL DEFAULT 24,
    "showTranslation" BOOLEAN NOT NULL DEFAULT true,
    "autoPlayNext" BOOLEAN NOT NULL DEFAULT false,
    "repeatCount" INTEGER NOT NULL DEFAULT 3,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserPreferences" ("autoPlayNext", "fontSize", "id", "reciter", "repeatCount", "showTranslation", "theme", "translation", "userId") SELECT "autoPlayNext", "fontSize", "id", "reciter", "repeatCount", "showTranslation", "theme", "translation", "userId" FROM "UserPreferences";
DROP TABLE "UserPreferences";
ALTER TABLE "new_UserPreferences" RENAME TO "UserPreferences";
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
