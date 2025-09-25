import type { AuthUser } from 'wasp/auth';

import { useEffect, useState } from 'react';
import { config } from 'wasp/client';
import { FeatureContainer } from './FeatureContainer';
import { getSessionId } from 'wasp/client/api';

export const StreamingTestPage = ({ user }: { user: AuthUser }) => {
  const [input, setInput] = useState('');
  const { response, sendMessage } = useTextStream({ path: '/api/recipes/stream-chat', metadata: { threadId: 'recipe-session-1' } });

  return (
    <FeatureContainer>
      <div className='space-y-4'>
        <h2 className='feature-title'>Streaming Demo</h2>
        <div className='space-y-2'>
          <input
            type='text'
            placeholder='Type your message...'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage({ message: input });
              }
            }}
          />
        </div>
        <div className='card'>
          <p className='max-w-2xl'>{response}</p>
        </div>
      </div>
    </FeatureContainer>
  );
};

function useTextStream({ path, metadata }: { path: string; metadata: Record<string, string> }) {
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState('');
  function sendMessage({ message }: { message: string }) {
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
        setResponse((prev) => prev + chunk);
      },
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

type FetchStreamProps = { path: string; input: string; metadata: Record<string, string>; onData: (data: string) => void; controller: AbortController };

async function fetchStream({ path, input, metadata, onData, controller }: FetchStreamProps) {
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

  if (response.body === null) {
    throw new Error('Stream body is null');
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      return;
    }
    onData(value.toString());
  }
}
