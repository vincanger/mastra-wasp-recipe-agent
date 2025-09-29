/*
  Warnings:

  - You are about to drop the `ElaboratedRecipe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ElaboratedRecipe" DROP CONSTRAINT "ElaboratedRecipe_userId_fkey";

-- DropTable
DROP TABLE "ElaboratedRecipe";

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ingredients" JSONB NOT NULL,
    "instructions" JSONB NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "dateCreated" TEXT NOT NULL,
    "servings" INTEGER,
    "prepTime" INTEGER,
    "cookTime" INTEGER,
    "tags" JSONB,
    "thumbnailUrl" TEXT,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
