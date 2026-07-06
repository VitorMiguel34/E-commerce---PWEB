-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserCart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tokens" REAL NOT NULL DEFAULT 0,
    "password" TEXT NOT NULL DEFAULT '1234',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_UserCart" ("createdAt", "email", "id", "name", "password", "tokens") SELECT "createdAt", "email", "id", "name", "password", "tokens" FROM "UserCart";
DROP TABLE "UserCart";
ALTER TABLE "new_UserCart" RENAME TO "UserCart";
CREATE UNIQUE INDEX "UserCart_email_key" ON "UserCart"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
