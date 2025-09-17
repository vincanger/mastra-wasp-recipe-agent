-- CreateTable
CREATE TABLE "ElaboratedRecipe" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ingredients" JSONB NOT NULL,
    "instructions" JSONB NOT NULL,
    "dateCreated" TEXT NOT NULL,
    "servings" INTEGER,
    "prepTime" INTEGER,
    "cookTime" INTEGER,
    "tags" JSONB,

    CONSTRAINT "ElaboratedRecipe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ElaboratedRecipe" ADD CONSTRAINT "ElaboratedRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
