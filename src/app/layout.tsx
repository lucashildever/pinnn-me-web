import type { Metadata } from 'next';

import Providers from '@/components/providers/providers';
import ReduxHydration from '@/components/redux-hydration/ReduxHydration';

import { Source_Sans_3 } from 'next/font/google';
import '@/styles/reset.css';
import '@/styles/globals.scss';

const sourceSans3 = Source_Sans_3({
  variable: '--font-source-sans-3',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pinnn Me - more than just a "link in bio"',
  description:
    "Create your mural, share your work and get paid. It's easy. It's free.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSans3.className}`}>
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
