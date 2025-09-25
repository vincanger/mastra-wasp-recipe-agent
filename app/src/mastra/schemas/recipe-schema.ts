import { z } from "zod";

export const elaboratedRecipeSchema = z.object({
  id: z.string().nullable(),
  title: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  dateCreated: z.string(),
  thumbnailUrl: z.string().nullable(),
});

export type ElaboratedRecipe = z.infer<typeof elaboratedRecipeSchema>;
