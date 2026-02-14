import { IBM_Plex_Mono, Inter } from "next/font/google";
import { getLocale, t } from "@/i18n";
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

export async function generateMetadata() {
  const locale = await getLocale();
  return {
    title: t(locale, "meta.title"),
    description: t(locale, "meta.description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={`${displaySans.variable} ${bodyMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
