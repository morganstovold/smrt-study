import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	studySets: defineTable({
		title: v.string(),
		description: v.optional(v.string()),
		subject: v.string(),
		difficulty: v.union(
			v.literal("beginner"),
			v.literal("intermediate"),
			v.literal("advanced"),
		),

		sources: v.array(
			v.object({
				id: v.string(), // unique source identifier
				type: v.union(
					v.literal("file"),
					v.literal("url"),
					v.literal("text"),
					v.literal("audio"),
				),
				content: v.string(), // extracted text content
				originalName: v.optional(v.string()), // for files
				fileId: v.optional(v.id("_storage")), // Convex storage ID
				metadata: v.object({
					wordCount: v.number(),
					processingTime: v.number(), // milliseconds
					contentHash: v.string(), // for deduplication
				}),
			}),
		),

		questions: v.array(
			v.object({
				id: v.string(),
				type: v.union(
					v.literal("flashcard"),
					v.literal("multiple_choice"),
					v.literal("short_answer"),
					v.literal("matching"),
					v.literal("fill_in_blank"),
				),
				difficulty: v.union(
					v.literal("beginner"),
					v.literal("intermediate"),
					v.literal("advanced"),
				),
				question: v.string(),
				answer: v.any(), // varies by question type
				options: v.optional(v.array(v.string())), // for multiple choice
				explanation: v.optional(v.string()),
				tags: v.array(v.string()),
				sourceIds: v.array(v.string()), // which sources this question came from
				qualityScore: v.number(), // 0-1, AI-generated quality assessment
			}),
		),

		analytics: v.object({
			totalQuestions: v.number(),
			averageDifficulty: v.number(),
			completionRate: v.number(), // average across all users
			averageScore: v.number(),
			timesStudied: v.number(),
		}),

		createdBy: v.string(),
		isPublic: v.boolean(),
		isTemplate: v.boolean(), // featured/template study sets
		collaborators: v.array(
			v.object({
				userId: v.string(),
				role: v.union(v.literal("viewer"), v.literal("editor")),
			}),
		),

		status: v.union(
			v.literal("draft"),
			v.literal("processing"),
			v.literal("ready"),
			v.literal("error"),
		),

		processingStatus: v.optional(
			v.object({
				stage: v.string(), // "extracting", "generating_questions", "optimizing"
				progress: v.number(), // 0-100
				errorMessage: v.optional(v.string()),
			}),
		),

		// Metadata
		createdAt: v.number(),
		updatedAt: v.number(),
	})
		.index("by_creator", ["createdBy"])
		.index("by_public", ["isPublic"])
		.index("by_subject", ["subject"])
		.index("by_status", ["status"])
		.index("by_template", ["isTemplate"])
		.index("by_created_at", ["createdAt"]),

	studySessions: defineTable({
		userId: v.string(),
		studySetId: v.id("studySets"),

		// Session configuration
		sessionType: v.union(
			v.literal("practice"),
			v.literal("quiz"),
			v.literal("review"),
		),
		questionTypes: v.array(v.string()), // subset of question types to focus on
		targetQuestions: v.number(),
		timeLimit: v.optional(v.number()), // minutes, null for untimed

		// Session state
		status: v.union(
			v.literal("active"),
			v.literal("paused"),
			v.literal("completed"),
			v.literal("abandoned"),
		),
		currentQuestionIndex: v.number(),
		questionsAsked: v.array(
			v.object({
				questionId: v.string(),
				userAnswer: v.any(),
				correctAnswer: v.any(),
				isCorrect: v.boolean(),
				timeSpent: v.number(), // seconds
				difficulty: v.string(),
				timestamp: v.number(),
			}),
		),

		// Performance tracking
		totalScore: v.number(), // percentage
		progress: v.number(), // 0-1
		timeSpent: v.number(), // total seconds
		hintsUsed: v.number(),

		// Spaced repetition data (local app logic)
		reviewSchedule: v.array(
			v.object({
				questionId: v.string(),
				interval: v.number(), // days
				easeFactor: v.number(),
				repetitions: v.number(),
				nextReview: v.number(), // timestamp
				lastReviewed: v.number(),
			}),
		),

		// Metadata
		startedAt: v.number(),
		completedAt: v.optional(v.number()),
		lastActiveAt: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_study_set", ["studySetId"])
		.index("by_user_and_set", ["userId", "studySetId"])
		.index("by_status", ["status"])
		.index("by_last_active", ["lastActiveAt"]),

	analyticsEvents: defineTable({
		userId: v.optional(v.string()),
		eventType: v.string(), // "study_session_completed", "question_answered", "streak_achieved"
		eventData: v.any(),
		sessionId: v.optional(v.string()),
		studySetId: v.optional(v.id("studySets")),
		timestamp: v.number(),
	})
		.index("by_user", ["userId"])
		.index("by_event_type", ["eventType"])
		.index("by_timestamp", ["timestamp"]),
});
