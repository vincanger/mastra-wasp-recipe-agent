import { z } from "zod";
import { Prisma } from "@prisma/client";

export const elaboratedRecipeSchema = z.object({
  title: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  dateCreated: z.string(),
  thumbnailUrl: z.string().nullable(),
});

export type ElaboratedRecipe = z.infer<typeof elaboratedRecipeSchema>;

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([z.string(), z.number(), z.boolean(), z.literal(null), z.record(z.lazy(() => JsonValueSchema.optional())), z.array(z.lazy(() => JsonValueSchema))])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

// Zod schema for the Recipe entity found in schema.prisma
export const recipeDbModelSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string(),
  title: z.string(),
  ingredients: JsonValueSchema,
  instructions: JsonValueSchema,
  isFavorite: z.boolean(),
  dateCreated: z.string(),
  servings: z.number().int().nullable(),
  prepTime: z.number().int().nullable(),
  cookTime: z.number().int().nullable(),
  tags: JsonValueSchema.nullable(),
  thumbnailUrl: z.string().nullable(),
});
