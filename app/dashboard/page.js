import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { GameIcon } from "@/components/ui/Icons";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "16px",
      padding: "40px 20px",
      background: "#F3EEF7",
      fontFamily: "'Nunito', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "white", top: "-10%", right: "-5%", pointerEvents: "none", opacity: 0.6 }} />
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "white", bottom: "10%", left: "-5%", pointerEvents: "none", opacity: 0.4 }} />
      <div style={{ position: "absolute", width: 120, height: 120, borderRadius: "50%", background: "white", top: "50%", right: "10%", pointerEvents: "none", opacity: 0.3 }} />
      <span style={{ width: "64px", height: "64px", display: "inline-block" }}><GameIcon /></span>
      <h1 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "2rem" }}>
        Welcome, {session.user.name || "Hero"}!
      </h1>
      <p style={{ color: "#777" }}>Your coding adventure begins here.</p>
      <form
        action={async () => {
          "use server";
          const { auth } = await import("@/lib/auth");
          const { headers } = await import("next/headers");
          await auth.api.signOut({ headers: await headers() });
          redirect("/");
        }}
      >
        <button type="submit" style={{
          padding: "12px 32px",
          background: "#FF4B4B",
          color: "white",
          border: "none",
          borderRadius: "999px",
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          cursor: "pointer",
          boxShadow: "0 4px 0 #d93a3a",
        }}>
          Sign Out
        </button>
      </form>
    </div>
  );
}
