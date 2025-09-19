import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { getIsoAndHumanDate } from "../tools/get-current-date";
import { WorkflowId } from "./ids";

export const elaboratedRecipeSchema = z.object({
  id: z.string().nullable(),
  title: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  dateCreated: z.string(),
});
export type ElaboratedRecipe = z.infer<typeof elaboratedRecipeSchema>;

export const elaborateRecipesInputSchema = z.object({
  titles: z.array(z.string()).min(1),
});
export const elaborateRecipesOutputSchema = z.object({
  recipes: z.array(elaboratedRecipeSchema),
});
export type GenerateElaboratedRecipesOutput = z.infer<typeof elaborateRecipesOutputSchema>;

const generateElaboratedRecipesStep = createStep({
  id: "generateElaboratedRecipesStep",
  inputSchema: elaborateRecipesInputSchema,
  outputSchema: elaborateRecipesOutputSchema,
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

    return { recipes: results };
  },
});

export const elaborateRecipesWorkflow = createWorkflow({
  id: WorkflowId.ElaborateRecipesWorkflow,
  inputSchema: elaborateRecipesInputSchema,
  outputSchema: elaborateRecipesOutputSchema,
})
  .then(generateElaboratedRecipesStep)
  // You can add more steps here, such as generating recipe thumbnails, etc
  // and can even run them in parallel with e.g. `.parallel([step1, step2])`
  .commit();