import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { recipeOrchestrator } from "./agents/recipe-orchestrator";
import { recipeElaborator } from "./agents/recipe-elaborator";
import { elaborateRecipesWorkflow } from "./workflow/elaborate-recipes";

export const mastra: Mastra = new Mastra({
  agents: { recipeOrchestrator, recipeElaborator },
  workflows: { elaborateRecipesWorkflow },

  storage: new LibSQLStore({
    url: 'file:../memory.db',
  }),

  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
