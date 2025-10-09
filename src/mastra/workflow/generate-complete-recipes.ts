import type { AuthUser } from 'wasp/auth';
import type { UserRuntimeContext } from '../../recipes/streaming/api';

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { getIsoAndHumanDate } from '../tools/get-current-date';
import { generateThumbnailForRecipe } from '../tools/generate-recipe-thumbnail';
import { WorkflowId, WorkflowStepId } from './ids';
import { AgentId } from '../agents/ids';
import { elaboratedRecipeSchema, recipeDbModelSchema } from '../schemas/recipe-schema';
import { saveRecipes } from 'wasp/server/operations';

const generateCompleteRecipesInputSchema = z.object({
  titles: z.array(z.string()).min(1),
});
const generateElaboratedRecipesOutputSchema = z.object({
  recipes: z.array(elaboratedRecipeSchema),
  userId: z.string(),
});

export const generateCompleteRecipesOutputSchema = z.object({
  recipes: z.array(recipeDbModelSchema),
  userId: z.string(),
});
export type GenerateCompleteRecipesOutput = z.infer<typeof generateCompleteRecipesOutputSchema>;

// Step 1: Generate elaborated recipes (text content only)
const generateElaboratedRecipesStep = createStep({
  id: WorkflowStepId.GenerateElaboratedRecipesStep,
  inputSchema: generateCompleteRecipesInputSchema,
  outputSchema: generateElaboratedRecipesOutputSchema,
  execute: async ({ inputData, mastra, runtimeContext }) => {
    const userId = runtimeContext.get('id') as UserRuntimeContext['id'];
    if (!userId) {
      throw new Error('userId is required for generateElaboratedRecipesStep. It must be provided in input or runContext.');
    }
    
    const { iso: todaysDate } = getIsoAndHumanDate();
    const recipeElaborator = mastra.getAgent(AgentId.RecipeElaborator);

    const results = await Promise.all(
      inputData.titles.map(async (title) => {
        const res = await recipeElaborator.generateVNext(`Generate a complete, elaborated recipe with today's date ${todaysDate} for the following recipe idea: ${title}`, {
          structuredOutput: {
            schema: elaboratedRecipeSchema,
            errorStrategy: 'warn',
          },
          toolChoice: 'none',
          format: 'aisdk',
        });
        if (!res.object) {
          throw new Error(`Failed to generate elaborated recipe for: ${title}`);
        }
        return res.object;
      })
    );

    return { recipes: results, userId };
  },
});

// Step 2: Generate thumbnails for all recipes
const generateRecipeThumbnailsStep = createStep({
  id: WorkflowStepId.GenerateRecipeThumbnailsStep,
  inputSchema: generateElaboratedRecipesOutputSchema,
  outputSchema: generateElaboratedRecipesOutputSchema,
  execute: async ({ inputData }) => {
    const recipesWithThumbnails = await Promise.all(
      inputData.recipes.map(async (recipe) => {
        try {
          const thumbnailResult = await generateThumbnailForRecipe(recipe, inputData.userId);

          return {
            ...recipe,
            thumbnailUrl: thumbnailResult.success ? thumbnailResult.thumbnailUrl : null,
          };
        } catch (error) {
          console.error(`Failed to generate thumbnail for ${recipe.title}:`, error);
          // Continue without thumbnail if generation fails
          return {
            ...recipe,
            thumbnailUrl: null,
          };
        }
      })
    );

    return { recipes: recipesWithThumbnails, userId: inputData.userId };
  },
});

// Step 3: Save recipes to database
const saveRecipesToDatabaseStep = createStep({
  id: WorkflowStepId.SaveRecipesToDatabaseStep,
  inputSchema: generateElaboratedRecipesOutputSchema,
  outputSchema: generateCompleteRecipesOutputSchema,
  execute: async ({ inputData }) => {
    const recipes = await saveRecipes(inputData.recipes, { user: { id: inputData.userId } as AuthUser });
    return { recipes, userId: inputData.userId };
  },
});

export const generateCompleteRecipes = createWorkflow({
  id: WorkflowId.GenerateCompleteRecipes,
  inputSchema: generateCompleteRecipesInputSchema,
  outputSchema: generateCompleteRecipesOutputSchema,
})
  .then(generateElaboratedRecipesStep)
  .then(generateRecipeThumbnailsStep)
  .then(saveRecipesToDatabaseStep)
  .commit();
