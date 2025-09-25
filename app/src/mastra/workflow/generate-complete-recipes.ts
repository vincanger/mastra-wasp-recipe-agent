import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { getIsoAndHumanDate } from "../tools/get-current-date";
import { generateThumbnailForRecipe } from "../tools/generate-recipe-thumbnail";
import { WorkflowId } from "./ids";
import { AgentId } from "../agents/ids";
import { elaboratedRecipeSchema } from "../schemas/recipe-schema";

const generateElaboratedRecipesOutputSchema = z.object({
  recipes: z.array(
    z.object({
      id: z.string().nullable(),
      title: z.string(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string()),
      dateCreated: z.string(),
      thumbnailUrl: z.string().nullable(),
    })
  ),
  userId: z.string(),
});

const generateCompleteRecipesInputSchema = z.object({
  titles: z.array(z.string()).min(1),
  userId: z.string().describe("User ID for organizing uploaded thumbnail files"),
});
export const generateCompleteRecipesOutputSchema = z.object({
  recipes: z.array(
    z.object({
      id: z.string().nullable(),
      title: z.string(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string()),
      dateCreated: z.string(),
      thumbnailUrl: z.string().nullable(),
    })
  ),
});
export type GenerateCompleteRecipesOutput = z.infer<typeof generateCompleteRecipesOutputSchema>;

const generateInitialMessageStep = createStep({
  id: "generateInitialMessageStep",
  inputSchema: z.object({
    titles: z.array(z.string()).min(1),
  }),
  outputSchema: z.object({
    initialMessage: z.string(),
  }),
  execute: async ({ inputData }) => {
    return { initialMessage: "Generating recipes for: " + inputData.titles.join(", ") };
  },
});

// Step 1: Generate elaborated recipes (text content only)
const generateElaboratedRecipesStep = createStep({
  id: "generateElaboratedRecipesStep",
  inputSchema: generateCompleteRecipesInputSchema,
  outputSchema: generateElaboratedRecipesOutputSchema,
  execute: async ({ inputData, mastra }) => {
    const { iso: todaysDate } = getIsoAndHumanDate();

    const recipeElaborator = mastra.getAgent(AgentId.RecipeElaborator);

    const results = await Promise.all(
      inputData.titles.map(async (title) => {
        const res = await recipeElaborator.generateVNext(`Generate a complete, elaborated recipe with today's date ${todaysDate} for the following recipe idea: ${title}`, {
          structuredOutput: {
            schema: z.object({
              id: z.string().nullable(),
              title: z.string(),
              ingredients: z.array(z.string()),
              instructions: z.array(z.string()),
              dateCreated: z.string(),
              thumbnailUrl: z.string().nullable(),
            }),
            errorStrategy: 'warn',
          },
          toolChoice: 'none', 
          format: 'aisdk',
        });
        if (!res.object) {
          throw new Error(`Failed to generate elaborated recipe for: ${title}`);
        }
        return res.object;
      }),
    );

    return { recipes: results, userId: inputData.userId };
  },
});

// Step 2: Generate thumbnails for all recipes
const generateRecipeThumbnailsStep = createStep({
  id: "generateRecipeThumbnailsStep",
  inputSchema: generateElaboratedRecipesOutputSchema,
  outputSchema: generateCompleteRecipesOutputSchema,
  execute: async ({ inputData }) => {
    const recipesWithThumbnails = await Promise.all(
      inputData.recipes.map(async (recipe) => {
        try {
          const thumbnailResult = await generateThumbnailForRecipe(
            recipe,
            inputData.userId
          );

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

    return { recipes: recipesWithThumbnails };
  },
});

export const generateCompleteRecipes = createWorkflow({
  id: WorkflowId.GenerateCompleteRecipes,
  inputSchema: generateCompleteRecipesInputSchema,
  outputSchema: generateCompleteRecipesOutputSchema,
})
  .then(generateElaboratedRecipesStep)
  .then(generateRecipeThumbnailsStep)
  .commit();
