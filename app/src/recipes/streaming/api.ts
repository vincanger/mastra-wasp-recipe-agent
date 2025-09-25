import type { StreamChatWithRecipeAgent } from 'wasp/server/api';
import type { GenerateCompleteRecipesResponse, AnyToolResponse } from '../../mastra/tools/responses';
import type { MiddlewareConfigFn } from 'wasp/server';

import { HttpError} from 'wasp/server';
import { AgentId } from '../../mastra/agents/ids';
import { mastra } from '../../mastra';
import { setUserIdForToolUse, ToolId } from '../../mastra/tools/ids';
import { ToolResultExtractor } from '../../mastra/tools/responses';
import { ElaboratedRecipe } from '../../mastra/schemas/recipe-schema';

// Custom API endpoint that returns a streaming text.
export const streamChatWithRecipeAgent: StreamChatWithRecipeAgent = async (req, res, context) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  console.log('req.body', req.body)
  
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  const { messages } = req.body;
  for (const message of messages) {
    const { parts, metadata } = message;
    const { threadId } = metadata;

    setUserIdForToolUse(context.user.id);

    const recipeOrchestrator = mastra.getAgent(AgentId.RecipeOrchestrator);

    const messageText = parts.map((part: { text: string }) => part.text).join('');

    const streamResult = await recipeOrchestrator.streamVNext(messageText, {
      memory: {
        resource: context.user.id, // user id
        thread: threadId, // conversation id
      },
    });

    for await (const chunk of streamResult.textStream) {
      res.write(chunk);
    }
    for await (const chunk of streamResult.fullStream) {
      if (chunk.type === 'tool-result') {
        const toolName = chunk.payload.toolName;
        const toolResult = chunk.payload.result;
      }
    }
    const toolResults = await streamResult.toolResults;
    let numRecipesCreated = 0;
    let completionText = '';
    let displayRecipeIds: string[] = [];
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
      const responseObject = {
        text: completionText,
        numRecipesCreated,
        displayRecipeIds,
        toolIdsCalled: toolIdsCalled.map((id) => id.toString()),
      };
      res.json(responseObject)
    }
  }

  res.end();
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
  context: Parameters<StreamChatWithRecipeAgent>[2];
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


// Returning the default config.
export const getMiddlewareConfig: MiddlewareConfigFn = (config) => {
  return config;
};
