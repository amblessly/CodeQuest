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

    if (user?.emailVerified) {
      return NextResponse.json({ verified: true });
    }

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

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verification.deleteMany({ where: { identifier: userId } });

    await prisma.verification.create({
      data: {
        identifier: userId,
        value: code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await resend.emails.send({
      from: "CodeQuest <onboarding@resend.dev>",
      to: email,
      subject: "Welcome to CodeQuest!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h1 style="color: #22C55E;">Welcome to CodeQuest!</h1>
          <p>You're one step away from starting your coding adventure.</p>
          <div style="background: #F0FDE6; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
            <p style="font-size: 14px; color: #666; margin-bottom: 8px;">Your verification code</p>
            <p style="font-size: 32px; font-weight: bold; color: #16A34A; letter-spacing: 8px;">${code}</p>
          </div>
          <p style="color: #999; font-size: 14px;">This code expires in 10 minutes.</p>
          <p style="color: #999; font-size: 14px;">If you didn't request this, you can ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ verified: false });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}