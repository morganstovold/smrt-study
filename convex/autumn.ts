import { components } from "./_generated/api";
import { Autumn } from "@useautumn/convex";
import { MutationCtx } from "./_generated/server";

export const autumn = new Autumn(components.autumn, {
  secretKey: process.env.AUTUMN_SECRET_KEY ?? "",
  identify: async (ctx: MutationCtx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return null;

    const userId = user.subject.split("|")[0];
    return {
      customerId: userId,
      customerData: {
        name: user.name as string,
        email: user.email as string,
      },
    };
  },
});

export const {
  track,
  cancel,
  query,
  attach,
  check,
  checkout,
  usage,
  setupPayment,
  createCustomer,
  listProducts,
  billingPortal,
  createReferralCode,
  redeemReferralCode,
  createEntity,
  getEntity,
} = autumn.api();
