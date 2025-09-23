import { createTool, type Tool } from "@mastra/core/tools";
import { z } from "zod";

const inputSchema = z.object({});

const outputSchema = z.object({
  iso: z.string(),
  human: z.string()
})

export const getCurrentDate: Tool<typeof inputSchema, typeof outputSchema> = 
  createTool({
    id: "getCurrentDate",
    description: "Get current date in human-readable and structured forms",
    inputSchema,
    outputSchema, 
    execute: async () => {
      const { iso, human } = getIsoAndHumanDate();
      return {
        iso,
        human,
      };
    },
  });

export const getIsoAndHumanDate = () => {
  const now = new Date();
  const human = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(now);
  const iso = now.toISOString();
  return {
    iso,
    human,
  };
}