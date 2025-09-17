import type { Tool } from "@mastra/core/tools";

import { ElaboratedRecipeSchema } from "../../lib/zod";
import { createTool } from '@mastra/core/tools';
import { z } from "zod";
import { prisma } from "wasp/server";
import { Prisma } from "@prisma/client";
import { ToolId } from "./ids";

// Global state to store current user ID for tool execution
let currentUserId: string | null = null;

export const setCurrentUserId = (userId: string) => {
  currentUserId = userId;
};

export const getCurrentUserId = () => currentUserId;

const inputSchema = z.object({
  savedOnly: z.boolean().optional().describe("If true, only return saved recipes"),
  favoritesOnly: z.boolean().optional().describe("If true, only return favorite recipes"),
  searchQuery: z.string().optional().describe("Optional search term to filter recipes by title or ingredients"),
});

const outputSchema = z.object({
  recipes: z.array(ElaboratedRecipeSchema),
  recipeIds: z.array(z.string()).describe("Array of recipe IDs for filtering"),
  totalCount: z.number(),
  savedCount: z.number(),
  favoriteCount: z.number(),
  summary: z.string(),
});

export const getUserRecipes: Tool<typeof inputSchema, typeof outputSchema> = 
  createTool({
    id: ToolId.GetUserRecipes,
    description: `Search and retrieve the user's saved and/or favorite recipes from their personal collection. 
    This tool can filter by saved status, favorite status, or search by title/ingredients. 
    Use this when the user asks about their existing recipes, wants to find something they've saved before, 
    needs to see their favorites, or wants to search through their recipe collection.
    
    Examples:
    - "Show me my saved recipes"
    - "What are my favorite pasta recipes?"
    - "Find recipes with chicken in my collection"
    - "Do I have any quick recipes saved?"`,
    inputSchema,
    outputSchema,
    execute: async (executionContext) => {
      const { savedOnly, favoritesOnly, searchQuery } = executionContext.context;
      try {
        // Get userId from global state set before tool execution
        const userId = getCurrentUserId();
        
        if (!userId) {
          throw new Error("User ID not available - make sure setCurrentUserId was called");
        }

        // Build the where clause for filtering
        const whereConditions: Prisma.ElaboratedRecipeWhereInput = {
          userId: userId,
        };

        if (savedOnly) {
          whereConditions.isSaved = true;
        }

        if (favoritesOnly) {
          whereConditions.isFavorite = true;
        }

        // Add search functionality
        if (searchQuery) {
          whereConditions.OR = [
            {
              title: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
            {
              // Search within ingredients JSON array
              ingredients: {
                path: ['$'],
                string_contains: searchQuery,
              },
            },
          ];
        }

        // // Query the database
        const recipes = await prisma.elaboratedRecipe.findMany({
          where: whereConditions,
          orderBy: {
            createdAt: 'desc',
          },
        });

        // Calculate counts
        const totalCount = recipes.length;
        const savedCount = recipes.filter(r => r.isSaved).length;
        const favoriteCount = recipes.filter(r => r.isFavorite).length;

        // Generate a helpful summary
        let summary = `Found ${totalCount} recipe${totalCount !== 1 ? 's' : ''}`;
        
        if (savedOnly) {
          summary += ` (saved recipes)`;
        } else if (favoritesOnly) {
          summary += ` (favorite recipes)`;
        } else {
          summary += ` (${savedCount} saved, ${favoriteCount} favorites)`;
        }
        
        if (searchQuery) {
          summary += ` matching "${searchQuery}"`;
        }

        if (totalCount === 0) {
          summary = searchQuery 
            ? `No recipes found matching "${searchQuery}" in your collection.`
            : savedOnly 
              ? "You haven't saved any recipes yet."
              : favoritesOnly
                ? "You haven't favorited any recipes yet."
                : "Your recipe collection is empty.";
        }

        return {
          recipes: recipes,
          recipeIds: recipes.map(recipe => recipe.id),
          totalCount,
          savedCount,
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
          savedCount: 0,
          favoriteCount: 0,
          summary: "Unable to retrieve recipes at the moment. Please try again.",
        };
      }
    },
  });