import type { ChatWithRecipeAgent } from 'wasp/server/operations';
import type { GenerateElaboratedRecipesOutput, ElaboratedRecipe } from './mastra/workflow/generate-full-recipes';

import { HttpError } from 'wasp/server';
import { mastra } from './mastra';
import { ToolId } from './mastra/tools/ids';
import { AgentId } from './mastra/agents/ids';
import { GetUserRecipesOutput, setCurrentUserId } from './mastra/tools/get-user-recipes';

type ToolCallResponse = ElaboratedRecipeResponse | GetUserRecipesResponse;
type ElaboratedRecipeResponse = {
  payload: {
    toolName: ToolId.RunElaborateRecipesWorkflow;
    result: GenerateElaboratedRecipesOutput;
  };
};
type GetUserRecipesResponse = {
  payload: {
    toolName: ToolId.GetUserRecipes;
    result: GetUserRecipesOutput;
  };
};

type ChatWithRecipeAgentInput = {
  message: string;
  resourceId: string;
  threadId: string;
};
export type ChatWithRecipeAgentOutput = {
  text: string;
  toolIdsCalled: string[];
  displayRecipeIds: string[];
  numRecipesCreated: number;
};

export const chatWithRecipeAgent: ChatWithRecipeAgent<ChatWithRecipeAgentInput, ChatWithRecipeAgentOutput> = async ({ message, resourceId, threadId }, context) => {
  console.log(`starting chat with ${AgentId.RecipeOrchestrator} agent`);

  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  // Set the current user ID for tools to access
  setCurrentUserId(resourceId);

  const recipeAgent = mastra.getAgent(AgentId.RecipeOrchestrator);

  const { text, toolResults } = await recipeAgent.generateVNext(message, {
    memory: {
      resource: resourceId, // user id
      thread: threadId, // conversation id
    },
  });

  console.log(`${AgentId.RecipeOrchestrator} agent toolResults: `, toolResults);
  console.log(`${AgentId.RecipeOrchestrator} agent text: `, text);

  const displayRecipeIds: string[] = [];
  const toolIdsCalled: string[] = [];
  let completionText = text;
  let numRecipesCreated = 0;
  const prependedToolCallsCompletionText = 'The following tasks were completed: \n';

  if (toolResults.length > 0) {
    const resultsByToolId = groupToolResultsByToolId(toolResults);

    if (resultsByToolId.has(ToolId.RunElaborateRecipesWorkflow)) {
      const result = await saveAndReturnRecipeData({ resultsByToolId, context, prependedToolCallsCompletionText });
      numRecipesCreated = result.recipesCreated;
      completionText = result.completionText;
      displayRecipeIds.push(...result.recipeIds);
    }

    if (resultsByToolId.has(ToolId.GetUserRecipes)) {
      const userRecipeIds = extractRecipeIdsFromUserRecipes({ resultsByToolId });
      displayRecipeIds.push(...userRecipeIds);
    }

    toolIdsCalled.push(...toolResults.map((toolResult) => toolResult.payload.toolName));
  }

  return { text: completionText, numRecipesCreated: numRecipesCreated, displayRecipeIds, toolIdsCalled };
};

const groupToolResultsByToolId = (toolResults: ToolCallResponse[]) => {
  const resultsByToolId = new Map<ToolId, ToolCallResponse[]>();

  toolResults.forEach((toolResult) => {
    const { toolName } = toolResult.payload;
    if (!resultsByToolId.has(toolName)) {
      resultsByToolId.set(toolName, []);
    }
    resultsByToolId.get(toolName)!.push(toolResult);
  });

  return resultsByToolId;
};

const extractElaborateRecipes = (recipeToolResults: ElaboratedRecipeResponse[]) => {
  const recipes: ElaboratedRecipe[] = [];

  for (const toolResult of recipeToolResults) {
    const payload = toolResult.payload;
    payload.result.recipes.forEach((recipe: ElaboratedRecipe) => {
        recipes.push(recipe);
    });
  }

  return recipes;
};

async function saveAndReturnRecipeData({
  resultsByToolId,
  context,
  prependedToolCallsCompletionText,
}: {
  resultsByToolId: ReturnType<typeof groupToolResultsByToolId>;
  context: Parameters<ChatWithRecipeAgent>[1];
  prependedToolCallsCompletionText: string;
}) {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  let recipesCreated = 0;
  const savedRecipeIds: string[] = [];
  const recipeToolResults = resultsByToolId.get(ToolId.RunElaborateRecipesWorkflow)!;
  const recipes = extractElaborateRecipes(recipeToolResults as ElaboratedRecipeResponse[]);

  const recipeTitles = recipes.map((recipe) => recipe.title);

  for (const recipe of recipes) {
    const savedRecipe = await context.entities.ElaboratedRecipe.create({
      data: {
        userId: context.user.id,
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        dateCreated: recipe.dateCreated,
        isFavorite: false,
      },
    });
    savedRecipeIds.push(savedRecipe.id);
    recipesCreated++;
  }

  const appendedToolCallsCompletionText = `- Created ${recipesCreated} recipes: ${recipeTitles.join(', ')}.\n`;
  const completionText = prependedToolCallsCompletionText + appendedToolCallsCompletionText;
  console.log(`Persisted ${recipesCreated} recipes to database for user ${context.user.id}`);

  return { recipesCreated, completionText, recipeIds: savedRecipeIds };
}

function extractRecipeIdsFromUserRecipes({ resultsByToolId }: { resultsByToolId: ReturnType<typeof groupToolResultsByToolId> }): string[] {
  const userRecipeToolResults = resultsByToolId.get(ToolId.GetUserRecipes)! as GetUserRecipesResponse[];
  const payloads = userRecipeToolResults.map((toolResult) => toolResult.payload);
  const recipes = payloads.map((payload) => payload.result.recipes);
  const recipeIds = recipes.flatMap((recipe) => recipe.map((recipe) => recipe.id));
  console.log(`Found ${recipeIds.length} recipe IDs from getUserRecipes tool.`);
  return recipeIds;
}

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
