import type { RunMutationCtx } from "@convex-dev/better-auth";
import { Resend } from "@convex-dev/resend";
import { render } from "@react-email/components";
import { components } from "./_generated/api";
import MagicLinkEmail from "./emails/magicLink";
import ResetPasswordEmail from "./emails/resetPassword";
import VerifyEmail from "./emails/verifyEmail";
import VerifyOTP from "./emails/verifyOTP";

export const resend = new Resend(components.resend, {
	testMode: false,
});

export const sendEmailVerification = async (
	ctx: RunMutationCtx,
	{
		to,
		url,
	}: {
		to: string;
		url: string;
	},
) => {
	await resend.sendEmail(ctx, {
		from: "SmrtStudy <noreply@email.smrtstudy.com>",
		to,
		subject: "Verify your email address",
		html: await render(<VerifyEmail url={url} />),
	});
};

export const sendOTPVerification = async (
	ctx: RunMutationCtx,
	{
		to,
		code,
	}: {
		to: string;
		code: string;
	},
) => {
	await resend.sendEmail(ctx, {
		from: "SmrtStudy <noreply@email.smrtstudy.com>",
		to,
		subject: "Verify your email address",
		html: await render(<VerifyOTP code={code} />),
	});
};

export const sendMagicLink = async (
	ctx: RunMutationCtx,
	{
		to,
		url,
	}: {
		to: string;
		url: string;
	},
) => {
	await resend.sendEmail(ctx, {
		from: "SmrtStudy <noreply@email.smrtstudy.com>",
		to,
		subject: "Sign in to your account",
		html: await render(<MagicLinkEmail url={url} />),
	});
};

export const sendResetPassword = async (
	ctx: RunMutationCtx,
	{
		to,
		url,
	}: {
		to: string;
		url: string;
	},
) => {
	await resend.sendEmail(ctx, {
		from: "SmrtStudy <noreply@email.smrtstudy.com>",
		to,
		subject: "Reset your password",
		html: await render(<ResetPasswordEmail url={url} />),
	});
};
