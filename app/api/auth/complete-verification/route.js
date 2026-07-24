import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import resend from "@/lib/resend";

export async function POST(request) {
  try {
    const { userId, email } = await request.json();

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing userId or email" }, { status: 400 });
    }

    let user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      const base = email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "");
      let username = base;
      let attempts = 0;
      while (await prisma.user.findUnique({ where: { username } })) {
        attempts++;
        username = `${base}${attempts}`;
      }

      user = await prisma.user.create({
        data: {
          id: userId,
          email,
          emailVerified: false,
          username,
        },
      });
    }

    if (!user.emailVerified) {
      await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: true },
      });
    }

    try {
      await resend.emails.send({
        from: "CodeQuest <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to CodeQuest!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <h1 style="color: #22C55E;">Welcome to CodeQuest!</h1>
            <p>Your coding adventure has begun! Start solving quizzes, earning XP, and unlocking levels.</p>
            <div style="background: #F0FDE6; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
              <p style="font-size: 16px; color: #333;">Happy learning!</p>
            </div>
            <p style="color: #999; font-size: 14px;">If you didn't sign up for CodeQuest, you can ignore this email.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send welcome email:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Failed to complete verification" }, { status: 500 });
  }
}