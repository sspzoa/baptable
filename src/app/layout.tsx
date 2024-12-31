import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import RootWrapper from '@/components/common/RootWrapper';
import type React from 'react';

const WantedSansVariable = localFont({
  src: [
    {
      path: './fonts/WantedSansVariable.woff2',
    },
  ],
  variable: '--font-WantedSansVariable',
});

export const metadata: Metadata = {
  title: '밥',
  description: '한국디지털미디어고등학교 급식 API',
  openGraph: {
    images: [{ url: 'https://xn--rh3b.net/images/og-image.png' }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
    <head>
      <meta property="og:image" content="https://xn--rh3b.net/images/og-image.png"/>
      <meta name="viewport" content="initial-scale=1, viewport-fit=cover"/>
      <meta name="apple-mobile-web-app-capable" content="yes"/>
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"/>
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
    </head>
    <body className={`${WantedSansVariable.variable} antialiased`}>
    <RootWrapper>{children}</RootWrapper>
      </body>
    </html>
  );
}
