import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anime Gallery — Fire Red Theme",
  description:
    "Modern anime gallery with blazing red vibes. Browse and download thousands of images from /public/images with dark/light mode and server-side pagination.",
  keywords: [
    "Anime",
    "Gallery",
    "Next.js",
    "Dark Mode",
    "Download Images",
    "Red Theme",
  ],
  openGraph: {
    title: "Anime Gallery — Fire Red Theme",
    description:
      "Sleek, modern anime gallery with pagination and instant downloads.",
    type: "website",
    images: [{ url: "/icons/fire.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anime Gallery — Fire Red Theme",
    description:
      "Sleek, modern anime gallery with pagination and instant downloads.",
    images: ["/icons/fire.png"],
  },
  icons: {
    icon: [{ url: "/icons/fire.png" }], // <— custom icon (not favicon.ico)
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100`}
      >
        {children}
      </body>
    </html>
  );
}
