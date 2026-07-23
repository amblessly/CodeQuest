import { Resend } from "resend";

export async function GET() {
  const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

  if (!resend) {
    return Response.json({ error: "RESEND_API_KEY not set" }, { status: 400 });
  }

  try {
    const result = await resend.emails.send({
      from: "CodeQuest <onboarding@resend.dev>",
      to: "luisonblessly@gmail.com",
      subject: "CodeQuest Test Email 🧪",
      html: "<h1>Test</h1><p>If you see this, Resend is working!</p>",
    });

    return Response.json({ success: true, id: result?.id });
  } catch (err) {
    return Response.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
