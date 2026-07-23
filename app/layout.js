import "./globals.css";

export const metadata = {
  title: "CodeQuest",
  description: "Learn to code through quizzes and challenges",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
