import { MastraClient } from '@mastra/client-js';

export const mastraClient = new MastraClient({
  baseUrl: import.meta.env.REACT_APP_MASTRA_API_URL || 'http://localhost:4111',
  // headers: {
  //   Authorization: `Bearer ${import.meta.env.REACT_APP_MASTRA_JWT_TOKEN}`,
  // },
});
