import type { 
  ToggleFavoriteRecipe, 
  GetUserRecipes, 
  DeleteRecipe, 
  SaveRecipes,
} from 'wasp/server/operations';
import type { CleanupUnfavoritedRecipes } from 'wasp/server/jobs';
import type { Recipe } from 'wasp/entities';
import type { ElaboratedRecipe as ElaboratedRecipeType } from '../mastra/schemas/recipe-schema';

import { HttpError } from 'wasp/server';

export const saveRecipes = (async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

 return await context.entities.Recipe.createManyAndReturn({
  data: args.map((recipe) => ({
    ...recipe,
    userId: context.user!.id,
  })),
 });
}) satisfies SaveRecipes<ElaboratedRecipeType[]>;

type ToggleFavoriteInput = {
  recipeId: string;
};

export const toggleFavoriteRecipe: ToggleFavoriteRecipe<ToggleFavoriteInput, Recipe> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  try {
    // First check if recipe exists and belongs to user
    const recipe = await context.entities.Recipe.findFirst({
      where: {
        id: args.recipeId,
        userId: context.user.id,
      },
    });

    if (!recipe) {
      throw new HttpError(404, 'Recipe not found');
    }

    return await context.entities.Recipe.update({
      where: { id: args.recipeId },
      data: {
        isFavorite: !recipe.isFavorite,
      },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Failed to toggle favorite:', error);
    throw new HttpError(500, 'Failed to update recipe');
  }
};

type GetUserRecipesInput = {
  favoritesOnly?: boolean;
  recipeIds?: string[]; // Optional array of specific recipe IDs to filter by
};

export const getUserRecipes: GetUserRecipes<GetUserRecipesInput, Recipe[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  try {
    const whereConditions: any = {
      userId: context.user.id,
    };

    if (args.favoritesOnly) {
      whereConditions.isFavorite = true;
    }

    // If specific recipe IDs are provided, filter by them
    if (args.recipeIds && args.recipeIds.length > 0) {
      whereConditions.id = {
        in: args.recipeIds,
      };
    }

    return await context.entities.Recipe.findMany({
      where: whereConditions,
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Failed to get user recipes:', error);
    throw new HttpError(500, 'Failed to retrieve recipes');
  }
};

type DeleteRecipeInput = {
  recipeId: string;
};

export const deleteRecipe: DeleteRecipe<DeleteRecipeInput, { success: boolean }> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  try {
    // Check if recipe exists and belongs to user
    const recipe = await context.entities.Recipe.findFirst({
      where: {
        id: args.recipeId,
        userId: context.user.id,
      },
    });

    if (!recipe) {
      throw new HttpError(404, 'Recipe not found');
    }

    await context.entities.Recipe.delete({
      where: { id: args.recipeId },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }
    console.error('Failed to delete recipe:', error);
    throw new HttpError(500, 'Failed to delete recipe');
  }
};

// Cron job function to cleanup unsaved recipes older than 7 days
export const cleanupUnfavoritedRecipes: CleanupUnfavoritedRecipes<never, { deletedCount: number }> = async (_args, context) => {
  try {
    // Delete recipes that are not favorited and older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await context.entities.Recipe.deleteMany({
      where: {
        isFavorite: false,
        createdAt: {
          lt: sevenDaysAgo,
        },
      },
    });

    console.log(`Cleanup job: Deleted ${result.count} unfavorited recipes older than 7 days`);

    return { deletedCount: result.count };
  } catch (error) {
    console.error('Failed to cleanup unfavorited recipes:', error);
    throw new HttpError(500, 'Failed to cleanup unfavorited recipes');
  }
};
