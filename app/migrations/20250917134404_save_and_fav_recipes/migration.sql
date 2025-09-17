-- AlterTable
ALTER TABLE "ElaboratedRecipe" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSaved" BOOLEAN NOT NULL DEFAULT false;
