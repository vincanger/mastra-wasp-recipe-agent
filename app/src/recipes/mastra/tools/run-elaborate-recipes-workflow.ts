import { createTool, type Tool } from "@mastra/core/tools";
import { elaborateRecipesInputSchema, elaborateRecipesOutputSchema } from "../workflow/generate-full-recipes";
import { ToolId } from "./ids";
import { WorkflowId } from "../workflow/ids";

export const runElaborateRecipesWorkflow: Tool<typeof elaborateRecipesInputSchema, typeof elaborateRecipesOutputSchema> = createTool({
  id: ToolId.RunElaborateRecipesWorkflow,
  description: "Generate full, detailed recipes for the provided titles by running the recipe workflow.",
  inputSchema: elaborateRecipesInputSchema,
  outputSchema: elaborateRecipesOutputSchema,
  execute: async (executionContext) => {
    const { titles } = executionContext.context;
    const mastra = executionContext.mastra;
    
    if (!mastra) {
      throw new Error("Mastra is not available");
    }
    
    const run = await mastra
      .getWorkflow(WorkflowId.ElaborateRecipesWorkflow)
      .createRunAsync();
    const response = await run.start({ inputData: { titles } });
    
    if (response.status !== "success") {
      throw new Error("Recipe generation workflow failed");
    }
    
    console.log(`response from ${ToolId.RunElaborateRecipesWorkflow} tool: `, response)
    return response.result
  },
});
