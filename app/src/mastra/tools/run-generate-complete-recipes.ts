import { createTool, type Tool } from "@mastra/core/tools";
import { z } from "zod";
import { generateCompleteRecipesOutputSchema } from "../workflow/generate-complete-recipes";
import { ToolId } from "./ids";
import { WorkflowId } from "../workflow/ids";
import { getCurrentUserId } from "./ids";

const toolInputSchema = z.object({
  titles: z.array(z.string()).min(1),
});

export const runGenerateCompleteRecipes: Tool<typeof toolInputSchema, typeof generateCompleteRecipesOutputSchema> = createTool({
  id: ToolId.RunGenerateCompleteRecipes,
  description: "Generate full, detailed recipes for the provided titles by running the recipe workflow.",
  inputSchema: toolInputSchema,
  outputSchema: generateCompleteRecipesOutputSchema,
  execute: async (executionContext) => {
    const { titles } = executionContext.context;
    const mastra = executionContext.mastra;
    
    if (!mastra) {
      throw new Error("Mastra is not available");
    }
    
    const userId = getCurrentUserId();
    
    const run = await mastra
      .getWorkflow(WorkflowId.GenerateCompleteRecipes)
      .createRunAsync();
    const response = await run.start({ inputData: { titles, userId } });
    
    if (response.status !== "success") {
      throw new Error("Recipe generation workflow failed");
    }
    
    console.log(`response from ${ToolId.RunGenerateCompleteRecipes} tool: `, response)
    return response.result
  },
});
