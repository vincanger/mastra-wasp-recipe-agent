import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { recipeOrchestrator } from "./agents/recipe-orchestrator";
import { recipeElaborator } from "./agents/recipe-elaborator";
import { generateCompleteRecipes } from "./workflow/generate-complete-recipes";
// import { MastraJwtAuth } from "@mastra/auth";

export const mastra: Mastra = new Mastra({
  agents: { recipeOrchestrator, recipeElaborator },
  workflows: { generateCompleteRecipes },

  storage: new LibSQLStore({
    url: 'file:../memory.db',
  }),

  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),

  server: {
    // experimental_auth: new MastraJwtAuth({
    //   secret: process.env.MASTRA_JWT_SECRET,
    // }),
  },
});
