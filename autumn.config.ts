import { feature, featureItem, priceItem, product } from "atmn";

// Features

export const aiQuestions = feature({
	id: "ai_questions",
	name: "AI Question Generation",
	type: "single_use", // Each question generated uses 1 from limit
});

export const studySets = feature({
	id: "study_sets",
	name: "Study Sets",
	type: "single_use", // Each study set created uses 1
});

export const fileUploads = feature({
	id: "file_uploads",
	name: "File Processing",
	type: "single_use", // Each file uploaded uses 1
});

export const webScraping = feature({
	id: "web_scraping",
	name: "Web Content Import",
	type: "single_use", // Each URL scraped uses 1
});

// Split study modes into separate features
export const practiceMode = feature({
	id: "practice_mode",
	name: "Practice Mode",
	type: "single_use", // Each practice session
});

export const quizMode = feature({
	id: "quiz_mode",
	name: "Timed Quiz Mode",
	type: "single_use", // Each quiz taken
});

export const reviewMode = feature({
	id: "review_mode",
	name: "Spaced Repetition Review",
	type: "single_use", // Each review session
});

// Products

export const starter = product({
	id: "starter",
	name: "Starter",
	items: [
		// Basic AI questions
		featureItem({
			feature_id: aiQuestions.id,
			included_usage: 25,
			interval: "month",
		}),
		// Limited study sets
		featureItem({
			feature_id: studySets.id,
			included_usage: 2,
		}),
		// Basic file uploads
		featureItem({
			feature_id: fileUploads.id,
			included_usage: 3,
			interval: "month",
		}),
		// Limited practice sessions
		featureItem({
			feature_id: practiceMode.id,
			included_usage: 10, // 10 practice sessions per month
			interval: "month",
		}),
	],
});

export const pro = product({
	id: "pro",
	name: "Pro",
	items: [
		// Monthly price
		priceItem({
			price: 14.99,
			interval: "month",
		}),
		// More AI questions
		featureItem({
			feature_id: aiQuestions.id,
			included_usage: 200,
			interval: "month",
		}),
		// More study sets
		featureItem({
			feature_id: studySets.id,
			included_usage: 15,
		}),
		// More file uploads
		featureItem({
			feature_id: fileUploads.id,
			included_usage: 25,
			interval: "month",
		}),
		// Web scraping included
		featureItem({
			feature_id: webScraping.id,
			included_usage: 10,
			interval: "month",
		}),
		// More practice sessions
		featureItem({
			feature_id: practiceMode.id,
			included_usage: 50,
			interval: "month",
		}),
		// Quiz mode included
		featureItem({
			feature_id: quizMode.id,
			included_usage: 20, // 20 quizzes per month
			interval: "month",
		}),
		// Review mode included
		featureItem({
			feature_id: reviewMode.id,
			included_usage: 30, // 30 review sessions per month
			interval: "month",
		}),
	],
});

export const premium = product({
	id: "premium",
	name: "Premium",
	items: [
		// Monthly price
		priceItem({
			price: 24.99,
			interval: "month",
		}),
		// Lots of AI questions
		featureItem({
			feature_id: aiQuestions.id,
			included_usage: 750,
			interval: "month",
		}),
		// Unlimited study sets
		featureItem({
			feature_id: studySets.id,
			included_usage: -1,
		}),
		// Lots of file uploads
		featureItem({
			feature_id: fileUploads.id,
			included_usage: 100,
			interval: "month",
		}),
		// More web scraping
		featureItem({
			feature_id: webScraping.id,
			included_usage: 50,
			interval: "month",
		}),
		// High practice limit
		featureItem({
			feature_id: practiceMode.id,
			included_usage: 200, // High but not unlimited
			interval: "month",
		}),
		// High quiz limit
		featureItem({
			feature_id: quizMode.id,
			included_usage: 100, // 100 quizzes per month
			interval: "month",
		}),
		// High review limit
		featureItem({
			feature_id: reviewMode.id,
			included_usage: 150, // 150 review sessions per month
			interval: "month",
		}),
	],
});
