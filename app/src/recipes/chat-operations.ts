import type { ChatWithRecipeAgent } from 'wasp/server/operations';
import type { ElaboratedRecipe } from '../mastra/schemas/recipe-schema';
import type { GenerateCompleteRecipesResponse, AnyToolResponse } from '../mastra/tools/responses';

import { ToolResultExtractor } from '../mastra/tools/responses';
import { HttpError } from 'wasp/server';
import { mastra } from '../mastra';
import { ToolId } from '../mastra/tools/ids';
import { AgentId } from '../mastra/agents/ids';
import { setUserIdForToolUse } from '../mastra/tools/ids';

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

  // Set the current user ID for mastra tools to access
  setUserIdForToolUse(resourceId);

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
  let completionText = text;
  let numRecipesCreated = 0;
  const prependedToolCallsCompletionText = 'The following tasks were completed: \n';

  if (toolResults.length > 0) {
    // Use the type-safe extractor
    const toolResultExtractor = new ToolResultExtractor(toolResults as AnyToolResponse[]);

    if (toolResultExtractor.hasResults(ToolId.RunGenerateCompleteRecipes)) {
      const result = await saveAndReturnRecipeData({
        toolResultExtractor,
        context,
        prependedToolCallsCompletionText,
      });
      numRecipesCreated = result.recipesCreated;
      completionText = result.completionText;
      displayRecipeIds.push(...result.recipeIds);
    }

    if (toolResultExtractor.hasResults(ToolId.GetUserRecipes)) {
      const userRecipeIds = extractRecipeIdsFromUserRecipes(toolResultExtractor);
      displayRecipeIds.push(...userRecipeIds);
    }

    const toolIdsCalled = toolResultExtractor.getCalledToolIds();
    return {
      text: completionText,
      numRecipesCreated,
      displayRecipeIds,
      toolIdsCalled: toolIdsCalled.map((id) => id.toString()),
    };
  }

  return { text: completionText, numRecipesCreated: 0, displayRecipeIds, toolIdsCalled: [] };
};

const flattenElaboratedRecipesArray = (recipeToolResults: GenerateCompleteRecipesResponse[]): ElaboratedRecipe[] => {
  const recipes: ElaboratedRecipe[] = [];

  for (const toolResult of recipeToolResults) {
    const payload = toolResult.payload;
    payload.result.recipes.forEach((recipe) => {
      recipes.push(recipe);
    });
  }

  return recipes;
};

async function saveAndReturnRecipeData({
  toolResultExtractor,
  context,
  prependedToolCallsCompletionText,
}: {
  toolResultExtractor: ToolResultExtractor;
  context: Parameters<ChatWithRecipeAgent>[1];
  prependedToolCallsCompletionText: string;
}) {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  let recipesCreated = 0;
  const savedRecipeIds: string[] = [];
  const elaboratedRecipeResults = toolResultExtractor.getResults(ToolId.RunGenerateCompleteRecipes);
  const recipes = flattenElaboratedRecipesArray(elaboratedRecipeResults);
  const recipeTitles = recipes.map((recipe) => recipe.title);

  for (const recipe of recipes) {
    const savedRecipe = await context.entities.ElaboratedRecipe.create({
      data: {
        userId: context.user.id,
        title: recipe.title,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        dateCreated: recipe.dateCreated,
        thumbnailUrl: recipe.thumbnailUrl ?? undefined,
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

function extractRecipeIdsFromUserRecipes(extractor: ToolResultExtractor): string[] {
  const userRecipeToolResults = extractor.getResults(ToolId.GetUserRecipes);
  const payloads = userRecipeToolResults.map((toolResult) => toolResult.payload);
  const recipes = payloads.map((payload) => payload.result.recipes);
  const recipeIds = recipes.flatMap((recipe) => recipe.map((recipe) => recipe.id));
  console.log(`Found ${recipeIds.length} recipe IDs from getUserRecipes tool.`);
  return recipeIds;
}
