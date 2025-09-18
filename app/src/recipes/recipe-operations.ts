import type { 
  SaveRecipe, 
  ToggleFavoriteRecipe, 
  GetUserRecipes, 
  DeleteRecipe, 
} from 'wasp/server/operations';
import type { CleanupUnfavoritedRecipes } from 'wasp/server/jobs';
import type { ElaboratedRecipe } from 'wasp/entities';
import { HttpError } from 'wasp/server';

type SaveRecipeInput = {
  title: string;
  ingredients: string[];
  instructions: string[];
  dateCreated: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  tags?: string[];
};

export const saveRecipe: SaveRecipe<SaveRecipeInput, ElaboratedRecipe> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  try {
    return await context.entities.ElaboratedRecipe.create({
      data: {
        userId: context.user.id,
        title: args.title,
        ingredients: args.ingredients,
        instructions: args.instructions,
        dateCreated: args.dateCreated,
        servings: args.servings,
        prepTime: args.prepTime,
        cookTime: args.cookTime,
        tags: args.tags,
        isFavorite: false,
      },
    });
  } catch (error) {
    console.error('Failed to save recipe:', error);
    throw new HttpError(500, 'Failed to save recipe');
  }
};

type ToggleFavoriteInput = {
  recipeId: string;
};

export const toggleFavoriteRecipe: ToggleFavoriteRecipe<ToggleFavoriteInput, ElaboratedRecipe> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  try {
    // First check if recipe exists and belongs to user
    const recipe = await context.entities.ElaboratedRecipe.findFirst({
      where: {
        id: args.recipeId,
        userId: context.user.id,
      },
    });

    if (!recipe) {
      throw new HttpError(404, 'Recipe not found');
    }

    return await context.entities.ElaboratedRecipe.update({
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

export const getUserRecipes: GetUserRecipes<GetUserRecipesInput, ElaboratedRecipe[]> = async (args, context) => {
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

    return await context.entities.ElaboratedRecipe.findMany({
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
    const recipe = await context.entities.ElaboratedRecipe.findFirst({
      where: {
        id: args.recipeId,
        userId: context.user.id,
      },
    });

    if (!recipe) {
      throw new HttpError(404, 'Recipe not found');
    }

    await context.entities.ElaboratedRecipe.delete({
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

    const result = await context.entities.ElaboratedRecipe.deleteMany({
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
