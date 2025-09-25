import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anime Gallery",
  description:
    "Modern anime gallery where u can download 4k images for mobile wallpaper and more.",
  keywords: [
    "Anime",
    "Gallery",
    "Next.js",
    "Dark Mode",
    "Download",
    "Image Grid",
    "Fire Theme",
  ],
  openGraph: {
    title: "Anime Gallery — Fire Red Theme",
    description:
      "Sleek anime gallery with pagination, search, and instant downloads.",
    type: "website",
    images: [{ url: "/icons/fire.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anime Gallery — Fire Red Theme",
    description:
      "Sleek anime gallery with pagination, search, and instant downloads.",
    images: ["/icons/fire.png"],
  },
  icons: {
    icon: [{ url: "/icons/fire.png" }], // custom, not favicon.ico
    apple: [{ url: "/icons/fire.png" }],
    shortcut: ["/icons/fire.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jakarta.variable} ${jetbrains.variable} antialiased bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100`}
        style={{
          fontFamily: "var(--font-jakarta), ui-sans-serif, system-ui",
        }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
