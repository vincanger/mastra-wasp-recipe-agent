import { createTool } from '@mastra/core/tools';
import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { getIsoAndHumanDate } from './tools/7309d2c6-83bb-407e-8d0c-51f46fca779f.mjs';
import { ToolId } from './tools/991d5cf0-e1b2-4aec-94a6-5b0f38fa58e8.mjs';

var WorkflowId = /* @__PURE__ */ ((WorkflowId2) => {
  WorkflowId2["GenerateFullRecipesWorkflow"] = "generateFullRecipesWorkflow";
  return WorkflowId2;
})(WorkflowId || {});

const elaboratedRecipeSchema = z.object({
  id: z.string().nullable(),
  title: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  dateCreated: z.string()
});
const elaborateRecipesInputSchema = z.object({
  titles: z.array(z.string()).min(1)
});
const elaborateRecipesOutputSchema = z.object({
  recipes: z.array(elaboratedRecipeSchema)
});
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
              errorStrategy: "warn"
            },
            toolChoice: "none"
          }
        );
        if (!res.object) {
          throw new Error(`Failed to generate elaborated recipe for: ${title}`);
        }
        return res.object;
      })
    );
    return { recipes: results };
  }
});
const generateFullRecipesWorkflow = createWorkflow({
  id: WorkflowId.GenerateFullRecipesWorkflow,
  inputSchema: elaborateRecipesInputSchema,
  outputSchema: elaborateRecipesOutputSchema
}).then(generateElaboratedRecipesStep).commit();

const runGenerateFullRecipesWorkflow = createTool({
  id: ToolId.RunGenerateFullRecipesWorkflow,
  description: "Generate full, detailed recipes for the provided titles by running the recipe workflow.",
  inputSchema: elaborateRecipesInputSchema,
  outputSchema: elaborateRecipesOutputSchema,
  execute: async (executionContext) => {
    const { titles } = executionContext.context;
    const mastra = executionContext.mastra;
    if (!mastra) {
      throw new Error("Mastra is not available");
    }
    const run = await mastra.getWorkflow(WorkflowId.GenerateFullRecipesWorkflow).createRunAsync();
    const response = await run.start({ inputData: { titles } });
    if (response.status !== "success") {
      throw new Error("Recipe generation workflow failed");
    }
    console.log(`response from ${ToolId.RunGenerateFullRecipesWorkflow} tool: `, response);
    return response.result;
  }
});

export { generateFullRecipesWorkflow as g, runGenerateFullRecipesWorkflow as r };
