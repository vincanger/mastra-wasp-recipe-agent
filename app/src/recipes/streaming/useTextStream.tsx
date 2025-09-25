import type { RecipeMessage } from '../RecipeChatPage';

import { SetStateAction, Dispatch, useEffect, useState } from 'react';
import { config } from 'wasp/client';
import { getSessionId } from 'wasp/client/api';
import { v4 as uuidv4 } from 'uuid';

export function useTextStream({ path, metadata, setIsLoading }: { path: string; metadata: Record<string, string>; setIsLoading: Dispatch<SetStateAction<boolean>> }) {
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState<RecipeMessage>({ id: uuidv4(), role: 'assistant', content: '' });
  const [finishReason, setFinishReason] = useState<'stop' | 'error' | null>(null);
  function sendMessage({ message }: { message: string }) {
    // Reset response message with new UUID when starting a new message
    setResponse({ id: uuidv4(), role: 'assistant', content: '' });
    setMessage(message);
  }
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
        setResponse((prev) => ({ ...prev, content: prev.content + chunk }));
      },
      setIsLoading,
      setFinishReason,
      controller,
    });

    return () => {
      controller.abort();
    };
  }, [message]);

  return {
    response,
    sendMessage,
    finishReason,
  };
}

type FetchStreamProps = { path: string; input: string; metadata: Record<string, string>; onData: (data: string) => void; setIsLoading: Dispatch<SetStateAction<boolean>>; setFinishReason: Dispatch<SetStateAction<'stop' | 'error' | null>>; controller: AbortController };

async function fetchStream({ path, input, metadata, onData, setIsLoading, setFinishReason, controller }: FetchStreamProps) {
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
    setFinishReason('error');
    throw new Error('Stream body is null');
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      setFinishReason('stop');
      return;
    }
    onData(value.toString());
  }
}
