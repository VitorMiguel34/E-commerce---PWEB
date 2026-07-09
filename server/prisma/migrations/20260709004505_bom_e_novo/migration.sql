/*
  Warnings:

  - You are about to alter the column `price` on the `ProductInCart` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductInCart" (
    "userCartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "orderId" INTEGER,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" REAL NOT NULL DEFAULT 0,

    PRIMARY KEY ("userCartId", "productId"),
    CONSTRAINT "ProductInCart_userCartId_fkey" FOREIGN KEY ("userCartId") REFERENCES "UserCart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductInCart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductInCart_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProductInCart" ("orderId", "price", "productId", "quantity", "userCartId") SELECT "orderId", "price", "productId", "quantity", "userCartId" FROM "ProductInCart";
DROP TABLE "ProductInCart";
ALTER TABLE "new_ProductInCart" RENAME TO "ProductInCart";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
