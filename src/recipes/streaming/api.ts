import type { AuthUser } from 'wasp/auth';
import type { StreamChatWithRecipeAgent } from 'wasp/server/api';
import type { MiddlewareConfigFn } from 'wasp/server';
import type { ChunkType } from '@mastra/core';
import type { TextStreamChunk, ToolChunk } from './chatStreaming';
import type { Response } from 'express';

import { HttpError } from 'wasp/server';
import { AgentId } from '../../mastra/agents/ids';
import { mastra } from '../../mastra';
import { ToolId } from '../../mastra/tools/ids';
import { RuntimeContext } from '@mastra/core/runtime-context';
import { printWorkflowStepStatus, WorkflowId, WorkflowStepId } from '../../mastra/workflow/ids';
import { mastraToolOutputChunkSchema, mastraToolResultChunkSchema, streamChatRequestBodySchema } from './chatStreaming';

export type UserRuntimeContext = Pick<AuthUser, 'id'>;

export const streamChatWithRecipeAgent: StreamChatWithRecipeAgent = async (req, res, context) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  const { success, data, error } = streamChatRequestBodySchema.safeParse(req.body);
  if (!success) {
    throw new HttpError(400, 'Invalid request body', { errors: error.errors });
  }

  const runtimeContext = new RuntimeContext<UserRuntimeContext>();
  runtimeContext.set('id', context.user.id);

  const { messages } = data;
  for (const message of messages) {
    const { parts, metadata } = message;
    const { threadId } = metadata;
    const messageText = parts.map((part: { text: string }) => part.text).join('');

    const recipeOrchestrator = mastra.getAgent(AgentId.RecipeOrchestrator);
    const streamResult = await recipeOrchestrator.streamVNext(messageText, {
      memory: {
        resource: context.user.id, // user id
        thread: threadId, // conversation id
      },
      // Pass userId from Wasp context to Mastra's runtimeContext so tools and workflows can access it.
      runtimeContext
    });

    for await (const chunk of streamResult.fullStream) {
      try {
        switch (chunk.type) {
          case 'text-delta':
            handleTextDeltaChunk(chunk, res);
            break;

          case 'tool-call-input-streaming-start':
            handleToolCallStartChunk(chunk, res);
            break;

          case 'tool-output':
            handleToolOutputChunk(chunk, res);
            break;

          case 'tool-result':
            console.log('tool-result chunk: ', chunk);
            if (handleToolResultChunk(chunk, res)) {
              return; // Stream ended
            }
            break;

          default:
            console.log('Unhandled chunk type:', chunk.type);
            break;
        }
      } catch (error) {
        console.error('Error processing chunk:', error);
        // Continue processing other chunks instead of crashing
      }
    }
  }

  res.end();
};

function handleTextDeltaChunk(chunk: Extract<ChunkType, { type: 'text-delta' }>, res: Response) {
  const textDeltaChunk: TextStreamChunk = {
    type: chunk.type,
    content: chunk.payload.text,
  };
  res.write(JSON.stringify(textDeltaChunk));
}

function handleToolCallStartChunk(chunk: Extract<ChunkType, { type: 'tool-call-input-streaming-start' }>, res: Response) {
  const toolName = chunk.payload.toolName;
  if (toolName === WorkflowId.GenerateCompleteRecipes || toolName === ToolId.GetUserRecipes) {
    const toolCallStartChunk: ToolChunk = {
      type: chunk.type,
      toolId: toolName,
      toolCallStatus: 'starting',
      content: toolName === WorkflowId.GenerateCompleteRecipes ? '⏳ Starting recipe generation... ' : '⏳ Starting recipe search... ',
    };
    res.write(JSON.stringify(toolCallStartChunk));
  }
}

function handleToolOutputChunk(chunk: Extract<ChunkType, { type: 'tool-output' }>, res: Response) {
  const validated = mastraToolOutputChunkSchema.parse(chunk);

  if (validated.payload.output.type === 'workflow-step-start') {
    const { id } = validated.payload.output.payload;
    if (!id) {
      return;
    }
    // Handle the generate complete recipes workflow steps only, and pretty print messages for the user to keep them updated/engaged.
    if (Object.values(WorkflowStepId).includes(id)) {
      let stepMessage = printWorkflowStepStatus(id);
      const toolOutputChunk: ToolChunk = {
        type: chunk.type,
        toolId: id,
        toolCallStatus: 'running',
        content: stepMessage,
      };
      res.write(JSON.stringify(toolOutputChunk));
    }
  }
}

function handleToolResultChunk(chunk: Extract<ChunkType, { type: 'tool-result' }>, res: Response) {
  const { success, data, error } = mastraToolResultChunkSchema.safeParse(chunk);
  if (!success) {
    console.error('Invalid tool result chunk:', error);
    throw new HttpError(400, 'Invalid tool result chunk', { errors: error.errors });
  }

  const toolName = data.payload.toolName;

  if (toolName === WorkflowId.GenerateCompleteRecipes || toolName === ToolId.GetUserRecipes) {
    const toolResultChunk: ToolChunk = {
      type: chunk.type,
      toolId: toolName,
      toolCallStatus: 'finished',
      content: toolName === WorkflowId.GenerateCompleteRecipes ? '🍕 Your recipes are ready! ' : `🍕 ${data.payload.result?.recipeIds?.length} recipes were found.`,
      recipeIds: data.payload.result?.recipeIds,
    };
    res.write(JSON.stringify(toolResultChunk));
    // Our workflow result saves an array of completed recipes,
    // to the db, so we can end the stream and display the recipes
    // in the detailed recipe view without also streaming the entire recipe text.
    res.end();
    return true;
  }
  return false;
}

// Returning the default config is necessary for our custom API.
export const getMiddlewareConfig: MiddlewareConfigFn = (config) => {
  return config;
};
