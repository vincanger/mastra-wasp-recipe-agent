import type { StreamChatWithRecipeAgent } from 'wasp/server/api';
import type { MiddlewareConfigFn } from 'wasp/server';

import { HttpError } from 'wasp/server';
import { AgentId } from '../../mastra/agents/ids';
import { mastra } from '../../mastra';
import { setUserIdForToolUse, ToolId } from '../../mastra/tools/ids';
import { WorkflowId, WorkflowStepId } from '../../mastra/workflow/ids';

export type ToolOutputChunk = {
  type: 'tool-output';
  workflowStepId: WorkflowStepId;
};

export type ToolCallStartChunk = {
  type: 'tool-call-input-streaming-start';
  workflowId?: WorkflowId;
  toolId?: ToolId;
};

export type ToolResultChunk = {
  type: 'tool-result';
  workflowId?: WorkflowId;
  toolId?: ToolId;
  recipeIds?: string[];
};

export type TextDeltaChunk = {
  type: 'text-delta';
  text: string;
};

// Union type that TypeScript can discriminate
export type TextStreamChunk = ToolOutputChunk | ToolCallStartChunk | ToolResultChunk | TextDeltaChunk;

// Custom API endpoint that returns a streaming text.
export const streamChatWithRecipeAgent: StreamChatWithRecipeAgent = async (req, res, context) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  if (!context.user) {
    throw new HttpError(401, 'Not authorized');
  }

  const { messages } = req.body;
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
      if (chunk.type === 'tool-output') {
        // {
        // type: 'workflow-step-start',
        //    runId: '7471b3c0-ea73-4eb1-bbc2-4a2d1405f39b',
        //    from: 'WORKFLOW',
        //    payload: {
        //     stepName: 'generateElaboratedRecipesStep',
        //     id: 'generateElaboratedRecipesStep',
        //     stepCallId: '2d0e62a4-2c73-4266-972e-e30177254c71',
        //     payload: { titles: [Array] },
        //     startedAt: 1759130424815,
        //     status: 'running'
        //   }
        // }
        if (chunk.payload.output.type === 'workflow-step-start') {
          const textStreamChunk: TextStreamChunk = {
            type: chunk.type,
            workflowStepId: chunk.payload.output.payload.id,
          };
          res.write(JSON.stringify(textStreamChunk));
        }
      }
      if (chunk.type === 'tool-call-input-streaming-start') {
        if (chunk.payload.toolName === WorkflowId.GenerateCompleteRecipes) {
          const textStreamChunk: TextStreamChunk = {
            type: chunk.type,
            workflowId: chunk.payload.toolName,
          };
          res.write(JSON.stringify(textStreamChunk));
        } else if (chunk.payload.toolName === ToolId.GetUserRecipes) {
          const textStreamChunk: TextStreamChunk = {
            type: chunk.type,
            toolId: chunk.payload.toolName,
          };
          res.write(JSON.stringify(textStreamChunk));
        }
      }
      if (chunk.type === 'tool-result') {
        if (chunk.payload.toolName === WorkflowId.GenerateCompleteRecipes) {
          const textStreamChunk: TextStreamChunk = {
            type: chunk.type,
            workflowId: chunk.payload.toolName,
          };
          res.write(JSON.stringify(textStreamChunk));
          // Our workflow result sends an array of completed recipes,
          // which we save to the db, so we can end the stream
          // and display the recipes in the detailed recipe view
          // so we dont also stream the entire recipe text.
          res.end();
          return;
        } else if (chunk.payload.toolName === ToolId.GetUserRecipes) {
          const textStreamChunk: TextStreamChunk = {
            type: chunk.type,
            toolId: chunk.payload.toolName,
            recipeIds: chunk.payload.result.recipeIds,
          };
          res.write(JSON.stringify(textStreamChunk));
          res.end();
          return;
        }
      }
      if (chunk.type === 'text-delta') {
        const textStreamChunk: TextStreamChunk = {
          type: chunk.type,
          text: chunk.payload.text,
        };
        res.write(JSON.stringify(textStreamChunk));
      }
    }
  }

  res.end();
};

// Returning the default config.
export const getMiddlewareConfig: MiddlewareConfigFn = (config) => {
  return config;
};
