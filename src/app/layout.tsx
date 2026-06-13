import type { Metadata } from "next";
import { Fredoka, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Oshudpati | Trusted Online Medicine & Healthcare Marketplace",
    template: "%s | Oshudpati",
  },

  description:
    "Buy authentic medicines, healthcare products, baby care, personal care, and wellness essentials online from trusted pharmacies and sellers across Bangladesh.",
  keywords: [
    "Oshudpati",
    "online pharmacy Bangladesh",
    "medicine marketplace",
    "buy medicine online",
    "healthcare products",
    "baby care",
    "personal care",
    "wellness products",
    "Bangladesh pharmacy",
  ],
  authors: [
    {
      name: "Zeanur Rahaman Zeon",
    },
  ],
  creator: "Zeanur Rahaman Zeon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body suppressHydrationWarning={true}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
