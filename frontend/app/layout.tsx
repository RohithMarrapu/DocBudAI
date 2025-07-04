import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DocBudAI',
  description: 'PDF Intelligence Platform - Chat with your PDF documents using advanced AI',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>DocBudAI</title>
        <link rel="icon" href="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3e%3cdefs%3e%3clinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3e%3cstop offset='0%25' style='stop-color:%232563eb;stop-opacity:1' /%3e%3cstop offset='100%25' style='stop-color:%239333ea;stop-opacity:1' /%3e%3c/linearGradient%3e%3c/defs%3e%3crect width='32' height='32' rx='6' fill='url(%23grad)'/%3e%3cpath d='M18.5 6H10a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V11.5L18.5 6z' fill='white'/%3e%3cpolyline points='18,6 18,12 24,12' fill='white'/%3e%3cline x1='20' y1='17' x2='12' y2='17' stroke='%23374151' stroke-width='1'/%3e%3cline x1='20' y1='21' x2='12' y2='21' stroke='%23374151' stroke-width='1'/%3e%3cline x1='14' y1='13' x2='12' y2='13' stroke='%23374151' stroke-width='1'/%3e%3c/svg%3e" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}