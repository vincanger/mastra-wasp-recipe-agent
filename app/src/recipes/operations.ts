import type { ChatWithRecipeAgent } from "wasp/server/operations";
import type { FormattedRecipe } from "../mastra/workflow/generate-full-recipes";
import { HttpError } from 'wasp/server';

import { mastra } from "../mastra";
import { ToolId } from "../mastra/tools/ids";
import { AgentId } from "../mastra/agents/ids";
import { setCurrentUserId } from "../mastra/tools/get-user-recipes";

type ChatWithRecipeAgentInput = {
  message: string;
  resourceId: string;
  threadId: string;
};

// Define the actual output type that matches what we're returning
export type ChatWithRecipeAgentOutput = {
  text: string;
  recipesCreated?: number; // Optional count of recipes created
  displayRecipeIds?: string[]; // Recipe IDs to display when getUserRecipes tool is used
};

// Helper function to group tool results by tool ID
const groupToolResultsByToolId = (
  toolResults: any[],
): Map<ToolId, any[]> => {
  const resultsByToolId = new Map<ToolId, any[]>();

  toolResults.forEach((toolResult) => {
    const { toolName } = toolResult.payload;
    if (!resultsByToolId.has(toolName)) {
      resultsByToolId.set(toolName, []);
    }
    resultsByToolId.get(toolName)!.push(toolResult);
  });

  return resultsByToolId;
};

// Helper function to extract recipes from tool results
const extractRecipesFromToolResults = (
  toolResults: any[],
): FormattedRecipe[] => {
  const recipes: FormattedRecipe[] = [];
  
  toolResults.forEach((toolResult) => {
    if (toolResult.payload.result && toolResult.payload.result.recipes) {
      toolResult.payload.result.recipes.forEach((recipe: FormattedRecipe) => {
        recipes.push(recipe);
      });
    }
  });
  
  return recipes;
};

export const chatWithRecipeAgent: ChatWithRecipeAgent<
  ChatWithRecipeAgentInput,
  ChatWithRecipeAgentOutput
> = async ({ message, resourceId, threadId }, context) => {
  console.log(`starting chat with ${AgentId.RecipeOrchestrator} agent`);

  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  // Set the current user ID for tools to access
  setCurrentUserId(resourceId);

  const recipeAgent = mastra.getAgent(AgentId.RecipeOrchestrator);

  // const memory = mastra.getMemory();
  // const lastThread = await memory?.getThreadById({threadId});

  const { text, toolResults } = await recipeAgent.generateVNext(message, {
    memory: {
      resource: resourceId, // user id
      thread: threadId, // conversation id
    },
  });

  console.log(`${AgentId.RecipeOrchestrator} agent toolResults: `, toolResults);
  console.log(`${AgentId.RecipeOrchestrator} agent text: `, text);

  // Process tool results server-side
  let recipesCreated = 0;
  let displayRecipeIds: string[] | undefined;
  
  if (toolResults && toolResults.length > 0) {
    const resultsByToolId = groupToolResultsByToolId(toolResults);
    
    // If we have recipe generation results, persist them to the database
    if (resultsByToolId.has(ToolId.RunGenerateFullRecipesWorkflow)) {
      const recipeToolResults = resultsByToolId.get(ToolId.RunGenerateFullRecipesWorkflow)!;
      const recipes = extractRecipesFromToolResults(recipeToolResults);
      
      // Save each recipe to the database
      for (const recipe of recipes) {
        await context.entities.ElaboratedRecipe.create({
          data: {
            userId: context.user.id,
            title: recipe.title,
            ingredients: recipe.ingredients, // JSON field - array of strings
            instructions: recipe.instructions, // JSON field - array of strings
            dateCreated: recipe.dateCreated,
            isSaved: false,
            isFavorite: false,
          },
        });
        recipesCreated++;
      }
      
      console.log(`Persisted ${recipesCreated} recipes to database for user ${context.user.id}`);
    }
    
    // If getUserRecipes tool was called, extract the recipe IDs for display filtering
    if (resultsByToolId.has(ToolId.GetUserRecipes)) {
      const userRecipeToolResults = resultsByToolId.get(ToolId.GetUserRecipes)!;
      const recipeIds: string[] = [];
      
      userRecipeToolResults.forEach((toolResult) => {
        if (toolResult.payload.result && toolResult.payload.result.recipeIds) {
          recipeIds.push(...toolResult.payload.result.recipeIds);
        }
      });
      
      displayRecipeIds = recipeIds;
      console.log(`Found ${recipeIds.length} recipe IDs from getUserRecipes tool for user ${context.user.id}`);
    }
  }

  return { text, recipesCreated, displayRecipeIds };
};

// toolResults:  [
//   {
//     type: 'tool-result',
//     runId: 'd1fda321-1e51-40b6-b0d8-e4034586c8f0',
//     from: 'AGENT',
//     payload: {
//       args: [Object],
//       toolCallId: 'call_D443DNexuR1wR51ojl2RbPYi',
//       toolName: 'createRecipes',
//       result: [Object],
//       providerMetadata: [Object],
//       providerExecuted: undefined
//     }
//   }
// ]
