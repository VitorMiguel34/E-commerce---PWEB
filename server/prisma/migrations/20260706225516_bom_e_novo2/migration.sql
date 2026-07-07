-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductInCart" (
    "userCartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("userCartId", "productId"),
    CONSTRAINT "ProductInCart_userCartId_fkey" FOREIGN KEY ("userCartId") REFERENCES "UserCart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductInCart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductInCart" ("productId", "quantity", "userCartId") SELECT "productId", "quantity", "userCartId" FROM "ProductInCart";
DROP TABLE "ProductInCart";
ALTER TABLE "new_ProductInCart" RENAME TO "ProductInCart";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
