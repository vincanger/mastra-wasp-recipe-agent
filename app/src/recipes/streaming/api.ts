import type { StreamChatWithRecipeAgent } from 'wasp/server/api';
import type { MiddlewareConfigFn } from 'wasp/server';
import type { ChunkType } from '@mastra/core';
import type { TextStreamChunk, ToolOutputChunk, ToolCallStartChunk, ToolResultChunk } from './chunkTypes';
import type { Response } from 'express';

import { z } from 'zod';
import { HttpError } from 'wasp/server';
import { AgentId } from '../../mastra/agents/ids';
import { mastra } from '../../mastra';
import { setUserIdForToolUse, ToolId } from '../../mastra/tools/ids';
import { WorkflowId } from '../../mastra/workflow/ids';
import { mastraToolOutputChunkSchema, mastraToolResultChunkSchema } from './chunkTypes';

const streamChatRequestBodySchema = z.object({
  messages: z.array(
    z.object({
      parts: z.array(
        z.object({
          text: z.string(),
        })
      ),
      metadata: z.object({
        threadId: z.string(),
      }),
    })
  ),
});

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

  const { messages } = data;
  for (const message of messages) {
    console.log('message: ', message);
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
    text: chunk.payload.text,
  };
  res.write(JSON.stringify(textDeltaChunk));
}

function handleToolOutputChunk(chunk: Extract<ChunkType, { type: 'tool-output' }>, res: Response) {
  const validated = mastraToolOutputChunkSchema.parse(chunk);

  if (validated.payload.output.type === 'workflow-step-start') {
    const toolOutputChunk: ToolOutputChunk = {
      type: chunk.type,
      workflowStepId: validated.payload.output.payload.id,
    };
    res.write(JSON.stringify(toolOutputChunk));
  }
}

function handleToolCallStartChunk(chunk: Extract<ChunkType, { type: 'tool-call-input-streaming-start' }>, res: Response) {
  // We only want to handle certain tool calls, in this case:
  if (chunk.payload.toolName === WorkflowId.GenerateCompleteRecipes) {
    const toolCallStartChunk: ToolCallStartChunk = {
      type: chunk.type,
      workflowId: chunk.payload.toolName,
    };
    res.write(JSON.stringify(toolCallStartChunk));
  } else if (chunk.payload.toolName === ToolId.GetUserRecipes) {
    const toolCallStartChunk: ToolCallStartChunk = {
      type: chunk.type,
      toolId: chunk.payload.toolName,
    };
    res.write(JSON.stringify(toolCallStartChunk));
  }
}

function handleToolResultChunk(chunk: Extract<ChunkType, { type: 'tool-result' }>, res: Response) {
  const { success, data, error } = mastraToolResultChunkSchema.safeParse(chunk);
  if (!success) {
    console.error('Invalid tool result chunk:', error);
    throw new HttpError(400, 'Invalid tool result chunk', { errors: error.errors });
  }

  if (data.payload.toolName === WorkflowId.GenerateCompleteRecipes) {
    const toolResultChunk: ToolResultChunk = {
      type: chunk.type,
      workflowId: data.payload.toolName,
    };
    res.write(JSON.stringify(toolResultChunk));
    // Our workflow result saves an array of completed recipes,
    // to the db, so we can end the stream and display the recipes
    // in the detailed recipe view without also streaming the entire recipe text.
    res.end();
    return true;
  } else if (data.payload.toolName === ToolId.GetUserRecipes) {
    const toolResultChunk: ToolResultChunk = {
      type: chunk.type,
      toolId: data.payload.toolName,
      recipeIds: data.payload.result?.recipeIds,
    };
    res.write(JSON.stringify(toolResultChunk));
    res.end();
    return true;
  }
  return false;
}

// Returning the default config is necessary for our custom API.
export const getMiddlewareConfig: MiddlewareConfigFn = (config) => {
  return config;
};
