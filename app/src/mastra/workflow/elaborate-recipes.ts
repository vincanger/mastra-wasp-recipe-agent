import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { getIsoAndHumanDate } from "../tools/get-current-date";
import { generateThumbnailForRecipe } from "../tools/generate-recipe-thumbnail";
import { WorkflowId } from "./ids";

export const elaboratedRecipeSchema = z.object({
  id: z.string().nullable(),
  title: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  dateCreated: z.string(),
  thumbnailUrl: z.string().nullable(),
});
export type ElaboratedRecipe = z.infer<typeof elaboratedRecipeSchema>;

const elaborateRecipesInputSchema = z.object({
  titles: z.array(z.string()).min(1),
  userId: z.string().describe("User ID for organizing uploaded thumbnail files"),
});
export const elaborateRecipesOutputSchema = z.object({
  recipes: z.array(elaboratedRecipeSchema),
});
export type GenerateElaboratedRecipesOutput = z.infer<typeof elaborateRecipesOutputSchema>;

// Step 1: Generate elaborated recipes (text content only)
const generateElaboratedRecipesStep = createStep({
  id: "generateElaboratedRecipesStep",
  inputSchema: elaborateRecipesInputSchema,
  outputSchema: z.object({
    recipes: z.array(elaboratedRecipeSchema),
    userId: z.string(),
  }),
  execute: async ({ inputData, mastra }) => {
    const { iso: todaysDate } = getIsoAndHumanDate();

    const recipeElaborator = mastra.getAgent("recipeElaborator");

    const results = await Promise.all(
      inputData.titles.map(async (title, index) => {
        const res = await recipeElaborator.generateVNext(
          `Generate a complete, elaborated recipe with today's date ${todaysDate} for the following recipe idea: ${title}`,
          {
            structuredOutput: {
              schema: elaboratedRecipeSchema,
              errorStrategy: "warn",
            },
            toolChoice: "none",
          },
        );
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
  inputSchema: z.object({
    recipes: z.array(elaboratedRecipeSchema),
    userId: z.string(),
  }),
  outputSchema: elaborateRecipesOutputSchema,
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

export const elaborateRecipesWorkflow = createWorkflow({
  id: WorkflowId.ElaborateRecipesWorkflow,
  inputSchema: elaborateRecipesInputSchema,
  outputSchema: elaborateRecipesOutputSchema,
})
  .then(generateElaboratedRecipesStep)
  .then(generateRecipeThumbnailsStep)
  .commit();