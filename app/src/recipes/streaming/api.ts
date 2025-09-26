import type { StreamChatWithRecipeAgent } from 'wasp/server/api';
import type { GenerateCompleteRecipesResponse, AnyToolResponse } from '../../mastra/tools/responses';
import type { MiddlewareConfigFn } from 'wasp/server';

import { HttpError } from 'wasp/server';
import { AgentId } from '../../mastra/agents/ids';
import { mastra } from '../../mastra';
import { setUserIdForToolUse, ToolId } from '../../mastra/tools/ids';
import { ToolResultExtractor } from '../../mastra/tools/responses';
import { ElaboratedRecipe } from '../../mastra/schemas/recipe-schema';
import { ChunkType } from '@mastra/core';

// Custom API endpoint that returns a streaming text.
export const streamChatWithRecipeAgent: StreamChatWithRecipeAgent = async (req, res, context) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
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

    for await (const chunk of streamResult.fullStream) {
      if (chunk.type === 'tool-result' && chunk.payload.toolName === ToolId.RunGenerateCompleteRecipes) {
        res.write(`Your recipes are ready!`);
        break;
      } else if (chunk.type === 'text-delta') {
        res.write(chunk.payload.text);
      }
    }

    const toolResults = await streamResult.toolResults;
    if (toolResults.length > 0) {
      const toolResultExtractor = new ToolResultExtractor(toolResults as AnyToolResponse[]);
      if (toolResultExtractor.hasResults(ToolId.RunGenerateCompleteRecipes)) {
        await saveAndReturnRecipeData({
          toolResultExtractor,
          context,
        });
      }
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

async function saveAndReturnRecipeData({ toolResultExtractor, context }: { toolResultExtractor: ToolResultExtractor; context: Parameters<StreamChatWithRecipeAgent>[2] }) {
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  let recipesCreated = 0;
  const savedRecipeIds: string[] = [];
  const elaboratedRecipeResults = toolResultExtractor.getResults(ToolId.RunGenerateCompleteRecipes);
  const recipes = flattenElaboratedRecipesArray(elaboratedRecipeResults);

  console.log('recipes within api saveAndReturnRecipeData: ', recipes);

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

  console.log(`Persisted ${recipesCreated} recipes to database for user ${context.user.id}`);

  return { recipesCreated, recipeIds: savedRecipeIds };
}

// Returning the default config.
export const getMiddlewareConfig: MiddlewareConfigFn = (config) => {
  return config;
};
