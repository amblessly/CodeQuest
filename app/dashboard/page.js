import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  if (!session.user.user_metadata?.onboarding_complete) {
    redirect("/onboarding");
  }

  redirect("/levels");
}
