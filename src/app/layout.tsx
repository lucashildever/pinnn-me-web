import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "@/styles/reset.css";
import "@/styles/globals.scss";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  weight: ["200", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pinnn me",
  description: "Pinnn me app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className}`}>{children}</body>
    </html>
  );
}
