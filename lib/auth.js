import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(url) {
      // Will implement password reset later
    },
  },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
      xp: {
        type: "number",
        required: false,
        defaultValue: 0,
        input: false,
      },
      level: {
        type: "number",
        required: false,
        defaultValue: 1,
        input: false,
      },
    },
  },
  callbacks: {
    signUp: {
      async after(user) {
        console.log("[SignUp] callback fired for:", user?.email);
        if (resend) {
          try {
            console.log("[SignUp] sending welcome email to:", user?.email);
            const result = await resend.emails.send({
              from: "CodeQuest <onboarding@resend.dev>",
              to: user.email,
              subject: "Welcome to CodeQuest! 🎉",
              html: `
                <div style="font-family: 'Nunito', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
                  <h1 style="font-family: 'Fredoka', sans-serif; color: #58CC02;">🎉 Welcome to CodeQuest!</h1>
                  <p>Hi ${user.name || "Hero"},</p>
                  <p>Thank you for creating an account and becoming one of our early users.</p>
                  <p>CodeQuest is a programming quiz platform where you can level up your coding skills through fun, interactive quizzes. Earn XP, unlock new levels, and challenge yourself as you progress through different programming languages.</p>
                  <p>The platform is still under active development, so you may encounter bugs or features that are still being improved. If you find any issues or have suggestions, I'd love to hear your feedback — it will help make CodeQuest even better.</p>
                  <p>Thanks for joining the adventure, and good luck on your coding journey!</p>
                  <p style="margin-top: 24px;">Happy coding! 🚀<br/>— Blessly<br/>Creator of CodeQuest</p>
                </div>
              `,
            });
            console.log("[SignUp] email result:", result?.id);
          } catch (err) {
            console.error("[SignUp] Failed to send welcome email:", err?.message || err, err?.stack || "");
          }
        }
        return user;
      },
    },
  },
  plugins: [nextCookies()],
});
