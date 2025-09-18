import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { autumn } from "./autumn";

/**
 * Check if user has access to a specific feature
 * This is the main function you'll use throughout your app
 */
export const checkFeatureAccess = query({
  args: {
    featureId: v.string(), // "ai_questions", "file_uploads", "web_scraping", etc.
  },
  returns: v.object({
    allowed: v.boolean(),
    reason: v.optional(v.string()),
    upgradeRequired: v.boolean(),
  }),
  handler: async (ctx, args) => {
    try {
      const { data, error } = await autumn.check(ctx, {
        featureId: args.featureId,
      });

      if (error || !data) {
        return {
          allowed: false,
          reason: "Unable to check feature access",
          upgradeRequired: false,
        };
      }

      return {
        allowed: data.allowed,
        reason: data.allowed
          ? undefined
          : `${args.featureId} not available on your current plan`,
        upgradeRequired: !data.allowed, // Autumn handles the upgrade logic
      };
    } catch (error) {
      console.error("Feature access check error:", error);
      return {
        allowed: false,
        reason: "Error checking feature access",
        upgradeRequired: false,
      };
    }
  },
});

/**
 * Track usage of a feature
 * Call this after the user successfully uses a feature
 */
export const trackFeatureUsage = mutation({
  args: {
    featureId: v.string(),
    value: v.optional(v.number()), // defaults to 1
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    try {
      await autumn.track(ctx, {
        featureId: args.featureId,
        value: args.value || 1,
      });
    } catch (error) {
      console.error("Usage tracking error:", error);
      // Don't throw - usage tracking shouldn't block functionality
    }
    return null;
  },
});

/**
 * Create checkout session for subscription
 */
export const createCheckoutSession = mutation({
  args: {
    productId: v.string(),
    returnUrl: v.optional(v.string()),
  },
  returns: v.object({
    url: v.optional(v.string()),
    message: v.optional(v.string()),
    success: v.boolean(),
  }),
  handler: async (ctx, args) => {
    try {
      const { data, error } = await autumn.checkout(ctx, {
        productId: args.productId,
        successUrl: args.returnUrl,
      });

      if (error || !data) {
        return {
          success: false,
          message: "Failed to create checkout session",
        };
      }

      return {
        success: true,
        url: data.url,
        message: data.url ? undefined : "Plan updated successfully",
      };
    } catch (error) {
      console.error("Checkout error:", error);
      return {
        success: false,
        message: "An error occurred during checkout",
      };
    }
  },
});

/**
 * Open billing portal for subscription management
 */
export const openBillingPortal = mutation({
  args: {
    returnUrl: v.optional(v.string()),
  },
  returns: v.object({
    url: v.optional(v.string()),
    success: v.boolean(),
    message: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const { data, error } = await autumn.customers.billingPortal(ctx, {
        returnUrl: args.returnUrl || `${process.env.SITE_URL}/billing`,
      });

      if (error || !data) {
        return {
          success: false,
          message: "Failed to open billing portal",
        };
      }

      return {
        success: true,
        url: data.url,
      };
    } catch (error) {
      console.error("Billing portal error:", error);
      return {
        success: false,
        message: "Failed to open billing portal",
      };
    }
  },
});