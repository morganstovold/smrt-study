---
trigger: glob
description: Guidelines and best practices for building Convex projects, including database schema design, queries, mutations, and real-world examples
globs: **/*.ts,**/*.tsx,**/*.js,**/*.jsx
---

# Convex Rules for SmrtStudy

<function_syntax>

- ALWAYS use new function syntax with args/returns validators
- Use `query`, `mutation`, `action` for public APIs
- Use `internalQuery`, `internalMutation`, `internalAction` for private functions
- Include `returns: v.null()` for functions that don't return anything

```typescript
export const createStudySet = mutation({
  args: {
    title: v.string(),
    sources: v.array(v.object({
      type: v.union(v.literal("file"), v.literal("url"), v.literal("text")),
      content: v.string()
    }))
  },
  returns: v.id("studySets"),
  handler: async (ctx, args) => { ... },
});
```

</function_syntax>

<validators>
- `v.string()` - strings
- `v.number()` - numbers (Float64) 
- `v.int64()` - BigInt (NOT `v.bigint()`)
- `v.boolean()` - booleans
- `v.null()` - null values (NOT undefined)
- `v.id("tableName")` - document IDs
- `v.array(type)` - arrays (max 8192 items)
- `v.object({ key: type })` - objects (max 1024 entries)
- `v.record(keyType, valueType)` - dynamic key objects
- `v.union(type1, type2)` - union types for question types, study methods
- `v.optional(type)` - optional fields
- `v.literal("value")` - literal values for enum-like types
- `v.bytes()` - ArrayBuffer for file processing
</validators>

<smrtstudy_schema_patterns>

- Use proper ID typing: `v.id("users")`, `v.id("studySets")`
- Enum-like types with unions: `v.union(v.literal("flashcard"), v.literal("multiple_choice"))`
- Nested objects for complex data: `v.object({ preferences: v.object({...}) })`
- Arrays for collections: `v.array(v.object({ questionId: v.id("questions") }))`
- Optional fields for extensibility: `v.optional(v.string())`

```typescript
// Good schema design for SmrtStudy
studySets: defineTable({
  title: v.string(),
  description: v.optional(v.string()),
  subject: v.string(),
  difficulty: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
  createdBy: v.id("users"),
  isPublic: v.boolean(),
  sources: v.array(v.object({
    type: v.union(v.literal("file"), v.literal("url"), v.literal("text")),
    content: v.string(),
    metadata: v.object({
      title: v.string(),
      wordCount: v.number(),
      processingCost: v.number()
    })
  })),
  analytics: v.object({
    totalQuestions: v.number(),
    averageDifficulty: v.number(),
    completionRate: v.number()
  })
}).index("by_creator", ["createdBy"])
  .index("by_public", ["isPublic"])
  .index("by_subject", ["subject"]),
```

</smrtstudy_schema_patterns>

<database_operations>

- NO `.filter()` in queries - use indexes with `withIndex()`
- Use `ctx.db.get(id)` for single documents
- Use `.unique()` for single query results that should exist
- Use `.order("desc")` for newest first (creation time)
- Use `.take(n)` to limit results for performance
- NO `.delete()` on queries - collect and iterate instead

```typescript
// Good - using indexes for SmrtStudy queries
await ctx.db
  .query("studySets")
  .withIndex("by_creator", (q) => q.eq("createdBy", userId))
  .order("desc")
  .take(10);

// Good - efficient user study sessions
await ctx.db
  .query("studySessions")
  .withIndex("by_user_and_set", (q) =>
    q.eq("userId", userId).eq("studySetId", studySetId),
  )
  .order("desc")
  .first();

// Bad - don't use filter
await ctx.db
  .query("questions")
  .filter((q) => q.eq(q.field("difficulty"), "hard"));
```

</database_operations>

<ai_integration_patterns>

- Store AI clients outside handlers for reuse
- Use actions for external AI calls (OpenAI, Firecrawl)
- Track costs for all AI operations
- Implement caching to avoid regeneration
- Handle API errors gracefully with fallbacks

```typescript
"use node";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateQuestions = action({
  args: {
    content: v.string(),
    questionTypes: v.array(v.string()),
    difficulty: v.string(),
  },
  returns: v.object({
    questions: v.array(v.any()),
    cost: v.number(),
    tokensUsed: v.number(),
  }),
  handler: async (ctx, args) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: generateQuestionPrompt(
              args.questionTypes,
              args.difficulty,
            ),
          },
          {
            role: "user",
            content: args.content,
          },
        ],
      });

      // Track usage and costs
      await ctx.runMutation(internal.usage.trackAIUsage, {
        userId: ctx.auth.getUserIdentity()?.subject,
        operation: "question_generation",
        tokensUsed: response.usage?.total_tokens || 0,
        cost: calculateCost(response.usage?.total_tokens || 0),
      });

      return {
        questions: JSON.parse(response.choices[0].message.content),
        cost: calculateCost(response.usage?.total_tokens || 0),
        tokensUsed: response.usage?.total_tokens || 0,
      };
    } catch (error) {
      console.error("AI generation failed:", error);
      // Return cached or fallback content
      return await ctx.runQuery(internal.fallbacks.getCachedQuestions, {
        contentHash: hashContent(args.content),
      });
    }
  },
});
```

</ai_integration_patterns>

<billing_integration>

- Use Autumn component for subscription management
- Track usage for all billable operations
- Implement usage limits enforcement
- Handle subscription state changes

```typescript
import { components } from "./_generated/api";

export const checkUsageLimit = query({
  args: { userId: v.id("users"), operation: v.string() },
  returns: v.object({
    allowed: v.boolean(),
    remaining: v.number(),
    upgradeRequired: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    const usage = await getCurrentUsage(ctx, args.userId);
    const limits = getPlanLimits(user.subscription);

    const operationCount = usage[args.operation] || 0;
    const limit = limits[args.operation];

    return {
      allowed: limit === -1 || operationCount < limit,
      remaining: limit === -1 ? -1 : Math.max(0, limit - operationCount),
      upgradeRequired: limit !== -1 && operationCount >= limit,
    };
  },
});

export const incrementUsage = mutation({
  args: {
    userId: v.id("users"),
    operation: v.string(),
    amount: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    const amount = args.amount || 1;

    // Check if operation is allowed
    const limitCheck = await ctx.runQuery(internal.billing.checkUsageLimit, {
      userId: args.userId,
      operation: args.operation,
    });

    if (!limitCheck.allowed) {
      throw new ConvexError(`Usage limit exceeded for ${args.operation}`);
    }

    // Update usage counters
    await ctx.db.patch(args.userId, {
      [`usage.${args.operation}`]: (user.usage[args.operation] || 0) + amount,
    });

    return null;
  },
});
```

</billing_integration>

<learning_analytics>

- Track detailed performance metrics
- Implement spaced repetition algorithms
- Calculate learning velocity and retention
- Store progression data efficiently

```typescript
export const updateQuestionPerformance = mutation({
  args: {
    questionId: v.id("questions"),
    userId: v.id("users"),
    isCorrect: v.boolean(),
    responseTime: v.number(),
    difficulty: v.string(),
  },
  returns: v.object({
    nextReview: v.number(),
    difficultyAdjustment: v.string(),
  }),
  handler: async (ctx, args) => {
    // Get or create review schedule
    let review = await ctx.db
      .query("reviewSchedule")
      .withIndex("by_user_and_question", (q) =>
        q.eq("userId", args.userId).eq("questionId", args.questionId),
      )
      .unique();

    if (!review) {
      review = await ctx.db.insert("reviewSchedule", {
        userId: args.userId,
        questionId: args.questionId,
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReview: Date.now(),
      });
    }

    // Calculate new interval using spaced repetition
    const newSchedule = calculateSpacedRepetition(
      review,
      args.isCorrect,
      args.responseTime,
    );

    // Update review schedule
    await ctx.db.patch(review._id, newSchedule);

    // Track performance metrics
    await ctx.runMutation(internal.analytics.recordPerformance, {
      userId: args.userId,
      questionId: args.questionId,
      isCorrect: args.isCorrect,
      responseTime: args.responseTime,
      difficulty: args.difficulty,
    });

    return {
      nextReview: newSchedule.nextReview,
      difficultyAdjustment: newSchedule.suggestedDifficulty,
    };
  },
});
```

</learning_analytics>

<file_processing>

- Use Cloudflare R2 for large files via actions
- Store file metadata in Convex
- Process files with external services
- Track processing costs

```typescript
export const processUploadedFile = action({
  args: {
    fileId: v.id("_storage"),
    userId: v.id("users"),
    studySetId: v.id("studySets"),
  },
  returns: v.object({
    extractedText: v.string(),
    wordCount: v.number(),
    processingCost: v.number(),
  }),
  handler: async (ctx, args) => {
    // Get file from Convex storage
    const fileUrl = await ctx.storage.getUrl(args.fileId);
    const fileBlob = await fetch(fileUrl).then((r) => r.blob());

    // Extract text based on file type
    let extractedText = "";
    let processingCost = 0;

    if (fileBlob.type === "application/pdf") {
      extractedText = await extractPDFText(fileBlob);
      processingCost = calculateFileProcessingCost(fileBlob.size);
    }

    // Store extracted content in study set
    await ctx.runMutation(internal.study.addContentToSet, {
      studySetId: args.studySetId,
      content: extractedText,
      source: {
        type: "file",
        fileId: args.fileId,
        metadata: {
          size: fileBlob.size,
          type: fileBlob.type,
          processingCost,
        },
      },
    });

    return {
      extractedText,
      wordCount: extractedText.split(" ").length,
      processingCost,
    };
  },
});
```

</file_processing>

<real_time_study_sessions>

- Use Convex real-time for live study sessions
- Update progress incrementally
- Handle session state management
- Sync across devices

```typescript
export const updateStudySession = mutation({
  args: {
    sessionId: v.id("studySessions"),
    questionResponse: v.object({
      questionId: v.id("questions"),
      userAnswer: v.string(),
      isCorrect: v.boolean(),
      timeSpent: v.number()
    })
  },
  returns: v.object({
    sessionProgress: v.number(),
    nextQuestion: v.optional(v.any()),
    sessionComplete: v.boolean()
  }),
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);

    // Add response to session
    const updatedResponses = [
      ...session.questionsAsked,
      args.questionResponse
    ];

    // Calculate new score and progress
    const correctAnswers = updatedResponses.filter(r => r.isCorrect).length;
    const totalScore = (correctAnswers / updatedResponses.length) * 100;
    const progress = updatedResponses.length / session.targetQuestions;

    // Update session
    await ctx.db.patch(args.sessionId, {
      questionsAsked: updatedResponses,
      totalScore,
      progress
    });

    // Update user performance analytics
    await ctx.runMutation(internal.analytics.updatePerformance, {
      userId: session.userId,
      questionResponse: args.questionResponse
    });

    // Get next question if session not complete
    const sessionComplete = progress >= 1.0;
    let nextQuestion = null;

    if (!sessionComplete) {
      nextQuestion = await ctx.runQuery(inter
```
