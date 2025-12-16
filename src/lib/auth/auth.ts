import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";

import { sendEmail } from "@/actions/email-actions";
import prisma from "../prisma/prisma";




export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  rateLimit: {
    enabled: process.env.NODE_ENV !== "development",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": {
        window: 10,
        max: 3,
      },
      "/two-factor/*": async () => ({ window: 10, max: 3 }),
    },
    storage: "database", // or "secondary-storage", or implement customStorage
  },

  advanced: {
    ipAddress: {
      ipAddressHeaders: ["cf-connecting-ip", "x-forwarded-for"], // Cloudflare or Vercel
    },
  },

  plugins: [
    nextCookies(),

    magicLink({
      sendMagicLink: async ({ email, url }) => {
        try {
          const username = email.split("@")[0];
          await sendEmail({
            to: email,
            username,
            subject: "Your Magic Sign-In Link",
            text: "Click the button below to sign in.",
            buttonText: "Sign In",
            linkUrl: url,
          });
        } catch (err) {
          console.error("Failed to send magic link:", err);
          throw new Error("Failed to send email. Please try again later.");
        }
      },
    }),
  ],

  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url, token }, request) => {
        try {
          const username = user.email.split("@")[0]; // or user.name if available
          await sendEmail({
            to: user.email, // current email for approval
            username,       // <-- add this!
            subject: "Approve Email Change",
            text: `Hi ${user.name || username},\n\nYou requested to change your email to ${newEmail}.\n\nPlease click the link below to approve this change:\n${url}\n\nIf you didn't request this, please ignore this message.`,
            buttonText: "Approve Email Change",
            linkUrl: url,
          });
        } catch (err) {
          console.error("Failed to send email change verification:", err);
          throw new Error("Failed to send email. Please try again later.");
        }
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
