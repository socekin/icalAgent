import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";

const displaySans = Inter({
  variable: "--font-display-sans",
  subsets: ["latin"],
});

const bodyMono = IBM_Plex_Mono({
  variable: "--font-body-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iCalAgent | AI 日历订阅",
  description: "通用 AI 日历订阅平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${displaySans.variable} ${bodyMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
