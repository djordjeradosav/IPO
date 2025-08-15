import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Real IPO Calendar Tracker',
  description:
    'Track upcoming Initial Public Offerings and recent public listings with real financial data',
  keywords:
    'IPO, Initial Public Offering, stock market, investments, financial data',
  authors: [{ name: 'IPO Tracker Team' }],
  openGraph: {
    title: 'Real IPO Calendar Tracker',
    description:
      'Track upcoming IPOs and recent public listings with real financial data',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
