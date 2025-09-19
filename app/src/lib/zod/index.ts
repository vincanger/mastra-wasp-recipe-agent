import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','createdAt','email','username','isAdmin','paymentProcessorUserId','lemonSqueezyCustomerPortalUrl','subscriptionStatus','subscriptionPlan','datePaid','credits']);

export const FileScalarFieldEnumSchema = z.enum(['id','createdAt','userId','name','type','key','uploadUrl']);

export const DailyStatsScalarFieldEnumSchema = z.enum(['id','date','totalViews','prevDayViewsChangePercent','userCount','paidUserCount','userDelta','paidUserDelta','totalRevenue','totalProfit']);

export const PageViewSourceScalarFieldEnumSchema = z.enum(['name','date','dailyStatsId','visitors']);

export const LogsScalarFieldEnumSchema = z.enum(['id','createdAt','message','level']);

export const ContactFormMessageScalarFieldEnumSchema = z.enum(['id','createdAt','userId','content','isRead','repliedAt']);

export const ElaboratedRecipeScalarFieldEnumSchema = z.enum(['id','createdAt','updatedAt','userId','title','ingredients','instructions','isFavorite','dateCreated','servings','prepTime','cookTime','tags']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
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
  credits: z.number().int(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// FILE SCHEMA
/////////////////////////////////////////

export const FileSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  userId: z.string(),
  name: z.string(),
  type: z.string(),
  key: z.string(),
  uploadUrl: z.string(),
})

export type File = z.infer<typeof FileSchema>

/////////////////////////////////////////
// DAILY STATS SCHEMA
/////////////////////////////////////////

export const DailyStatsSchema = z.object({
  id: z.number().int(),
  date: z.coerce.date(),
  totalViews: z.number().int(),
  prevDayViewsChangePercent: z.string(),
  userCount: z.number().int(),
  paidUserCount: z.number().int(),
  userDelta: z.number().int(),
  paidUserDelta: z.number().int(),
  totalRevenue: z.number(),
  totalProfit: z.number(),
})

export type DailyStats = z.infer<typeof DailyStatsSchema>

/////////////////////////////////////////
// PAGE VIEW SOURCE SCHEMA
/////////////////////////////////////////

export const PageViewSourceSchema = z.object({
  name: z.string(),
  date: z.coerce.date(),
  dailyStatsId: z.number().int().nullable(),
  visitors: z.number().int(),
})

export type PageViewSource = z.infer<typeof PageViewSourceSchema>

/////////////////////////////////////////
// LOGS SCHEMA
/////////////////////////////////////////

export const LogsSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  message: z.string(),
  level: z.string(),
})

export type Logs = z.infer<typeof LogsSchema>

/////////////////////////////////////////
// CONTACT FORM MESSAGE SCHEMA
/////////////////////////////////////////

export const ContactFormMessageSchema = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  userId: z.string(),
  content: z.string(),
  isRead: z.boolean(),
  repliedAt: z.coerce.date().nullable(),
})

export type ContactFormMessage = z.infer<typeof ContactFormMessageSchema>

/////////////////////////////////////////
// ELABORATED RECIPE SCHEMA
/////////////////////////////////////////

export const ElaboratedRecipeSchema = z.object({
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
})

export type ElaboratedRecipe = z.infer<typeof ElaboratedRecipeSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  contactFormMessages: z.union([z.boolean(),z.lazy(() => ContactFormMessageFindManyArgsSchema)]).optional(),
  files: z.union([z.boolean(),z.lazy(() => FileFindManyArgsSchema)]).optional(),
  elaboratedRecipes: z.union([z.boolean(),z.lazy(() => ElaboratedRecipeFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  contactFormMessages: z.boolean().optional(),
  files: z.boolean().optional(),
  elaboratedRecipes: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
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
  contactFormMessages: z.union([z.boolean(),z.lazy(() => ContactFormMessageFindManyArgsSchema)]).optional(),
  files: z.union([z.boolean(),z.lazy(() => FileFindManyArgsSchema)]).optional(),
  elaboratedRecipes: z.union([z.boolean(),z.lazy(() => ElaboratedRecipeFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// FILE
//------------------------------------------------------

export const FileIncludeSchema: z.ZodType<Prisma.FileInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const FileArgsSchema: z.ZodType<Prisma.FileDefaultArgs> = z.object({
  select: z.lazy(() => FileSelectSchema).optional(),
  include: z.lazy(() => FileIncludeSchema).optional(),
}).strict();

export const FileSelectSchema: z.ZodType<Prisma.FileSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  name: z.boolean().optional(),
  type: z.boolean().optional(),
  key: z.boolean().optional(),
  uploadUrl: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// DAILY STATS
//------------------------------------------------------

export const DailyStatsIncludeSchema: z.ZodType<Prisma.DailyStatsInclude> = z.object({
  sources: z.union([z.boolean(),z.lazy(() => PageViewSourceFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DailyStatsCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const DailyStatsArgsSchema: z.ZodType<Prisma.DailyStatsDefaultArgs> = z.object({
  select: z.lazy(() => DailyStatsSelectSchema).optional(),
  include: z.lazy(() => DailyStatsIncludeSchema).optional(),
}).strict();

export const DailyStatsCountOutputTypeArgsSchema: z.ZodType<Prisma.DailyStatsCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => DailyStatsCountOutputTypeSelectSchema).nullish(),
}).strict();

export const DailyStatsCountOutputTypeSelectSchema: z.ZodType<Prisma.DailyStatsCountOutputTypeSelect> = z.object({
  sources: z.boolean().optional(),
}).strict();

export const DailyStatsSelectSchema: z.ZodType<Prisma.DailyStatsSelect> = z.object({
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
  sources: z.union([z.boolean(),z.lazy(() => PageViewSourceFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => DailyStatsCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PAGE VIEW SOURCE
//------------------------------------------------------

export const PageViewSourceIncludeSchema: z.ZodType<Prisma.PageViewSourceInclude> = z.object({
  dailyStats: z.union([z.boolean(),z.lazy(() => DailyStatsArgsSchema)]).optional(),
}).strict()

export const PageViewSourceArgsSchema: z.ZodType<Prisma.PageViewSourceDefaultArgs> = z.object({
  select: z.lazy(() => PageViewSourceSelectSchema).optional(),
  include: z.lazy(() => PageViewSourceIncludeSchema).optional(),
}).strict();

export const PageViewSourceSelectSchema: z.ZodType<Prisma.PageViewSourceSelect> = z.object({
  name: z.boolean().optional(),
  date: z.boolean().optional(),
  dailyStatsId: z.boolean().optional(),
  visitors: z.boolean().optional(),
  dailyStats: z.union([z.boolean(),z.lazy(() => DailyStatsArgsSchema)]).optional(),
}).strict()

// LOGS
//------------------------------------------------------

export const LogsSelectSchema: z.ZodType<Prisma.LogsSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  message: z.boolean().optional(),
  level: z.boolean().optional(),
}).strict()

// CONTACT FORM MESSAGE
//------------------------------------------------------

export const ContactFormMessageIncludeSchema: z.ZodType<Prisma.ContactFormMessageInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const ContactFormMessageArgsSchema: z.ZodType<Prisma.ContactFormMessageDefaultArgs> = z.object({
  select: z.lazy(() => ContactFormMessageSelectSchema).optional(),
  include: z.lazy(() => ContactFormMessageIncludeSchema).optional(),
}).strict();

export const ContactFormMessageSelectSchema: z.ZodType<Prisma.ContactFormMessageSelect> = z.object({
  id: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  content: z.boolean().optional(),
  isRead: z.boolean().optional(),
  repliedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// ELABORATED RECIPE
//------------------------------------------------------

export const ElaboratedRecipeIncludeSchema: z.ZodType<Prisma.ElaboratedRecipeInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

export const ElaboratedRecipeArgsSchema: z.ZodType<Prisma.ElaboratedRecipeDefaultArgs> = z.object({
  select: z.lazy(() => ElaboratedRecipeSelectSchema).optional(),
  include: z.lazy(() => ElaboratedRecipeIncludeSchema).optional(),
}).strict();

export const ElaboratedRecipeSelectSchema: z.ZodType<Prisma.ElaboratedRecipeSelect> = z.object({
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
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  username: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  isAdmin: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  paymentProcessorUserId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  subscriptionStatus: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  subscriptionPlan: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  datePaid: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  credits: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageListRelationFilterSchema).optional(),
  files: z.lazy(() => FileListRelationFilterSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  username: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional(),
  paymentProcessorUserId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  subscriptionStatus: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  subscriptionPlan: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  datePaid: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  credits: z.lazy(() => SortOrderSchema).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageOrderByRelationAggregateInputSchema).optional(),
  files: z.lazy(() => FileOrderByRelationAggregateInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    email: z.string(),
    username: z.string(),
    paymentProcessorUserId: z.string()
  }),
  z.object({
    id: z.string(),
    email: z.string(),
    username: z.string(),
  }),
  z.object({
    id: z.string(),
    email: z.string(),
    paymentProcessorUserId: z.string(),
  }),
  z.object({
    id: z.string(),
    email: z.string(),
  }),
  z.object({
    id: z.string(),
    username: z.string(),
    paymentProcessorUserId: z.string(),
  }),
  z.object({
    id: z.string(),
    username: z.string(),
  }),
  z.object({
    id: z.string(),
    paymentProcessorUserId: z.string(),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    email: z.string(),
    username: z.string(),
    paymentProcessorUserId: z.string(),
  }),
  z.object({
    email: z.string(),
    username: z.string(),
  }),
  z.object({
    email: z.string(),
    paymentProcessorUserId: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
  z.object({
    username: z.string(),
    paymentProcessorUserId: z.string(),
  }),
  z.object({
    username: z.string(),
  }),
  z.object({
    paymentProcessorUserId: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  email: z.string().optional(),
  username: z.string().optional(),
  paymentProcessorUserId: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  isAdmin: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  subscriptionStatus: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  subscriptionPlan: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  datePaid: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  credits: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageListRelationFilterSchema).optional(),
  files: z.lazy(() => FileListRelationFilterSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  email: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  username: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  isAdmin: z.lazy(() => SortOrderSchema).optional(),
  paymentProcessorUserId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  subscriptionStatus: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  subscriptionPlan: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  datePaid: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  credits: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  email: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  username: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  isAdmin: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  paymentProcessorUserId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  subscriptionStatus: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  subscriptionPlan: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  datePaid: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  credits: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const FileWhereInputSchema: z.ZodType<Prisma.FileWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FileWhereInputSchema),z.lazy(() => FileWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FileWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FileWhereInputSchema),z.lazy(() => FileWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uploadUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const FileOrderByWithRelationInputSchema: z.ZodType<Prisma.FileOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  uploadUrl: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const FileWhereUniqueInputSchema: z.ZodType<Prisma.FileWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => FileWhereInputSchema),z.lazy(() => FileWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FileWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FileWhereInputSchema),z.lazy(() => FileWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uploadUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const FileOrderByWithAggregationInputSchema: z.ZodType<Prisma.FileOrderByWithAggregationInput> = z.object({
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

export const FileScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FileScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => FileScalarWhereWithAggregatesInputSchema),z.lazy(() => FileScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FileScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FileScalarWhereWithAggregatesInputSchema),z.lazy(() => FileScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  uploadUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const DailyStatsWhereInputSchema: z.ZodType<Prisma.DailyStatsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => DailyStatsWhereInputSchema),z.lazy(() => DailyStatsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DailyStatsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DailyStatsWhereInputSchema),z.lazy(() => DailyStatsWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  totalViews: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  prevDayViewsChangePercent: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userCount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  paidUserCount: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  userDelta: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  paidUserDelta: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  totalRevenue: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  totalProfit: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  sources: z.lazy(() => PageViewSourceListRelationFilterSchema).optional()
}).strict();

export const DailyStatsOrderByWithRelationInputSchema: z.ZodType<Prisma.DailyStatsOrderByWithRelationInput> = z.object({
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

export const DailyStatsWhereUniqueInputSchema: z.ZodType<Prisma.DailyStatsWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    date: z.coerce.date()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    date: z.coerce.date(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  date: z.coerce.date().optional(),
  AND: z.union([ z.lazy(() => DailyStatsWhereInputSchema),z.lazy(() => DailyStatsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DailyStatsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DailyStatsWhereInputSchema),z.lazy(() => DailyStatsWhereInputSchema).array() ]).optional(),
  totalViews: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  prevDayViewsChangePercent: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userCount: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  paidUserCount: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  userDelta: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  paidUserDelta: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  totalRevenue: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  totalProfit: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  sources: z.lazy(() => PageViewSourceListRelationFilterSchema).optional()
}).strict());

export const DailyStatsOrderByWithAggregationInputSchema: z.ZodType<Prisma.DailyStatsOrderByWithAggregationInput> = z.object({
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

export const DailyStatsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DailyStatsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => DailyStatsScalarWhereWithAggregatesInputSchema),z.lazy(() => DailyStatsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DailyStatsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DailyStatsScalarWhereWithAggregatesInputSchema),z.lazy(() => DailyStatsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  totalViews: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  prevDayViewsChangePercent: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userCount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  paidUserCount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  userDelta: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  paidUserDelta: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  totalRevenue: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  totalProfit: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const PageViewSourceWhereInputSchema: z.ZodType<Prisma.PageViewSourceWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PageViewSourceWhereInputSchema),z.lazy(() => PageViewSourceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageViewSourceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageViewSourceWhereInputSchema),z.lazy(() => PageViewSourceWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  dailyStatsId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  visitors: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  dailyStats: z.union([ z.lazy(() => DailyStatsNullableRelationFilterSchema),z.lazy(() => DailyStatsWhereInputSchema) ]).optional().nullable(),
}).strict();

export const PageViewSourceOrderByWithRelationInputSchema: z.ZodType<Prisma.PageViewSourceOrderByWithRelationInput> = z.object({
  name: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  dailyStatsId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  visitors: z.lazy(() => SortOrderSchema).optional(),
  dailyStats: z.lazy(() => DailyStatsOrderByWithRelationInputSchema).optional()
}).strict();

export const PageViewSourceWhereUniqueInputSchema: z.ZodType<Prisma.PageViewSourceWhereUniqueInput> = z.object({
  date_name: z.lazy(() => PageViewSourceDateNameCompoundUniqueInputSchema)
})
.and(z.object({
  date_name: z.lazy(() => PageViewSourceDateNameCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => PageViewSourceWhereInputSchema),z.lazy(() => PageViewSourceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageViewSourceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageViewSourceWhereInputSchema),z.lazy(() => PageViewSourceWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  dailyStatsId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  visitors: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  dailyStats: z.union([ z.lazy(() => DailyStatsNullableRelationFilterSchema),z.lazy(() => DailyStatsWhereInputSchema) ]).optional().nullable(),
}).strict());

export const PageViewSourceOrderByWithAggregationInputSchema: z.ZodType<Prisma.PageViewSourceOrderByWithAggregationInput> = z.object({
  name: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  dailyStatsId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  visitors: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PageViewSourceCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PageViewSourceAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PageViewSourceMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PageViewSourceMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PageViewSourceSumOrderByAggregateInputSchema).optional()
}).strict();

export const PageViewSourceScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PageViewSourceScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PageViewSourceScalarWhereWithAggregatesInputSchema),z.lazy(() => PageViewSourceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageViewSourceScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageViewSourceScalarWhereWithAggregatesInputSchema),z.lazy(() => PageViewSourceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  dailyStatsId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  visitors: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict();

export const LogsWhereInputSchema: z.ZodType<Prisma.LogsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => LogsWhereInputSchema),z.lazy(() => LogsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LogsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LogsWhereInputSchema),z.lazy(() => LogsWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  level: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const LogsOrderByWithRelationInputSchema: z.ZodType<Prisma.LogsOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  level: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LogsWhereUniqueInputSchema: z.ZodType<Prisma.LogsWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => LogsWhereInputSchema),z.lazy(() => LogsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LogsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LogsWhereInputSchema),z.lazy(() => LogsWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  message: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  level: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict());

export const LogsOrderByWithAggregationInputSchema: z.ZodType<Prisma.LogsOrderByWithAggregationInput> = z.object({
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

export const LogsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LogsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => LogsScalarWhereWithAggregatesInputSchema),z.lazy(() => LogsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LogsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LogsScalarWhereWithAggregatesInputSchema),z.lazy(() => LogsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  message: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  level: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const ContactFormMessageWhereInputSchema: z.ZodType<Prisma.ContactFormMessageWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContactFormMessageWhereInputSchema),z.lazy(() => ContactFormMessageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactFormMessageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactFormMessageWhereInputSchema),z.lazy(() => ContactFormMessageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isRead: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  repliedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const ContactFormMessageOrderByWithRelationInputSchema: z.ZodType<Prisma.ContactFormMessageOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  repliedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ContactFormMessageWhereUniqueInputSchema: z.ZodType<Prisma.ContactFormMessageWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ContactFormMessageWhereInputSchema),z.lazy(() => ContactFormMessageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactFormMessageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactFormMessageWhereInputSchema),z.lazy(() => ContactFormMessageWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isRead: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  repliedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const ContactFormMessageOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContactFormMessageOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  repliedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ContactFormMessageCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContactFormMessageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContactFormMessageMinOrderByAggregateInputSchema).optional()
}).strict();

export const ContactFormMessageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContactFormMessageScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContactFormMessageScalarWhereWithAggregatesInputSchema),z.lazy(() => ContactFormMessageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactFormMessageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactFormMessageScalarWhereWithAggregatesInputSchema),z.lazy(() => ContactFormMessageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  isRead: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  repliedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const ElaboratedRecipeWhereInputSchema: z.ZodType<Prisma.ElaboratedRecipeWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ElaboratedRecipeWhereInputSchema),z.lazy(() => ElaboratedRecipeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ElaboratedRecipeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ElaboratedRecipeWhereInputSchema),z.lazy(() => ElaboratedRecipeWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ingredients: z.lazy(() => JsonFilterSchema).optional(),
  instructions: z.lazy(() => JsonFilterSchema).optional(),
  isFavorite: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  dateCreated: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  servings: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  prepTime: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  cookTime: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  tags: z.lazy(() => JsonNullableFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const ElaboratedRecipeOrderByWithRelationInputSchema: z.ZodType<Prisma.ElaboratedRecipeOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  ingredients: z.lazy(() => SortOrderSchema).optional(),
  instructions: z.lazy(() => SortOrderSchema).optional(),
  isFavorite: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  servings: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  prepTime: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  cookTime: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ElaboratedRecipeWhereUniqueInputSchema: z.ZodType<Prisma.ElaboratedRecipeWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ElaboratedRecipeWhereInputSchema),z.lazy(() => ElaboratedRecipeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ElaboratedRecipeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ElaboratedRecipeWhereInputSchema),z.lazy(() => ElaboratedRecipeWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ingredients: z.lazy(() => JsonFilterSchema).optional(),
  instructions: z.lazy(() => JsonFilterSchema).optional(),
  isFavorite: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  dateCreated: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  servings: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  prepTime: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  cookTime: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  tags: z.lazy(() => JsonNullableFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const ElaboratedRecipeOrderByWithAggregationInputSchema: z.ZodType<Prisma.ElaboratedRecipeOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  ingredients: z.lazy(() => SortOrderSchema).optional(),
  instructions: z.lazy(() => SortOrderSchema).optional(),
  isFavorite: z.lazy(() => SortOrderSchema).optional(),
  dateCreated: z.lazy(() => SortOrderSchema).optional(),
  servings: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  prepTime: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  cookTime: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  tags: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ElaboratedRecipeCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ElaboratedRecipeAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ElaboratedRecipeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ElaboratedRecipeMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ElaboratedRecipeSumOrderByAggregateInputSchema).optional()
}).strict();

export const ElaboratedRecipeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ElaboratedRecipeScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ElaboratedRecipeScalarWhereWithAggregatesInputSchema),z.lazy(() => ElaboratedRecipeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ElaboratedRecipeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ElaboratedRecipeScalarWhereWithAggregatesInputSchema),z.lazy(() => ElaboratedRecipeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  ingredients: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  instructions: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  isFavorite: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  dateCreated: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  servings: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  prepTime: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  cookTime: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  tags: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional()
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
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
  files: z.lazy(() => FileCreateNestedManyWithoutUserInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
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
  files: z.lazy(() => FileUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paymentProcessorUserId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionStatus: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionPlan: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datePaid: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUpdateManyWithoutUserNestedInputSchema).optional(),
  files: z.lazy(() => FileUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paymentProcessorUserId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionStatus: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionPlan: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datePaid: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  files: z.lazy(() => FileUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
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

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paymentProcessorUserId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionStatus: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionPlan: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datePaid: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paymentProcessorUserId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionStatus: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionPlan: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datePaid: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FileCreateInputSchema: z.ZodType<Prisma.FileCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  key: z.string(),
  uploadUrl: z.string(),
  user: z.lazy(() => UserCreateNestedOneWithoutFilesInputSchema)
}).strict();

export const FileUncheckedCreateInputSchema: z.ZodType<Prisma.FileUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  userId: z.string(),
  name: z.string(),
  type: z.string(),
  key: z.string(),
  uploadUrl: z.string()
}).strict();

export const FileUpdateInputSchema: z.ZodType<Prisma.FileUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutFilesNestedInputSchema).optional()
}).strict();

export const FileUncheckedUpdateInputSchema: z.ZodType<Prisma.FileUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FileCreateManyInputSchema: z.ZodType<Prisma.FileCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  userId: z.string(),
  name: z.string(),
  type: z.string(),
  key: z.string(),
  uploadUrl: z.string()
}).strict();

export const FileUpdateManyMutationInputSchema: z.ZodType<Prisma.FileUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FileUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FileUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DailyStatsCreateInputSchema: z.ZodType<Prisma.DailyStatsCreateInput> = z.object({
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

export const DailyStatsUncheckedCreateInputSchema: z.ZodType<Prisma.DailyStatsUncheckedCreateInput> = z.object({
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

export const DailyStatsUpdateInputSchema: z.ZodType<Prisma.DailyStatsUpdateInput> = z.object({
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  totalViews: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prevDayViewsChangePercent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  paidUserCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userDelta: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  paidUserDelta: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalRevenue: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalProfit: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  sources: z.lazy(() => PageViewSourceUpdateManyWithoutDailyStatsNestedInputSchema).optional()
}).strict();

export const DailyStatsUncheckedUpdateInputSchema: z.ZodType<Prisma.DailyStatsUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  totalViews: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prevDayViewsChangePercent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  paidUserCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userDelta: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  paidUserDelta: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalRevenue: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalProfit: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  sources: z.lazy(() => PageViewSourceUncheckedUpdateManyWithoutDailyStatsNestedInputSchema).optional()
}).strict();

export const DailyStatsCreateManyInputSchema: z.ZodType<Prisma.DailyStatsCreateManyInput> = z.object({
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

export const DailyStatsUpdateManyMutationInputSchema: z.ZodType<Prisma.DailyStatsUpdateManyMutationInput> = z.object({
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  totalViews: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prevDayViewsChangePercent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  paidUserCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userDelta: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  paidUserDelta: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalRevenue: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalProfit: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DailyStatsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DailyStatsUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  totalViews: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prevDayViewsChangePercent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  paidUserCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userDelta: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  paidUserDelta: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalRevenue: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalProfit: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PageViewSourceCreateInputSchema: z.ZodType<Prisma.PageViewSourceCreateInput> = z.object({
  name: z.string(),
  date: z.coerce.date().optional(),
  visitors: z.number().int(),
  dailyStats: z.lazy(() => DailyStatsCreateNestedOneWithoutSourcesInputSchema).optional()
}).strict();

export const PageViewSourceUncheckedCreateInputSchema: z.ZodType<Prisma.PageViewSourceUncheckedCreateInput> = z.object({
  name: z.string(),
  date: z.coerce.date().optional(),
  dailyStatsId: z.number().int().optional().nullable(),
  visitors: z.number().int()
}).strict();

export const PageViewSourceUpdateInputSchema: z.ZodType<Prisma.PageViewSourceUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  visitors: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  dailyStats: z.lazy(() => DailyStatsUpdateOneWithoutSourcesNestedInputSchema).optional()
}).strict();

export const PageViewSourceUncheckedUpdateInputSchema: z.ZodType<Prisma.PageViewSourceUncheckedUpdateInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  dailyStatsId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  visitors: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PageViewSourceCreateManyInputSchema: z.ZodType<Prisma.PageViewSourceCreateManyInput> = z.object({
  name: z.string(),
  date: z.coerce.date().optional(),
  dailyStatsId: z.number().int().optional().nullable(),
  visitors: z.number().int()
}).strict();

export const PageViewSourceUpdateManyMutationInputSchema: z.ZodType<Prisma.PageViewSourceUpdateManyMutationInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  visitors: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PageViewSourceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PageViewSourceUncheckedUpdateManyInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  dailyStatsId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  visitors: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LogsCreateInputSchema: z.ZodType<Prisma.LogsCreateInput> = z.object({
  createdAt: z.coerce.date().optional(),
  message: z.string(),
  level: z.string()
}).strict();

export const LogsUncheckedCreateInputSchema: z.ZodType<Prisma.LogsUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  message: z.string(),
  level: z.string()
}).strict();

export const LogsUpdateInputSchema: z.ZodType<Prisma.LogsUpdateInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  level: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LogsUncheckedUpdateInputSchema: z.ZodType<Prisma.LogsUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  level: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LogsCreateManyInputSchema: z.ZodType<Prisma.LogsCreateManyInput> = z.object({
  id: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  message: z.string(),
  level: z.string()
}).strict();

export const LogsUpdateManyMutationInputSchema: z.ZodType<Prisma.LogsUpdateManyMutationInput> = z.object({
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  level: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const LogsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LogsUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  message: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  level: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContactFormMessageCreateInputSchema: z.ZodType<Prisma.ContactFormMessageCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  content: z.string(),
  isRead: z.boolean().optional(),
  repliedAt: z.coerce.date().optional().nullable(),
  user: z.lazy(() => UserCreateNestedOneWithoutContactFormMessagesInputSchema)
}).strict();

export const ContactFormMessageUncheckedCreateInputSchema: z.ZodType<Prisma.ContactFormMessageUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  userId: z.string(),
  content: z.string(),
  isRead: z.boolean().optional(),
  repliedAt: z.coerce.date().optional().nullable()
}).strict();

export const ContactFormMessageUpdateInputSchema: z.ZodType<Prisma.ContactFormMessageUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutContactFormMessagesNestedInputSchema).optional()
}).strict();

export const ContactFormMessageUncheckedUpdateInputSchema: z.ZodType<Prisma.ContactFormMessageUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ContactFormMessageCreateManyInputSchema: z.ZodType<Prisma.ContactFormMessageCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  userId: z.string(),
  content: z.string(),
  isRead: z.boolean().optional(),
  repliedAt: z.coerce.date().optional().nullable()
}).strict();

export const ContactFormMessageUpdateManyMutationInputSchema: z.ZodType<Prisma.ContactFormMessageUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ContactFormMessageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContactFormMessageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ElaboratedRecipeCreateInputSchema: z.ZodType<Prisma.ElaboratedRecipeCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  title: z.string(),
  ingredients: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  instructions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isFavorite: z.boolean().optional(),
  dateCreated: z.string(),
  servings: z.number().int().optional().nullable(),
  prepTime: z.number().int().optional().nullable(),
  cookTime: z.number().int().optional().nullable(),
  tags: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutElaboratedRecipesInputSchema)
}).strict();

export const ElaboratedRecipeUncheckedCreateInputSchema: z.ZodType<Prisma.ElaboratedRecipeUncheckedCreateInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string(),
  title: z.string(),
  ingredients: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  instructions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isFavorite: z.boolean().optional(),
  dateCreated: z.string(),
  servings: z.number().int().optional().nullable(),
  prepTime: z.number().int().optional().nullable(),
  cookTime: z.number().int().optional().nullable(),
  tags: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const ElaboratedRecipeUpdateInputSchema: z.ZodType<Prisma.ElaboratedRecipeUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ingredients: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  instructions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isFavorite: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  servings: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prepTime: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cookTime: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutElaboratedRecipesNestedInputSchema).optional()
}).strict();

export const ElaboratedRecipeUncheckedUpdateInputSchema: z.ZodType<Prisma.ElaboratedRecipeUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ingredients: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  instructions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isFavorite: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  servings: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prepTime: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cookTime: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const ElaboratedRecipeCreateManyInputSchema: z.ZodType<Prisma.ElaboratedRecipeCreateManyInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string(),
  title: z.string(),
  ingredients: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  instructions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isFavorite: z.boolean().optional(),
  dateCreated: z.string(),
  servings: z.number().int().optional().nullable(),
  prepTime: z.number().int().optional().nullable(),
  cookTime: z.number().int().optional().nullable(),
  tags: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const ElaboratedRecipeUpdateManyMutationInputSchema: z.ZodType<Prisma.ElaboratedRecipeUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ingredients: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  instructions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isFavorite: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  servings: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prepTime: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cookTime: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const ElaboratedRecipeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ElaboratedRecipeUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ingredients: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  instructions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isFavorite: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  servings: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prepTime: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cookTime: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const ContactFormMessageListRelationFilterSchema: z.ZodType<Prisma.ContactFormMessageListRelationFilter> = z.object({
  every: z.lazy(() => ContactFormMessageWhereInputSchema).optional(),
  some: z.lazy(() => ContactFormMessageWhereInputSchema).optional(),
  none: z.lazy(() => ContactFormMessageWhereInputSchema).optional()
}).strict();

export const FileListRelationFilterSchema: z.ZodType<Prisma.FileListRelationFilter> = z.object({
  every: z.lazy(() => FileWhereInputSchema).optional(),
  some: z.lazy(() => FileWhereInputSchema).optional(),
  none: z.lazy(() => FileWhereInputSchema).optional()
}).strict();

export const ElaboratedRecipeListRelationFilterSchema: z.ZodType<Prisma.ElaboratedRecipeListRelationFilter> = z.object({
  every: z.lazy(() => ElaboratedRecipeWhereInputSchema).optional(),
  some: z.lazy(() => ElaboratedRecipeWhereInputSchema).optional(),
  none: z.lazy(() => ElaboratedRecipeWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const ContactFormMessageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ContactFormMessageOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FileOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FileOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ElaboratedRecipeOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ElaboratedRecipeOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
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

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  credits: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
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

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
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

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  credits: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const FileCountOrderByAggregateInputSchema: z.ZodType<Prisma.FileCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  uploadUrl: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FileMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FileMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  uploadUrl: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FileMinOrderByAggregateInputSchema: z.ZodType<Prisma.FileMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  uploadUrl: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const PageViewSourceListRelationFilterSchema: z.ZodType<Prisma.PageViewSourceListRelationFilter> = z.object({
  every: z.lazy(() => PageViewSourceWhereInputSchema).optional(),
  some: z.lazy(() => PageViewSourceWhereInputSchema).optional(),
  none: z.lazy(() => PageViewSourceWhereInputSchema).optional()
}).strict();

export const PageViewSourceOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PageViewSourceOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DailyStatsCountOrderByAggregateInputSchema: z.ZodType<Prisma.DailyStatsCountOrderByAggregateInput> = z.object({
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

export const DailyStatsAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DailyStatsAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  totalViews: z.lazy(() => SortOrderSchema).optional(),
  userCount: z.lazy(() => SortOrderSchema).optional(),
  paidUserCount: z.lazy(() => SortOrderSchema).optional(),
  userDelta: z.lazy(() => SortOrderSchema).optional(),
  paidUserDelta: z.lazy(() => SortOrderSchema).optional(),
  totalRevenue: z.lazy(() => SortOrderSchema).optional(),
  totalProfit: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DailyStatsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DailyStatsMaxOrderByAggregateInput> = z.object({
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

export const DailyStatsMinOrderByAggregateInputSchema: z.ZodType<Prisma.DailyStatsMinOrderByAggregateInput> = z.object({
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

export const DailyStatsSumOrderByAggregateInputSchema: z.ZodType<Prisma.DailyStatsSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  totalViews: z.lazy(() => SortOrderSchema).optional(),
  userCount: z.lazy(() => SortOrderSchema).optional(),
  paidUserCount: z.lazy(() => SortOrderSchema).optional(),
  userDelta: z.lazy(() => SortOrderSchema).optional(),
  paidUserDelta: z.lazy(() => SortOrderSchema).optional(),
  totalRevenue: z.lazy(() => SortOrderSchema).optional(),
  totalProfit: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DailyStatsNullableRelationFilterSchema: z.ZodType<Prisma.DailyStatsNullableRelationFilter> = z.object({
  is: z.lazy(() => DailyStatsWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => DailyStatsWhereInputSchema).optional().nullable()
}).strict();

export const PageViewSourceDateNameCompoundUniqueInputSchema: z.ZodType<Prisma.PageViewSourceDateNameCompoundUniqueInput> = z.object({
  date: z.coerce.date(),
  name: z.string()
}).strict();

export const PageViewSourceCountOrderByAggregateInputSchema: z.ZodType<Prisma.PageViewSourceCountOrderByAggregateInput> = z.object({
  name: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  dailyStatsId: z.lazy(() => SortOrderSchema).optional(),
  visitors: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PageViewSourceAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PageViewSourceAvgOrderByAggregateInput> = z.object({
  dailyStatsId: z.lazy(() => SortOrderSchema).optional(),
  visitors: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PageViewSourceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PageViewSourceMaxOrderByAggregateInput> = z.object({
  name: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  dailyStatsId: z.lazy(() => SortOrderSchema).optional(),
  visitors: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PageViewSourceMinOrderByAggregateInputSchema: z.ZodType<Prisma.PageViewSourceMinOrderByAggregateInput> = z.object({
  name: z.lazy(() => SortOrderSchema).optional(),
  date: z.lazy(() => SortOrderSchema).optional(),
  dailyStatsId: z.lazy(() => SortOrderSchema).optional(),
  visitors: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PageViewSourceSumOrderByAggregateInputSchema: z.ZodType<Prisma.PageViewSourceSumOrderByAggregateInput> = z.object({
  dailyStatsId: z.lazy(() => SortOrderSchema).optional(),
  visitors: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const LogsCountOrderByAggregateInputSchema: z.ZodType<Prisma.LogsCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  level: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LogsAvgOrderByAggregateInputSchema: z.ZodType<Prisma.LogsAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LogsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LogsMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  level: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LogsMinOrderByAggregateInputSchema: z.ZodType<Prisma.LogsMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  message: z.lazy(() => SortOrderSchema).optional(),
  level: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const LogsSumOrderByAggregateInputSchema: z.ZodType<Prisma.LogsSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactFormMessageCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContactFormMessageCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  repliedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactFormMessageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContactFormMessageMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  repliedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContactFormMessageMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContactFormMessageMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  repliedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
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

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
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

export const ElaboratedRecipeCountOrderByAggregateInputSchema: z.ZodType<Prisma.ElaboratedRecipeCountOrderByAggregateInput> = z.object({
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

export const ElaboratedRecipeAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ElaboratedRecipeAvgOrderByAggregateInput> = z.object({
  servings: z.lazy(() => SortOrderSchema).optional(),
  prepTime: z.lazy(() => SortOrderSchema).optional(),
  cookTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ElaboratedRecipeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ElaboratedRecipeMaxOrderByAggregateInput> = z.object({
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

export const ElaboratedRecipeMinOrderByAggregateInputSchema: z.ZodType<Prisma.ElaboratedRecipeMinOrderByAggregateInput> = z.object({
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

export const ElaboratedRecipeSumOrderByAggregateInputSchema: z.ZodType<Prisma.ElaboratedRecipeSumOrderByAggregateInput> = z.object({
  servings: z.lazy(() => SortOrderSchema).optional(),
  prepTime: z.lazy(() => SortOrderSchema).optional(),
  cookTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
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

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
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

export const ContactFormMessageCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ContactFormMessageCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema),z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema).array(),z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema),z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema),z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContactFormMessageCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContactFormMessageWhereUniqueInputSchema),z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FileCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FileCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => FileCreateWithoutUserInputSchema),z.lazy(() => FileCreateWithoutUserInputSchema).array(),z.lazy(() => FileUncheckedCreateWithoutUserInputSchema),z.lazy(() => FileUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FileCreateOrConnectWithoutUserInputSchema),z.lazy(() => FileCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FileCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FileWhereUniqueInputSchema),z.lazy(() => FileWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ElaboratedRecipeCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ElaboratedRecipeCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema).array(),z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ElaboratedRecipeCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ContactFormMessageUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ContactFormMessageUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema),z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema).array(),z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema),z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema),z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContactFormMessageCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContactFormMessageWhereUniqueInputSchema),z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FileUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.FileUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => FileCreateWithoutUserInputSchema),z.lazy(() => FileCreateWithoutUserInputSchema).array(),z.lazy(() => FileUncheckedCreateWithoutUserInputSchema),z.lazy(() => FileUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FileCreateOrConnectWithoutUserInputSchema),z.lazy(() => FileCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FileCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FileWhereUniqueInputSchema),z.lazy(() => FileWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ElaboratedRecipeUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ElaboratedRecipeUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema).array(),z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ElaboratedRecipeCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const ContactFormMessageUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ContactFormMessageUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema),z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema).array(),z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema),z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema),z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContactFormMessageUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ContactFormMessageUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContactFormMessageCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContactFormMessageWhereUniqueInputSchema),z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContactFormMessageWhereUniqueInputSchema),z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContactFormMessageWhereUniqueInputSchema),z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContactFormMessageWhereUniqueInputSchema),z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContactFormMessageUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ContactFormMessageUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContactFormMessageUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ContactFormMessageUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContactFormMessageScalarWhereInputSchema),z.lazy(() => ContactFormMessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FileUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FileUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => FileCreateWithoutUserInputSchema),z.lazy(() => FileCreateWithoutUserInputSchema).array(),z.lazy(() => FileUncheckedCreateWithoutUserInputSchema),z.lazy(() => FileUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FileCreateOrConnectWithoutUserInputSchema),z.lazy(() => FileCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FileUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FileUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FileCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FileWhereUniqueInputSchema),z.lazy(() => FileWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FileWhereUniqueInputSchema),z.lazy(() => FileWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FileWhereUniqueInputSchema),z.lazy(() => FileWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FileWhereUniqueInputSchema),z.lazy(() => FileWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FileUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FileUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FileUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => FileUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FileScalarWhereInputSchema),z.lazy(() => FileScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ElaboratedRecipeUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ElaboratedRecipeUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema).array(),z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ElaboratedRecipeUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ElaboratedRecipeCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ElaboratedRecipeUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ElaboratedRecipeUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ElaboratedRecipeScalarWhereInputSchema),z.lazy(() => ElaboratedRecipeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContactFormMessageUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ContactFormMessageUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema),z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema).array(),z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema),z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema),z.lazy(() => ContactFormMessageCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContactFormMessageUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ContactFormMessageUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContactFormMessageCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContactFormMessageWhereUniqueInputSchema),z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContactFormMessageWhereUniqueInputSchema),z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContactFormMessageWhereUniqueInputSchema),z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContactFormMessageWhereUniqueInputSchema),z.lazy(() => ContactFormMessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContactFormMessageUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ContactFormMessageUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContactFormMessageUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ContactFormMessageUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContactFormMessageScalarWhereInputSchema),z.lazy(() => ContactFormMessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FileUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.FileUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => FileCreateWithoutUserInputSchema),z.lazy(() => FileCreateWithoutUserInputSchema).array(),z.lazy(() => FileUncheckedCreateWithoutUserInputSchema),z.lazy(() => FileUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FileCreateOrConnectWithoutUserInputSchema),z.lazy(() => FileCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FileUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FileUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FileCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FileWhereUniqueInputSchema),z.lazy(() => FileWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FileWhereUniqueInputSchema),z.lazy(() => FileWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FileWhereUniqueInputSchema),z.lazy(() => FileWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FileWhereUniqueInputSchema),z.lazy(() => FileWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FileUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => FileUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FileUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => FileUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FileScalarWhereInputSchema),z.lazy(() => FileScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ElaboratedRecipeUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ElaboratedRecipeUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema).array(),z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ElaboratedRecipeUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ElaboratedRecipeCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ElaboratedRecipeUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ElaboratedRecipeUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ElaboratedRecipeScalarWhereInputSchema),z.lazy(() => ElaboratedRecipeScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutFilesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutFilesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutFilesInputSchema),z.lazy(() => UserUncheckedCreateWithoutFilesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFilesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutFilesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutFilesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutFilesInputSchema),z.lazy(() => UserUncheckedCreateWithoutFilesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutFilesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutFilesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutFilesInputSchema),z.lazy(() => UserUpdateWithoutFilesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFilesInputSchema) ]).optional(),
}).strict();

export const PageViewSourceCreateNestedManyWithoutDailyStatsInputSchema: z.ZodType<Prisma.PageViewSourceCreateNestedManyWithoutDailyStatsInput> = z.object({
  create: z.union([ z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema).array(),z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PageViewSourceCreateManyDailyStatsInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PageViewSourceWhereUniqueInputSchema),z.lazy(() => PageViewSourceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PageViewSourceUncheckedCreateNestedManyWithoutDailyStatsInputSchema: z.ZodType<Prisma.PageViewSourceUncheckedCreateNestedManyWithoutDailyStatsInput> = z.object({
  create: z.union([ z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema).array(),z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PageViewSourceCreateManyDailyStatsInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PageViewSourceWhereUniqueInputSchema),z.lazy(() => PageViewSourceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const PageViewSourceUpdateManyWithoutDailyStatsNestedInputSchema: z.ZodType<Prisma.PageViewSourceUpdateManyWithoutDailyStatsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema).array(),z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PageViewSourceUpsertWithWhereUniqueWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceUpsertWithWhereUniqueWithoutDailyStatsInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PageViewSourceCreateManyDailyStatsInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PageViewSourceWhereUniqueInputSchema),z.lazy(() => PageViewSourceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PageViewSourceWhereUniqueInputSchema),z.lazy(() => PageViewSourceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PageViewSourceWhereUniqueInputSchema),z.lazy(() => PageViewSourceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PageViewSourceWhereUniqueInputSchema),z.lazy(() => PageViewSourceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PageViewSourceUpdateWithWhereUniqueWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceUpdateWithWhereUniqueWithoutDailyStatsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PageViewSourceUpdateManyWithWhereWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceUpdateManyWithWhereWithoutDailyStatsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PageViewSourceScalarWhereInputSchema),z.lazy(() => PageViewSourceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PageViewSourceUncheckedUpdateManyWithoutDailyStatsNestedInputSchema: z.ZodType<Prisma.PageViewSourceUncheckedUpdateManyWithoutDailyStatsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema).array(),z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PageViewSourceUpsertWithWhereUniqueWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceUpsertWithWhereUniqueWithoutDailyStatsInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PageViewSourceCreateManyDailyStatsInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PageViewSourceWhereUniqueInputSchema),z.lazy(() => PageViewSourceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PageViewSourceWhereUniqueInputSchema),z.lazy(() => PageViewSourceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PageViewSourceWhereUniqueInputSchema),z.lazy(() => PageViewSourceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PageViewSourceWhereUniqueInputSchema),z.lazy(() => PageViewSourceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PageViewSourceUpdateWithWhereUniqueWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceUpdateWithWhereUniqueWithoutDailyStatsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PageViewSourceUpdateManyWithWhereWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceUpdateManyWithWhereWithoutDailyStatsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PageViewSourceScalarWhereInputSchema),z.lazy(() => PageViewSourceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const DailyStatsCreateNestedOneWithoutSourcesInputSchema: z.ZodType<Prisma.DailyStatsCreateNestedOneWithoutSourcesInput> = z.object({
  create: z.union([ z.lazy(() => DailyStatsCreateWithoutSourcesInputSchema),z.lazy(() => DailyStatsUncheckedCreateWithoutSourcesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DailyStatsCreateOrConnectWithoutSourcesInputSchema).optional(),
  connect: z.lazy(() => DailyStatsWhereUniqueInputSchema).optional()
}).strict();

export const DailyStatsUpdateOneWithoutSourcesNestedInputSchema: z.ZodType<Prisma.DailyStatsUpdateOneWithoutSourcesNestedInput> = z.object({
  create: z.union([ z.lazy(() => DailyStatsCreateWithoutSourcesInputSchema),z.lazy(() => DailyStatsUncheckedCreateWithoutSourcesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DailyStatsCreateOrConnectWithoutSourcesInputSchema).optional(),
  upsert: z.lazy(() => DailyStatsUpsertWithoutSourcesInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => DailyStatsWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => DailyStatsWhereInputSchema) ]).optional(),
  connect: z.lazy(() => DailyStatsWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DailyStatsUpdateToOneWithWhereWithoutSourcesInputSchema),z.lazy(() => DailyStatsUpdateWithoutSourcesInputSchema),z.lazy(() => DailyStatsUncheckedUpdateWithoutSourcesInputSchema) ]).optional(),
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const UserCreateNestedOneWithoutContactFormMessagesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutContactFormMessagesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutContactFormMessagesInputSchema),z.lazy(() => UserUncheckedCreateWithoutContactFormMessagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutContactFormMessagesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutContactFormMessagesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutContactFormMessagesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutContactFormMessagesInputSchema),z.lazy(() => UserUncheckedCreateWithoutContactFormMessagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutContactFormMessagesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutContactFormMessagesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutContactFormMessagesInputSchema),z.lazy(() => UserUpdateWithoutContactFormMessagesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutContactFormMessagesInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutElaboratedRecipesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutElaboratedRecipesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutElaboratedRecipesInputSchema),z.lazy(() => UserUncheckedCreateWithoutElaboratedRecipesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutElaboratedRecipesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutElaboratedRecipesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutElaboratedRecipesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutElaboratedRecipesInputSchema),z.lazy(() => UserUncheckedCreateWithoutElaboratedRecipesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutElaboratedRecipesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutElaboratedRecipesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutElaboratedRecipesInputSchema),z.lazy(() => UserUpdateWithoutElaboratedRecipesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutElaboratedRecipesInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
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

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
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

export const ContactFormMessageCreateWithoutUserInputSchema: z.ZodType<Prisma.ContactFormMessageCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  content: z.string(),
  isRead: z.boolean().optional(),
  repliedAt: z.coerce.date().optional().nullable()
}).strict();

export const ContactFormMessageUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ContactFormMessageUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  content: z.string(),
  isRead: z.boolean().optional(),
  repliedAt: z.coerce.date().optional().nullable()
}).strict();

export const ContactFormMessageCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ContactFormMessageCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ContactFormMessageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema),z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ContactFormMessageCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ContactFormMessageCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ContactFormMessageCreateManyUserInputSchema),z.lazy(() => ContactFormMessageCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const FileCreateWithoutUserInputSchema: z.ZodType<Prisma.FileCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  key: z.string(),
  uploadUrl: z.string()
}).strict();

export const FileUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.FileUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  key: z.string(),
  uploadUrl: z.string()
}).strict();

export const FileCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.FileCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => FileWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FileCreateWithoutUserInputSchema),z.lazy(() => FileUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const FileCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.FileCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FileCreateManyUserInputSchema),z.lazy(() => FileCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ElaboratedRecipeCreateWithoutUserInputSchema: z.ZodType<Prisma.ElaboratedRecipeCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  title: z.string(),
  ingredients: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  instructions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isFavorite: z.boolean().optional(),
  dateCreated: z.string(),
  servings: z.number().int().optional().nullable(),
  prepTime: z.number().int().optional().nullable(),
  cookTime: z.number().int().optional().nullable(),
  tags: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const ElaboratedRecipeUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ElaboratedRecipeUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  title: z.string(),
  ingredients: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  instructions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isFavorite: z.boolean().optional(),
  dateCreated: z.string(),
  servings: z.number().int().optional().nullable(),
  prepTime: z.number().int().optional().nullable(),
  cookTime: z.number().int().optional().nullable(),
  tags: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const ElaboratedRecipeCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ElaboratedRecipeCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ElaboratedRecipeCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ElaboratedRecipeCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ElaboratedRecipeCreateManyUserInputSchema),z.lazy(() => ElaboratedRecipeCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ContactFormMessageUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ContactFormMessageUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ContactFormMessageWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContactFormMessageUpdateWithoutUserInputSchema),z.lazy(() => ContactFormMessageUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ContactFormMessageCreateWithoutUserInputSchema),z.lazy(() => ContactFormMessageUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ContactFormMessageUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ContactFormMessageUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ContactFormMessageWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContactFormMessageUpdateWithoutUserInputSchema),z.lazy(() => ContactFormMessageUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ContactFormMessageUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ContactFormMessageUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ContactFormMessageScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContactFormMessageUpdateManyMutationInputSchema),z.lazy(() => ContactFormMessageUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ContactFormMessageScalarWhereInputSchema: z.ZodType<Prisma.ContactFormMessageScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContactFormMessageScalarWhereInputSchema),z.lazy(() => ContactFormMessageScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContactFormMessageScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContactFormMessageScalarWhereInputSchema),z.lazy(() => ContactFormMessageScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  isRead: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  repliedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const FileUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FileUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => FileWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FileUpdateWithoutUserInputSchema),z.lazy(() => FileUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => FileCreateWithoutUserInputSchema),z.lazy(() => FileUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const FileUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.FileUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => FileWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FileUpdateWithoutUserInputSchema),z.lazy(() => FileUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const FileUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.FileUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => FileScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FileUpdateManyMutationInputSchema),z.lazy(() => FileUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const FileScalarWhereInputSchema: z.ZodType<Prisma.FileScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FileScalarWhereInputSchema),z.lazy(() => FileScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FileScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FileScalarWhereInputSchema),z.lazy(() => FileScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  uploadUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const ElaboratedRecipeUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ElaboratedRecipeUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ElaboratedRecipeUpdateWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ElaboratedRecipeCreateWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ElaboratedRecipeUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ElaboratedRecipeUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ElaboratedRecipeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ElaboratedRecipeUpdateWithoutUserInputSchema),z.lazy(() => ElaboratedRecipeUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ElaboratedRecipeUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ElaboratedRecipeUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ElaboratedRecipeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ElaboratedRecipeUpdateManyMutationInputSchema),z.lazy(() => ElaboratedRecipeUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ElaboratedRecipeScalarWhereInputSchema: z.ZodType<Prisma.ElaboratedRecipeScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ElaboratedRecipeScalarWhereInputSchema),z.lazy(() => ElaboratedRecipeScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ElaboratedRecipeScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ElaboratedRecipeScalarWhereInputSchema),z.lazy(() => ElaboratedRecipeScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  ingredients: z.lazy(() => JsonFilterSchema).optional(),
  instructions: z.lazy(() => JsonFilterSchema).optional(),
  isFavorite: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  dateCreated: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  servings: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  prepTime: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  cookTime: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  tags: z.lazy(() => JsonNullableFilterSchema).optional()
}).strict();

export const UserCreateWithoutFilesInputSchema: z.ZodType<Prisma.UserCreateWithoutFilesInput> = z.object({
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
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutFilesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutFilesInput> = z.object({
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
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutFilesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutFilesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutFilesInputSchema),z.lazy(() => UserUncheckedCreateWithoutFilesInputSchema) ]),
}).strict();

export const UserUpsertWithoutFilesInputSchema: z.ZodType<Prisma.UserUpsertWithoutFilesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutFilesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFilesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutFilesInputSchema),z.lazy(() => UserUncheckedCreateWithoutFilesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutFilesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutFilesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutFilesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutFilesInputSchema) ]),
}).strict();

export const UserUpdateWithoutFilesInputSchema: z.ZodType<Prisma.UserUpdateWithoutFilesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paymentProcessorUserId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionStatus: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionPlan: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datePaid: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutFilesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutFilesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paymentProcessorUserId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionStatus: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionPlan: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datePaid: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const PageViewSourceCreateWithoutDailyStatsInputSchema: z.ZodType<Prisma.PageViewSourceCreateWithoutDailyStatsInput> = z.object({
  name: z.string(),
  date: z.coerce.date().optional(),
  visitors: z.number().int()
}).strict();

export const PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema: z.ZodType<Prisma.PageViewSourceUncheckedCreateWithoutDailyStatsInput> = z.object({
  name: z.string(),
  date: z.coerce.date().optional(),
  visitors: z.number().int()
}).strict();

export const PageViewSourceCreateOrConnectWithoutDailyStatsInputSchema: z.ZodType<Prisma.PageViewSourceCreateOrConnectWithoutDailyStatsInput> = z.object({
  where: z.lazy(() => PageViewSourceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema) ]),
}).strict();

export const PageViewSourceCreateManyDailyStatsInputEnvelopeSchema: z.ZodType<Prisma.PageViewSourceCreateManyDailyStatsInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PageViewSourceCreateManyDailyStatsInputSchema),z.lazy(() => PageViewSourceCreateManyDailyStatsInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const PageViewSourceUpsertWithWhereUniqueWithoutDailyStatsInputSchema: z.ZodType<Prisma.PageViewSourceUpsertWithWhereUniqueWithoutDailyStatsInput> = z.object({
  where: z.lazy(() => PageViewSourceWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PageViewSourceUpdateWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceUncheckedUpdateWithoutDailyStatsInputSchema) ]),
  create: z.union([ z.lazy(() => PageViewSourceCreateWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceUncheckedCreateWithoutDailyStatsInputSchema) ]),
}).strict();

export const PageViewSourceUpdateWithWhereUniqueWithoutDailyStatsInputSchema: z.ZodType<Prisma.PageViewSourceUpdateWithWhereUniqueWithoutDailyStatsInput> = z.object({
  where: z.lazy(() => PageViewSourceWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PageViewSourceUpdateWithoutDailyStatsInputSchema),z.lazy(() => PageViewSourceUncheckedUpdateWithoutDailyStatsInputSchema) ]),
}).strict();

export const PageViewSourceUpdateManyWithWhereWithoutDailyStatsInputSchema: z.ZodType<Prisma.PageViewSourceUpdateManyWithWhereWithoutDailyStatsInput> = z.object({
  where: z.lazy(() => PageViewSourceScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PageViewSourceUpdateManyMutationInputSchema),z.lazy(() => PageViewSourceUncheckedUpdateManyWithoutDailyStatsInputSchema) ]),
}).strict();

export const PageViewSourceScalarWhereInputSchema: z.ZodType<Prisma.PageViewSourceScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PageViewSourceScalarWhereInputSchema),z.lazy(() => PageViewSourceScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PageViewSourceScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PageViewSourceScalarWhereInputSchema),z.lazy(() => PageViewSourceScalarWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  date: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  dailyStatsId: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  visitors: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict();

export const DailyStatsCreateWithoutSourcesInputSchema: z.ZodType<Prisma.DailyStatsCreateWithoutSourcesInput> = z.object({
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

export const DailyStatsUncheckedCreateWithoutSourcesInputSchema: z.ZodType<Prisma.DailyStatsUncheckedCreateWithoutSourcesInput> = z.object({
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

export const DailyStatsCreateOrConnectWithoutSourcesInputSchema: z.ZodType<Prisma.DailyStatsCreateOrConnectWithoutSourcesInput> = z.object({
  where: z.lazy(() => DailyStatsWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DailyStatsCreateWithoutSourcesInputSchema),z.lazy(() => DailyStatsUncheckedCreateWithoutSourcesInputSchema) ]),
}).strict();

export const DailyStatsUpsertWithoutSourcesInputSchema: z.ZodType<Prisma.DailyStatsUpsertWithoutSourcesInput> = z.object({
  update: z.union([ z.lazy(() => DailyStatsUpdateWithoutSourcesInputSchema),z.lazy(() => DailyStatsUncheckedUpdateWithoutSourcesInputSchema) ]),
  create: z.union([ z.lazy(() => DailyStatsCreateWithoutSourcesInputSchema),z.lazy(() => DailyStatsUncheckedCreateWithoutSourcesInputSchema) ]),
  where: z.lazy(() => DailyStatsWhereInputSchema).optional()
}).strict();

export const DailyStatsUpdateToOneWithWhereWithoutSourcesInputSchema: z.ZodType<Prisma.DailyStatsUpdateToOneWithWhereWithoutSourcesInput> = z.object({
  where: z.lazy(() => DailyStatsWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DailyStatsUpdateWithoutSourcesInputSchema),z.lazy(() => DailyStatsUncheckedUpdateWithoutSourcesInputSchema) ]),
}).strict();

export const DailyStatsUpdateWithoutSourcesInputSchema: z.ZodType<Prisma.DailyStatsUpdateWithoutSourcesInput> = z.object({
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  totalViews: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prevDayViewsChangePercent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  paidUserCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userDelta: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  paidUserDelta: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalRevenue: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalProfit: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const DailyStatsUncheckedUpdateWithoutSourcesInputSchema: z.ZodType<Prisma.DailyStatsUncheckedUpdateWithoutSourcesInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  totalViews: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  prevDayViewsChangePercent: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  paidUserCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  userDelta: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  paidUserDelta: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  totalRevenue: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  totalProfit: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserCreateWithoutContactFormMessagesInputSchema: z.ZodType<Prisma.UserCreateWithoutContactFormMessagesInput> = z.object({
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
  files: z.lazy(() => FileCreateNestedManyWithoutUserInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutContactFormMessagesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutContactFormMessagesInput> = z.object({
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
  files: z.lazy(() => FileUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutContactFormMessagesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutContactFormMessagesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutContactFormMessagesInputSchema),z.lazy(() => UserUncheckedCreateWithoutContactFormMessagesInputSchema) ]),
}).strict();

export const UserUpsertWithoutContactFormMessagesInputSchema: z.ZodType<Prisma.UserUpsertWithoutContactFormMessagesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutContactFormMessagesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutContactFormMessagesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutContactFormMessagesInputSchema),z.lazy(() => UserUncheckedCreateWithoutContactFormMessagesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutContactFormMessagesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutContactFormMessagesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutContactFormMessagesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutContactFormMessagesInputSchema) ]),
}).strict();

export const UserUpdateWithoutContactFormMessagesInputSchema: z.ZodType<Prisma.UserUpdateWithoutContactFormMessagesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paymentProcessorUserId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionStatus: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionPlan: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datePaid: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  files: z.lazy(() => FileUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutContactFormMessagesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutContactFormMessagesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paymentProcessorUserId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionStatus: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionPlan: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datePaid: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  files: z.lazy(() => FileUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  elaboratedRecipes: z.lazy(() => ElaboratedRecipeUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateWithoutElaboratedRecipesInputSchema: z.ZodType<Prisma.UserCreateWithoutElaboratedRecipesInput> = z.object({
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
  files: z.lazy(() => FileCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutElaboratedRecipesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutElaboratedRecipesInput> = z.object({
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
  files: z.lazy(() => FileUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutElaboratedRecipesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutElaboratedRecipesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutElaboratedRecipesInputSchema),z.lazy(() => UserUncheckedCreateWithoutElaboratedRecipesInputSchema) ]),
}).strict();

export const UserUpsertWithoutElaboratedRecipesInputSchema: z.ZodType<Prisma.UserUpsertWithoutElaboratedRecipesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutElaboratedRecipesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutElaboratedRecipesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutElaboratedRecipesInputSchema),z.lazy(() => UserUncheckedCreateWithoutElaboratedRecipesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutElaboratedRecipesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutElaboratedRecipesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutElaboratedRecipesInputSchema),z.lazy(() => UserUncheckedUpdateWithoutElaboratedRecipesInputSchema) ]),
}).strict();

export const UserUpdateWithoutElaboratedRecipesInputSchema: z.ZodType<Prisma.UserUpdateWithoutElaboratedRecipesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paymentProcessorUserId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionStatus: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionPlan: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datePaid: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUpdateManyWithoutUserNestedInputSchema).optional(),
  files: z.lazy(() => FileUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutElaboratedRecipesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutElaboratedRecipesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  username: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isAdmin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  paymentProcessorUserId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  lemonSqueezyCustomerPortalUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionStatus: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  subscriptionPlan: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  datePaid: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  credits: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contactFormMessages: z.lazy(() => ContactFormMessageUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  files: z.lazy(() => FileUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ContactFormMessageCreateManyUserInputSchema: z.ZodType<Prisma.ContactFormMessageCreateManyUserInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  content: z.string(),
  isRead: z.boolean().optional(),
  repliedAt: z.coerce.date().optional().nullable()
}).strict();

export const FileCreateManyUserInputSchema: z.ZodType<Prisma.FileCreateManyUserInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  name: z.string(),
  type: z.string(),
  key: z.string(),
  uploadUrl: z.string()
}).strict();

export const ElaboratedRecipeCreateManyUserInputSchema: z.ZodType<Prisma.ElaboratedRecipeCreateManyUserInput> = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  title: z.string(),
  ingredients: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  instructions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  isFavorite: z.boolean().optional(),
  dateCreated: z.string(),
  servings: z.number().int().optional().nullable(),
  prepTime: z.number().int().optional().nullable(),
  cookTime: z.number().int().optional().nullable(),
  tags: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const ContactFormMessageUpdateWithoutUserInputSchema: z.ZodType<Prisma.ContactFormMessageUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ContactFormMessageUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ContactFormMessageUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ContactFormMessageUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ContactFormMessageUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  repliedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const FileUpdateWithoutUserInputSchema: z.ZodType<Prisma.FileUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FileUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.FileUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FileUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.FileUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  uploadUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ElaboratedRecipeUpdateWithoutUserInputSchema: z.ZodType<Prisma.ElaboratedRecipeUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ingredients: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  instructions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isFavorite: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  servings: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prepTime: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cookTime: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const ElaboratedRecipeUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ElaboratedRecipeUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ingredients: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  instructions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isFavorite: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  servings: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prepTime: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cookTime: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const ElaboratedRecipeUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ElaboratedRecipeUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  ingredients: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  instructions: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  isFavorite: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dateCreated: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  servings: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  prepTime: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  cookTime: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  tags: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const PageViewSourceCreateManyDailyStatsInputSchema: z.ZodType<Prisma.PageViewSourceCreateManyDailyStatsInput> = z.object({
  name: z.string(),
  date: z.coerce.date().optional(),
  visitors: z.number().int()
}).strict();

export const PageViewSourceUpdateWithoutDailyStatsInputSchema: z.ZodType<Prisma.PageViewSourceUpdateWithoutDailyStatsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  visitors: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PageViewSourceUncheckedUpdateWithoutDailyStatsInputSchema: z.ZodType<Prisma.PageViewSourceUncheckedUpdateWithoutDailyStatsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  visitors: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PageViewSourceUncheckedUpdateManyWithoutDailyStatsInputSchema: z.ZodType<Prisma.PageViewSourceUncheckedUpdateManyWithoutDailyStatsInput> = z.object({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  date: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  visitors: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const FileFindFirstArgsSchema: z.ZodType<Prisma.FileFindFirstArgs> = z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  where: FileWhereInputSchema.optional(),
  orderBy: z.union([ FileOrderByWithRelationInputSchema.array(),FileOrderByWithRelationInputSchema ]).optional(),
  cursor: FileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FileScalarFieldEnumSchema,FileScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FileFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FileFindFirstOrThrowArgs> = z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  where: FileWhereInputSchema.optional(),
  orderBy: z.union([ FileOrderByWithRelationInputSchema.array(),FileOrderByWithRelationInputSchema ]).optional(),
  cursor: FileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FileScalarFieldEnumSchema,FileScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FileFindManyArgsSchema: z.ZodType<Prisma.FileFindManyArgs> = z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  where: FileWhereInputSchema.optional(),
  orderBy: z.union([ FileOrderByWithRelationInputSchema.array(),FileOrderByWithRelationInputSchema ]).optional(),
  cursor: FileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FileScalarFieldEnumSchema,FileScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FileAggregateArgsSchema: z.ZodType<Prisma.FileAggregateArgs> = z.object({
  where: FileWhereInputSchema.optional(),
  orderBy: z.union([ FileOrderByWithRelationInputSchema.array(),FileOrderByWithRelationInputSchema ]).optional(),
  cursor: FileWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FileGroupByArgsSchema: z.ZodType<Prisma.FileGroupByArgs> = z.object({
  where: FileWhereInputSchema.optional(),
  orderBy: z.union([ FileOrderByWithAggregationInputSchema.array(),FileOrderByWithAggregationInputSchema ]).optional(),
  by: FileScalarFieldEnumSchema.array(),
  having: FileScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FileFindUniqueArgsSchema: z.ZodType<Prisma.FileFindUniqueArgs> = z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  where: FileWhereUniqueInputSchema,
}).strict() ;

export const FileFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FileFindUniqueOrThrowArgs> = z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  where: FileWhereUniqueInputSchema,
}).strict() ;

export const DailyStatsFindFirstArgsSchema: z.ZodType<Prisma.DailyStatsFindFirstArgs> = z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  where: DailyStatsWhereInputSchema.optional(),
  orderBy: z.union([ DailyStatsOrderByWithRelationInputSchema.array(),DailyStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: DailyStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DailyStatsScalarFieldEnumSchema,DailyStatsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DailyStatsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DailyStatsFindFirstOrThrowArgs> = z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  where: DailyStatsWhereInputSchema.optional(),
  orderBy: z.union([ DailyStatsOrderByWithRelationInputSchema.array(),DailyStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: DailyStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DailyStatsScalarFieldEnumSchema,DailyStatsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DailyStatsFindManyArgsSchema: z.ZodType<Prisma.DailyStatsFindManyArgs> = z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  where: DailyStatsWhereInputSchema.optional(),
  orderBy: z.union([ DailyStatsOrderByWithRelationInputSchema.array(),DailyStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: DailyStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DailyStatsScalarFieldEnumSchema,DailyStatsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const DailyStatsAggregateArgsSchema: z.ZodType<Prisma.DailyStatsAggregateArgs> = z.object({
  where: DailyStatsWhereInputSchema.optional(),
  orderBy: z.union([ DailyStatsOrderByWithRelationInputSchema.array(),DailyStatsOrderByWithRelationInputSchema ]).optional(),
  cursor: DailyStatsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DailyStatsGroupByArgsSchema: z.ZodType<Prisma.DailyStatsGroupByArgs> = z.object({
  where: DailyStatsWhereInputSchema.optional(),
  orderBy: z.union([ DailyStatsOrderByWithAggregationInputSchema.array(),DailyStatsOrderByWithAggregationInputSchema ]).optional(),
  by: DailyStatsScalarFieldEnumSchema.array(),
  having: DailyStatsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const DailyStatsFindUniqueArgsSchema: z.ZodType<Prisma.DailyStatsFindUniqueArgs> = z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  where: DailyStatsWhereUniqueInputSchema,
}).strict() ;

export const DailyStatsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DailyStatsFindUniqueOrThrowArgs> = z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  where: DailyStatsWhereUniqueInputSchema,
}).strict() ;

export const PageViewSourceFindFirstArgsSchema: z.ZodType<Prisma.PageViewSourceFindFirstArgs> = z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  where: PageViewSourceWhereInputSchema.optional(),
  orderBy: z.union([ PageViewSourceOrderByWithRelationInputSchema.array(),PageViewSourceOrderByWithRelationInputSchema ]).optional(),
  cursor: PageViewSourceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PageViewSourceScalarFieldEnumSchema,PageViewSourceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PageViewSourceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PageViewSourceFindFirstOrThrowArgs> = z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  where: PageViewSourceWhereInputSchema.optional(),
  orderBy: z.union([ PageViewSourceOrderByWithRelationInputSchema.array(),PageViewSourceOrderByWithRelationInputSchema ]).optional(),
  cursor: PageViewSourceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PageViewSourceScalarFieldEnumSchema,PageViewSourceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PageViewSourceFindManyArgsSchema: z.ZodType<Prisma.PageViewSourceFindManyArgs> = z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  where: PageViewSourceWhereInputSchema.optional(),
  orderBy: z.union([ PageViewSourceOrderByWithRelationInputSchema.array(),PageViewSourceOrderByWithRelationInputSchema ]).optional(),
  cursor: PageViewSourceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PageViewSourceScalarFieldEnumSchema,PageViewSourceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PageViewSourceAggregateArgsSchema: z.ZodType<Prisma.PageViewSourceAggregateArgs> = z.object({
  where: PageViewSourceWhereInputSchema.optional(),
  orderBy: z.union([ PageViewSourceOrderByWithRelationInputSchema.array(),PageViewSourceOrderByWithRelationInputSchema ]).optional(),
  cursor: PageViewSourceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PageViewSourceGroupByArgsSchema: z.ZodType<Prisma.PageViewSourceGroupByArgs> = z.object({
  where: PageViewSourceWhereInputSchema.optional(),
  orderBy: z.union([ PageViewSourceOrderByWithAggregationInputSchema.array(),PageViewSourceOrderByWithAggregationInputSchema ]).optional(),
  by: PageViewSourceScalarFieldEnumSchema.array(),
  having: PageViewSourceScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PageViewSourceFindUniqueArgsSchema: z.ZodType<Prisma.PageViewSourceFindUniqueArgs> = z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  where: PageViewSourceWhereUniqueInputSchema,
}).strict() ;

export const PageViewSourceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PageViewSourceFindUniqueOrThrowArgs> = z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  where: PageViewSourceWhereUniqueInputSchema,
}).strict() ;

export const LogsFindFirstArgsSchema: z.ZodType<Prisma.LogsFindFirstArgs> = z.object({
  select: LogsSelectSchema.optional(),
  where: LogsWhereInputSchema.optional(),
  orderBy: z.union([ LogsOrderByWithRelationInputSchema.array(),LogsOrderByWithRelationInputSchema ]).optional(),
  cursor: LogsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LogsScalarFieldEnumSchema,LogsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LogsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LogsFindFirstOrThrowArgs> = z.object({
  select: LogsSelectSchema.optional(),
  where: LogsWhereInputSchema.optional(),
  orderBy: z.union([ LogsOrderByWithRelationInputSchema.array(),LogsOrderByWithRelationInputSchema ]).optional(),
  cursor: LogsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LogsScalarFieldEnumSchema,LogsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LogsFindManyArgsSchema: z.ZodType<Prisma.LogsFindManyArgs> = z.object({
  select: LogsSelectSchema.optional(),
  where: LogsWhereInputSchema.optional(),
  orderBy: z.union([ LogsOrderByWithRelationInputSchema.array(),LogsOrderByWithRelationInputSchema ]).optional(),
  cursor: LogsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LogsScalarFieldEnumSchema,LogsScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const LogsAggregateArgsSchema: z.ZodType<Prisma.LogsAggregateArgs> = z.object({
  where: LogsWhereInputSchema.optional(),
  orderBy: z.union([ LogsOrderByWithRelationInputSchema.array(),LogsOrderByWithRelationInputSchema ]).optional(),
  cursor: LogsWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LogsGroupByArgsSchema: z.ZodType<Prisma.LogsGroupByArgs> = z.object({
  where: LogsWhereInputSchema.optional(),
  orderBy: z.union([ LogsOrderByWithAggregationInputSchema.array(),LogsOrderByWithAggregationInputSchema ]).optional(),
  by: LogsScalarFieldEnumSchema.array(),
  having: LogsScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const LogsFindUniqueArgsSchema: z.ZodType<Prisma.LogsFindUniqueArgs> = z.object({
  select: LogsSelectSchema.optional(),
  where: LogsWhereUniqueInputSchema,
}).strict() ;

export const LogsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LogsFindUniqueOrThrowArgs> = z.object({
  select: LogsSelectSchema.optional(),
  where: LogsWhereUniqueInputSchema,
}).strict() ;

export const ContactFormMessageFindFirstArgsSchema: z.ZodType<Prisma.ContactFormMessageFindFirstArgs> = z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  where: ContactFormMessageWhereInputSchema.optional(),
  orderBy: z.union([ ContactFormMessageOrderByWithRelationInputSchema.array(),ContactFormMessageOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactFormMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContactFormMessageScalarFieldEnumSchema,ContactFormMessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContactFormMessageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContactFormMessageFindFirstOrThrowArgs> = z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  where: ContactFormMessageWhereInputSchema.optional(),
  orderBy: z.union([ ContactFormMessageOrderByWithRelationInputSchema.array(),ContactFormMessageOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactFormMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContactFormMessageScalarFieldEnumSchema,ContactFormMessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContactFormMessageFindManyArgsSchema: z.ZodType<Prisma.ContactFormMessageFindManyArgs> = z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  where: ContactFormMessageWhereInputSchema.optional(),
  orderBy: z.union([ ContactFormMessageOrderByWithRelationInputSchema.array(),ContactFormMessageOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactFormMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContactFormMessageScalarFieldEnumSchema,ContactFormMessageScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContactFormMessageAggregateArgsSchema: z.ZodType<Prisma.ContactFormMessageAggregateArgs> = z.object({
  where: ContactFormMessageWhereInputSchema.optional(),
  orderBy: z.union([ ContactFormMessageOrderByWithRelationInputSchema.array(),ContactFormMessageOrderByWithRelationInputSchema ]).optional(),
  cursor: ContactFormMessageWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContactFormMessageGroupByArgsSchema: z.ZodType<Prisma.ContactFormMessageGroupByArgs> = z.object({
  where: ContactFormMessageWhereInputSchema.optional(),
  orderBy: z.union([ ContactFormMessageOrderByWithAggregationInputSchema.array(),ContactFormMessageOrderByWithAggregationInputSchema ]).optional(),
  by: ContactFormMessageScalarFieldEnumSchema.array(),
  having: ContactFormMessageScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContactFormMessageFindUniqueArgsSchema: z.ZodType<Prisma.ContactFormMessageFindUniqueArgs> = z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  where: ContactFormMessageWhereUniqueInputSchema,
}).strict() ;

export const ContactFormMessageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContactFormMessageFindUniqueOrThrowArgs> = z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  where: ContactFormMessageWhereUniqueInputSchema,
}).strict() ;

export const ElaboratedRecipeFindFirstArgsSchema: z.ZodType<Prisma.ElaboratedRecipeFindFirstArgs> = z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  where: ElaboratedRecipeWhereInputSchema.optional(),
  orderBy: z.union([ ElaboratedRecipeOrderByWithRelationInputSchema.array(),ElaboratedRecipeOrderByWithRelationInputSchema ]).optional(),
  cursor: ElaboratedRecipeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ElaboratedRecipeScalarFieldEnumSchema,ElaboratedRecipeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ElaboratedRecipeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ElaboratedRecipeFindFirstOrThrowArgs> = z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  where: ElaboratedRecipeWhereInputSchema.optional(),
  orderBy: z.union([ ElaboratedRecipeOrderByWithRelationInputSchema.array(),ElaboratedRecipeOrderByWithRelationInputSchema ]).optional(),
  cursor: ElaboratedRecipeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ElaboratedRecipeScalarFieldEnumSchema,ElaboratedRecipeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ElaboratedRecipeFindManyArgsSchema: z.ZodType<Prisma.ElaboratedRecipeFindManyArgs> = z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  where: ElaboratedRecipeWhereInputSchema.optional(),
  orderBy: z.union([ ElaboratedRecipeOrderByWithRelationInputSchema.array(),ElaboratedRecipeOrderByWithRelationInputSchema ]).optional(),
  cursor: ElaboratedRecipeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ElaboratedRecipeScalarFieldEnumSchema,ElaboratedRecipeScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ElaboratedRecipeAggregateArgsSchema: z.ZodType<Prisma.ElaboratedRecipeAggregateArgs> = z.object({
  where: ElaboratedRecipeWhereInputSchema.optional(),
  orderBy: z.union([ ElaboratedRecipeOrderByWithRelationInputSchema.array(),ElaboratedRecipeOrderByWithRelationInputSchema ]).optional(),
  cursor: ElaboratedRecipeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ElaboratedRecipeGroupByArgsSchema: z.ZodType<Prisma.ElaboratedRecipeGroupByArgs> = z.object({
  where: ElaboratedRecipeWhereInputSchema.optional(),
  orderBy: z.union([ ElaboratedRecipeOrderByWithAggregationInputSchema.array(),ElaboratedRecipeOrderByWithAggregationInputSchema ]).optional(),
  by: ElaboratedRecipeScalarFieldEnumSchema.array(),
  having: ElaboratedRecipeScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ElaboratedRecipeFindUniqueArgsSchema: z.ZodType<Prisma.ElaboratedRecipeFindUniqueArgs> = z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  where: ElaboratedRecipeWhereUniqueInputSchema,
}).strict() ;

export const ElaboratedRecipeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ElaboratedRecipeFindUniqueOrThrowArgs> = z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  where: ElaboratedRecipeWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]).optional(),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const FileCreateArgsSchema: z.ZodType<Prisma.FileCreateArgs> = z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  data: z.union([ FileCreateInputSchema,FileUncheckedCreateInputSchema ]),
}).strict() ;

export const FileUpsertArgsSchema: z.ZodType<Prisma.FileUpsertArgs> = z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  where: FileWhereUniqueInputSchema,
  create: z.union([ FileCreateInputSchema,FileUncheckedCreateInputSchema ]),
  update: z.union([ FileUpdateInputSchema,FileUncheckedUpdateInputSchema ]),
}).strict() ;

export const FileCreateManyArgsSchema: z.ZodType<Prisma.FileCreateManyArgs> = z.object({
  data: z.union([ FileCreateManyInputSchema,FileCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const FileCreateManyAndReturnArgsSchema: z.ZodType<Prisma.FileCreateManyAndReturnArgs> = z.object({
  data: z.union([ FileCreateManyInputSchema,FileCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const FileDeleteArgsSchema: z.ZodType<Prisma.FileDeleteArgs> = z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  where: FileWhereUniqueInputSchema,
}).strict() ;

export const FileUpdateArgsSchema: z.ZodType<Prisma.FileUpdateArgs> = z.object({
  select: FileSelectSchema.optional(),
  include: FileIncludeSchema.optional(),
  data: z.union([ FileUpdateInputSchema,FileUncheckedUpdateInputSchema ]),
  where: FileWhereUniqueInputSchema,
}).strict() ;

export const FileUpdateManyArgsSchema: z.ZodType<Prisma.FileUpdateManyArgs> = z.object({
  data: z.union([ FileUpdateManyMutationInputSchema,FileUncheckedUpdateManyInputSchema ]),
  where: FileWhereInputSchema.optional(),
}).strict() ;

export const FileDeleteManyArgsSchema: z.ZodType<Prisma.FileDeleteManyArgs> = z.object({
  where: FileWhereInputSchema.optional(),
}).strict() ;

export const DailyStatsCreateArgsSchema: z.ZodType<Prisma.DailyStatsCreateArgs> = z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  data: z.union([ DailyStatsCreateInputSchema,DailyStatsUncheckedCreateInputSchema ]).optional(),
}).strict() ;

export const DailyStatsUpsertArgsSchema: z.ZodType<Prisma.DailyStatsUpsertArgs> = z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  where: DailyStatsWhereUniqueInputSchema,
  create: z.union([ DailyStatsCreateInputSchema,DailyStatsUncheckedCreateInputSchema ]),
  update: z.union([ DailyStatsUpdateInputSchema,DailyStatsUncheckedUpdateInputSchema ]),
}).strict() ;

export const DailyStatsCreateManyArgsSchema: z.ZodType<Prisma.DailyStatsCreateManyArgs> = z.object({
  data: z.union([ DailyStatsCreateManyInputSchema,DailyStatsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DailyStatsCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DailyStatsCreateManyAndReturnArgs> = z.object({
  data: z.union([ DailyStatsCreateManyInputSchema,DailyStatsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const DailyStatsDeleteArgsSchema: z.ZodType<Prisma.DailyStatsDeleteArgs> = z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  where: DailyStatsWhereUniqueInputSchema,
}).strict() ;

export const DailyStatsUpdateArgsSchema: z.ZodType<Prisma.DailyStatsUpdateArgs> = z.object({
  select: DailyStatsSelectSchema.optional(),
  include: DailyStatsIncludeSchema.optional(),
  data: z.union([ DailyStatsUpdateInputSchema,DailyStatsUncheckedUpdateInputSchema ]),
  where: DailyStatsWhereUniqueInputSchema,
}).strict() ;

export const DailyStatsUpdateManyArgsSchema: z.ZodType<Prisma.DailyStatsUpdateManyArgs> = z.object({
  data: z.union([ DailyStatsUpdateManyMutationInputSchema,DailyStatsUncheckedUpdateManyInputSchema ]),
  where: DailyStatsWhereInputSchema.optional(),
}).strict() ;

export const DailyStatsDeleteManyArgsSchema: z.ZodType<Prisma.DailyStatsDeleteManyArgs> = z.object({
  where: DailyStatsWhereInputSchema.optional(),
}).strict() ;

export const PageViewSourceCreateArgsSchema: z.ZodType<Prisma.PageViewSourceCreateArgs> = z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  data: z.union([ PageViewSourceCreateInputSchema,PageViewSourceUncheckedCreateInputSchema ]),
}).strict() ;

export const PageViewSourceUpsertArgsSchema: z.ZodType<Prisma.PageViewSourceUpsertArgs> = z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  where: PageViewSourceWhereUniqueInputSchema,
  create: z.union([ PageViewSourceCreateInputSchema,PageViewSourceUncheckedCreateInputSchema ]),
  update: z.union([ PageViewSourceUpdateInputSchema,PageViewSourceUncheckedUpdateInputSchema ]),
}).strict() ;

export const PageViewSourceCreateManyArgsSchema: z.ZodType<Prisma.PageViewSourceCreateManyArgs> = z.object({
  data: z.union([ PageViewSourceCreateManyInputSchema,PageViewSourceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PageViewSourceCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PageViewSourceCreateManyAndReturnArgs> = z.object({
  data: z.union([ PageViewSourceCreateManyInputSchema,PageViewSourceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PageViewSourceDeleteArgsSchema: z.ZodType<Prisma.PageViewSourceDeleteArgs> = z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  where: PageViewSourceWhereUniqueInputSchema,
}).strict() ;

export const PageViewSourceUpdateArgsSchema: z.ZodType<Prisma.PageViewSourceUpdateArgs> = z.object({
  select: PageViewSourceSelectSchema.optional(),
  include: PageViewSourceIncludeSchema.optional(),
  data: z.union([ PageViewSourceUpdateInputSchema,PageViewSourceUncheckedUpdateInputSchema ]),
  where: PageViewSourceWhereUniqueInputSchema,
}).strict() ;

export const PageViewSourceUpdateManyArgsSchema: z.ZodType<Prisma.PageViewSourceUpdateManyArgs> = z.object({
  data: z.union([ PageViewSourceUpdateManyMutationInputSchema,PageViewSourceUncheckedUpdateManyInputSchema ]),
  where: PageViewSourceWhereInputSchema.optional(),
}).strict() ;

export const PageViewSourceDeleteManyArgsSchema: z.ZodType<Prisma.PageViewSourceDeleteManyArgs> = z.object({
  where: PageViewSourceWhereInputSchema.optional(),
}).strict() ;

export const LogsCreateArgsSchema: z.ZodType<Prisma.LogsCreateArgs> = z.object({
  select: LogsSelectSchema.optional(),
  data: z.union([ LogsCreateInputSchema,LogsUncheckedCreateInputSchema ]),
}).strict() ;

export const LogsUpsertArgsSchema: z.ZodType<Prisma.LogsUpsertArgs> = z.object({
  select: LogsSelectSchema.optional(),
  where: LogsWhereUniqueInputSchema,
  create: z.union([ LogsCreateInputSchema,LogsUncheckedCreateInputSchema ]),
  update: z.union([ LogsUpdateInputSchema,LogsUncheckedUpdateInputSchema ]),
}).strict() ;

export const LogsCreateManyArgsSchema: z.ZodType<Prisma.LogsCreateManyArgs> = z.object({
  data: z.union([ LogsCreateManyInputSchema,LogsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LogsCreateManyAndReturnArgsSchema: z.ZodType<Prisma.LogsCreateManyAndReturnArgs> = z.object({
  data: z.union([ LogsCreateManyInputSchema,LogsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const LogsDeleteArgsSchema: z.ZodType<Prisma.LogsDeleteArgs> = z.object({
  select: LogsSelectSchema.optional(),
  where: LogsWhereUniqueInputSchema,
}).strict() ;

export const LogsUpdateArgsSchema: z.ZodType<Prisma.LogsUpdateArgs> = z.object({
  select: LogsSelectSchema.optional(),
  data: z.union([ LogsUpdateInputSchema,LogsUncheckedUpdateInputSchema ]),
  where: LogsWhereUniqueInputSchema,
}).strict() ;

export const LogsUpdateManyArgsSchema: z.ZodType<Prisma.LogsUpdateManyArgs> = z.object({
  data: z.union([ LogsUpdateManyMutationInputSchema,LogsUncheckedUpdateManyInputSchema ]),
  where: LogsWhereInputSchema.optional(),
}).strict() ;

export const LogsDeleteManyArgsSchema: z.ZodType<Prisma.LogsDeleteManyArgs> = z.object({
  where: LogsWhereInputSchema.optional(),
}).strict() ;

export const ContactFormMessageCreateArgsSchema: z.ZodType<Prisma.ContactFormMessageCreateArgs> = z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  data: z.union([ ContactFormMessageCreateInputSchema,ContactFormMessageUncheckedCreateInputSchema ]),
}).strict() ;

export const ContactFormMessageUpsertArgsSchema: z.ZodType<Prisma.ContactFormMessageUpsertArgs> = z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  where: ContactFormMessageWhereUniqueInputSchema,
  create: z.union([ ContactFormMessageCreateInputSchema,ContactFormMessageUncheckedCreateInputSchema ]),
  update: z.union([ ContactFormMessageUpdateInputSchema,ContactFormMessageUncheckedUpdateInputSchema ]),
}).strict() ;

export const ContactFormMessageCreateManyArgsSchema: z.ZodType<Prisma.ContactFormMessageCreateManyArgs> = z.object({
  data: z.union([ ContactFormMessageCreateManyInputSchema,ContactFormMessageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContactFormMessageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ContactFormMessageCreateManyAndReturnArgs> = z.object({
  data: z.union([ ContactFormMessageCreateManyInputSchema,ContactFormMessageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ContactFormMessageDeleteArgsSchema: z.ZodType<Prisma.ContactFormMessageDeleteArgs> = z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  where: ContactFormMessageWhereUniqueInputSchema,
}).strict() ;

export const ContactFormMessageUpdateArgsSchema: z.ZodType<Prisma.ContactFormMessageUpdateArgs> = z.object({
  select: ContactFormMessageSelectSchema.optional(),
  include: ContactFormMessageIncludeSchema.optional(),
  data: z.union([ ContactFormMessageUpdateInputSchema,ContactFormMessageUncheckedUpdateInputSchema ]),
  where: ContactFormMessageWhereUniqueInputSchema,
}).strict() ;

export const ContactFormMessageUpdateManyArgsSchema: z.ZodType<Prisma.ContactFormMessageUpdateManyArgs> = z.object({
  data: z.union([ ContactFormMessageUpdateManyMutationInputSchema,ContactFormMessageUncheckedUpdateManyInputSchema ]),
  where: ContactFormMessageWhereInputSchema.optional(),
}).strict() ;

export const ContactFormMessageDeleteManyArgsSchema: z.ZodType<Prisma.ContactFormMessageDeleteManyArgs> = z.object({
  where: ContactFormMessageWhereInputSchema.optional(),
}).strict() ;

export const ElaboratedRecipeCreateArgsSchema: z.ZodType<Prisma.ElaboratedRecipeCreateArgs> = z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  data: z.union([ ElaboratedRecipeCreateInputSchema,ElaboratedRecipeUncheckedCreateInputSchema ]),
}).strict() ;

export const ElaboratedRecipeUpsertArgsSchema: z.ZodType<Prisma.ElaboratedRecipeUpsertArgs> = z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  where: ElaboratedRecipeWhereUniqueInputSchema,
  create: z.union([ ElaboratedRecipeCreateInputSchema,ElaboratedRecipeUncheckedCreateInputSchema ]),
  update: z.union([ ElaboratedRecipeUpdateInputSchema,ElaboratedRecipeUncheckedUpdateInputSchema ]),
}).strict() ;

export const ElaboratedRecipeCreateManyArgsSchema: z.ZodType<Prisma.ElaboratedRecipeCreateManyArgs> = z.object({
  data: z.union([ ElaboratedRecipeCreateManyInputSchema,ElaboratedRecipeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ElaboratedRecipeCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ElaboratedRecipeCreateManyAndReturnArgs> = z.object({
  data: z.union([ ElaboratedRecipeCreateManyInputSchema,ElaboratedRecipeCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ElaboratedRecipeDeleteArgsSchema: z.ZodType<Prisma.ElaboratedRecipeDeleteArgs> = z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  where: ElaboratedRecipeWhereUniqueInputSchema,
}).strict() ;

export const ElaboratedRecipeUpdateArgsSchema: z.ZodType<Prisma.ElaboratedRecipeUpdateArgs> = z.object({
  select: ElaboratedRecipeSelectSchema.optional(),
  include: ElaboratedRecipeIncludeSchema.optional(),
  data: z.union([ ElaboratedRecipeUpdateInputSchema,ElaboratedRecipeUncheckedUpdateInputSchema ]),
  where: ElaboratedRecipeWhereUniqueInputSchema,
}).strict() ;

export const ElaboratedRecipeUpdateManyArgsSchema: z.ZodType<Prisma.ElaboratedRecipeUpdateManyArgs> = z.object({
  data: z.union([ ElaboratedRecipeUpdateManyMutationInputSchema,ElaboratedRecipeUncheckedUpdateManyInputSchema ]),
  where: ElaboratedRecipeWhereInputSchema.optional(),
}).strict() ;

export const ElaboratedRecipeDeleteManyArgsSchema: z.ZodType<Prisma.ElaboratedRecipeDeleteManyArgs> = z.object({
  where: ElaboratedRecipeWhereInputSchema.optional(),
}).strict() ;