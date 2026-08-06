import React from 'react';
import './globals.css';
import SiteChrome from '@/components/SiteChrome';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Umi Kasum Reseller',
  description: 'Reseller Official Umi Kasum',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Providers>
          <SiteChrome />
          {children}
        </Providers>
      </body>
    </html>
  );
}