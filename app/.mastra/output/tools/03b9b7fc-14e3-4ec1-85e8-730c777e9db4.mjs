import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { createTool } from '@mastra/core/tools';
import { prisma } from 'wasp/server';
import { ToolId } from './d5d83f80-0f94-4784-913e-b046fe612b0a.mjs';

const transformJsonNull = (v) => {
  if (!v || v === "DbNull")
    return Prisma.DbNull;
  if (v === "JsonNull")
    return Prisma.JsonNull;
  return v;
};
const JsonValueSchema = z.lazy(
  () => z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema))
  ])
);
z.union([JsonValueSchema, z.literal("DbNull"), z.literal("JsonNull")]).nullable().transform((v) => transformJsonNull(v));
const InputJsonValueSchema = z.lazy(
  () => z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)])))
  ])
);
z.enum(["ReadUncommitted", "ReadCommitted", "RepeatableRead", "Serializable"]);
const UserScalarFieldEnumSchema = z.enum(["id", "createdAt", "email", "username", "isAdmin", "paymentProcessorUserId", "lemonSqueezyCustomerPortalUrl", "subscriptionStatus", "subscriptionPlan", "datePaid", "credits"]);
const GptResponseScalarFieldEnumSchema = z.enum(["id", "createdAt", "updatedAt", "userId", "content"]);
const TaskScalarFieldEnumSchema = z.enum(["id", "createdAt", "userId", "description", "time", "isDone"]);
const FileScalarFieldEnumSchema = z.enum(["id", "createdAt", "userId", "name", "type", "key", "uploadUrl"]);
const DailyStatsScalarFieldEnumSchema = z.enum(["id", "date", "totalViews", "prevDayViewsChangePercent", "userCount", "paidUserCount", "userDelta", "paidUserDelta", "totalRevenue", "totalProfit"]);
const PageViewSourceScalarFieldEnumSchema = z.enum(["name", "date", "dailyStatsId", "visitors"]);
const LogsScalarFieldEnumSchema = z.enum(["id", "createdAt", "message", "level"]);
const ContactFormMessageScalarFieldEnumSchema = z.enum(["id", "createdAt", "userId", "content", "isRead", "repliedAt"]);
const ElaboratedRecipeScalarFieldEnumSchema = z.enum(["id", "createdAt", "updatedAt", "userId", "title", "ingredients", "instructions", "isFavorite", "dateCreated", "servings", "prepTime", "cookTime", "tags"]);
const SortOrderSchema = z.enum(["asc", "desc"]);
const JsonNullValueInputSchema = z.enum(["JsonNull"]).transform((value) => value === "JsonNull" ? Prisma.JsonNull : value);
const NullableJsonNullValueInputSchema = z.enum(["DbNull", "JsonNull"]).transform((value) => value === "JsonNull" ? Prisma.JsonNull : value === "DbNull" ? Prisma.DbNull : value);
const QueryModeSchema = z.enum(["default", "insensitive"]);
const NullsOrderSchema = z.enum(["first", "last"]);
z.enum(["DbNull", "JsonNull", "AnyNull"]).transform((value) => value === "JsonNull" ? Prisma.JsonNull : value === "DbNull" ? Prisma.JsonNull : value === "AnyNull" ? Prisma.AnyNull : value);
z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  email: z.string().nullable(),
  username: z.string().nullable(),
  isAdmin: z.boolean(),
  paymentProcessorUserId: z.string().nullable(),
  lemonSqueezyCustomerPortalUrl: z.string().nullable(),
  subscriptionStatus: z.string().nullable(),
  subscriptionPlan: z.string().nullable(),
  datePaid: z.coerce.date().nullable(),
  credits: z.number().int()
});
z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string(),
  content: z.string()
});
z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  userId: z.string(),
  description: z.string(),
  time: z.string(),
  isDone: z.boolean()
});
z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  userId: z.string(),
  name: z.string(),
  type: z.string(),
  key: z.string(),
  uploadUrl: z.string()
});
z.object({
  id: z.number().int(),
  date: z.coerce.date(),
  totalViews: z.number().int(),
  prevDayViewsChangePercent: z.string(),
  userCount: z.number().int(),
  paidUserCount: z.number().int(),
  userDelta: z.number().int(),
  paidUserDelta: z.number().int(),
  totalRevenue: z.number(),
  totalProfit: z.number()
});
z.object({
  name: z.string(),
  date: z.coerce.date(),
  dailyStatsId: z.number().int().nullable(),
  visitors: z.number().int()
});
z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  message: z.string(),
  level: z.string()
});
z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  userId: z.string(),
  content: z.string(),
  isRead: z.boolean(),
  repliedAt: z.coerce.date().nullable()
});
const ElaboratedRecipeSchema = z.object({
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
  tags: JsonValueSchema.nullable()
});
const UserIncludeSchema = z.object({
  gptResponses: z.union([z.boolean(), z.lazy(() => GptResponseFindManyArgsSchema)]).optional(),
  contactFormMessages: z.union([z.boolean(), z.lazy(() => ContactFormMessageFindManyArgsSchema)]).optional(),
  tasks: z.union([z.boolean(), z.lazy(() => TaskFindManyArgsSchema)]).optional(),
  files: z.union([z.boolean(), z.lazy(() => FileFindManyArgsSchema)]).optional(),
  elaboratedRecipes: z.union([z.boolean(), z.lazy(() => ElaboratedRecipeFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)]).optional()
}).strict();
const UserArgsSchema = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional()
}).strict();
const UserCountOutputTypeArgsSchema = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish()
}).strict();
const UserCountOutputTypeSelectSchema = z.object({
  gptResponses: z.boolean().optional(),
  contactFormMessages: z.boolean().optional(),
  tasks: z.boolean().optional(),
  files: z.boolean().optional(),
  elaboratedRecipes: z.boolean().optional()
}).strict();
const UserSelectSchema = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  email: z.boolean().optional(),
  username: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
  paymentProcessorUserId: z.boolean().optional(),
  lemonSqueezyCustomerPortalUrl: z.boolean().optional(),
  subscriptionStatus: z.boolean().optional(),
  subscriptionPlan: z.boolean().optional(),
  datePaid: z.boolean().optional(),
  credits: z.boolean().optional(),
  gptResponses: z.union([z.boolean(), z.lazy(() => GptResponseFindManyArgsSchema)]).optional(),
  contactFormMessages: z.union([z.boolean(), z.lazy(() => ContactFormMessageFindManyArgsSchema)]).optional(),
  tasks: z.union([z.boolean(), z.lazy(() => TaskFindManyArgsSchema)]).optional(),
  files: z.union([z.boolean(), z.lazy(() => FileFindManyArgsSchema)]).optional(),
  elaboratedRecipes: z.union([z.boolean(), z.lazy(() => ElaboratedRecipeFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)]).optional()
}).strict();
const GptResponseIncludeSchema = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional()
}).strict();
z.object({
  select: z.lazy(() => GptResponseSelectSchema).optional(),
  include: z.lazy(() => GptResponseIncludeSchema).optional()
}).strict();
const GptResponseSelectSchema = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  content: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional()
}).strict();
const TaskIncludeSchema = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional()
}).strict();
z.object({
  select: z.lazy(() => TaskSelectSchema).optional(),
  include: z.lazy(() => TaskIncludeSchema).optional()
}).strict();
const TaskSelectSchema = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  description: z.boolean().optional(),
  time: z.boolean().optional(),
  isDone: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional()
}).strict();
const FileIncludeSchema = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional()
}).strict();
z.object({
  select: z.lazy(() => FileSelectSchema).optional(),
  include: z.lazy(() => FileIncludeSchema).optional()
}).strict();
const FileSelectSchema = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  name: z.boolean().optional(),
  type: z.boolean().optional(),
  key: z.boolean().optional(),
  uploadUrl: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional()
}).strict();
const DailyStatsIncludeSchema = z.object({
  sources: z.union([z.boolean(), z.lazy(() => PageViewSourceFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => DailyStatsCountOutputTypeArgsSchema)]).optional()
}).strict();
const DailyStatsArgsSchema = z.object({
  select: z.lazy(() => DailyStatsSelectSchema).optional(),
  include: z.lazy(() => DailyStatsIncludeSchema).optional()
}).strict();
const DailyStatsCountOutputTypeArgsSchema = z.object({
  select: z.lazy(() => DailyStatsCountOutputTypeSelectSchema).nullish()
}).strict();
const DailyStatsCountOutputTypeSelectSchema = z.object({
  sources: z.boolean().optional()
}).strict();
const DailyStatsSelectSchema = z.object({
  id: z.boolean().optional(),
  date: z.boolean().optional(),
  totalViews: z.boolean().optional(),
  prevDayViewsChangePercent: z.boolean().optional(),
  userCount: z.boolean().optional(),
  paidUserCount: z.boolean().optional(),
  userDelta: z.boolean().optional(),
  paidUserDelta: z.boolean().optional(),
  totalRevenue: z.boolean().optional(),
  totalProfit: z.boolean().optional(),
  sources: z.union([z.boolean(), z.lazy(() => PageViewSourceFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => DailyStatsCountOutputTypeArgsSchema)]).optional()
}).strict();
const PageViewSourceIncludeSchema = z.object({
  dailyStats: z.union([z.boolean(), z.lazy(() => DailyStatsArgsSchema)]).optional()
}).strict();
z.object({
  select: z.lazy(() => PageViewSourceSelectSchema).optional(),
  include: z.lazy(() => PageViewSourceIncludeSchema).optional()
}).strict();
const PageViewSourceSelectSchema = z.object({
  name: z.boolean().optional(),
  date: z.boolean().optional(),
  dailyStatsId: z.boolean().optional(),
  visitors: z.boolean().optional(),
  dailyStats: z.union([z.boolean(), z.lazy(() => DailyStatsArgsSchema)]).optional()
}).strict();
const LogsSelectSchema = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  message: z.boolean().optional(),
  level: z.boolean().optional()
}).strict();
const ContactFormMessageIncludeSchema = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional()
}).strict();
z.object({
  select: z.lazy(() => ContactFormMessageSelectSchema).optional(),
  include: z.lazy(() => ContactFormMessageIncludeSchema).optional()
}).strict();
const ContactFormMessageSelectSchema = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  content: z.boolean().optional(),
  isRead: z.boolean().optional(),
  repliedAt: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional()
}).strict();
const ElaboratedRecipeIncludeSchema = z.object({
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional()
}).strict();
z.object({
  select: z.lazy(() => ElaboratedRecipeSelectSchema).optional(),
  include: z.lazy(() => ElaboratedRecipeIncludeSchema).optional()
}).strict();
const ElaboratedRecipeSelectSchema = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  title: z.boolean().optional(),
  ingredients: z.boolean().optional(),
  instructions: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  dateCreated: z.boolean().optional(),
  servings: z.boolean().optional(),
  prepTime: z.boolean().optional(),
  cookTime: z.boolean().optional(),
  tags: z.boolean().optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional()
}).strict();
const UserWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  email: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  username: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  isAdmin: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  paymentProcessorUserId: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  subscriptionStatus: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  subscriptionPlan: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  datePaid: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()]).optional().nullable(),
  credits: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
  gptResponses: z.lazy(() => GptResponseListRelationFilterSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageListRelationFilterSchema).optional(),
  tasks: z.lazy(() => TaskListRelationFilterSchema).optional(),
  files: z.lazy(() => FileListRelationFilterSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeListRelationFilterSchema).optional()
}).strict();
const UserOrderByWithRelationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  username: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional(),
  paymentProcessorUserId: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  lemonSqueezyCustomerPortalUrl: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  subscriptionStatus: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  subscriptionPlan: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  datePaid: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  credits: z.lazy(() => SortOrderSchema).optional(),
  gptResponses: z.lazy(() => GptResponseOrderByRelationAggregateInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageOrderByRelationAggregateInputSchema).optional(),
  tasks: z.lazy(() => TaskOrderByRelationAggregateInputSchema).optional(),
  files: z.lazy(() => FileOrderByRelationAggregateInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeOrderByRelationAggregateInputSchema).optional()
}).strict();
const UserWhereUniqueInputSchema = z.union([
  z.object({
    id: z.string(),
    email: z.string(),
    username: z.string(),
    paymentProcessorUserId: z.string()
  }),
  z.object({
    id: z.string(),
    email: z.string(),
    username: z.string()
  }),
  z.object({
    id: z.string(),
    email: z.string(),
    paymentProcessorUserId: z.string()
  }),
  z.object({
    id: z.string(),
    email: z.string()
  }),
  z.object({
    id: z.string(),
    username: z.string(),
    paymentProcessorUserId: z.string()
  }),
  z.object({
    id: z.string(),
    username: z.string()
  }),
  z.object({
    id: z.string(),
    paymentProcessorUserId: z.string()
  }),
  z.object({
    id: z.string()
  }),
  z.object({
    email: z.string(),
    username: z.string(),
    paymentProcessorUserId: z.string()
  }),
  z.object({
    email: z.string(),
    username: z.string()
  }),
  z.object({
    email: z.string(),
    paymentProcessorUserId: z.string()
  }),
  z.object({
    email: z.string()
  }),
  z.object({
    username: z.string(),
    paymentProcessorUserId: z.string()
  }),
  z.object({
    username: z.string()
  }),
  z.object({
    paymentProcessorUserId: z.string()
  })
]).and(z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  username: z.string().optional(),
  paymentProcessorUserId: z.string().optional(),
  AND: z.union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  isAdmin: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  lemonSqueezyCustomerPortalUrl: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  subscriptionStatus: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  subscriptionPlan: z.union([z.lazy(() => StringNullableFilterSchema), z.string()]).optional().nullable(),
  datePaid: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()]).optional().nullable(),
  credits: z.union([z.lazy(() => IntFilterSchema), z.number().int()]).optional(),
  gptResponses: z.lazy(() => GptResponseListRelationFilterSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageListRelationFilterSchema).optional(),
  tasks: z.lazy(() => TaskListRelationFilterSchema).optional(),
  files: z.lazy(() => FileListRelationFilterSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeListRelationFilterSchema).optional()
}).strict());
const UserOrderByWithAggregationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  username: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional(),
  paymentProcessorUserId: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  lemonSqueezyCustomerPortalUrl: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  subscriptionStatus: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  subscriptionPlan: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  datePaid: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  credits: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict();
const UserScalarWhereWithAggregatesInputSchema = z.object({
  AND: z.union([z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()]).optional(),
  email: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  username: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  isAdmin: z.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()]).optional(),
  paymentProcessorUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  subscriptionStatus: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  subscriptionPlan: z.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()]).optional().nullable(),
  datePaid: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date()]).optional().nullable(),
  credits: z.union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()]).optional()
}).strict();
const GptResponseWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => GptResponseWhereInputSchema), z.lazy(() => GptResponseWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => GptResponseWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => GptResponseWhereInputSchema), z.lazy(() => GptResponseWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  content: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional()
}).strict();
const GptResponseOrderByWithRelationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();
const GptResponseWhereUniqueInputSchema = z.object({
  id: z.string()
}).and(z.object({
  id: z.string().optional(),
  AND: z.union([z.lazy(() => GptResponseWhereInputSchema), z.lazy(() => GptResponseWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => GptResponseWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => GptResponseWhereInputSchema), z.lazy(() => GptResponseWhereInputSchema).array()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  content: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional()
}).strict());
const GptResponseOrderByWithAggregationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => GptResponseCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => GptResponseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => GptResponseMinOrderByAggregateInputSchema).optional()
}).strict();
const GptResponseScalarWhereWithAggregatesInputSchema = z.object({
  AND: z.union([z.lazy(() => GptResponseScalarWhereWithAggregatesInputSchema), z.lazy(() => GptResponseScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => GptResponseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => GptResponseScalarWhereWithAggregatesInputSchema), z.lazy(() => GptResponseScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  content: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional()
}).strict();
const TaskWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => TaskWhereInputSchema), z.lazy(() => TaskWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => TaskWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskWhereInputSchema), z.lazy(() => TaskWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  time: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  isDone: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional()
}).strict();
const TaskOrderByWithRelationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  isDone: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();
const TaskWhereUniqueInputSchema = z.object({
  id: z.string()
}).and(z.object({
  id: z.string().optional(),
  AND: z.union([z.lazy(() => TaskWhereInputSchema), z.lazy(() => TaskWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => TaskWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskWhereInputSchema), z.lazy(() => TaskWhereInputSchema).array()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  time: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  isDone: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional()
}).strict());
const TaskOrderByWithAggregationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  isDone: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TaskCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TaskMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TaskMinOrderByAggregateInputSchema).optional()
}).strict();
const TaskScalarWhereWithAggregatesInputSchema = z.object({
  AND: z.union([z.lazy(() => TaskScalarWhereWithAggregatesInputSchema), z.lazy(() => TaskScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => TaskScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskScalarWhereWithAggregatesInputSchema), z.lazy(() => TaskScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  time: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  isDone: z.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()]).optional()
}).strict();
const FileWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => FileWhereInputSchema), z.lazy(() => FileWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => FileWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => FileWhereInputSchema), z.lazy(() => FileWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  uploadUrl: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional()
}).strict();
const FileOrderByWithRelationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  uploadUrl: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();
const FileWhereUniqueInputSchema = z.object({
  id: z.string()
}).and(z.object({
  id: z.string().optional(),
  AND: z.union([z.lazy(() => FileWhereInputSchema), z.lazy(() => FileWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => FileWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => FileWhereInputSchema), z.lazy(() => FileWhereInputSchema).array()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  uploadUrl: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional()
}).strict());
const FileOrderByWithAggregationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  uploadUrl: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FileCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FileMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FileMinOrderByAggregateInputSchema).optional()
}).strict();
const FileScalarWhereWithAggregatesInputSchema = z.object({
  AND: z.union([z.lazy(() => FileScalarWhereWithAggregatesInputSchema), z.lazy(() => FileScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => FileScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => FileScalarWhereWithAggregatesInputSchema), z.lazy(() => FileScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  uploadUrl: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional()
}).strict();
const DailyStatsWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => DailyStatsWhereInputSchema), z.lazy(() => DailyStatsWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => DailyStatsWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => DailyStatsWhereInputSchema), z.lazy(() => DailyStatsWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
  date: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  totalViews: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
  prevDayViewsChangePercent: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userCount: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
  paidUserCount: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
  userDelta: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
  paidUserDelta: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
  totalRevenue: z.union([z.lazy(() => FloatFilterSchema), z.number()]).optional(),
  totalProfit: z.union([z.lazy(() => FloatFilterSchema), z.number()]).optional(),
  sources: z.lazy(() => PageViewSourceListRelationFilterSchema).optional()
}).strict();
const DailyStatsOrderByWithRelationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  totalViews: z.lazy(() => SortOrderSchema).optional(),
  prevDayViewsChangePercent: z.lazy(() => SortOrderSchema).optional(),
  userCount: z.lazy(() => SortOrderSchema).optional(),
  paidUserCount: z.lazy(() => SortOrderSchema).optional(),
  userDelta: z.lazy(() => SortOrderSchema).optional(),
  paidUserDelta: z.lazy(() => SortOrderSchema).optional(),
  totalRevenue: z.lazy(() => SortOrderSchema).optional(),
  totalProfit: z.lazy(() => SortOrderSchema).optional(),
  sources: z.lazy(() => PageViewSourceOrderByRelationAggregateInputSchema).optional()
}).strict();
const DailyStatsWhereUniqueInputSchema = z.union([
  z.object({
    id: z.number().int(),
    date: z.coerce.date()
  }),
  z.object({
    id: z.number().int()
  }),
  z.object({
    date: z.coerce.date()
  })
]).and(z.object({
  id: z.number().int().optional(),
  date: z.coerce.date().optional(),
  AND: z.union([z.lazy(() => DailyStatsWhereInputSchema), z.lazy(() => DailyStatsWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => DailyStatsWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => DailyStatsWhereInputSchema), z.lazy(() => DailyStatsWhereInputSchema).array()]).optional(),
  totalViews: z.union([z.lazy(() => IntFilterSchema), z.number().int()]).optional(),
  prevDayViewsChangePercent: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  userCount: z.union([z.lazy(() => IntFilterSchema), z.number().int()]).optional(),
  paidUserCount: z.union([z.lazy(() => IntFilterSchema), z.number().int()]).optional(),
  userDelta: z.union([z.lazy(() => IntFilterSchema), z.number().int()]).optional(),
  paidUserDelta: z.union([z.lazy(() => IntFilterSchema), z.number().int()]).optional(),
  totalRevenue: z.union([z.lazy(() => FloatFilterSchema), z.number()]).optional(),
  totalProfit: z.union([z.lazy(() => FloatFilterSchema), z.number()]).optional(),
  sources: z.lazy(() => PageViewSourceListRelationFilterSchema).optional()
}).strict());
const DailyStatsOrderByWithAggregationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  totalViews: z.lazy(() => SortOrderSchema).optional(),
  prevDayViewsChangePercent: z.lazy(() => SortOrderSchema).optional(),
  userCount: z.lazy(() => SortOrderSchema).optional(),
  paidUserCount: z.lazy(() => SortOrderSchema).optional(),
  userDelta: z.lazy(() => SortOrderSchema).optional(),
  paidUserDelta: z.lazy(() => SortOrderSchema).optional(),
  totalRevenue: z.lazy(() => SortOrderSchema).optional(),
  totalProfit: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DailyStatsCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DailyStatsAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DailyStatsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DailyStatsMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DailyStatsSumOrderByAggregateInputSchema).optional()
}).strict();
const DailyStatsScalarWhereWithAggregatesInputSchema = z.object({
  AND: z.union([z.lazy(() => DailyStatsScalarWhereWithAggregatesInputSchema), z.lazy(() => DailyStatsScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => DailyStatsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => DailyStatsScalarWhereWithAggregatesInputSchema), z.lazy(() => DailyStatsScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()]).optional(),
  date: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()]).optional(),
  totalViews: z.union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()]).optional(),
  prevDayViewsChangePercent: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  userCount: z.union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()]).optional(),
  paidUserCount: z.union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()]).optional(),
  userDelta: z.union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()]).optional(),
  paidUserDelta: z.union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()]).optional(),
  totalRevenue: z.union([z.lazy(() => FloatWithAggregatesFilterSchema), z.number()]).optional(),
  totalProfit: z.union([z.lazy(() => FloatWithAggregatesFilterSchema), z.number()]).optional()
}).strict();
const PageViewSourceWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => PageViewSourceWhereInputSchema), z.lazy(() => PageViewSourceWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => PageViewSourceWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => PageViewSourceWhereInputSchema), z.lazy(() => PageViewSourceWhereInputSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  date: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  dailyStatsId: z.union([z.lazy(() => IntNullableFilterSchema), z.number()]).optional().nullable(),
  visitors: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
  dailyStats: z.union([z.lazy(() => DailyStatsNullableRelationFilterSchema), z.lazy(() => DailyStatsWhereInputSchema)]).optional().nullable()
}).strict();
const PageViewSourceOrderByWithRelationInputSchema = z.object({
  name: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  dailyStatsId: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  visitors: z.lazy(() => SortOrderSchema).optional(),
  dailyStats: z.lazy(() => DailyStatsOrderByWithRelationInputSchema).optional()
}).strict();
const PageViewSourceWhereUniqueInputSchema = z.object({
  date_name: z.lazy(() => PageViewSourceDateNameCompoundUniqueInputSchema)
}).and(z.object({
  date_name: z.lazy(() => PageViewSourceDateNameCompoundUniqueInputSchema).optional(),
  AND: z.union([z.lazy(() => PageViewSourceWhereInputSchema), z.lazy(() => PageViewSourceWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => PageViewSourceWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => PageViewSourceWhereInputSchema), z.lazy(() => PageViewSourceWhereInputSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  date: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  dailyStatsId: z.union([z.lazy(() => IntNullableFilterSchema), z.number().int()]).optional().nullable(),
  visitors: z.union([z.lazy(() => IntFilterSchema), z.number().int()]).optional(),
  dailyStats: z.union([z.lazy(() => DailyStatsNullableRelationFilterSchema), z.lazy(() => DailyStatsWhereInputSchema)]).optional().nullable()
}).strict());
const PageViewSourceOrderByWithAggregationInputSchema = z.object({
  name: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  dailyStatsId: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  visitors: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PageViewSourceCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PageViewSourceAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PageViewSourceMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PageViewSourceMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PageViewSourceSumOrderByAggregateInputSchema).optional()
}).strict();
const PageViewSourceScalarWhereWithAggregatesInputSchema = z.object({
  AND: z.union([z.lazy(() => PageViewSourceScalarWhereWithAggregatesInputSchema), z.lazy(() => PageViewSourceScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => PageViewSourceScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => PageViewSourceScalarWhereWithAggregatesInputSchema), z.lazy(() => PageViewSourceScalarWhereWithAggregatesInputSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  date: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()]).optional(),
  dailyStatsId: z.union([z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number()]).optional().nullable(),
  visitors: z.union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()]).optional()
}).strict();
const LogsWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => LogsWhereInputSchema), z.lazy(() => LogsWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => LogsWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => LogsWhereInputSchema), z.lazy(() => LogsWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  message: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional()
}).strict();
const LogsOrderByWithRelationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  level: z.lazy(() => SortOrderSchema).optional()
}).strict();
const LogsWhereUniqueInputSchema = z.object({
  id: z.number().int()
}).and(z.object({
  id: z.number().int().optional(),
  AND: z.union([z.lazy(() => LogsWhereInputSchema), z.lazy(() => LogsWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => LogsWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => LogsWhereInputSchema), z.lazy(() => LogsWhereInputSchema).array()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  message: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional()
}).strict());
const LogsOrderByWithAggregationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  level: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LogsCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => LogsAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LogsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LogsMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => LogsSumOrderByAggregateInputSchema).optional()
}).strict();
const LogsScalarWhereWithAggregatesInputSchema = z.object({
  AND: z.union([z.lazy(() => LogsScalarWhereWithAggregatesInputSchema), z.lazy(() => LogsScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => LogsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => LogsScalarWhereWithAggregatesInputSchema), z.lazy(() => LogsScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()]).optional(),
  message: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional()
}).strict();
const ContactFormMessageWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => ContactFormMessageWhereInputSchema), z.lazy(() => ContactFormMessageWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => ContactFormMessageWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => ContactFormMessageWhereInputSchema), z.lazy(() => ContactFormMessageWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  content: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  isRead: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  repliedAt: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()]).optional().nullable(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional()
}).strict();
const ContactFormMessageOrderByWithRelationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  repliedAt: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();
const ContactFormMessageWhereUniqueInputSchema = z.object({
  id: z.string()
}).and(z.object({
  id: z.string().optional(),
  AND: z.union([z.lazy(() => ContactFormMessageWhereInputSchema), z.lazy(() => ContactFormMessageWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => ContactFormMessageWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => ContactFormMessageWhereInputSchema), z.lazy(() => ContactFormMessageWhereInputSchema).array()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  content: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  isRead: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  repliedAt: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()]).optional().nullable(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional()
}).strict());
const ContactFormMessageOrderByWithAggregationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  repliedAt: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  _count: z.lazy(() => ContactFormMessageCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContactFormMessageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContactFormMessageMinOrderByAggregateInputSchema).optional()
}).strict();
const ContactFormMessageScalarWhereWithAggregatesInputSchema = z.object({
  AND: z.union([z.lazy(() => ContactFormMessageScalarWhereWithAggregatesInputSchema), z.lazy(() => ContactFormMessageScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => ContactFormMessageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => ContactFormMessageScalarWhereWithAggregatesInputSchema), z.lazy(() => ContactFormMessageScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  content: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  isRead: z.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()]).optional(),
  repliedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date()]).optional().nullable()
}).strict();
const ElaboratedRecipeWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => ElaboratedRecipeWhereInputSchema), z.lazy(() => ElaboratedRecipeWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => ElaboratedRecipeWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => ElaboratedRecipeWhereInputSchema), z.lazy(() => ElaboratedRecipeWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  ingredients: z.lazy(() => JsonFilterSchema).optional(),
  instructions: z.lazy(() => JsonFilterSchema).optional(),
  isFavorite: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  dateCreated: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  servings: z.union([z.lazy(() => IntNullableFilterSchema), z.number()]).optional().nullable(),
  prepTime: z.union([z.lazy(() => IntNullableFilterSchema), z.number()]).optional().nullable(),
  cookTime: z.union([z.lazy(() => IntNullableFilterSchema), z.number()]).optional().nullable(),
  tags: z.lazy(() => JsonNullableFilterSchema).optional(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional()
}).strict();
const ElaboratedRecipeOrderByWithRelationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  ingredients: z.lazy(() => SortOrderSchema).optional(),
  instructions: z.lazy(() => SortOrderSchema).optional(),
  isFavorite: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  servings: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  prepTime: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  cookTime: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  tags: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();
const ElaboratedRecipeWhereUniqueInputSchema = z.object({
  id: z.string()
}).and(z.object({
  id: z.string().optional(),
  AND: z.union([z.lazy(() => ElaboratedRecipeWhereInputSchema), z.lazy(() => ElaboratedRecipeWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => ElaboratedRecipeWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => ElaboratedRecipeWhereInputSchema), z.lazy(() => ElaboratedRecipeWhereInputSchema).array()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  ingredients: z.lazy(() => JsonFilterSchema).optional(),
  instructions: z.lazy(() => JsonFilterSchema).optional(),
  isFavorite: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  dateCreated: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  servings: z.union([z.lazy(() => IntNullableFilterSchema), z.number().int()]).optional().nullable(),
  prepTime: z.union([z.lazy(() => IntNullableFilterSchema), z.number().int()]).optional().nullable(),
  cookTime: z.union([z.lazy(() => IntNullableFilterSchema), z.number().int()]).optional().nullable(),
  tags: z.lazy(() => JsonNullableFilterSchema).optional(),
  user: z.union([z.lazy(() => UserRelationFilterSchema), z.lazy(() => UserWhereInputSchema)]).optional()
}).strict());
const ElaboratedRecipeOrderByWithAggregationInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  ingredients: z.lazy(() => SortOrderSchema).optional(),
  instructions: z.lazy(() => SortOrderSchema).optional(),
  isFavorite: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  servings: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  prepTime: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  cookTime: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  tags: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
  _count: z.lazy(() => ElaboratedRecipeCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ElaboratedRecipeAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ElaboratedRecipeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ElaboratedRecipeMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ElaboratedRecipeSumOrderByAggregateInputSchema).optional()
}).strict();
const ElaboratedRecipeScalarWhereWithAggregatesInputSchema = z.object({
  AND: z.union([z.lazy(() => ElaboratedRecipeScalarWhereWithAggregatesInputSchema), z.lazy(() => ElaboratedRecipeScalarWhereWithAggregatesInputSchema).array()]).optional(),
  OR: z.lazy(() => ElaboratedRecipeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => ElaboratedRecipeScalarWhereWithAggregatesInputSchema), z.lazy(() => ElaboratedRecipeScalarWhereWithAggregatesInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  ingredients: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  instructions: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  isFavorite: z.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()]).optional(),
  dateCreated: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
  servings: z.union([z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number()]).optional().nullable(),
  prepTime: z.union([z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number()]).optional().nullable(),
  cookTime: z.union([z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number()]).optional().nullable(),
  tags: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional()
}).strict();
const UserCreateInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  isAdmin: z.boolean().optional(),
  paymentProcessorUserId: z.string().optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.string().optional().nullable(),
  subscriptionStatus: z.string().optional().nullable(),
  subscriptionPlan: z.string().optional().nullable(),
  datePaid: z.coerce.date().optional().nullable(),
  credits: z.number().int().optional(),
  gptResponses: z.lazy(() => GptResponseCreateNestedManyWithoutUserInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageCreateNestedManyWithoutUserInputSchema).optional(),
  tasks: z.lazy(() => TaskCreateNestedManyWithoutUserInputSchema).optional(),
  files: z.lazy(() => FileCreateNestedManyWithoutUserInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeCreateNestedManyWithoutUserInputSchema).optional()
}).strict();
const UserUncheckedCreateInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  isAdmin: z.boolean().optional(),
  paymentProcessorUserId: z.string().optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.string().optional().nullable(),
  subscriptionStatus: z.string().optional().nullable(),
  subscriptionPlan: z.string().optional().nullable(),
  datePaid: z.coerce.date().optional().nullable(),
  credits: z.number().int().optional(),
  gptResponses: z.lazy(() => GptResponseUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  files: z.lazy(() => FileUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();
const UserUpdateInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  username: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  isAdmin: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  paymentProcessorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionPlan: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  datePaid: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  gptResponses: z.lazy(() => GptResponseUpdateManyWithoutUserNestedInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUpdateManyWithoutUserNestedInputSchema).optional(),
  tasks: z.lazy(() => TaskUpdateManyWithoutUserNestedInputSchema).optional(),
  files: z.lazy(() => FileUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();
const UserUncheckedUpdateInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  username: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  isAdmin: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  paymentProcessorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionPlan: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  datePaid: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  gptResponses: z.lazy(() => GptResponseUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tasks: z.lazy(() => TaskUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  files: z.lazy(() => FileUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();
const UserCreateManyInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  isAdmin: z.boolean().optional(),
  paymentProcessorUserId: z.string().optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.string().optional().nullable(),
  subscriptionStatus: z.string().optional().nullable(),
  subscriptionPlan: z.string().optional().nullable(),
  datePaid: z.coerce.date().optional().nullable(),
  credits: z.number().int().optional()
}).strict();
const UserUpdateManyMutationInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  username: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  isAdmin: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  paymentProcessorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionPlan: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  datePaid: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const UserUncheckedUpdateManyInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  username: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  isAdmin: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  paymentProcessorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionPlan: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  datePaid: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const GptResponseCreateInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  content: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutGptResponsesInputSchema)
}).strict();
const GptResponseUncheckedCreateInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string(),
  content: z.string()
}).strict();
const GptResponseUpdateInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutGptResponsesNestedInputSchema).optional()
}).strict();
const GptResponseUncheckedUpdateInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const GptResponseCreateManyInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string(),
  content: z.string()
}).strict();
const GptResponseUpdateManyMutationInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const GptResponseUncheckedUpdateManyInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const TaskCreateInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  description: z.string(),
  time: z.string().optional(),
  isDone: z.boolean().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutTasksInputSchema)
}).strict();
const TaskUncheckedCreateInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  userId: z.string(),
  description: z.string(),
  time: z.string().optional(),
  isDone: z.boolean().optional()
}).strict();
const TaskUpdateInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  time: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isDone: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutTasksNestedInputSchema).optional()
}).strict();
const TaskUncheckedUpdateInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  time: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isDone: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const TaskCreateManyInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  userId: z.string(),
  description: z.string(),
  time: z.string().optional(),
  isDone: z.boolean().optional()
}).strict();
const TaskUpdateManyMutationInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  time: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isDone: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const TaskUncheckedUpdateManyInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  time: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isDone: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const FileCreateInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  key: z.string(),
  uploadUrl: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutFilesInputSchema)
}).strict();
const FileUncheckedCreateInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  userId: z.string(),
  name: z.string(),
  type: z.string(),
  key: z.string(),
  uploadUrl: z.string()
}).strict();
const FileUpdateInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  key: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  uploadUrl: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutFilesNestedInputSchema).optional()
}).strict();
const FileUncheckedUpdateInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  key: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  uploadUrl: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const FileCreateManyInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  userId: z.string(),
  name: z.string(),
  type: z.string(),
  key: z.string(),
  uploadUrl: z.string()
}).strict();
const FileUpdateManyMutationInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  key: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  uploadUrl: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const FileUncheckedUpdateManyInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  key: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  uploadUrl: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const DailyStatsCreateInputSchema = z.object({
  date: z.coerce.date().optional(),
  totalViews: z.number().int().optional(),
  prevDayViewsChangePercent: z.string().optional(),
  userCount: z.number().int().optional(),
  paidUserCount: z.number().int().optional(),
  userDelta: z.number().int().optional(),
  paidUserDelta: z.number().int().optional(),
  totalRevenue: z.number().optional(),
  totalProfit: z.number().optional(),
  sources: z.lazy(() => PageViewSourceCreateNestedManyWithoutDailyStatsInputSchema).optional()
}).strict();
const DailyStatsUncheckedCreateInputSchema = z.object({
  id: z.number().int().optional(),
  date: z.coerce.date().optional(),
  totalViews: z.number().int().optional(),
  prevDayViewsChangePercent: z.string().optional(),
  userCount: z.number().int().optional(),
  paidUserCount: z.number().int().optional(),
  userDelta: z.number().int().optional(),
  paidUserDelta: z.number().int().optional(),
  totalRevenue: z.number().optional(),
  totalProfit: z.number().optional(),
  sources: z.lazy(() => PageViewSourceUncheckedCreateNestedManyWithoutDailyStatsInputSchema).optional()
}).strict();
const DailyStatsUpdateInputSchema = z.object({
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  totalViews: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  prevDayViewsChangePercent: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  paidUserCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  userDelta: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  paidUserDelta: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  totalRevenue: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputSchema)]).optional(),
  totalProfit: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputSchema)]).optional(),
  sources: z.lazy(() => PageViewSourceUpdateManyWithoutDailyStatsNestedInputSchema).optional()
}).strict();
const DailyStatsUncheckedUpdateInputSchema = z.object({
  id: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  totalViews: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  prevDayViewsChangePercent: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  paidUserCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  userDelta: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  paidUserDelta: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  totalRevenue: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputSchema)]).optional(),
  totalProfit: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputSchema)]).optional(),
  sources: z.lazy(() => PageViewSourceUncheckedUpdateManyWithoutDailyStatsNestedInputSchema).optional()
}).strict();
const DailyStatsCreateManyInputSchema = z.object({
  id: z.number().int().optional(),
  date: z.coerce.date().optional(),
  totalViews: z.number().int().optional(),
  prevDayViewsChangePercent: z.string().optional(),
  userCount: z.number().int().optional(),
  paidUserCount: z.number().int().optional(),
  userDelta: z.number().int().optional(),
  paidUserDelta: z.number().int().optional(),
  totalRevenue: z.number().optional(),
  totalProfit: z.number().optional()
}).strict();
const DailyStatsUpdateManyMutationInputSchema = z.object({
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  totalViews: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  prevDayViewsChangePercent: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  paidUserCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  userDelta: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  paidUserDelta: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  totalRevenue: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputSchema)]).optional(),
  totalProfit: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const DailyStatsUncheckedUpdateManyInputSchema = z.object({
  id: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  totalViews: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  prevDayViewsChangePercent: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  paidUserCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  userDelta: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  paidUserDelta: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  totalRevenue: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputSchema)]).optional(),
  totalProfit: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const PageViewSourceCreateInputSchema = z.object({
  name: z.string(),
  date: z.coerce.date().optional(),
  visitors: z.number().int(),
  dailyStats: z.lazy(() => DailyStatsCreateNestedOneWithoutSourcesInputSchema).optional()
}).strict();
const PageViewSourceUncheckedCreateInputSchema = z.object({
  name: z.string(),
  date: z.coerce.date().optional(),
  dailyStatsId: z.number().int().optional().nullable(),
  visitors: z.number().int()
}).strict();
const PageViewSourceUpdateInputSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  visitors: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  dailyStats: z.lazy(() => DailyStatsUpdateOneWithoutSourcesNestedInputSchema).optional()
}).strict();
const PageViewSourceUncheckedUpdateInputSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  dailyStatsId: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  visitors: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const PageViewSourceCreateManyInputSchema = z.object({
  name: z.string(),
  date: z.coerce.date().optional(),
  dailyStatsId: z.number().int().optional().nullable(),
  visitors: z.number().int()
}).strict();
const PageViewSourceUpdateManyMutationInputSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  visitors: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const PageViewSourceUncheckedUpdateManyInputSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  dailyStatsId: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  visitors: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const LogsCreateInputSchema = z.object({
  createdAt: z.coerce.date().optional(),
  message: z.string(),
  level: z.string()
}).strict();
const LogsUncheckedCreateInputSchema = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  message: z.string(),
  level: z.string()
}).strict();
const LogsUpdateInputSchema = z.object({
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  message: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const LogsUncheckedUpdateInputSchema = z.object({
  id: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  message: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const LogsCreateManyInputSchema = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  message: z.string(),
  level: z.string()
}).strict();
const LogsUpdateManyMutationInputSchema = z.object({
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  message: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const LogsUncheckedUpdateManyInputSchema = z.object({
  id: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  message: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  level: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const ContactFormMessageCreateInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  content: z.string(),
  isRead: z.boolean().optional(),
  repliedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutContactFormMessagesInputSchema)
}).strict();
const ContactFormMessageUncheckedCreateInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  userId: z.string(),
  content: z.string(),
  isRead: z.boolean().optional(),
  repliedAt: z.coerce.date().optional().nullable()
}).strict();
const ContactFormMessageUpdateInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isRead: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  repliedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutContactFormMessagesNestedInputSchema).optional()
}).strict();
const ContactFormMessageUncheckedUpdateInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isRead: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  repliedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable()
}).strict();
const ContactFormMessageCreateManyInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  userId: z.string(),
  content: z.string(),
  isRead: z.boolean().optional(),
  repliedAt: z.coerce.date().optional().nullable()
}).strict();
const ContactFormMessageUpdateManyMutationInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isRead: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  repliedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable()
}).strict();
const ContactFormMessageUncheckedUpdateManyInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isRead: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  repliedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable()
}).strict();
const ElaboratedRecipeCreateInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  title: z.string(),
  ingredients: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
  instructions: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
  isFavorite: z.boolean().optional(),
  dateCreated: z.string(),
  servings: z.number().int().optional().nullable(),
  prepTime: z.number().int().optional().nullable(),
  cookTime: z.number().int().optional().nullable(),
  tags: z.union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutElaboratedRecipesInputSchema)
}).strict();
const ElaboratedRecipeUncheckedCreateInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string(),
  title: z.string(),
  ingredients: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
  instructions: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
  isFavorite: z.boolean().optional(),
  dateCreated: z.string(),
  servings: z.number().int().optional().nullable(),
  prepTime: z.number().int().optional().nullable(),
  cookTime: z.number().int().optional().nullable(),
  tags: z.union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema]).optional()
}).strict();
const ElaboratedRecipeUpdateInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  ingredients: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  instructions: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  isFavorite: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  dateCreated: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  servings: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  prepTime: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  cookTime: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  tags: z.union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutElaboratedRecipesNestedInputSchema).optional()
}).strict();
const ElaboratedRecipeUncheckedUpdateInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  ingredients: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  instructions: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  isFavorite: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  dateCreated: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  servings: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  prepTime: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  cookTime: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  tags: z.union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema]).optional()
}).strict();
const ElaboratedRecipeCreateManyInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string(),
  title: z.string(),
  ingredients: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
  instructions: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
  isFavorite: z.boolean().optional(),
  dateCreated: z.string(),
  servings: z.number().int().optional().nullable(),
  prepTime: z.number().int().optional().nullable(),
  cookTime: z.number().int().optional().nullable(),
  tags: z.union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema]).optional()
}).strict();
const ElaboratedRecipeUpdateManyMutationInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  ingredients: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  instructions: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  isFavorite: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  dateCreated: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  servings: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  prepTime: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  cookTime: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  tags: z.union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema]).optional()
}).strict();
const ElaboratedRecipeUncheckedUpdateManyInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  ingredients: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  instructions: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  isFavorite: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  dateCreated: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  servings: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  prepTime: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  cookTime: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  tags: z.union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema]).optional()
}).strict();
const StringFilterSchema = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringFilterSchema)]).optional()
}).strict();
const DateTimeFilterSchema = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)]).optional()
}).strict();
const StringNullableFilterSchema = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)]).optional().nullable()
}).strict();
const BoolFilterSchema = z.object({
  equals: z.boolean().optional(),
  not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)]).optional()
}).strict();
const DateTimeNullableFilterSchema = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableFilterSchema)]).optional().nullable()
}).strict();
const IntFilterSchema = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional()
}).strict();
const GptResponseListRelationFilterSchema = z.object({
  every: z.lazy(() => GptResponseWhereInputSchema).optional(),
  some: z.lazy(() => GptResponseWhereInputSchema).optional(),
  none: z.lazy(() => GptResponseWhereInputSchema).optional()
}).strict();
const ContactFormMessageListRelationFilterSchema = z.object({
  every: z.lazy(() => ContactFormMessageWhereInputSchema).optional(),
  some: z.lazy(() => ContactFormMessageWhereInputSchema).optional(),
  none: z.lazy(() => ContactFormMessageWhereInputSchema).optional()
}).strict();
const TaskListRelationFilterSchema = z.object({
  every: z.lazy(() => TaskWhereInputSchema).optional(),
  some: z.lazy(() => TaskWhereInputSchema).optional(),
  none: z.lazy(() => TaskWhereInputSchema).optional()
}).strict();
const FileListRelationFilterSchema = z.object({
  every: z.lazy(() => FileWhereInputSchema).optional(),
  some: z.lazy(() => FileWhereInputSchema).optional(),
  none: z.lazy(() => FileWhereInputSchema).optional()
}).strict();
const ElaboratedRecipeListRelationFilterSchema = z.object({
  every: z.lazy(() => ElaboratedRecipeWhereInputSchema).optional(),
  some: z.lazy(() => ElaboratedRecipeWhereInputSchema).optional(),
  none: z.lazy(() => ElaboratedRecipeWhereInputSchema).optional()
}).strict();
const SortOrderInputSchema = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();
const GptResponseOrderByRelationAggregateInputSchema = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();
const ContactFormMessageOrderByRelationAggregateInputSchema = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();
const TaskOrderByRelationAggregateInputSchema = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();
const FileOrderByRelationAggregateInputSchema = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();
const ElaboratedRecipeOrderByRelationAggregateInputSchema = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();
const UserCountOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional(),
  paymentProcessorUserId: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyCustomerPortalUrl: z.lazy(() => SortOrderSchema).optional(),
  subscriptionStatus: z.lazy(() => SortOrderSchema).optional(),
  subscriptionPlan: z.lazy(() => SortOrderSchema).optional(),
  datePaid: z.lazy(() => SortOrderSchema).optional(),
  credits: z.lazy(() => SortOrderSchema).optional()
}).strict();
const UserAvgOrderByAggregateInputSchema = z.object({
  credits: z.lazy(() => SortOrderSchema).optional()
}).strict();
const UserMaxOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional(),
  paymentProcessorUserId: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyCustomerPortalUrl: z.lazy(() => SortOrderSchema).optional(),
  subscriptionStatus: z.lazy(() => SortOrderSchema).optional(),
  subscriptionPlan: z.lazy(() => SortOrderSchema).optional(),
  datePaid: z.lazy(() => SortOrderSchema).optional(),
  credits: z.lazy(() => SortOrderSchema).optional()
}).strict();
const UserMinOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional(),
  paymentProcessorUserId: z.lazy(() => SortOrderSchema).optional(),
  lemonSqueezyCustomerPortalUrl: z.lazy(() => SortOrderSchema).optional(),
  subscriptionStatus: z.lazy(() => SortOrderSchema).optional(),
  subscriptionPlan: z.lazy(() => SortOrderSchema).optional(),
  datePaid: z.lazy(() => SortOrderSchema).optional(),
  credits: z.lazy(() => SortOrderSchema).optional()
}).strict();
const UserSumOrderByAggregateInputSchema = z.object({
  credits: z.lazy(() => SortOrderSchema).optional()
}).strict();
const StringWithAggregatesFilterSchema = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();
const DateTimeWithAggregatesFilterSchema = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();
const StringNullableWithAggregatesFilterSchema = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringNullableWithAggregatesFilterSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();
const BoolWithAggregatesFilterSchema = z.object({
  equals: z.boolean().optional(),
  not: z.union([z.boolean(), z.lazy(() => NestedBoolWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();
const DateTimeNullableWithAggregatesFilterSchema = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();
const IntWithAggregatesFilterSchema = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();
const UserRelationFilterSchema = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();
const GptResponseCountOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional()
}).strict();
const GptResponseMaxOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional()
}).strict();
const GptResponseMinOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional()
}).strict();
const TaskCountOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  isDone: z.lazy(() => SortOrderSchema).optional()
}).strict();
const TaskMaxOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  isDone: z.lazy(() => SortOrderSchema).optional()
}).strict();
const TaskMinOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  isDone: z.lazy(() => SortOrderSchema).optional()
}).strict();
const FileCountOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  uploadUrl: z.lazy(() => SortOrderSchema).optional()
}).strict();
const FileMaxOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  uploadUrl: z.lazy(() => SortOrderSchema).optional()
}).strict();
const FileMinOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  uploadUrl: z.lazy(() => SortOrderSchema).optional()
}).strict();
const FloatFilterSchema = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedFloatFilterSchema)]).optional()
}).strict();
const PageViewSourceListRelationFilterSchema = z.object({
  every: z.lazy(() => PageViewSourceWhereInputSchema).optional(),
  some: z.lazy(() => PageViewSourceWhereInputSchema).optional(),
  none: z.lazy(() => PageViewSourceWhereInputSchema).optional()
}).strict();
const PageViewSourceOrderByRelationAggregateInputSchema = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();
const DailyStatsCountOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  totalViews: z.lazy(() => SortOrderSchema).optional(),
  prevDayViewsChangePercent: z.lazy(() => SortOrderSchema).optional(),
  userCount: z.lazy(() => SortOrderSchema).optional(),
  paidUserCount: z.lazy(() => SortOrderSchema).optional(),
  userDelta: z.lazy(() => SortOrderSchema).optional(),
  paidUserDelta: z.lazy(() => SortOrderSchema).optional(),
  totalRevenue: z.lazy(() => SortOrderSchema).optional(),
  totalProfit: z.lazy(() => SortOrderSchema).optional()
}).strict();
const DailyStatsAvgOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  totalViews: z.lazy(() => SortOrderSchema).optional(),
  userCount: z.lazy(() => SortOrderSchema).optional(),
  paidUserCount: z.lazy(() => SortOrderSchema).optional(),
  userDelta: z.lazy(() => SortOrderSchema).optional(),
  paidUserDelta: z.lazy(() => SortOrderSchema).optional(),
  totalRevenue: z.lazy(() => SortOrderSchema).optional(),
  totalProfit: z.lazy(() => SortOrderSchema).optional()
}).strict();
const DailyStatsMaxOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  totalViews: z.lazy(() => SortOrderSchema).optional(),
  prevDayViewsChangePercent: z.lazy(() => SortOrderSchema).optional(),
  userCount: z.lazy(() => SortOrderSchema).optional(),
  paidUserCount: z.lazy(() => SortOrderSchema).optional(),
  userDelta: z.lazy(() => SortOrderSchema).optional(),
  paidUserDelta: z.lazy(() => SortOrderSchema).optional(),
  totalRevenue: z.lazy(() => SortOrderSchema).optional(),
  totalProfit: z.lazy(() => SortOrderSchema).optional()
}).strict();
const DailyStatsMinOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  totalViews: z.lazy(() => SortOrderSchema).optional(),
  prevDayViewsChangePercent: z.lazy(() => SortOrderSchema).optional(),
  userCount: z.lazy(() => SortOrderSchema).optional(),
  paidUserCount: z.lazy(() => SortOrderSchema).optional(),
  userDelta: z.lazy(() => SortOrderSchema).optional(),
  paidUserDelta: z.lazy(() => SortOrderSchema).optional(),
  totalRevenue: z.lazy(() => SortOrderSchema).optional(),
  totalProfit: z.lazy(() => SortOrderSchema).optional()
}).strict();
const DailyStatsSumOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  totalViews: z.lazy(() => SortOrderSchema).optional(),
  userCount: z.lazy(() => SortOrderSchema).optional(),
  paidUserCount: z.lazy(() => SortOrderSchema).optional(),
  userDelta: z.lazy(() => SortOrderSchema).optional(),
  paidUserDelta: z.lazy(() => SortOrderSchema).optional(),
  totalRevenue: z.lazy(() => SortOrderSchema).optional(),
  totalProfit: z.lazy(() => SortOrderSchema).optional()
}).strict();
const FloatWithAggregatesFilterSchema = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedFloatWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();
const IntNullableFilterSchema = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)]).optional().nullable()
}).strict();
const DailyStatsNullableRelationFilterSchema = z.object({
  is: z.lazy(() => DailyStatsWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => DailyStatsWhereInputSchema).optional().nullable()
}).strict();
const PageViewSourceDateNameCompoundUniqueInputSchema = z.object({
  date: z.coerce.date(),
  name: z.string()
}).strict();
const PageViewSourceCountOrderByAggregateInputSchema = z.object({
  name: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  dailyStatsId: z.lazy(() => SortOrderSchema).optional(),
  visitors: z.lazy(() => SortOrderSchema).optional()
}).strict();
const PageViewSourceAvgOrderByAggregateInputSchema = z.object({
  dailyStatsId: z.lazy(() => SortOrderSchema).optional(),
  visitors: z.lazy(() => SortOrderSchema).optional()
}).strict();
const PageViewSourceMaxOrderByAggregateInputSchema = z.object({
  name: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  dailyStatsId: z.lazy(() => SortOrderSchema).optional(),
  visitors: z.lazy(() => SortOrderSchema).optional()
}).strict();
const PageViewSourceMinOrderByAggregateInputSchema = z.object({
  name: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  dailyStatsId: z.lazy(() => SortOrderSchema).optional(),
  visitors: z.lazy(() => SortOrderSchema).optional()
}).strict();
const PageViewSourceSumOrderByAggregateInputSchema = z.object({
  dailyStatsId: z.lazy(() => SortOrderSchema).optional(),
  visitors: z.lazy(() => SortOrderSchema).optional()
}).strict();
const IntNullableWithAggregatesFilterSchema = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntNullableWithAggregatesFilterSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();
const LogsCountOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  level: z.lazy(() => SortOrderSchema).optional()
}).strict();
const LogsAvgOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();
const LogsMaxOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  level: z.lazy(() => SortOrderSchema).optional()
}).strict();
const LogsMinOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  level: z.lazy(() => SortOrderSchema).optional()
}).strict();
const LogsSumOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();
const ContactFormMessageCountOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  repliedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();
const ContactFormMessageMaxOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  repliedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();
const ContactFormMessageMinOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  repliedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();
const JsonFilterSchema = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();
const JsonNullableFilterSchema = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();
const ElaboratedRecipeCountOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  ingredients: z.lazy(() => SortOrderSchema).optional(),
  instructions: z.lazy(() => SortOrderSchema).optional(),
  isFavorite: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  servings: z.lazy(() => SortOrderSchema).optional(),
  prepTime: z.lazy(() => SortOrderSchema).optional(),
  cookTime: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional()
}).strict();
const ElaboratedRecipeAvgOrderByAggregateInputSchema = z.object({
  servings: z.lazy(() => SortOrderSchema).optional(),
  prepTime: z.lazy(() => SortOrderSchema).optional(),
  cookTime: z.lazy(() => SortOrderSchema).optional()
}).strict();
const ElaboratedRecipeMaxOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  isFavorite: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  servings: z.lazy(() => SortOrderSchema).optional(),
  prepTime: z.lazy(() => SortOrderSchema).optional(),
  cookTime: z.lazy(() => SortOrderSchema).optional()
}).strict();
const ElaboratedRecipeMinOrderByAggregateInputSchema = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  isFavorite: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  servings: z.lazy(() => SortOrderSchema).optional(),
  prepTime: z.lazy(() => SortOrderSchema).optional(),
  cookTime: z.lazy(() => SortOrderSchema).optional()
}).strict();
const ElaboratedRecipeSumOrderByAggregateInputSchema = z.object({
  servings: z.lazy(() => SortOrderSchema).optional(),
  prepTime: z.lazy(() => SortOrderSchema).optional(),
  cookTime: z.lazy(() => SortOrderSchema).optional()
}).strict();
const JsonWithAggregatesFilterSchema = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();
const JsonNullableWithAggregatesFilterSchema = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();
const GptResponseCreateNestedManyWithoutUserInputSchema = z.object({
  create: z.union([z.lazy(() => GptResponseCreateWithoutUserInputSchema), z.lazy(() => GptResponseCreateWithoutUserInputSchema).array(), z.lazy(() => GptResponseUncheckedCreateWithoutUserInputSchema), z.lazy(() => GptResponseUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GptResponseCreateOrConnectWithoutUserInputSchema), z.lazy(() => GptResponseCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => GptResponseCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => GptResponseWhereUniqueInputSchema), z.lazy(() => GptResponseWhereUniqueInputSchema).array()]).optional()
}).strict();
const ContactFormMessageCreateNestedManyWithoutUserInputSchema = z.object({
  create: z.union([z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema), z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema).array(), z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema), z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema), z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => ContactFormMessageCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => ContactFormMessageWhereUniqueInputSchema), z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array()]).optional()
}).strict();
const TaskCreateNestedManyWithoutUserInputSchema = z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutUserInputSchema), z.lazy(() => TaskCreateWithoutUserInputSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutUserInputSchema), z.lazy(() => TaskUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutUserInputSchema), z.lazy(() => TaskCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputSchema), z.lazy(() => TaskWhereUniqueInputSchema).array()]).optional()
}).strict();
const FileCreateNestedManyWithoutUserInputSchema = z.object({
  create: z.union([z.lazy(() => FileCreateWithoutUserInputSchema), z.lazy(() => FileCreateWithoutUserInputSchema).array(), z.lazy(() => FileUncheckedCreateWithoutUserInputSchema), z.lazy(() => FileUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => FileCreateOrConnectWithoutUserInputSchema), z.lazy(() => FileCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => FileCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => FileWhereUniqueInputSchema), z.lazy(() => FileWhereUniqueInputSchema).array()]).optional()
}).strict();
const ElaboratedRecipeCreateNestedManyWithoutUserInputSchema = z.object({
  create: z.union([z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema).array(), z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => ElaboratedRecipeCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema), z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array()]).optional()
}).strict();
const GptResponseUncheckedCreateNestedManyWithoutUserInputSchema = z.object({
  create: z.union([z.lazy(() => GptResponseCreateWithoutUserInputSchema), z.lazy(() => GptResponseCreateWithoutUserInputSchema).array(), z.lazy(() => GptResponseUncheckedCreateWithoutUserInputSchema), z.lazy(() => GptResponseUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GptResponseCreateOrConnectWithoutUserInputSchema), z.lazy(() => GptResponseCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => GptResponseCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => GptResponseWhereUniqueInputSchema), z.lazy(() => GptResponseWhereUniqueInputSchema).array()]).optional()
}).strict();
const ContactFormMessageUncheckedCreateNestedManyWithoutUserInputSchema = z.object({
  create: z.union([z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema), z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema).array(), z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema), z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema), z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => ContactFormMessageCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => ContactFormMessageWhereUniqueInputSchema), z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array()]).optional()
}).strict();
const TaskUncheckedCreateNestedManyWithoutUserInputSchema = z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutUserInputSchema), z.lazy(() => TaskCreateWithoutUserInputSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutUserInputSchema), z.lazy(() => TaskUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutUserInputSchema), z.lazy(() => TaskCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputSchema), z.lazy(() => TaskWhereUniqueInputSchema).array()]).optional()
}).strict();
const FileUncheckedCreateNestedManyWithoutUserInputSchema = z.object({
  create: z.union([z.lazy(() => FileCreateWithoutUserInputSchema), z.lazy(() => FileCreateWithoutUserInputSchema).array(), z.lazy(() => FileUncheckedCreateWithoutUserInputSchema), z.lazy(() => FileUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => FileCreateOrConnectWithoutUserInputSchema), z.lazy(() => FileCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => FileCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => FileWhereUniqueInputSchema), z.lazy(() => FileWhereUniqueInputSchema).array()]).optional()
}).strict();
const ElaboratedRecipeUncheckedCreateNestedManyWithoutUserInputSchema = z.object({
  create: z.union([z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema).array(), z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => ElaboratedRecipeCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema), z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array()]).optional()
}).strict();
const StringFieldUpdateOperationsInputSchema = z.object({
  set: z.string().optional()
}).strict();
const DateTimeFieldUpdateOperationsInputSchema = z.object({
  set: z.coerce.date().optional()
}).strict();
const NullableStringFieldUpdateOperationsInputSchema = z.object({
  set: z.string().optional().nullable()
}).strict();
const BoolFieldUpdateOperationsInputSchema = z.object({
  set: z.boolean().optional()
}).strict();
const NullableDateTimeFieldUpdateOperationsInputSchema = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();
const IntFieldUpdateOperationsInputSchema = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();
const GptResponseUpdateManyWithoutUserNestedInputSchema = z.object({
  create: z.union([z.lazy(() => GptResponseCreateWithoutUserInputSchema), z.lazy(() => GptResponseCreateWithoutUserInputSchema).array(), z.lazy(() => GptResponseUncheckedCreateWithoutUserInputSchema), z.lazy(() => GptResponseUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GptResponseCreateOrConnectWithoutUserInputSchema), z.lazy(() => GptResponseCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => GptResponseUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => GptResponseUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => GptResponseCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => GptResponseWhereUniqueInputSchema), z.lazy(() => GptResponseWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => GptResponseWhereUniqueInputSchema), z.lazy(() => GptResponseWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => GptResponseWhereUniqueInputSchema), z.lazy(() => GptResponseWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => GptResponseWhereUniqueInputSchema), z.lazy(() => GptResponseWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => GptResponseUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => GptResponseUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => GptResponseUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => GptResponseUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => GptResponseScalarWhereInputSchema), z.lazy(() => GptResponseScalarWhereInputSchema).array()]).optional()
}).strict();
const ContactFormMessageUpdateManyWithoutUserNestedInputSchema = z.object({
  create: z.union([z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema), z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema).array(), z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema), z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema), z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ContactFormMessageUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ContactFormMessageUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => ContactFormMessageCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => ContactFormMessageWhereUniqueInputSchema), z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ContactFormMessageWhereUniqueInputSchema), z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ContactFormMessageWhereUniqueInputSchema), z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ContactFormMessageWhereUniqueInputSchema), z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => ContactFormMessageUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ContactFormMessageUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ContactFormMessageUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => ContactFormMessageUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ContactFormMessageScalarWhereInputSchema), z.lazy(() => ContactFormMessageScalarWhereInputSchema).array()]).optional()
}).strict();
const TaskUpdateManyWithoutUserNestedInputSchema = z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutUserInputSchema), z.lazy(() => TaskCreateWithoutUserInputSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutUserInputSchema), z.lazy(() => TaskUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutUserInputSchema), z.lazy(() => TaskCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputSchema), z.lazy(() => TaskWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputSchema), z.lazy(() => TaskWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputSchema), z.lazy(() => TaskWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputSchema), z.lazy(() => TaskWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputSchema), z.lazy(() => TaskScalarWhereInputSchema).array()]).optional()
}).strict();
const FileUpdateManyWithoutUserNestedInputSchema = z.object({
  create: z.union([z.lazy(() => FileCreateWithoutUserInputSchema), z.lazy(() => FileCreateWithoutUserInputSchema).array(), z.lazy(() => FileUncheckedCreateWithoutUserInputSchema), z.lazy(() => FileUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => FileCreateOrConnectWithoutUserInputSchema), z.lazy(() => FileCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => FileUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => FileUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => FileCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => FileWhereUniqueInputSchema), z.lazy(() => FileWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => FileWhereUniqueInputSchema), z.lazy(() => FileWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => FileWhereUniqueInputSchema), z.lazy(() => FileWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => FileWhereUniqueInputSchema), z.lazy(() => FileWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => FileUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => FileUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => FileUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => FileUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => FileScalarWhereInputSchema), z.lazy(() => FileScalarWhereInputSchema).array()]).optional()
}).strict();
const ElaboratedRecipeUpdateManyWithoutUserNestedInputSchema = z.object({
  create: z.union([z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema).array(), z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ElaboratedRecipeUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => ElaboratedRecipeCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema), z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema), z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema), z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema), z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => ElaboratedRecipeUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ElaboratedRecipeUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ElaboratedRecipeScalarWhereInputSchema), z.lazy(() => ElaboratedRecipeScalarWhereInputSchema).array()]).optional()
}).strict();
const GptResponseUncheckedUpdateManyWithoutUserNestedInputSchema = z.object({
  create: z.union([z.lazy(() => GptResponseCreateWithoutUserInputSchema), z.lazy(() => GptResponseCreateWithoutUserInputSchema).array(), z.lazy(() => GptResponseUncheckedCreateWithoutUserInputSchema), z.lazy(() => GptResponseUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => GptResponseCreateOrConnectWithoutUserInputSchema), z.lazy(() => GptResponseCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => GptResponseUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => GptResponseUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => GptResponseCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => GptResponseWhereUniqueInputSchema), z.lazy(() => GptResponseWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => GptResponseWhereUniqueInputSchema), z.lazy(() => GptResponseWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => GptResponseWhereUniqueInputSchema), z.lazy(() => GptResponseWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => GptResponseWhereUniqueInputSchema), z.lazy(() => GptResponseWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => GptResponseUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => GptResponseUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => GptResponseUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => GptResponseUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => GptResponseScalarWhereInputSchema), z.lazy(() => GptResponseScalarWhereInputSchema).array()]).optional()
}).strict();
const ContactFormMessageUncheckedUpdateManyWithoutUserNestedInputSchema = z.object({
  create: z.union([z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema), z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema).array(), z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema), z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema), z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ContactFormMessageUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ContactFormMessageUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => ContactFormMessageCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => ContactFormMessageWhereUniqueInputSchema), z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ContactFormMessageWhereUniqueInputSchema), z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ContactFormMessageWhereUniqueInputSchema), z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ContactFormMessageWhereUniqueInputSchema), z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => ContactFormMessageUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ContactFormMessageUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ContactFormMessageUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => ContactFormMessageUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ContactFormMessageScalarWhereInputSchema), z.lazy(() => ContactFormMessageScalarWhereInputSchema).array()]).optional()
}).strict();
const TaskUncheckedUpdateManyWithoutUserNestedInputSchema = z.object({
  create: z.union([z.lazy(() => TaskCreateWithoutUserInputSchema), z.lazy(() => TaskCreateWithoutUserInputSchema).array(), z.lazy(() => TaskUncheckedCreateWithoutUserInputSchema), z.lazy(() => TaskUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => TaskCreateOrConnectWithoutUserInputSchema), z.lazy(() => TaskCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => TaskUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => TaskUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => TaskCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => TaskWhereUniqueInputSchema), z.lazy(() => TaskWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => TaskWhereUniqueInputSchema), z.lazy(() => TaskWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => TaskWhereUniqueInputSchema), z.lazy(() => TaskWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => TaskWhereUniqueInputSchema), z.lazy(() => TaskWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => TaskUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => TaskUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => TaskUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => TaskUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => TaskScalarWhereInputSchema), z.lazy(() => TaskScalarWhereInputSchema).array()]).optional()
}).strict();
const FileUncheckedUpdateManyWithoutUserNestedInputSchema = z.object({
  create: z.union([z.lazy(() => FileCreateWithoutUserInputSchema), z.lazy(() => FileCreateWithoutUserInputSchema).array(), z.lazy(() => FileUncheckedCreateWithoutUserInputSchema), z.lazy(() => FileUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => FileCreateOrConnectWithoutUserInputSchema), z.lazy(() => FileCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => FileUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => FileUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => FileCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => FileWhereUniqueInputSchema), z.lazy(() => FileWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => FileWhereUniqueInputSchema), z.lazy(() => FileWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => FileWhereUniqueInputSchema), z.lazy(() => FileWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => FileWhereUniqueInputSchema), z.lazy(() => FileWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => FileUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => FileUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => FileUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => FileUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => FileScalarWhereInputSchema), z.lazy(() => FileScalarWhereInputSchema).array()]).optional()
}).strict();
const ElaboratedRecipeUncheckedUpdateManyWithoutUserNestedInputSchema = z.object({
  create: z.union([z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema).array(), z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => ElaboratedRecipeUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeUpsertWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  createMany: z.lazy(() => ElaboratedRecipeCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema), z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema), z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema), z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema), z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => ElaboratedRecipeUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeUpdateWithWhereUniqueWithoutUserInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => ElaboratedRecipeUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeUpdateManyWithWhereWithoutUserInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => ElaboratedRecipeScalarWhereInputSchema), z.lazy(() => ElaboratedRecipeScalarWhereInputSchema).array()]).optional()
}).strict();
const UserCreateNestedOneWithoutGptResponsesInputSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutGptResponsesInputSchema), z.lazy(() => UserUncheckedCreateWithoutGptResponsesInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutGptResponsesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();
const UserUpdateOneRequiredWithoutGptResponsesNestedInputSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutGptResponsesInputSchema), z.lazy(() => UserUncheckedCreateWithoutGptResponsesInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutGptResponsesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutGptResponsesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutGptResponsesInputSchema), z.lazy(() => UserUpdateWithoutGptResponsesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutGptResponsesInputSchema)]).optional()
}).strict();
const UserCreateNestedOneWithoutTasksInputSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutTasksInputSchema), z.lazy(() => UserUncheckedCreateWithoutTasksInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTasksInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();
const UserUpdateOneRequiredWithoutTasksNestedInputSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutTasksInputSchema), z.lazy(() => UserUncheckedCreateWithoutTasksInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutTasksInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutTasksInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutTasksInputSchema), z.lazy(() => UserUpdateWithoutTasksInputSchema), z.lazy(() => UserUncheckedUpdateWithoutTasksInputSchema)]).optional()
}).strict();
const UserCreateNestedOneWithoutFilesInputSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutFilesInputSchema), z.lazy(() => UserUncheckedCreateWithoutFilesInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFilesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();
const UserUpdateOneRequiredWithoutFilesNestedInputSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutFilesInputSchema), z.lazy(() => UserUncheckedCreateWithoutFilesInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFilesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutFilesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutFilesInputSchema), z.lazy(() => UserUpdateWithoutFilesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutFilesInputSchema)]).optional()
}).strict();
const PageViewSourceCreateNestedManyWithoutDailyStatsInputSchema = z.object({
  create: z.union([z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema).array(), z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema).array()]).optional(),
  createMany: z.lazy(() => PageViewSourceCreateManyDailyStatsInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => PageViewSourceWhereUniqueInputSchema), z.lazy(() => PageViewSourceWhereUniqueInputSchema).array()]).optional()
}).strict();
const PageViewSourceUncheckedCreateNestedManyWithoutDailyStatsInputSchema = z.object({
  create: z.union([z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema).array(), z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema).array()]).optional(),
  createMany: z.lazy(() => PageViewSourceCreateManyDailyStatsInputEnvelopeSchema).optional(),
  connect: z.union([z.lazy(() => PageViewSourceWhereUniqueInputSchema), z.lazy(() => PageViewSourceWhereUniqueInputSchema).array()]).optional()
}).strict();
const FloatFieldUpdateOperationsInputSchema = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();
const PageViewSourceUpdateManyWithoutDailyStatsNestedInputSchema = z.object({
  create: z.union([z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema).array(), z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PageViewSourceUpsertWithWhereUniqueWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceUpsertWithWhereUniqueWithoutDailyStatsInputSchema).array()]).optional(),
  createMany: z.lazy(() => PageViewSourceCreateManyDailyStatsInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => PageViewSourceWhereUniqueInputSchema), z.lazy(() => PageViewSourceWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PageViewSourceWhereUniqueInputSchema), z.lazy(() => PageViewSourceWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PageViewSourceWhereUniqueInputSchema), z.lazy(() => PageViewSourceWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PageViewSourceWhereUniqueInputSchema), z.lazy(() => PageViewSourceWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => PageViewSourceUpdateWithWhereUniqueWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceUpdateWithWhereUniqueWithoutDailyStatsInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PageViewSourceUpdateManyWithWhereWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceUpdateManyWithWhereWithoutDailyStatsInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PageViewSourceScalarWhereInputSchema), z.lazy(() => PageViewSourceScalarWhereInputSchema).array()]).optional()
}).strict();
const PageViewSourceUncheckedUpdateManyWithoutDailyStatsNestedInputSchema = z.object({
  create: z.union([z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema).array(), z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => PageViewSourceUpsertWithWhereUniqueWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceUpsertWithWhereUniqueWithoutDailyStatsInputSchema).array()]).optional(),
  createMany: z.lazy(() => PageViewSourceCreateManyDailyStatsInputEnvelopeSchema).optional(),
  set: z.union([z.lazy(() => PageViewSourceWhereUniqueInputSchema), z.lazy(() => PageViewSourceWhereUniqueInputSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => PageViewSourceWhereUniqueInputSchema), z.lazy(() => PageViewSourceWhereUniqueInputSchema).array()]).optional(),
  delete: z.union([z.lazy(() => PageViewSourceWhereUniqueInputSchema), z.lazy(() => PageViewSourceWhereUniqueInputSchema).array()]).optional(),
  connect: z.union([z.lazy(() => PageViewSourceWhereUniqueInputSchema), z.lazy(() => PageViewSourceWhereUniqueInputSchema).array()]).optional(),
  update: z.union([z.lazy(() => PageViewSourceUpdateWithWhereUniqueWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceUpdateWithWhereUniqueWithoutDailyStatsInputSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => PageViewSourceUpdateManyWithWhereWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceUpdateManyWithWhereWithoutDailyStatsInputSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => PageViewSourceScalarWhereInputSchema), z.lazy(() => PageViewSourceScalarWhereInputSchema).array()]).optional()
}).strict();
const DailyStatsCreateNestedOneWithoutSourcesInputSchema = z.object({
  create: z.union([z.lazy(() => DailyStatsCreateWithoutSourcesInputSchema), z.lazy(() => DailyStatsUncheckedCreateWithoutSourcesInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DailyStatsCreateOrConnectWithoutSourcesInputSchema).optional(),
  connect: z.lazy(() => DailyStatsWhereUniqueInputSchema).optional()
}).strict();
const DailyStatsUpdateOneWithoutSourcesNestedInputSchema = z.object({
  create: z.union([z.lazy(() => DailyStatsCreateWithoutSourcesInputSchema), z.lazy(() => DailyStatsUncheckedCreateWithoutSourcesInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => DailyStatsCreateOrConnectWithoutSourcesInputSchema).optional(),
  upsert: z.lazy(() => DailyStatsUpsertWithoutSourcesInputSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => DailyStatsWhereInputSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => DailyStatsWhereInputSchema)]).optional(),
  connect: z.lazy(() => DailyStatsWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => DailyStatsUpdateToOneWithWhereWithoutSourcesInputSchema), z.lazy(() => DailyStatsUpdateWithoutSourcesInputSchema), z.lazy(() => DailyStatsUncheckedUpdateWithoutSourcesInputSchema)]).optional()
}).strict();
const NullableIntFieldUpdateOperationsInputSchema = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();
const UserCreateNestedOneWithoutContactFormMessagesInputSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutContactFormMessagesInputSchema), z.lazy(() => UserUncheckedCreateWithoutContactFormMessagesInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutContactFormMessagesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();
const UserUpdateOneRequiredWithoutContactFormMessagesNestedInputSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutContactFormMessagesInputSchema), z.lazy(() => UserUncheckedCreateWithoutContactFormMessagesInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutContactFormMessagesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutContactFormMessagesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutContactFormMessagesInputSchema), z.lazy(() => UserUpdateWithoutContactFormMessagesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutContactFormMessagesInputSchema)]).optional()
}).strict();
const UserCreateNestedOneWithoutElaboratedRecipesInputSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutElaboratedRecipesInputSchema), z.lazy(() => UserUncheckedCreateWithoutElaboratedRecipesInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutElaboratedRecipesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();
const UserUpdateOneRequiredWithoutElaboratedRecipesNestedInputSchema = z.object({
  create: z.union([z.lazy(() => UserCreateWithoutElaboratedRecipesInputSchema), z.lazy(() => UserUncheckedCreateWithoutElaboratedRecipesInputSchema)]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutElaboratedRecipesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutElaboratedRecipesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([z.lazy(() => UserUpdateToOneWithWhereWithoutElaboratedRecipesInputSchema), z.lazy(() => UserUpdateWithoutElaboratedRecipesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutElaboratedRecipesInputSchema)]).optional()
}).strict();
const NestedStringFilterSchema = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringFilterSchema)]).optional()
}).strict();
const NestedDateTimeFilterSchema = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)]).optional()
}).strict();
const NestedStringNullableFilterSchema = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)]).optional().nullable()
}).strict();
const NestedBoolFilterSchema = z.object({
  equals: z.boolean().optional(),
  not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)]).optional()
}).strict();
const NestedDateTimeNullableFilterSchema = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableFilterSchema)]).optional().nullable()
}).strict();
const NestedIntFilterSchema = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional()
}).strict();
const NestedStringWithAggregatesFilterSchema = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();
const NestedDateTimeWithAggregatesFilterSchema = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();
const NestedStringNullableWithAggregatesFilterSchema = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([z.string(), z.lazy(() => NestedStringNullableWithAggregatesFilterSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();
const NestedIntNullableFilterSchema = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)]).optional().nullable()
}).strict();
const NestedBoolWithAggregatesFilterSchema = z.object({
  equals: z.boolean().optional(),
  not: z.union([z.boolean(), z.lazy(() => NestedBoolWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();
const NestedDateTimeNullableWithAggregatesFilterSchema = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();
const NestedIntWithAggregatesFilterSchema = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();
const NestedFloatFilterSchema = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedFloatFilterSchema)]).optional()
}).strict();
const NestedFloatWithAggregatesFilterSchema = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedFloatWithAggregatesFilterSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();
const NestedIntNullableWithAggregatesFilterSchema = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedIntNullableWithAggregatesFilterSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();
const NestedFloatNullableFilterSchema = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([z.number(), z.lazy(() => NestedFloatNullableFilterSchema)]).optional().nullable()
}).strict();
const NestedJsonFilterSchema = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();
const NestedJsonNullableFilterSchema = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();
const GptResponseCreateWithoutUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  content: z.string()
}).strict();
const GptResponseUncheckedCreateWithoutUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  content: z.string()
}).strict();
const GptResponseCreateOrConnectWithoutUserInputSchema = z.object({
  where: z.lazy(() => GptResponseWhereUniqueInputSchema),
  create: z.union([z.lazy(() => GptResponseCreateWithoutUserInputSchema), z.lazy(() => GptResponseUncheckedCreateWithoutUserInputSchema)])
}).strict();
const GptResponseCreateManyUserInputEnvelopeSchema = z.object({
  data: z.union([z.lazy(() => GptResponseCreateManyUserInputSchema), z.lazy(() => GptResponseCreateManyUserInputSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
const ContactFormMessageCreateWithoutUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  content: z.string(),
  isRead: z.boolean().optional(),
  repliedAt: z.coerce.date().optional().nullable()
}).strict();
const ContactFormMessageUncheckedCreateWithoutUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  content: z.string(),
  isRead: z.boolean().optional(),
  repliedAt: z.coerce.date().optional().nullable()
}).strict();
const ContactFormMessageCreateOrConnectWithoutUserInputSchema = z.object({
  where: z.lazy(() => ContactFormMessageWhereUniqueInputSchema),
  create: z.union([z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema), z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema)])
}).strict();
const ContactFormMessageCreateManyUserInputEnvelopeSchema = z.object({
  data: z.union([z.lazy(() => ContactFormMessageCreateManyUserInputSchema), z.lazy(() => ContactFormMessageCreateManyUserInputSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
const TaskCreateWithoutUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  description: z.string(),
  time: z.string().optional(),
  isDone: z.boolean().optional()
}).strict();
const TaskUncheckedCreateWithoutUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  description: z.string(),
  time: z.string().optional(),
  isDone: z.boolean().optional()
}).strict();
const TaskCreateOrConnectWithoutUserInputSchema = z.object({
  where: z.lazy(() => TaskWhereUniqueInputSchema),
  create: z.union([z.lazy(() => TaskCreateWithoutUserInputSchema), z.lazy(() => TaskUncheckedCreateWithoutUserInputSchema)])
}).strict();
const TaskCreateManyUserInputEnvelopeSchema = z.object({
  data: z.union([z.lazy(() => TaskCreateManyUserInputSchema), z.lazy(() => TaskCreateManyUserInputSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
const FileCreateWithoutUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  key: z.string(),
  uploadUrl: z.string()
}).strict();
const FileUncheckedCreateWithoutUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  key: z.string(),
  uploadUrl: z.string()
}).strict();
const FileCreateOrConnectWithoutUserInputSchema = z.object({
  where: z.lazy(() => FileWhereUniqueInputSchema),
  create: z.union([z.lazy(() => FileCreateWithoutUserInputSchema), z.lazy(() => FileUncheckedCreateWithoutUserInputSchema)])
}).strict();
const FileCreateManyUserInputEnvelopeSchema = z.object({
  data: z.union([z.lazy(() => FileCreateManyUserInputSchema), z.lazy(() => FileCreateManyUserInputSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
const ElaboratedRecipeCreateWithoutUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  title: z.string(),
  ingredients: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
  instructions: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
  isFavorite: z.boolean().optional(),
  dateCreated: z.string(),
  servings: z.number().int().optional().nullable(),
  prepTime: z.number().int().optional().nullable(),
  cookTime: z.number().int().optional().nullable(),
  tags: z.union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema]).optional()
}).strict();
const ElaboratedRecipeUncheckedCreateWithoutUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  title: z.string(),
  ingredients: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
  instructions: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
  isFavorite: z.boolean().optional(),
  dateCreated: z.string(),
  servings: z.number().int().optional().nullable(),
  prepTime: z.number().int().optional().nullable(),
  cookTime: z.number().int().optional().nullable(),
  tags: z.union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema]).optional()
}).strict();
const ElaboratedRecipeCreateOrConnectWithoutUserInputSchema = z.object({
  where: z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),
  create: z.union([z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema)])
}).strict();
const ElaboratedRecipeCreateManyUserInputEnvelopeSchema = z.object({
  data: z.union([z.lazy(() => ElaboratedRecipeCreateManyUserInputSchema), z.lazy(() => ElaboratedRecipeCreateManyUserInputSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
const GptResponseUpsertWithWhereUniqueWithoutUserInputSchema = z.object({
  where: z.lazy(() => GptResponseWhereUniqueInputSchema),
  update: z.union([z.lazy(() => GptResponseUpdateWithoutUserInputSchema), z.lazy(() => GptResponseUncheckedUpdateWithoutUserInputSchema)]),
  create: z.union([z.lazy(() => GptResponseCreateWithoutUserInputSchema), z.lazy(() => GptResponseUncheckedCreateWithoutUserInputSchema)])
}).strict();
const GptResponseUpdateWithWhereUniqueWithoutUserInputSchema = z.object({
  where: z.lazy(() => GptResponseWhereUniqueInputSchema),
  data: z.union([z.lazy(() => GptResponseUpdateWithoutUserInputSchema), z.lazy(() => GptResponseUncheckedUpdateWithoutUserInputSchema)])
}).strict();
const GptResponseUpdateManyWithWhereWithoutUserInputSchema = z.object({
  where: z.lazy(() => GptResponseScalarWhereInputSchema),
  data: z.union([z.lazy(() => GptResponseUpdateManyMutationInputSchema), z.lazy(() => GptResponseUncheckedUpdateManyWithoutUserInputSchema)])
}).strict();
const GptResponseScalarWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => GptResponseScalarWhereInputSchema), z.lazy(() => GptResponseScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => GptResponseScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => GptResponseScalarWhereInputSchema), z.lazy(() => GptResponseScalarWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  content: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional()
}).strict();
const ContactFormMessageUpsertWithWhereUniqueWithoutUserInputSchema = z.object({
  where: z.lazy(() => ContactFormMessageWhereUniqueInputSchema),
  update: z.union([z.lazy(() => ContactFormMessageUpdateWithoutUserInputSchema), z.lazy(() => ContactFormMessageUncheckedUpdateWithoutUserInputSchema)]),
  create: z.union([z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema), z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema)])
}).strict();
const ContactFormMessageUpdateWithWhereUniqueWithoutUserInputSchema = z.object({
  where: z.lazy(() => ContactFormMessageWhereUniqueInputSchema),
  data: z.union([z.lazy(() => ContactFormMessageUpdateWithoutUserInputSchema), z.lazy(() => ContactFormMessageUncheckedUpdateWithoutUserInputSchema)])
}).strict();
const ContactFormMessageUpdateManyWithWhereWithoutUserInputSchema = z.object({
  where: z.lazy(() => ContactFormMessageScalarWhereInputSchema),
  data: z.union([z.lazy(() => ContactFormMessageUpdateManyMutationInputSchema), z.lazy(() => ContactFormMessageUncheckedUpdateManyWithoutUserInputSchema)])
}).strict();
const ContactFormMessageScalarWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => ContactFormMessageScalarWhereInputSchema), z.lazy(() => ContactFormMessageScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => ContactFormMessageScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => ContactFormMessageScalarWhereInputSchema), z.lazy(() => ContactFormMessageScalarWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  content: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  isRead: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  repliedAt: z.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()]).optional().nullable()
}).strict();
const TaskUpsertWithWhereUniqueWithoutUserInputSchema = z.object({
  where: z.lazy(() => TaskWhereUniqueInputSchema),
  update: z.union([z.lazy(() => TaskUpdateWithoutUserInputSchema), z.lazy(() => TaskUncheckedUpdateWithoutUserInputSchema)]),
  create: z.union([z.lazy(() => TaskCreateWithoutUserInputSchema), z.lazy(() => TaskUncheckedCreateWithoutUserInputSchema)])
}).strict();
const TaskUpdateWithWhereUniqueWithoutUserInputSchema = z.object({
  where: z.lazy(() => TaskWhereUniqueInputSchema),
  data: z.union([z.lazy(() => TaskUpdateWithoutUserInputSchema), z.lazy(() => TaskUncheckedUpdateWithoutUserInputSchema)])
}).strict();
const TaskUpdateManyWithWhereWithoutUserInputSchema = z.object({
  where: z.lazy(() => TaskScalarWhereInputSchema),
  data: z.union([z.lazy(() => TaskUpdateManyMutationInputSchema), z.lazy(() => TaskUncheckedUpdateManyWithoutUserInputSchema)])
}).strict();
const TaskScalarWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => TaskScalarWhereInputSchema), z.lazy(() => TaskScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => TaskScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskScalarWhereInputSchema), z.lazy(() => TaskScalarWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  time: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  isDone: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional()
}).strict();
const FileUpsertWithWhereUniqueWithoutUserInputSchema = z.object({
  where: z.lazy(() => FileWhereUniqueInputSchema),
  update: z.union([z.lazy(() => FileUpdateWithoutUserInputSchema), z.lazy(() => FileUncheckedUpdateWithoutUserInputSchema)]),
  create: z.union([z.lazy(() => FileCreateWithoutUserInputSchema), z.lazy(() => FileUncheckedCreateWithoutUserInputSchema)])
}).strict();
const FileUpdateWithWhereUniqueWithoutUserInputSchema = z.object({
  where: z.lazy(() => FileWhereUniqueInputSchema),
  data: z.union([z.lazy(() => FileUpdateWithoutUserInputSchema), z.lazy(() => FileUncheckedUpdateWithoutUserInputSchema)])
}).strict();
const FileUpdateManyWithWhereWithoutUserInputSchema = z.object({
  where: z.lazy(() => FileScalarWhereInputSchema),
  data: z.union([z.lazy(() => FileUpdateManyMutationInputSchema), z.lazy(() => FileUncheckedUpdateManyWithoutUserInputSchema)])
}).strict();
const FileScalarWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => FileScalarWhereInputSchema), z.lazy(() => FileScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => FileScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => FileScalarWhereInputSchema), z.lazy(() => FileScalarWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  key: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  uploadUrl: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional()
}).strict();
const ElaboratedRecipeUpsertWithWhereUniqueWithoutUserInputSchema = z.object({
  where: z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),
  update: z.union([z.lazy(() => ElaboratedRecipeUpdateWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeUncheckedUpdateWithoutUserInputSchema)]),
  create: z.union([z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema)])
}).strict();
const ElaboratedRecipeUpdateWithWhereUniqueWithoutUserInputSchema = z.object({
  where: z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),
  data: z.union([z.lazy(() => ElaboratedRecipeUpdateWithoutUserInputSchema), z.lazy(() => ElaboratedRecipeUncheckedUpdateWithoutUserInputSchema)])
}).strict();
const ElaboratedRecipeUpdateManyWithWhereWithoutUserInputSchema = z.object({
  where: z.lazy(() => ElaboratedRecipeScalarWhereInputSchema),
  data: z.union([z.lazy(() => ElaboratedRecipeUpdateManyMutationInputSchema), z.lazy(() => ElaboratedRecipeUncheckedUpdateManyWithoutUserInputSchema)])
}).strict();
const ElaboratedRecipeScalarWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => ElaboratedRecipeScalarWhereInputSchema), z.lazy(() => ElaboratedRecipeScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => ElaboratedRecipeScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => ElaboratedRecipeScalarWhereInputSchema), z.lazy(() => ElaboratedRecipeScalarWhereInputSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  title: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  ingredients: z.lazy(() => JsonFilterSchema).optional(),
  instructions: z.lazy(() => JsonFilterSchema).optional(),
  isFavorite: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
  dateCreated: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  servings: z.union([z.lazy(() => IntNullableFilterSchema), z.number()]).optional().nullable(),
  prepTime: z.union([z.lazy(() => IntNullableFilterSchema), z.number()]).optional().nullable(),
  cookTime: z.union([z.lazy(() => IntNullableFilterSchema), z.number()]).optional().nullable(),
  tags: z.lazy(() => JsonNullableFilterSchema).optional()
}).strict();
const UserCreateWithoutGptResponsesInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  isAdmin: z.boolean().optional(),
  paymentProcessorUserId: z.string().optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.string().optional().nullable(),
  subscriptionStatus: z.string().optional().nullable(),
  subscriptionPlan: z.string().optional().nullable(),
  datePaid: z.coerce.date().optional().nullable(),
  credits: z.number().int().optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageCreateNestedManyWithoutUserInputSchema).optional(),
  tasks: z.lazy(() => TaskCreateNestedManyWithoutUserInputSchema).optional(),
  files: z.lazy(() => FileCreateNestedManyWithoutUserInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeCreateNestedManyWithoutUserInputSchema).optional()
}).strict();
const UserUncheckedCreateWithoutGptResponsesInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  isAdmin: z.boolean().optional(),
  paymentProcessorUserId: z.string().optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.string().optional().nullable(),
  subscriptionStatus: z.string().optional().nullable(),
  subscriptionPlan: z.string().optional().nullable(),
  datePaid: z.coerce.date().optional().nullable(),
  credits: z.number().int().optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  files: z.lazy(() => FileUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();
const UserCreateOrConnectWithoutGptResponsesInputSchema = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([z.lazy(() => UserCreateWithoutGptResponsesInputSchema), z.lazy(() => UserUncheckedCreateWithoutGptResponsesInputSchema)])
}).strict();
const UserUpsertWithoutGptResponsesInputSchema = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutGptResponsesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutGptResponsesInputSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutGptResponsesInputSchema), z.lazy(() => UserUncheckedCreateWithoutGptResponsesInputSchema)]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();
const UserUpdateToOneWithWhereWithoutGptResponsesInputSchema = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutGptResponsesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutGptResponsesInputSchema)])
}).strict();
const UserUpdateWithoutGptResponsesInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  username: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  isAdmin: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  paymentProcessorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionPlan: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  datePaid: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUpdateManyWithoutUserNestedInputSchema).optional(),
  tasks: z.lazy(() => TaskUpdateManyWithoutUserNestedInputSchema).optional(),
  files: z.lazy(() => FileUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();
const UserUncheckedUpdateWithoutGptResponsesInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  username: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  isAdmin: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  paymentProcessorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionPlan: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  datePaid: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tasks: z.lazy(() => TaskUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  files: z.lazy(() => FileUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();
const UserCreateWithoutTasksInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  isAdmin: z.boolean().optional(),
  paymentProcessorUserId: z.string().optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.string().optional().nullable(),
  subscriptionStatus: z.string().optional().nullable(),
  subscriptionPlan: z.string().optional().nullable(),
  datePaid: z.coerce.date().optional().nullable(),
  credits: z.number().int().optional(),
  gptResponses: z.lazy(() => GptResponseCreateNestedManyWithoutUserInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageCreateNestedManyWithoutUserInputSchema).optional(),
  files: z.lazy(() => FileCreateNestedManyWithoutUserInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeCreateNestedManyWithoutUserInputSchema).optional()
}).strict();
const UserUncheckedCreateWithoutTasksInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  isAdmin: z.boolean().optional(),
  paymentProcessorUserId: z.string().optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.string().optional().nullable(),
  subscriptionStatus: z.string().optional().nullable(),
  subscriptionPlan: z.string().optional().nullable(),
  datePaid: z.coerce.date().optional().nullable(),
  credits: z.number().int().optional(),
  gptResponses: z.lazy(() => GptResponseUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  files: z.lazy(() => FileUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();
const UserCreateOrConnectWithoutTasksInputSchema = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([z.lazy(() => UserCreateWithoutTasksInputSchema), z.lazy(() => UserUncheckedCreateWithoutTasksInputSchema)])
}).strict();
const UserUpsertWithoutTasksInputSchema = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutTasksInputSchema), z.lazy(() => UserUncheckedUpdateWithoutTasksInputSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutTasksInputSchema), z.lazy(() => UserUncheckedCreateWithoutTasksInputSchema)]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();
const UserUpdateToOneWithWhereWithoutTasksInputSchema = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutTasksInputSchema), z.lazy(() => UserUncheckedUpdateWithoutTasksInputSchema)])
}).strict();
const UserUpdateWithoutTasksInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  username: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  isAdmin: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  paymentProcessorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionPlan: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  datePaid: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  gptResponses: z.lazy(() => GptResponseUpdateManyWithoutUserNestedInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUpdateManyWithoutUserNestedInputSchema).optional(),
  files: z.lazy(() => FileUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();
const UserUncheckedUpdateWithoutTasksInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  username: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  isAdmin: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  paymentProcessorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionPlan: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  datePaid: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  gptResponses: z.lazy(() => GptResponseUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  files: z.lazy(() => FileUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();
const UserCreateWithoutFilesInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  isAdmin: z.boolean().optional(),
  paymentProcessorUserId: z.string().optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.string().optional().nullable(),
  subscriptionStatus: z.string().optional().nullable(),
  subscriptionPlan: z.string().optional().nullable(),
  datePaid: z.coerce.date().optional().nullable(),
  credits: z.number().int().optional(),
  gptResponses: z.lazy(() => GptResponseCreateNestedManyWithoutUserInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageCreateNestedManyWithoutUserInputSchema).optional(),
  tasks: z.lazy(() => TaskCreateNestedManyWithoutUserInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeCreateNestedManyWithoutUserInputSchema).optional()
}).strict();
const UserUncheckedCreateWithoutFilesInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  isAdmin: z.boolean().optional(),
  paymentProcessorUserId: z.string().optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.string().optional().nullable(),
  subscriptionStatus: z.string().optional().nullable(),
  subscriptionPlan: z.string().optional().nullable(),
  datePaid: z.coerce.date().optional().nullable(),
  credits: z.number().int().optional(),
  gptResponses: z.lazy(() => GptResponseUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();
const UserCreateOrConnectWithoutFilesInputSchema = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([z.lazy(() => UserCreateWithoutFilesInputSchema), z.lazy(() => UserUncheckedCreateWithoutFilesInputSchema)])
}).strict();
const UserUpsertWithoutFilesInputSchema = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutFilesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutFilesInputSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutFilesInputSchema), z.lazy(() => UserUncheckedCreateWithoutFilesInputSchema)]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();
const UserUpdateToOneWithWhereWithoutFilesInputSchema = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutFilesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutFilesInputSchema)])
}).strict();
const UserUpdateWithoutFilesInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  username: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  isAdmin: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  paymentProcessorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionPlan: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  datePaid: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  gptResponses: z.lazy(() => GptResponseUpdateManyWithoutUserNestedInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUpdateManyWithoutUserNestedInputSchema).optional(),
  tasks: z.lazy(() => TaskUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();
const UserUncheckedUpdateWithoutFilesInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  username: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  isAdmin: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  paymentProcessorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionPlan: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  datePaid: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  gptResponses: z.lazy(() => GptResponseUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tasks: z.lazy(() => TaskUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();
const PageViewSourceCreateWithoutDailyStatsInputSchema = z.object({
  name: z.string(),
  date: z.coerce.date().optional(),
  visitors: z.number().int()
}).strict();
const PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema = z.object({
  name: z.string(),
  date: z.coerce.date().optional(),
  visitors: z.number().int()
}).strict();
const PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema = z.object({
  where: z.lazy(() => PageViewSourceWhereUniqueInputSchema),
  create: z.union([z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema)])
}).strict();
const PageViewSourceCreateManyDailyStatsInputEnvelopeSchema = z.object({
  data: z.union([z.lazy(() => PageViewSourceCreateManyDailyStatsInputSchema), z.lazy(() => PageViewSourceCreateManyDailyStatsInputSchema).array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
const PageViewSourceUpsertWithWhereUniqueWithoutDailyStatsInputSchema = z.object({
  where: z.lazy(() => PageViewSourceWhereUniqueInputSchema),
  update: z.union([z.lazy(() => PageViewSourceUpdateWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceUncheckedUpdateWithoutDailyStatsInputSchema)]),
  create: z.union([z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema)])
}).strict();
const PageViewSourceUpdateWithWhereUniqueWithoutDailyStatsInputSchema = z.object({
  where: z.lazy(() => PageViewSourceWhereUniqueInputSchema),
  data: z.union([z.lazy(() => PageViewSourceUpdateWithoutDailyStatsInputSchema), z.lazy(() => PageViewSourceUncheckedUpdateWithoutDailyStatsInputSchema)])
}).strict();
const PageViewSourceUpdateManyWithWhereWithoutDailyStatsInputSchema = z.object({
  where: z.lazy(() => PageViewSourceScalarWhereInputSchema),
  data: z.union([z.lazy(() => PageViewSourceUpdateManyMutationInputSchema), z.lazy(() => PageViewSourceUncheckedUpdateManyWithoutDailyStatsInputSchema)])
}).strict();
const PageViewSourceScalarWhereInputSchema = z.object({
  AND: z.union([z.lazy(() => PageViewSourceScalarWhereInputSchema), z.lazy(() => PageViewSourceScalarWhereInputSchema).array()]).optional(),
  OR: z.lazy(() => PageViewSourceScalarWhereInputSchema).array().optional(),
  NOT: z.union([z.lazy(() => PageViewSourceScalarWhereInputSchema), z.lazy(() => PageViewSourceScalarWhereInputSchema).array()]).optional(),
  name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  date: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
  dailyStatsId: z.union([z.lazy(() => IntNullableFilterSchema), z.number()]).optional().nullable(),
  visitors: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional()
}).strict();
const DailyStatsCreateWithoutSourcesInputSchema = z.object({
  date: z.coerce.date().optional(),
  totalViews: z.number().int().optional(),
  prevDayViewsChangePercent: z.string().optional(),
  userCount: z.number().int().optional(),
  paidUserCount: z.number().int().optional(),
  userDelta: z.number().int().optional(),
  paidUserDelta: z.number().int().optional(),
  totalRevenue: z.number().optional(),
  totalProfit: z.number().optional()
}).strict();
const DailyStatsUncheckedCreateWithoutSourcesInputSchema = z.object({
  id: z.number().int().optional(),
  date: z.coerce.date().optional(),
  totalViews: z.number().int().optional(),
  prevDayViewsChangePercent: z.string().optional(),
  userCount: z.number().int().optional(),
  paidUserCount: z.number().int().optional(),
  userDelta: z.number().int().optional(),
  paidUserDelta: z.number().int().optional(),
  totalRevenue: z.number().optional(),
  totalProfit: z.number().optional()
}).strict();
const DailyStatsCreateOrConnectWithoutSourcesInputSchema = z.object({
  where: z.lazy(() => DailyStatsWhereUniqueInputSchema),
  create: z.union([z.lazy(() => DailyStatsCreateWithoutSourcesInputSchema), z.lazy(() => DailyStatsUncheckedCreateWithoutSourcesInputSchema)])
}).strict();
const DailyStatsUpsertWithoutSourcesInputSchema = z.object({
  update: z.union([z.lazy(() => DailyStatsUpdateWithoutSourcesInputSchema), z.lazy(() => DailyStatsUncheckedUpdateWithoutSourcesInputSchema)]),
  create: z.union([z.lazy(() => DailyStatsCreateWithoutSourcesInputSchema), z.lazy(() => DailyStatsUncheckedCreateWithoutSourcesInputSchema)]),
  where: z.lazy(() => DailyStatsWhereInputSchema).optional()
}).strict();
const DailyStatsUpdateToOneWithWhereWithoutSourcesInputSchema = z.object({
  where: z.lazy(() => DailyStatsWhereInputSchema).optional(),
  data: z.union([z.lazy(() => DailyStatsUpdateWithoutSourcesInputSchema), z.lazy(() => DailyStatsUncheckedUpdateWithoutSourcesInputSchema)])
}).strict();
const DailyStatsUpdateWithoutSourcesInputSchema = z.object({
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  totalViews: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  prevDayViewsChangePercent: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  paidUserCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  userDelta: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  paidUserDelta: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  totalRevenue: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputSchema)]).optional(),
  totalProfit: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const DailyStatsUncheckedUpdateWithoutSourcesInputSchema = z.object({
  id: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  totalViews: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  prevDayViewsChangePercent: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  userCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  paidUserCount: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  userDelta: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  paidUserDelta: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  totalRevenue: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputSchema)]).optional(),
  totalProfit: z.union([z.number(), z.lazy(() => FloatFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const UserCreateWithoutContactFormMessagesInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  isAdmin: z.boolean().optional(),
  paymentProcessorUserId: z.string().optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.string().optional().nullable(),
  subscriptionStatus: z.string().optional().nullable(),
  subscriptionPlan: z.string().optional().nullable(),
  datePaid: z.coerce.date().optional().nullable(),
  credits: z.number().int().optional(),
  gptResponses: z.lazy(() => GptResponseCreateNestedManyWithoutUserInputSchema).optional(),
  tasks: z.lazy(() => TaskCreateNestedManyWithoutUserInputSchema).optional(),
  files: z.lazy(() => FileCreateNestedManyWithoutUserInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeCreateNestedManyWithoutUserInputSchema).optional()
}).strict();
const UserUncheckedCreateWithoutContactFormMessagesInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  isAdmin: z.boolean().optional(),
  paymentProcessorUserId: z.string().optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.string().optional().nullable(),
  subscriptionStatus: z.string().optional().nullable(),
  subscriptionPlan: z.string().optional().nullable(),
  datePaid: z.coerce.date().optional().nullable(),
  credits: z.number().int().optional(),
  gptResponses: z.lazy(() => GptResponseUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  files: z.lazy(() => FileUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();
const UserCreateOrConnectWithoutContactFormMessagesInputSchema = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([z.lazy(() => UserCreateWithoutContactFormMessagesInputSchema), z.lazy(() => UserUncheckedCreateWithoutContactFormMessagesInputSchema)])
}).strict();
const UserUpsertWithoutContactFormMessagesInputSchema = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutContactFormMessagesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutContactFormMessagesInputSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutContactFormMessagesInputSchema), z.lazy(() => UserUncheckedCreateWithoutContactFormMessagesInputSchema)]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();
const UserUpdateToOneWithWhereWithoutContactFormMessagesInputSchema = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutContactFormMessagesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutContactFormMessagesInputSchema)])
}).strict();
const UserUpdateWithoutContactFormMessagesInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  username: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  isAdmin: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  paymentProcessorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionPlan: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  datePaid: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  gptResponses: z.lazy(() => GptResponseUpdateManyWithoutUserNestedInputSchema).optional(),
  tasks: z.lazy(() => TaskUpdateManyWithoutUserNestedInputSchema).optional(),
  files: z.lazy(() => FileUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();
const UserUncheckedUpdateWithoutContactFormMessagesInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  username: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  isAdmin: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  paymentProcessorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionPlan: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  datePaid: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  gptResponses: z.lazy(() => GptResponseUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tasks: z.lazy(() => TaskUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  files: z.lazy(() => FileUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();
const UserCreateWithoutElaboratedRecipesInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  isAdmin: z.boolean().optional(),
  paymentProcessorUserId: z.string().optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.string().optional().nullable(),
  subscriptionStatus: z.string().optional().nullable(),
  subscriptionPlan: z.string().optional().nullable(),
  datePaid: z.coerce.date().optional().nullable(),
  credits: z.number().int().optional(),
  gptResponses: z.lazy(() => GptResponseCreateNestedManyWithoutUserInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageCreateNestedManyWithoutUserInputSchema).optional(),
  tasks: z.lazy(() => TaskCreateNestedManyWithoutUserInputSchema).optional(),
  files: z.lazy(() => FileCreateNestedManyWithoutUserInputSchema).optional()
}).strict();
const UserUncheckedCreateWithoutElaboratedRecipesInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  email: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  isAdmin: z.boolean().optional(),
  paymentProcessorUserId: z.string().optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.string().optional().nullable(),
  subscriptionStatus: z.string().optional().nullable(),
  subscriptionPlan: z.string().optional().nullable(),
  datePaid: z.coerce.date().optional().nullable(),
  credits: z.number().int().optional(),
  gptResponses: z.lazy(() => GptResponseUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  tasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  files: z.lazy(() => FileUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();
const UserCreateOrConnectWithoutElaboratedRecipesInputSchema = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([z.lazy(() => UserCreateWithoutElaboratedRecipesInputSchema), z.lazy(() => UserUncheckedCreateWithoutElaboratedRecipesInputSchema)])
}).strict();
const UserUpsertWithoutElaboratedRecipesInputSchema = z.object({
  update: z.union([z.lazy(() => UserUpdateWithoutElaboratedRecipesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutElaboratedRecipesInputSchema)]),
  create: z.union([z.lazy(() => UserCreateWithoutElaboratedRecipesInputSchema), z.lazy(() => UserUncheckedCreateWithoutElaboratedRecipesInputSchema)]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();
const UserUpdateToOneWithWhereWithoutElaboratedRecipesInputSchema = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([z.lazy(() => UserUpdateWithoutElaboratedRecipesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutElaboratedRecipesInputSchema)])
}).strict();
const UserUpdateWithoutElaboratedRecipesInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  username: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  isAdmin: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  paymentProcessorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionPlan: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  datePaid: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  gptResponses: z.lazy(() => GptResponseUpdateManyWithoutUserNestedInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUpdateManyWithoutUserNestedInputSchema).optional(),
  tasks: z.lazy(() => TaskUpdateManyWithoutUserNestedInputSchema).optional(),
  files: z.lazy(() => FileUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();
const UserUncheckedUpdateWithoutElaboratedRecipesInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  email: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  username: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  isAdmin: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  paymentProcessorUserId: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionStatus: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  subscriptionPlan: z.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)]).optional().nullable(),
  datePaid: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable(),
  credits: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional(),
  gptResponses: z.lazy(() => GptResponseUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  tasks: z.lazy(() => TaskUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  files: z.lazy(() => FileUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();
const GptResponseCreateManyUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  content: z.string()
}).strict();
const ContactFormMessageCreateManyUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  content: z.string(),
  isRead: z.boolean().optional(),
  repliedAt: z.coerce.date().optional().nullable()
}).strict();
const TaskCreateManyUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  description: z.string(),
  time: z.string().optional(),
  isDone: z.boolean().optional()
}).strict();
const FileCreateManyUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  key: z.string(),
  uploadUrl: z.string()
}).strict();
const ElaboratedRecipeCreateManyUserInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  title: z.string(),
  ingredients: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
  instructions: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
  isFavorite: z.boolean().optional(),
  dateCreated: z.string(),
  servings: z.number().int().optional().nullable(),
  prepTime: z.number().int().optional().nullable(),
  cookTime: z.number().int().optional().nullable(),
  tags: z.union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema]).optional()
}).strict();
const GptResponseUpdateWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const GptResponseUncheckedUpdateWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const GptResponseUncheckedUpdateManyWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const ContactFormMessageUpdateWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isRead: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  repliedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable()
}).strict();
const ContactFormMessageUncheckedUpdateWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isRead: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  repliedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable()
}).strict();
const ContactFormMessageUncheckedUpdateManyWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  content: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isRead: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  repliedAt: z.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)]).optional().nullable()
}).strict();
const TaskUpdateWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  time: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isDone: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const TaskUncheckedUpdateWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  time: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isDone: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const TaskUncheckedUpdateManyWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  description: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  time: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  isDone: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const FileUpdateWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  key: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  uploadUrl: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const FileUncheckedUpdateWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  key: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  uploadUrl: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const FileUncheckedUpdateManyWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  type: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  key: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  uploadUrl: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const ElaboratedRecipeUpdateWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  ingredients: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  instructions: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  isFavorite: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  dateCreated: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  servings: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  prepTime: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  cookTime: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  tags: z.union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema]).optional()
}).strict();
const ElaboratedRecipeUncheckedUpdateWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  ingredients: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  instructions: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  isFavorite: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  dateCreated: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  servings: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  prepTime: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  cookTime: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  tags: z.union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema]).optional()
}).strict();
const ElaboratedRecipeUncheckedUpdateManyWithoutUserInputSchema = z.object({
  id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  createdAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  updatedAt: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  title: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  ingredients: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  instructions: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
  isFavorite: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
  dateCreated: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  servings: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  prepTime: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  cookTime: z.union([z.number().int(), z.lazy(() => NullableIntFieldUpdateOperationsInputSchema)]).optional().nullable(),
  tags: z.union([z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema]).optional()
}).strict();
const PageViewSourceCreateManyDailyStatsInputSchema = z.object({
  name: z.string(),
  date: z.coerce.date().optional(),
  visitors: z.number().int()
}).strict();
const PageViewSourceUpdateWithoutDailyStatsInputSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  visitors: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const PageViewSourceUncheckedUpdateWithoutDailyStatsInputSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  visitors: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional()
}).strict();
const PageViewSourceUncheckedUpdateManyWithoutDailyStatsInputSchema = z.object({
  name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
  date: z.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)]).optional(),
  visitors: z.union([z.number().int(), z.lazy(() => IntFieldUpdateOperationsInputSchema)]).optional()
}).strict();
z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema
}).strict();
z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema
}).strict();
z.object({
  select: GptResponseSelectSchema.optional(),
  include: GptResponseIncludeSchema.optional(),
  where: GptResponseWhereInputSchema.optional(),
  orderBy: z.union([GptResponseOrderByWithRelationInputSchema.array(), GptResponseOrderByWithRelationInputSchema]).optional(),
  cursor: GptResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([GptResponseScalarFieldEnumSchema, GptResponseScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  select: GptResponseSelectSchema.optional(),
  include: GptResponseIncludeSchema.optional(),
  where: GptResponseWhereInputSchema.optional(),
  orderBy: z.union([GptResponseOrderByWithRelationInputSchema.array(), GptResponseOrderByWithRelationInputSchema]).optional(),
  cursor: GptResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([GptResponseScalarFieldEnumSchema, GptResponseScalarFieldEnumSchema.array()]).optional()
}).strict();
const GptResponseFindManyArgsSchema = z.object({
  select: GptResponseSelectSchema.optional(),
  include: GptResponseIncludeSchema.optional(),
  where: GptResponseWhereInputSchema.optional(),
  orderBy: z.union([GptResponseOrderByWithRelationInputSchema.array(), GptResponseOrderByWithRelationInputSchema]).optional(),
  cursor: GptResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([GptResponseScalarFieldEnumSchema, GptResponseScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  where: GptResponseWhereInputSchema.optional(),
  orderBy: z.union([GptResponseOrderByWithRelationInputSchema.array(), GptResponseOrderByWithRelationInputSchema]).optional(),
  cursor: GptResponseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  where: GptResponseWhereInputSchema.optional(),
  orderBy: z.union([GptResponseOrderByWithAggregationInputSchema.array(), GptResponseOrderByWithAggregationInputSchema]).optional(),
  by: GptResponseScalarFieldEnumSchema.array(),
  having: GptResponseScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  select: GptResponseSelectSchema.optional(),
  include: GptResponseIncludeSchema.optional(),
  where: GptResponseWhereUniqueInputSchema
}).strict();
z.object({
  select: GptResponseSelectSchema.optional(),
  include: GptResponseIncludeSchema.optional(),
  where: GptResponseWhereUniqueInputSchema
}).strict();
z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  where: TaskWhereInputSchema.optional(),
  orderBy: z.union([TaskOrderByWithRelationInputSchema.array(), TaskOrderByWithRelationInputSchema]).optional(),
  cursor: TaskWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([TaskScalarFieldEnumSchema, TaskScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  where: TaskWhereInputSchema.optional(),
  orderBy: z.union([TaskOrderByWithRelationInputSchema.array(), TaskOrderByWithRelationInputSchema]).optional(),
  cursor: TaskWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([TaskScalarFieldEnumSchema, TaskScalarFieldEnumSchema.array()]).optional()
}).strict();
const TaskFindManyArgsSchema = z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  where: TaskWhereInputSchema.optional(),
  orderBy: z.union([TaskOrderByWithRelationInputSchema.array(), TaskOrderByWithRelationInputSchema]).optional(),
  cursor: TaskWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([TaskScalarFieldEnumSchema, TaskScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  where: TaskWhereInputSchema.optional(),
  orderBy: z.union([TaskOrderByWithRelationInputSchema.array(), TaskOrderByWithRelationInputSchema]).optional(),
  cursor: TaskWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  where: TaskWhereInputSchema.optional(),
  orderBy: z.union([TaskOrderByWithAggregationInputSchema.array(), TaskOrderByWithAggregationInputSchema]).optional(),
  by: TaskScalarFieldEnumSchema.array(),
  having: TaskScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  where: TaskWhereUniqueInputSchema
}).strict();
z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  where: TaskWhereUniqueInputSchema
}).strict();
z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  where: FileWhereInputSchema.optional(),
  orderBy: z.union([FileOrderByWithRelationInputSchema.array(), FileOrderByWithRelationInputSchema]).optional(),
  cursor: FileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([FileScalarFieldEnumSchema, FileScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  where: FileWhereInputSchema.optional(),
  orderBy: z.union([FileOrderByWithRelationInputSchema.array(), FileOrderByWithRelationInputSchema]).optional(),
  cursor: FileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([FileScalarFieldEnumSchema, FileScalarFieldEnumSchema.array()]).optional()
}).strict();
const FileFindManyArgsSchema = z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  where: FileWhereInputSchema.optional(),
  orderBy: z.union([FileOrderByWithRelationInputSchema.array(), FileOrderByWithRelationInputSchema]).optional(),
  cursor: FileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([FileScalarFieldEnumSchema, FileScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  where: FileWhereInputSchema.optional(),
  orderBy: z.union([FileOrderByWithRelationInputSchema.array(), FileOrderByWithRelationInputSchema]).optional(),
  cursor: FileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  where: FileWhereInputSchema.optional(),
  orderBy: z.union([FileOrderByWithAggregationInputSchema.array(), FileOrderByWithAggregationInputSchema]).optional(),
  by: FileScalarFieldEnumSchema.array(),
  having: FileScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  where: FileWhereUniqueInputSchema
}).strict();
z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  where: FileWhereUniqueInputSchema
}).strict();
z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  where: DailyStatsWhereInputSchema.optional(),
  orderBy: z.union([DailyStatsOrderByWithRelationInputSchema.array(), DailyStatsOrderByWithRelationInputSchema]).optional(),
  cursor: DailyStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([DailyStatsScalarFieldEnumSchema, DailyStatsScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  where: DailyStatsWhereInputSchema.optional(),
  orderBy: z.union([DailyStatsOrderByWithRelationInputSchema.array(), DailyStatsOrderByWithRelationInputSchema]).optional(),
  cursor: DailyStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([DailyStatsScalarFieldEnumSchema, DailyStatsScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  where: DailyStatsWhereInputSchema.optional(),
  orderBy: z.union([DailyStatsOrderByWithRelationInputSchema.array(), DailyStatsOrderByWithRelationInputSchema]).optional(),
  cursor: DailyStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([DailyStatsScalarFieldEnumSchema, DailyStatsScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  where: DailyStatsWhereInputSchema.optional(),
  orderBy: z.union([DailyStatsOrderByWithRelationInputSchema.array(), DailyStatsOrderByWithRelationInputSchema]).optional(),
  cursor: DailyStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  where: DailyStatsWhereInputSchema.optional(),
  orderBy: z.union([DailyStatsOrderByWithAggregationInputSchema.array(), DailyStatsOrderByWithAggregationInputSchema]).optional(),
  by: DailyStatsScalarFieldEnumSchema.array(),
  having: DailyStatsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  where: DailyStatsWhereUniqueInputSchema
}).strict();
z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  where: DailyStatsWhereUniqueInputSchema
}).strict();
z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  where: PageViewSourceWhereInputSchema.optional(),
  orderBy: z.union([PageViewSourceOrderByWithRelationInputSchema.array(), PageViewSourceOrderByWithRelationInputSchema]).optional(),
  cursor: PageViewSourceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([PageViewSourceScalarFieldEnumSchema, PageViewSourceScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  where: PageViewSourceWhereInputSchema.optional(),
  orderBy: z.union([PageViewSourceOrderByWithRelationInputSchema.array(), PageViewSourceOrderByWithRelationInputSchema]).optional(),
  cursor: PageViewSourceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([PageViewSourceScalarFieldEnumSchema, PageViewSourceScalarFieldEnumSchema.array()]).optional()
}).strict();
const PageViewSourceFindManyArgsSchema = z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  where: PageViewSourceWhereInputSchema.optional(),
  orderBy: z.union([PageViewSourceOrderByWithRelationInputSchema.array(), PageViewSourceOrderByWithRelationInputSchema]).optional(),
  cursor: PageViewSourceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([PageViewSourceScalarFieldEnumSchema, PageViewSourceScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  where: PageViewSourceWhereInputSchema.optional(),
  orderBy: z.union([PageViewSourceOrderByWithRelationInputSchema.array(), PageViewSourceOrderByWithRelationInputSchema]).optional(),
  cursor: PageViewSourceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  where: PageViewSourceWhereInputSchema.optional(),
  orderBy: z.union([PageViewSourceOrderByWithAggregationInputSchema.array(), PageViewSourceOrderByWithAggregationInputSchema]).optional(),
  by: PageViewSourceScalarFieldEnumSchema.array(),
  having: PageViewSourceScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  where: PageViewSourceWhereUniqueInputSchema
}).strict();
z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  where: PageViewSourceWhereUniqueInputSchema
}).strict();
z.object({
  select: LogsSelectSchema.optional(),
  where: LogsWhereInputSchema.optional(),
  orderBy: z.union([LogsOrderByWithRelationInputSchema.array(), LogsOrderByWithRelationInputSchema]).optional(),
  cursor: LogsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([LogsScalarFieldEnumSchema, LogsScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  select: LogsSelectSchema.optional(),
  where: LogsWhereInputSchema.optional(),
  orderBy: z.union([LogsOrderByWithRelationInputSchema.array(), LogsOrderByWithRelationInputSchema]).optional(),
  cursor: LogsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([LogsScalarFieldEnumSchema, LogsScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  select: LogsSelectSchema.optional(),
  where: LogsWhereInputSchema.optional(),
  orderBy: z.union([LogsOrderByWithRelationInputSchema.array(), LogsOrderByWithRelationInputSchema]).optional(),
  cursor: LogsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([LogsScalarFieldEnumSchema, LogsScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  where: LogsWhereInputSchema.optional(),
  orderBy: z.union([LogsOrderByWithRelationInputSchema.array(), LogsOrderByWithRelationInputSchema]).optional(),
  cursor: LogsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  where: LogsWhereInputSchema.optional(),
  orderBy: z.union([LogsOrderByWithAggregationInputSchema.array(), LogsOrderByWithAggregationInputSchema]).optional(),
  by: LogsScalarFieldEnumSchema.array(),
  having: LogsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  select: LogsSelectSchema.optional(),
  where: LogsWhereUniqueInputSchema
}).strict();
z.object({
  select: LogsSelectSchema.optional(),
  where: LogsWhereUniqueInputSchema
}).strict();
z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  where: ContactFormMessageWhereInputSchema.optional(),
  orderBy: z.union([ContactFormMessageOrderByWithRelationInputSchema.array(), ContactFormMessageOrderByWithRelationInputSchema]).optional(),
  cursor: ContactFormMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ContactFormMessageScalarFieldEnumSchema, ContactFormMessageScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  where: ContactFormMessageWhereInputSchema.optional(),
  orderBy: z.union([ContactFormMessageOrderByWithRelationInputSchema.array(), ContactFormMessageOrderByWithRelationInputSchema]).optional(),
  cursor: ContactFormMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ContactFormMessageScalarFieldEnumSchema, ContactFormMessageScalarFieldEnumSchema.array()]).optional()
}).strict();
const ContactFormMessageFindManyArgsSchema = z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  where: ContactFormMessageWhereInputSchema.optional(),
  orderBy: z.union([ContactFormMessageOrderByWithRelationInputSchema.array(), ContactFormMessageOrderByWithRelationInputSchema]).optional(),
  cursor: ContactFormMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ContactFormMessageScalarFieldEnumSchema, ContactFormMessageScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  where: ContactFormMessageWhereInputSchema.optional(),
  orderBy: z.union([ContactFormMessageOrderByWithRelationInputSchema.array(), ContactFormMessageOrderByWithRelationInputSchema]).optional(),
  cursor: ContactFormMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  where: ContactFormMessageWhereInputSchema.optional(),
  orderBy: z.union([ContactFormMessageOrderByWithAggregationInputSchema.array(), ContactFormMessageOrderByWithAggregationInputSchema]).optional(),
  by: ContactFormMessageScalarFieldEnumSchema.array(),
  having: ContactFormMessageScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  where: ContactFormMessageWhereUniqueInputSchema
}).strict();
z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  where: ContactFormMessageWhereUniqueInputSchema
}).strict();
z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  where: ElaboratedRecipeWhereInputSchema.optional(),
  orderBy: z.union([ElaboratedRecipeOrderByWithRelationInputSchema.array(), ElaboratedRecipeOrderByWithRelationInputSchema]).optional(),
  cursor: ElaboratedRecipeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ElaboratedRecipeScalarFieldEnumSchema, ElaboratedRecipeScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  where: ElaboratedRecipeWhereInputSchema.optional(),
  orderBy: z.union([ElaboratedRecipeOrderByWithRelationInputSchema.array(), ElaboratedRecipeOrderByWithRelationInputSchema]).optional(),
  cursor: ElaboratedRecipeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ElaboratedRecipeScalarFieldEnumSchema, ElaboratedRecipeScalarFieldEnumSchema.array()]).optional()
}).strict();
const ElaboratedRecipeFindManyArgsSchema = z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  where: ElaboratedRecipeWhereInputSchema.optional(),
  orderBy: z.union([ElaboratedRecipeOrderByWithRelationInputSchema.array(), ElaboratedRecipeOrderByWithRelationInputSchema]).optional(),
  cursor: ElaboratedRecipeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ElaboratedRecipeScalarFieldEnumSchema, ElaboratedRecipeScalarFieldEnumSchema.array()]).optional()
}).strict();
z.object({
  where: ElaboratedRecipeWhereInputSchema.optional(),
  orderBy: z.union([ElaboratedRecipeOrderByWithRelationInputSchema.array(), ElaboratedRecipeOrderByWithRelationInputSchema]).optional(),
  cursor: ElaboratedRecipeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  where: ElaboratedRecipeWhereInputSchema.optional(),
  orderBy: z.union([ElaboratedRecipeOrderByWithAggregationInputSchema.array(), ElaboratedRecipeOrderByWithAggregationInputSchema]).optional(),
  by: ElaboratedRecipeScalarFieldEnumSchema.array(),
  having: ElaboratedRecipeScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional()
}).strict();
z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  where: ElaboratedRecipeWhereUniqueInputSchema
}).strict();
z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  where: ElaboratedRecipeWhereUniqueInputSchema
}).strict();
z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]).optional()
}).strict();
z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]),
  update: z.union([UserUpdateInputSchema, UserUncheckedUpdateInputSchema])
}).strict();
z.object({
  data: z.union([UserCreateManyInputSchema, UserCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  data: z.union([UserCreateManyInputSchema, UserCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema
}).strict();
z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([UserUpdateInputSchema, UserUncheckedUpdateInputSchema]),
  where: UserWhereUniqueInputSchema
}).strict();
z.object({
  data: z.union([UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema]),
  where: UserWhereInputSchema.optional()
}).strict();
z.object({
  where: UserWhereInputSchema.optional()
}).strict();
z.object({
  select: GptResponseSelectSchema.optional(),
  include: GptResponseIncludeSchema.optional(),
  data: z.union([GptResponseCreateInputSchema, GptResponseUncheckedCreateInputSchema])
}).strict();
z.object({
  select: GptResponseSelectSchema.optional(),
  include: GptResponseIncludeSchema.optional(),
  where: GptResponseWhereUniqueInputSchema,
  create: z.union([GptResponseCreateInputSchema, GptResponseUncheckedCreateInputSchema]),
  update: z.union([GptResponseUpdateInputSchema, GptResponseUncheckedUpdateInputSchema])
}).strict();
z.object({
  data: z.union([GptResponseCreateManyInputSchema, GptResponseCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  data: z.union([GptResponseCreateManyInputSchema, GptResponseCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  select: GptResponseSelectSchema.optional(),
  include: GptResponseIncludeSchema.optional(),
  where: GptResponseWhereUniqueInputSchema
}).strict();
z.object({
  select: GptResponseSelectSchema.optional(),
  include: GptResponseIncludeSchema.optional(),
  data: z.union([GptResponseUpdateInputSchema, GptResponseUncheckedUpdateInputSchema]),
  where: GptResponseWhereUniqueInputSchema
}).strict();
z.object({
  data: z.union([GptResponseUpdateManyMutationInputSchema, GptResponseUncheckedUpdateManyInputSchema]),
  where: GptResponseWhereInputSchema.optional()
}).strict();
z.object({
  where: GptResponseWhereInputSchema.optional()
}).strict();
z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  data: z.union([TaskCreateInputSchema, TaskUncheckedCreateInputSchema])
}).strict();
z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  where: TaskWhereUniqueInputSchema,
  create: z.union([TaskCreateInputSchema, TaskUncheckedCreateInputSchema]),
  update: z.union([TaskUpdateInputSchema, TaskUncheckedUpdateInputSchema])
}).strict();
z.object({
  data: z.union([TaskCreateManyInputSchema, TaskCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  data: z.union([TaskCreateManyInputSchema, TaskCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  where: TaskWhereUniqueInputSchema
}).strict();
z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  data: z.union([TaskUpdateInputSchema, TaskUncheckedUpdateInputSchema]),
  where: TaskWhereUniqueInputSchema
}).strict();
z.object({
  data: z.union([TaskUpdateManyMutationInputSchema, TaskUncheckedUpdateManyInputSchema]),
  where: TaskWhereInputSchema.optional()
}).strict();
z.object({
  where: TaskWhereInputSchema.optional()
}).strict();
z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  data: z.union([FileCreateInputSchema, FileUncheckedCreateInputSchema])
}).strict();
z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  where: FileWhereUniqueInputSchema,
  create: z.union([FileCreateInputSchema, FileUncheckedCreateInputSchema]),
  update: z.union([FileUpdateInputSchema, FileUncheckedUpdateInputSchema])
}).strict();
z.object({
  data: z.union([FileCreateManyInputSchema, FileCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  data: z.union([FileCreateManyInputSchema, FileCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  where: FileWhereUniqueInputSchema
}).strict();
z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  data: z.union([FileUpdateInputSchema, FileUncheckedUpdateInputSchema]),
  where: FileWhereUniqueInputSchema
}).strict();
z.object({
  data: z.union([FileUpdateManyMutationInputSchema, FileUncheckedUpdateManyInputSchema]),
  where: FileWhereInputSchema.optional()
}).strict();
z.object({
  where: FileWhereInputSchema.optional()
}).strict();
z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  data: z.union([DailyStatsCreateInputSchema, DailyStatsUncheckedCreateInputSchema]).optional()
}).strict();
z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  where: DailyStatsWhereUniqueInputSchema,
  create: z.union([DailyStatsCreateInputSchema, DailyStatsUncheckedCreateInputSchema]),
  update: z.union([DailyStatsUpdateInputSchema, DailyStatsUncheckedUpdateInputSchema])
}).strict();
z.object({
  data: z.union([DailyStatsCreateManyInputSchema, DailyStatsCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  data: z.union([DailyStatsCreateManyInputSchema, DailyStatsCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  where: DailyStatsWhereUniqueInputSchema
}).strict();
z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  data: z.union([DailyStatsUpdateInputSchema, DailyStatsUncheckedUpdateInputSchema]),
  where: DailyStatsWhereUniqueInputSchema
}).strict();
z.object({
  data: z.union([DailyStatsUpdateManyMutationInputSchema, DailyStatsUncheckedUpdateManyInputSchema]),
  where: DailyStatsWhereInputSchema.optional()
}).strict();
z.object({
  where: DailyStatsWhereInputSchema.optional()
}).strict();
z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  data: z.union([PageViewSourceCreateInputSchema, PageViewSourceUncheckedCreateInputSchema])
}).strict();
z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  where: PageViewSourceWhereUniqueInputSchema,
  create: z.union([PageViewSourceCreateInputSchema, PageViewSourceUncheckedCreateInputSchema]),
  update: z.union([PageViewSourceUpdateInputSchema, PageViewSourceUncheckedUpdateInputSchema])
}).strict();
z.object({
  data: z.union([PageViewSourceCreateManyInputSchema, PageViewSourceCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  data: z.union([PageViewSourceCreateManyInputSchema, PageViewSourceCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  where: PageViewSourceWhereUniqueInputSchema
}).strict();
z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  data: z.union([PageViewSourceUpdateInputSchema, PageViewSourceUncheckedUpdateInputSchema]),
  where: PageViewSourceWhereUniqueInputSchema
}).strict();
z.object({
  data: z.union([PageViewSourceUpdateManyMutationInputSchema, PageViewSourceUncheckedUpdateManyInputSchema]),
  where: PageViewSourceWhereInputSchema.optional()
}).strict();
z.object({
  where: PageViewSourceWhereInputSchema.optional()
}).strict();
z.object({
  select: LogsSelectSchema.optional(),
  data: z.union([LogsCreateInputSchema, LogsUncheckedCreateInputSchema])
}).strict();
z.object({
  select: LogsSelectSchema.optional(),
  where: LogsWhereUniqueInputSchema,
  create: z.union([LogsCreateInputSchema, LogsUncheckedCreateInputSchema]),
  update: z.union([LogsUpdateInputSchema, LogsUncheckedUpdateInputSchema])
}).strict();
z.object({
  data: z.union([LogsCreateManyInputSchema, LogsCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  data: z.union([LogsCreateManyInputSchema, LogsCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  select: LogsSelectSchema.optional(),
  where: LogsWhereUniqueInputSchema
}).strict();
z.object({
  select: LogsSelectSchema.optional(),
  data: z.union([LogsUpdateInputSchema, LogsUncheckedUpdateInputSchema]),
  where: LogsWhereUniqueInputSchema
}).strict();
z.object({
  data: z.union([LogsUpdateManyMutationInputSchema, LogsUncheckedUpdateManyInputSchema]),
  where: LogsWhereInputSchema.optional()
}).strict();
z.object({
  where: LogsWhereInputSchema.optional()
}).strict();
z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  data: z.union([ContactFormMessageCreateInputSchema, ContactFormMessageUncheckedCreateInputSchema])
}).strict();
z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  where: ContactFormMessageWhereUniqueInputSchema,
  create: z.union([ContactFormMessageCreateInputSchema, ContactFormMessageUncheckedCreateInputSchema]),
  update: z.union([ContactFormMessageUpdateInputSchema, ContactFormMessageUncheckedUpdateInputSchema])
}).strict();
z.object({
  data: z.union([ContactFormMessageCreateManyInputSchema, ContactFormMessageCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  data: z.union([ContactFormMessageCreateManyInputSchema, ContactFormMessageCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  where: ContactFormMessageWhereUniqueInputSchema
}).strict();
z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  data: z.union([ContactFormMessageUpdateInputSchema, ContactFormMessageUncheckedUpdateInputSchema]),
  where: ContactFormMessageWhereUniqueInputSchema
}).strict();
z.object({
  data: z.union([ContactFormMessageUpdateManyMutationInputSchema, ContactFormMessageUncheckedUpdateManyInputSchema]),
  where: ContactFormMessageWhereInputSchema.optional()
}).strict();
z.object({
  where: ContactFormMessageWhereInputSchema.optional()
}).strict();
z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  data: z.union([ElaboratedRecipeCreateInputSchema, ElaboratedRecipeUncheckedCreateInputSchema])
}).strict();
z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  where: ElaboratedRecipeWhereUniqueInputSchema,
  create: z.union([ElaboratedRecipeCreateInputSchema, ElaboratedRecipeUncheckedCreateInputSchema]),
  update: z.union([ElaboratedRecipeUpdateInputSchema, ElaboratedRecipeUncheckedUpdateInputSchema])
}).strict();
z.object({
  data: z.union([ElaboratedRecipeCreateManyInputSchema, ElaboratedRecipeCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  data: z.union([ElaboratedRecipeCreateManyInputSchema, ElaboratedRecipeCreateManyInputSchema.array()]),
  skipDuplicates: z.boolean().optional()
}).strict();
z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  where: ElaboratedRecipeWhereUniqueInputSchema
}).strict();
z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  data: z.union([ElaboratedRecipeUpdateInputSchema, ElaboratedRecipeUncheckedUpdateInputSchema]),
  where: ElaboratedRecipeWhereUniqueInputSchema
}).strict();
z.object({
  data: z.union([ElaboratedRecipeUpdateManyMutationInputSchema, ElaboratedRecipeUncheckedUpdateManyInputSchema]),
  where: ElaboratedRecipeWhereInputSchema.optional()
}).strict();
z.object({
  where: ElaboratedRecipeWhereInputSchema.optional()
}).strict();

let currentUserId = null;
const setCurrentUserId = (userId) => {
  currentUserId = userId;
};
const getCurrentUserId = () => currentUserId;
const inputSchema = z.object({
  favoritesOnly: z.boolean().optional().describe("If true, only return favorite recipes"),
  searchQuery: z.string().optional().describe("Optional search term to filter recipes by title, ingredients, or instructions")
});
const outputSchema = z.object({
  recipes: z.array(ElaboratedRecipeSchema),
  recipeIds: z.array(z.string()).describe("Array of recipe IDs for filtering"),
  totalCount: z.number(),
  favoriteCount: z.number(),
  summary: z.string()
});
const getUserRecipes = createTool({
  id: ToolId.GetUserRecipes,
  description: `Search and retrieve the user's recipes from their personal collection. 
    This tool can filter by favorite status or search by title, ingredients, or instructions. 
    Use this when the user asks about their existing recipes, wants to find something they've created before, 
    needs to see their favorites, or wants to search through their recipe collection.
    
    Examples:
    - "Show me my recipes"
    - "What are my favorite pasta recipes?"
    - "Find recipes with chicken in my collection"
    - "Do I have any quick recipes?"
    - "Find recipes that involve baking"`,
  inputSchema,
  outputSchema,
  execute: async (executionContext) => {
    const { favoritesOnly, searchQuery } = executionContext.context;
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("User ID not available - make sure setCurrentUserId was called");
      }
      const whereConditions = {
        userId
      };
      if (favoritesOnly) {
        whereConditions.isFavorite = true;
      }
      let recipes;
      if (searchQuery) {
        const searchPattern = `%${searchQuery}%`;
        recipes = await prisma.$queryRaw`
            SELECT * FROM "ElaboratedRecipe" 
            WHERE "userId" = ${userId}
            ${favoritesOnly ? Prisma.sql`AND "isFavorite" = true` : Prisma.empty}
            AND (
              LOWER("title") LIKE LOWER(${searchPattern})
              OR EXISTS (
                SELECT 1 FROM jsonb_array_elements_text("ingredients") AS ingredient
                WHERE LOWER(ingredient) LIKE LOWER(${searchPattern})
              )
              OR EXISTS (
                SELECT 1 FROM jsonb_array_elements_text("instructions") AS instruction
                WHERE LOWER(instruction) LIKE LOWER(${searchPattern})
              )
            )
            ORDER BY "createdAt" DESC
          `;
      } else {
        recipes = await prisma.elaboratedRecipe.findMany({
          where: whereConditions,
          orderBy: {
            createdAt: "desc"
          }
        });
      }
      const totalCount = recipes.length;
      const favoriteCount = recipes.filter((r) => r.isFavorite).length;
      let summary = `Found ${totalCount} recipe${totalCount !== 1 ? "s" : ""}`;
      if (favoritesOnly) {
        summary += ` (favorite recipes)`;
      } else {
        summary += ` (${favoriteCount} favorites)`;
      }
      if (searchQuery) {
        summary += ` matching "${searchQuery}"`;
      }
      if (totalCount === 0) {
        summary = searchQuery ? `No recipes found matching "${searchQuery}" in your collection.` : favoritesOnly ? "You haven't favorited any recipes yet." : "Your recipe collection is empty.";
      }
      return {
        recipes,
        recipeIds: recipes.map((recipe) => recipe.id),
        totalCount,
        favoriteCount,
        summary
      };
    } catch (error) {
      console.error("Failed to get user recipes in tool:", error);
      return {
        recipes: [],
        recipeIds: [],
        totalCount: 0,
        favoriteCount: 0,
        summary: "Unable to retrieve recipes at the moment. Please try again."
      };
    }
  }
});

export { getCurrentUserId, getUserRecipes, setCurrentUserId };
