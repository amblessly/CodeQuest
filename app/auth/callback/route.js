import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const { id, email } = data.user;

      const existing = await prisma.user.findUnique({ where: { id } });
      if (!existing && email) {
        const base = email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "");
        let username = base;
        let attempts = 0;
        while (await prisma.user.findUnique({ where: { username } })) {
          attempts++;
          username = `${base}${attempts}`;
        }

        await prisma.user.create({
          data: {
            id,
            email,
            emailVerified: true,
            username,
            name: data.user.user_metadata?.name || null,
            image: data.user.user_metadata?.avatar_url || null,
          },
        });
      }

      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(new URL("/auth?verified=1", request.url));
}
