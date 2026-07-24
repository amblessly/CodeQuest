import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { userId, code } = await request.json();

    if (!userId || !code) {
      return NextResponse.json({ error: "Missing userId or code" }, { status: 400 });
    }

    const verification = await prisma.verification.findFirst({
      where: {
        identifier: userId,
        value: code,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    await prisma.verification.delete({ where: { id: verification.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 });
  }
}