import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { getCurrentDate } from "../tools/get-current-date";
import { AgentId } from "./ids";

export const recipeElaborator = new Agent({
  id: AgentId.RecipeElaborator,
  name: AgentId.RecipeElaborator,
  instructions:
    "Given a recipe idea, produce a complete, well-formatted recipe with: title, ingredients[], instructions[], and today's date via the date tool.",
  model: openai("gpt-4o-mini"),
  tools: {
    getCurrentDate,
  },
});
