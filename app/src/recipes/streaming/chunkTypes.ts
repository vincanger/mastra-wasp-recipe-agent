import type { ChunkType } from "@mastra/core";

import { z } from "zod";
import { WorkflowId, WorkflowStepId } from "../../mastra/workflow/ids";
import { ToolId } from "../../mastra/tools/ids";

export type ToolCallStatus = 'starting' | 'running' | 'finished';

interface BaseChunk {
  type: ChunkType['type'];
}

// === Outgoing chunk interfaces (sent to client) ===
export interface ToolChunk extends BaseChunk {
  type: 'tool-call-input-streaming-start' | 'tool-output' | 'tool-result';
  toolId: ToolId | WorkflowId | WorkflowStepId;
  toolCallStatus: ToolCallStatus;
  content: string;
  recipeIds?: string[];
}

export interface TextDeltaChunk extends BaseChunk {
  type: 'text-delta';
  content: string;
}

export type TextStreamChunk = ToolChunk | TextDeltaChunk;

// === Zod schemas for validating INCOMING Mastra chunks ===
// These validate the nested payload structures that are typed as 'any' in Mastra

export const mastraToolOutputChunkSchema = z.object({
  type: z.literal('tool-output'),
  payload: z.object({
    output: z.object({
      type: z.string(),
      payload: z.object({
        id: z.nativeEnum(WorkflowStepId).optional(),
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
