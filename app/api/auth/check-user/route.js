import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ exists: false, verified: false });
    }

    return NextResponse.json({ exists: true, verified: user.emailVerified });
  } catch (error) {
    console.error("Check user error:", error);
    return NextResponse.json({ error: "Failed to check user" }, { status: 500 });
  }
}