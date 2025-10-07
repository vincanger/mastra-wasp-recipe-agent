import type { ChunkType } from "@mastra/core";
import { z } from "zod";

import { WorkflowId, WorkflowStepId } from "../../mastra/workflow/ids";
import { ToolId } from "../../mastra/tools/ids";

interface BaseChunk {
  type: ChunkType['type'];
}

// === Outgoing chunk interfaces (sent to client) ===
export interface ToolOutputChunk extends BaseChunk {
  type: 'tool-output';
  workflowStepId: WorkflowStepId;
}

export interface ToolCallStartChunk extends BaseChunk {
  type: 'tool-call-input-streaming-start';
  workflowId?: WorkflowId;
  toolId?: ToolId;
}

export interface ToolResultChunk extends BaseChunk {
  type: 'tool-result';
  workflowId?: WorkflowId;
  toolId?: ToolId;
  recipeIds?: string[];
}

export interface TextDeltaChunk extends BaseChunk {
  type: 'text-delta';
  text: string;
}

export type TextStreamChunk = ToolOutputChunk | ToolCallStartChunk | ToolResultChunk | TextDeltaChunk;

// === Zod schemas for validating INCOMING Mastra chunks ===
// These validate the nested payload structures that are typed as 'any' in Mastra

export const mastraToolOutputChunkSchema = z.object({
  type: z.literal('tool-output'),
  payload: z.object({
    output: z.object({
      type: z.string(),
      payload: z.object({
        id: z.nativeEnum(WorkflowStepId), // This is the only workflow we've created so far, so we can hardcode the type.
      }).passthrough(),
    }).passthrough(),
  }).passthrough(),
}).passthrough();

export const mastraToolResultChunkSchema = z.object({
  type: z.literal('tool-result'),
  payload: z.object({
    toolName: z.union([
      z.nativeEnum(WorkflowId),
      z.nativeEnum(ToolId),
      z.string() // Mastra has its own internal tools that it may call e.g. updateWorkingMemory, so we allow them to pass as strings.
    ]),
    result: z.object({
      recipeIds: z.array(z.string()).optional(),
    }).passthrough().optional(),
  }).passthrough(),
}).passthrough();
