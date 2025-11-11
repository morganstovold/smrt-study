import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	// ============================================================================
	// MATERIALS - Raw uploaded content
	// Note: R2 component manages file storage metadata internally
	// We just store reference to R2 keys here
	// ============================================================================
	materials: defineTable({
		userId: v.id("users"),

		// Material metadata
		title: v.string(),
		description: v.optional(v.string()),

		// Source info
		sourceType: v.string(), // "pdf" | "url" | "text"
		r2Key: v.optional(v.string()), // Key from R2 component
		sourceUrl: v.optional(v.string()), // For URLs or R2 public URL

		// Extracted content (from Firecrawl)
		contentMarkdown: v.string(),
		contentPreview: v.string(), // First 500 chars
		wordCount: v.number(),

		// Processing status
		status: v.string(), // "processing" | "ready" | "error"
		errorMessage: v.optional(v.string()),

		// File info
		fileSize: v.optional(v.number()),
		fileName: v.optional(v.string()),
		mimeType: v.optional(v.string()),

		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_user_status", ["userId", "status"])
		.index("by_user_date", ["userId", "createdAt"])
		.searchIndex("search_title", {
			searchField: "title",
			filterFields: ["userId", "status"],
		}),

	// ============================================================================
	// STUDY SETS - AI-generated study materials (IMMUTABLE)
	// ============================================================================
	studySets: defineTable({
		userId: v.id("users"),
		materialId: v.id("materials"),

		// Study set metadata
		title: v.string(),
		description: v.optional(v.string()),

		// AI-generated content (created once, never modified)
		summary: v.string(),

		// Multiple choice questions
		mcqs: v.array(
			v.object({
				id: v.string(),
				question: v.string(),
				options: v.array(v.string()),
				correctIndex: v.number(),
				explanation: v.string(),
				difficulty: v.optional(v.string()),
			}),
		),

		// Flashcards
		flashcards: v.array(
			v.object({
				id: v.string(),
				front: v.string(),
				back: v.string(),
			}),
		),

		// Generation metadata
		modelUsed: v.string(),
		creditsUsed: v.number(),

		// Cache key for Action Cache component
		cacheKey: v.optional(v.string()),

		// Stats
		timesStudied: v.number(),
		lastStudiedAt: v.optional(v.number()),

		createdAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_material", ["materialId"])
		.index("by_user_date", ["userId", "createdAt"])
		.searchIndex("search_title", {
			searchField: "title",
			filterFields: ["userId"],
		}),

	// ============================================================================
	// STUDY SESSIONS - User progress
	// ============================================================================
	studySessions: defineTable({
		userId: v.id("users"),
		studySetId: v.id("studySets"),

		sessionType: v.string(), // "quiz" | "flashcards"

		// Quiz results
		quizAnswers: v.optional(
			v.array(
				v.object({
					questionId: v.string(),
					selectedIndex: v.number(),
					wasCorrect: v.boolean(),
					timeSpentSeconds: v.number(),
				}),
			),
		),
		quizScore: v.optional(v.number()),

		// Flashcard progress
		flashcardsReviewed: v.optional(
			v.array(
				v.object({
					flashcardId: v.string(),
					difficulty: v.string(), // "easy" | "medium" | "hard"
				}),
			),
		),

		durationSeconds: v.number(),
		completedAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_study_set", ["studySetId"])
		.index("by_user_date", ["userId", "completedAt"]),

	// ============================================================================
	// AI CHAT MESSAGES
	// ============================================================================
	chatMessages: defineTable({
		userId: v.id("users"),
		studySetId: v.id("studySets"),

		role: v.string(), // "user" | "assistant"
		content: v.string(),

		creditsUsed: v.optional(v.number()),

		timestamp: v.number(),
	})
		.index("by_study_set", ["studySetId"])
		.index("by_user_study_set", ["userId", "studySetId"]),

	// ============================================================================
	// USER STATS - Aggregated statistics for /overview
	// ============================================================================
	userStats: defineTable({
		userId: v.id("users"),

		totalMaterialsUploaded: v.number(),
		totalStudySetsCreated: v.number(),
		totalStudySessions: v.number(),
		totalQuestionsAnswered: v.number(),
		totalCorrectAnswers: v.number(),
		totalStudyTimeSeconds: v.number(),

		currentStreak: v.number(),
		longestStreak: v.number(),
		lastStudyDate: v.optional(v.number()),

		updatedAt: v.number(),
	}).index("by_user", ["userId"]),
});
