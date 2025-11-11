import { feature, product, featureItem, priceItem } from "atmn";

/**
 * AI Credits - Unified currency for all AI operations
 * Use for: Study set generation, AI chat, anything AI-powered
 */
export const aiCredits = feature({
	id: "ai_credits",
	type: "single_use", // consumed with each use
	name: "AI Credits",
});

/**
 * Study Sets Storage - How many study sets can be saved
 */
export const studySets = feature({
	id: "study_sets",
	type: "continuous_use", // allocated storage
	name: "Study Sets",
});

// ============================================================================
// PRODUCTS - Define pricing tiers
// ============================================================================

/**
 * FREE TIER
 * Try the platform with 30 credits
 */
export const freeTier = product({
	id: "free",
	name: "Free",
	is_default: true,
	is_add_on: false,
	items: [
		// 30 AI credits per month
		// Can be used for 6 study sets OR 30 chats OR mix
		featureItem({
			feature_id: aiCredits.id,
			included_usage: 30,
			interval: "month",
		}),
		// Store up to 10 study sets
		featureItem({
			feature_id: studySets.id,
			included_usage: 10,
			interval: "month",
		}),
	],
});

/**
 * STUDENT PLAN - Monthly
 * 200 credits for active learners
 */
export const studentPlan = product({
	id: "student",
	name: "Student",
	is_default: false,
	is_add_on: false,
	items: [
		priceItem({
			price: 9.99,
			interval: "month",
		}),

		// 200 AI credits per month
		// ~40 study sets OR 200 chats OR any mix
		featureItem({
			feature_id: aiCredits.id,
			included_usage: 200,
			interval: "month",
		}),

		featureItem({
			feature_id: studySets.id,
			included_usage: "inf",
			interval: "month",
		}),
	],
});

/**
 * PREMIUM PLAN - Monthly
 * Unlimited everything
 */
export const premiumPlan = product({
	id: "premium",
	name: "Premium",
	is_default: false,
	is_add_on: false,
	items: [
		priceItem({
			price: 19.99,
			interval: "month",
		}),
		// UNLIMITED AI credits
		featureItem({
			feature_id: aiCredits.id,
			included_usage: "inf",
			interval: "month",
		}),
		// Unlimited storage
		featureItem({
			feature_id: studySets.id,
			included_usage: "inf",
			interval: "month",
		}),
	],
});

/**
 * CREDIT TOP-UP
 * One-time purchase for extra credits (never expire)
 */
export const creditTopUp50 = product({
	id: "credit-topup-50",
	name: "50 AI Credits",
	is_default: false,
	is_add_on: true,
	items: [
		priceItem({
			price: 4.99,
		}),

		featureItem({
			feature_id: aiCredits.id,
			included_usage: 50,
		}),
	],
});

/**
 * BIGGER CREDIT TOP-UP
 * Better value for heavy users
 */
export const creditTopUp100 = product({
	id: "credit-topup-100",
	name: "100 AI Credits",
	is_default: false,
	is_add_on: true,
	items: [
		priceItem({
			price: 9.99,
		}),
		featureItem({
			feature_id: aiCredits.id,
			included_usage: 100,
		}),
	],
});

// Export config
export default {
	features: [aiCredits, studySets],
	products: [freeTier, studentPlan, premiumPlan, creditTopUp50, creditTopUp100],
};
