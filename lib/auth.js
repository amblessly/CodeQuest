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
  callbacks: {
    signUp: {
      async after(user) {
        if (resend) {
          try {
            await resend.emails.send({
              from: "noreply@codequest.app",
              to: user.email,
              subject: "Welcome to CodeQuest! ⚔️",
              html: `
                <div style="font-family: 'Nunito', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
                  <h1 style="font-family: 'Fredoka', sans-serif; color: #58CC02;">⚔️ Welcome to CodeQuest!</h1>
                  <p>Hi ${user.name || "Hero"},</p>
                  <p>You've just started your coding adventure! Get ready to solve quizzes, earn XP, and level up your skills.</p>
                  <p style="margin-top: 24px;">
                    <a href="${process.env.BETTER_AUTH_URL}/dashboard"
                       style="background: #58CC02; color: white; padding: 12px 28px; border-radius: 999px; text-decoration: none; font-weight: 700; display: inline-block;">
                      Start Your Quest →
                    </a>
                  </p>
                  <p style="margin-top: 24px; color: #777;">Happy coding!<br/>— The CodeQuest Team</p>
                </div>
              `,
            });
          } catch (err) {
            console.error("Failed to send welcome email:", err);
          }
        }
        return user;
      },
    },
  },
  plugins: [nextCookies()],
});
