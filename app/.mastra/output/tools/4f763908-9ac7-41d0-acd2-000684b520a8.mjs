import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const inputSchema = z.object({});
const outputSchema = z.object({
  iso: z.string(),
  human: z.string()
});
const getCurrentDate = createTool({
  id: "getCurrentDate",
  description: "Get current date in human-readable and structured forms",
  inputSchema,
  outputSchema,
  execute: async () => {
    const { iso, human } = getIsoAndHumanDate();
    return {
      iso,
      human
    };
  }
});
const getIsoAndHumanDate = () => {
  const now = /* @__PURE__ */ new Date();
  const human = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long"
  }).format(now);
  const iso = now.toISOString();
  return {
    iso,
    human
  };
};

export { getCurrentDate, getIsoAndHumanDate };
