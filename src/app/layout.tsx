import type { Metadata } from "next";

import Providers from "@/components/providers/providers";
import ReduxHydration from "@/components/redux-hydration/ReduxHydration";

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
  title: 'Pinnn Me - more than just a "link in bio"',
  description:
    "Create your mural, share your work and get paid. It's easy. It's free.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className}`}>
        <Providers>
          <>
            <ReduxHydration />
            {children}
          </>
        </Providers>
      </body>
    </html>
  );
}
