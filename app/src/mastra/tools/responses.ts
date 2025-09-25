import type { GenerateCompleteRecipesOutput } from '../workflow/generate-complete-recipes';
import type { GetUserRecipesOutput } from '../tools/get-user-recipes';
import type { GenerateRecipeThumbnailOutput } from './generate-recipe-thumbnail';

import { ToolId } from '../tools/ids';

export interface ToolResultTypeMap {
  [ToolId.RunGenerateCompleteRecipes]: GenerateCompleteRecipesOutput;
  [ToolId.GetUserRecipes]: GetUserRecipesOutput;
  [ToolId.GenerateRecipeThumbnail]: GenerateRecipeThumbnailOutput;
}

export interface ToolResponse<T extends ToolId> {
  payload: {
    toolName: T;
    result: ToolResultTypeMap[T];
  };
}

// Union of all possible tool response.
export type AnyToolResponse = {
  [K in ToolId]: ToolResponse<K>;
}[ToolId];

export class ToolResultExtractor {
  private resultsByToolId: Map<ToolId, AnyToolResponse[]>;

  constructor(toolResults: AnyToolResponse[]) {
    this.resultsByToolId = this.groupToolResultsByToolId(toolResults);
  }

  private groupToolResultsByToolId(toolResults: AnyToolResponse[]): Map<ToolId, AnyToolResponse[]> {
    const resultsByToolId = new Map<ToolId, AnyToolResponse[]>();

    toolResults.forEach((toolResult) => {
      const { toolName } = toolResult.payload;
      if (!resultsByToolId.has(toolName)) {
        resultsByToolId.set(toolName, []);
      }
      resultsByToolId.get(toolName)!.push(toolResult);
    });

    return resultsByToolId;
  }

  private assertToolResponses<T extends ToolId>(results: AnyToolResponse[]): asserts results is Array<Extract<AnyToolResponse, { payload: { toolName: T; result: ToolResultTypeMap[T] } }>> {
    // optional: dev-only sanity check; keep empty if you want zero runtime work
  }

  // Type-safe getter that returns correctly typed results
  public getResults<T extends ToolId>(toolId: T): ToolResponse<T>[] {
    const results = this.resultsByToolId.get(toolId) || [];
    this.assertToolResponses<T>(results);
    return results;
  }

  // Check if tool was called
  public hasResults(toolId: ToolId): boolean {
    return this.resultsByToolId.has(toolId);
  }

  // Get all tool IDs that were called
  public getCalledToolIds(): ToolId[] {
    return Array.from(this.resultsByToolId.keys());
  }
}

// Convenience type aliases for specific tool responses
export type GenerateCompleteRecipesResponse = ToolResponse<ToolId.RunGenerateCompleteRecipes>;
export type GetUserRecipesResponse = ToolResponse<ToolId.GetUserRecipes>;
export type GenerateRecipeThumbnailResponse = ToolResponse<ToolId.GenerateRecipeThumbnail>;
