import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import RootWrapper from '@/components/RootWrapper';
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
    images: [{ url: 'https://sspzoa.io/images/og-image.png' }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className={`${WantedSansVariable.variable} antialiased`}>
        <RootWrapper>{children}</RootWrapper>
      </body>
    </html>
  );
}
