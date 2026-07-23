import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
      background: "linear-gradient(180deg, #e5f5d1 0%, #f7f7f7 100%)",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <span style={{ fontSize: "4rem" }}>⚔️</span>
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
