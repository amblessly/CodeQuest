import "./globals.css";
import BottomNav from "@/components/ui/BottomNav";

export const metadata = {
  title: "CodeQuest - Learn to Code Through Play",
  description: "CodeQuest turns coding into an adventure! Solve fun quizzes, earn XP, unlock levels, and become a coding hero.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
