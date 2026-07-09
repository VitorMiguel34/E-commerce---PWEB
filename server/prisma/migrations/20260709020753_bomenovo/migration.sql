/*
  Warnings:

  - You are about to drop the column `orderId` on the `ProductInCart` table. All the data in the column will be lost.
  - Added the required column `receipt` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCost` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userCartId" INTEGER NOT NULL,
    "receipt" TEXT NOT NULL,
    "totalCost" REAL NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Order_userCartId_fkey" FOREIGN KEY ("userCartId") REFERENCES "UserCart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("id", "status", "userCartId") SELECT "id", "status", "userCartId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_ProductInCart" (
    "userCartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" REAL NOT NULL DEFAULT 0,

    PRIMARY KEY ("userCartId", "productId"),
    CONSTRAINT "ProductInCart_userCartId_fkey" FOREIGN KEY ("userCartId") REFERENCES "UserCart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductInCart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductInCart" ("price", "productId", "quantity", "userCartId") SELECT "price", "productId", "quantity", "userCartId" FROM "ProductInCart";
DROP TABLE "ProductInCart";
ALTER TABLE "new_ProductInCart" RENAME TO "ProductInCart";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
