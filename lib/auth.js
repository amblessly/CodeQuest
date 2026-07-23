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
          resend.emails.send({
            from: "CodeQuest <onboarding@resend.dev>",
            to: user.email,
            subject: "Welcome to CodeQuest!",
            html: `
              <div style="background: #f7f7f7; padding: 40px 20px; font-family: 'Nunito', sans-serif;">
                <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 24px; padding: 40px 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
                  <h1 style="font-family: 'Fredoka', sans-serif; color: #58CC02; font-size: 28px; text-align: center; margin: 0 0 24px;">Welcome to CodeQuest!</h1>
                  <p style="color: #333; line-height: 1.6; margin: 0 0 16px;">Hi ${user.name || "Hero"},</p>
                  <p style="color: #333; line-height: 1.6; margin: 0 0 16px;">Thank you for creating an account and becoming one of our early users.</p>
                  <p style="color: #333; line-height: 1.6; margin: 0 0 16px;">CodeQuest is a programming quiz platform where you can level up your coding skills through fun, interactive quizzes. Earn XP, unlock new levels, and challenge yourself as you progress through different programming languages.</p>
                  <p style="color: #333; line-height: 1.6; margin: 0 0 16px;">The platform is still under active development, so you may encounter bugs or features that are still being improved. If you find any issues or have suggestions, I'd love to hear your feedback — it will help make CodeQuest even better.</p>
                  <p style="color: #333; line-height: 1.6; margin: 0 0 16px;">Thanks for joining the adventure, and good luck on your coding journey!</p>
                  <div style="text-align: center; margin: 24px 0 0;">
                    <a href="${process.env.BETTER_AUTH_URL || "https://codequestts.vercel.app"}/dashboard" style="background: #58CC02; color: white; padding: 14px 36px; border-radius: 999px; text-decoration: none; font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 0 #3a9e00;">Start Your Quest →</a>
                  </div>
                  <p style="color: #777; line-height: 1.6; margin: 24px 0 0; text-align: center;">Happy coding!<br><strong style="color: #333;">— Blessly</strong><br><span style="font-size: 14px;">Creator of CodeQuest</span></p>
                </div>
              </div>
            `,
          }).then(r => console.log("[SignUp] email sent:", r?.id))
            .catch(e => console.error("[SignUp] email failed:", e?.message || e));
        }
        return user;
      },
    },
  },
  plugins: [nextCookies()],
});
