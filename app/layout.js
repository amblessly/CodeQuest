import "./globals.css";
import BottomNav from "@/components/ui/BottomNav";
import InstallPrompt from "@/components/InstallPrompt";
import SwRegister from "@/components/SwRegister";

export const metadata = {
  title: "CodeQuest - Learn to Code Through Play",
  description: "CodeQuest turns coding into an adventure! Solve fun quizzes, earn XP, unlock levels, and become a coding hero.",
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#58CC02",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <BottomNav />
        <InstallPrompt />
        <SwRegister />
      </body>
    </html>
  );
}
