import type { RecipeMessage } from '../RecipeChatPage';
import type { TextStreamChunk, ToolCallStartChunk, ToolResultChunk, TextDeltaChunk, ToolOutputChunk } from './api';

import { SetStateAction, Dispatch, useEffect, useState } from 'react';
import { config } from 'wasp/client';
import { getSessionId } from 'wasp/client/api';
import { v4 as uuidv4 } from 'uuid';
import { printWorkflowStepStatus, WorkflowId, WorkflowStepId } from '../../mastra/workflow/ids';
import { ToolId } from '../../mastra/tools/ids';

export type FinishReason = 'stop' | 'error' | null;

export function useTextStream({ path, metadata, setIsLoading }: { path: string; metadata: Record<string, string>; setIsLoading: Dispatch<SetStateAction<boolean>> }) {
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState<RecipeMessage>({ id: uuidv4(), role: 'assistant', content: '', toolCallStatus: undefined, recipeIds: undefined, finishReason: undefined });

  function sendMessage({ message }: { message: string }) {
    // Reset response message with new UUID when starting a new message
    setResponse({ id: uuidv4(), role: 'assistant', content: '', toolCallStatus: undefined, recipeIds: undefined, finishReason: undefined });
    setMessage(message);
  }

  const parseJsonChunkAndSetResponse = (chunk: string) => {
    console.log('chunk: ', chunk);
    const jsonStrings = splitJsonStringsInChunk(chunk);
    jsonStrings.forEach((jsonStr) => {
      try {
        const chunk = JSON.parse(jsonStr) as TextStreamChunk;
        const chunkType = chunk.type;
        switch (chunkType) {
          case 'tool-call-input-streaming-start':
            handleToolCallStart(chunk, setResponse);
            break;
          case 'tool-output':
            handleToolOutput(chunk, setResponse);
            break;
          case 'tool-result':
            handleToolResult(chunk, setResponse);
            break;
          case 'text-delta':
            handleTextDelta(chunk, setResponse);
            break;
        }
      } catch (e) {
        console.error('Failed to parse JSON:', jsonStr);
      }
    });
  };

  useEffect(() => {
    if (message.trim().length === 0) {
      return;
    }
    const controller = new AbortController();
    fetchStream({
      path,
      input: message,
      metadata,
      onData: (chunk) => {
        parseJsonChunkAndSetResponse(chunk);
      },
      setIsLoading,
      setResponse,
      controller,
    });

    return () => {
      controller.abort();
    };
  }, [message]);

  return {
    response,
    sendMessage,
  };
}

type FetchStreamProps = {
  path: string;
  input: string;
  metadata: Record<string, string>;
  onData: (data: string) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setResponse: Dispatch<SetStateAction<RecipeMessage>>;
  controller: AbortController;
};

async function fetchStream({ path, input, metadata, onData, setIsLoading, setResponse, controller }: FetchStreamProps) {
  setIsLoading(true);
  const sessionId = getSessionId();
  const body = {
    messages: [{ parts: [{ text: input }], metadata }],
  };

  const response = await fetch(config.apiUrl + path, {
    method: 'POST',
    body: JSON.stringify(body),
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionId}`,
    },
  });
  setIsLoading(false);

  if (response.body === null) {
    onData('I apologize, but I encountered an error processing your request. Please try again.');
    setResponse((prev) => ({ ...prev, finishReason: 'error' }));
    throw new Error('Stream body is null');
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log('<><><> text stream finished <><><>');
      setResponse((prev) => ({ ...prev, finishReason: 'stop' }));
      return;
    }
    onData(value.toString());
  }
}

function splitJsonStringsInChunk(chunk: string) {
  return chunk.split('}{').map((str, index, array) => {
    if (index === 0 && array.length > 1) return str + '}';
    if (index === array.length - 1 && array.length > 1) return '{' + str;
    if (array.length > 1) return '{' + str + '}';
    return str;
  });
}

function handleToolCallStart(chunk: ToolCallStartChunk, setResponse: Dispatch<SetStateAction<RecipeMessage>>) {
  if (chunk.workflowId === WorkflowId.GenerateCompleteRecipes) {
    setResponse((prev) => ({ ...prev, toolCallStatus: 'starting', content: '⏳ Starting recipe generation... ' }));
  } else if (chunk.toolId === ToolId.GetUserRecipes) {
    setResponse((prev) => ({ ...prev, toolCallStatus: 'starting', content: '⏳ Starting recipe search... ' }));
  }
}

function handleToolOutput(chunk: ToolOutputChunk, setResponse: Dispatch<SetStateAction<RecipeMessage>>) {
  if (Object.values(WorkflowStepId).includes(chunk.workflowStepId)) {
    let stepMessage = printWorkflowStepStatus(chunk.workflowStepId);
    setResponse((prev) => ({ ...prev, toolCallStatus: 'running', content: stepMessage }));
  }
}

function handleToolResult(chunk: ToolResultChunk, setResponse: Dispatch<SetStateAction<RecipeMessage>>) {
  if (chunk.workflowId === WorkflowId.GenerateCompleteRecipes) {
    setResponse((prev) => ({ ...prev, toolCallStatus: 'finished', content: '🍕 Your recipes are ready! ' }));
  } else if (chunk.toolId === ToolId.GetUserRecipes) {
    setResponse((prev) => ({ ...prev, toolCallStatus: 'finished', content: `🍕 ${chunk.recipeIds?.length} recipes were found.`, recipeIds: chunk.recipeIds }));
  }
}

function handleTextDelta(chunk: TextDeltaChunk, setResponse: Dispatch<SetStateAction<RecipeMessage>>) {
  setResponse((prev) => ({ ...prev, content: prev.content + chunk.text }));
}
