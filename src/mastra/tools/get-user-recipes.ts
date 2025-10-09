import type { Tool } from '@mastra/core/tools';
import type { UserRuntimeContext } from '../../recipes/streaming/api';

import { recipeDbModelSchema } from '../schemas/recipe-schema';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { prisma } from 'wasp/server';
import { Prisma } from '@prisma/client';
import { ToolId } from './ids';

const inputSchema = z.object({
  favoritesOnly: z.boolean().optional().describe('If true, only return favorite recipes'),
  searchQuery: z.string().optional().describe('Optional search term to filter recipes by title, ingredients, or instructions'),
});

const outputSchema = z.object({
  recipes: z.array(recipeDbModelSchema),
  recipeIds: z.array(z.string()).describe('Array of recipe IDs for filtering'),
  totalCount: z.number(),
  favoriteCount: z.number(),
  summary: z.string(),
});

export type GetUserRecipesOutput = z.infer<typeof outputSchema>;

export const getUserRecipes: Tool<typeof inputSchema, typeof outputSchema> = createTool({
  id: ToolId.GetUserRecipes,
  description: `Search and retrieve the user's recipes from their personal collection. 
    This tool can filter by favorite status or search by title, ingredients, or instructions. 
    Use this when the user asks about their existing recipes, wants to find something they've created before, 
    needs to see their favorites, or wants to search through their recipe collection.
    
    Examples:
    - "Show me my recipes"
    - "What are my favorite pasta recipes?"
    - "Find recipes with chicken in my collection"
    - "Do I have any quick recipes?"
    - "Find recipes that involve baking"`,
  inputSchema,
  outputSchema,
  execute: async ({context, runtimeContext}) => {
    const { favoritesOnly, searchQuery } = context;
    const userId = runtimeContext.get('id') as UserRuntimeContext['id'];
    try {
      if (!userId) {
        throw new Error(`User ID is required for ${ToolId.GetUserRecipes} tool`);
      }

      // Build the where clause for filtering
      const whereConditions: Prisma.RecipeWhereInput = {
        userId,
      };
      if (favoritesOnly) {
        whereConditions.isFavorite = true;
      }

      let recipes;

      // Add search functionality
      if (searchQuery) {
        // For PostgreSQL JSON arrays, we need to use raw SQL for proper searching
        // This searches both title and within the JSON ingredients array
        const searchPattern = `%${searchQuery}%`;

        recipes = await prisma.$queryRaw<any[]>`
            SELECT * FROM "Recipe" 
            WHERE "userId" = ${userId}
            ${favoritesOnly ? Prisma.sql`AND "isFavorite" = true` : Prisma.empty}
            AND (
              LOWER("title") LIKE LOWER(${searchPattern})
              OR EXISTS (
                SELECT 1 FROM jsonb_array_elements_text("ingredients") AS ingredient
                WHERE LOWER(ingredient) LIKE LOWER(${searchPattern})
              )
              OR EXISTS (
                SELECT 1 FROM jsonb_array_elements_text("instructions") AS instruction
                WHERE LOWER(instruction) LIKE LOWER(${searchPattern})
              )
            )
            ORDER BY "createdAt" DESC
          `;
      } else {
        // Use regular Prisma query when no search is needed
        recipes = await prisma.recipe.findMany({
          where: whereConditions,
          orderBy: {
            createdAt: 'desc',
          },
        });
      }

      // Calculate counts
      const totalCount = recipes.length;
      const favoriteCount = recipes.filter((r) => r.isFavorite).length;

      // Generate a helpful summary
      let summary = `Found ${totalCount} recipe${totalCount !== 1 ? 's' : ''}`;

      if (favoritesOnly) {
        summary += ` (favorite recipes)`;
      } else {
        summary += ` (${favoriteCount} favorites)`;
      }

      if (searchQuery) {
        summary += ` matching "${searchQuery}"`;
      }

      if (totalCount === 0) {
        summary = searchQuery ? `No recipes found matching "${searchQuery}" in your collection.` : favoritesOnly ? "You haven't favorited any recipes yet." : 'Your recipe collection is empty.';
      }

      return {
        recipes: recipes,
        recipeIds: recipes.map((recipe) => recipe.id),
        totalCount,
        favoriteCount,
        summary,
      };
    } catch (error) {
      console.error('Failed to get user recipes in tool:', error);

      // Return helpful error message
      return {
        recipes: [],
        recipeIds: [],
        totalCount: 0,
        favoriteCount: 0,
        summary: 'Unable to retrieve recipes at the moment. Please try again.',
      };
    }
  },
});
