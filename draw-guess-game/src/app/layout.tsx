import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 你画我猜 - 画画让AI来猜",
  description: "一个有趣的你画我猜游戏，画出题目让AI来猜测！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
