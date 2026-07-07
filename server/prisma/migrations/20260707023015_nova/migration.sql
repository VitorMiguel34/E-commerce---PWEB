/*
  Warnings:

  - You are about to drop the column `owner_id` on the `Product` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Order" (
    "userCartId" INTEGER NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "status" TEXT NOT NULL,
    CONSTRAINT "Order_userCartId_fkey" FOREIGN KEY ("userCartId") REFERENCES "UserCart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    CONSTRAINT "Product_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "UserCart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("category", "createdAt", "description", "id", "name", "price", "sku", "stock") SELECT "category", "createdAt", "description", "id", "name", "price", "sku", "stock" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
CREATE TABLE "new_ProductInCart" (
    "userCartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "orderId" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("userCartId", "productId"),
    CONSTRAINT "ProductInCart_userCartId_fkey" FOREIGN KEY ("userCartId") REFERENCES "UserCart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductInCart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductInCart_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductInCart" ("price", "productId", "quantity", "userCartId") SELECT "price", "productId", "quantity", "userCartId" FROM "ProductInCart";
DROP TABLE "ProductInCart";
ALTER TABLE "new_ProductInCart" RENAME TO "ProductInCart";
CREATE TABLE "new_UserCart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tokens" REAL NOT NULL DEFAULT 0,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_UserCart" ("createdAt", "email", "id", "isAdmin", "name", "password", "tokens") SELECT "createdAt", "email", "id", "isAdmin", "name", "password", "tokens" FROM "UserCart";
DROP TABLE "UserCart";
ALTER TABLE "new_UserCart" RENAME TO "UserCart";
CREATE UNIQUE INDEX "UserCart_email_key" ON "UserCart"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Order_userCartId_key" ON "Order"("userCartId");
