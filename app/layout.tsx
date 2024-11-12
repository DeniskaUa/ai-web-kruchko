import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { Inter } from 'next/font/google';
import { Sidebar } from './sidebar';

const inter = Inter({ subsets: ['latin'] });

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Sidebar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
