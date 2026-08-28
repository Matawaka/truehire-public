import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://truehire-matawaka.matawaka.chatgpt.site'),
  title: 'TRUEHIRE — Честный найм',
  description: 'Проясняйте намерения, условия и полномочия до разговора о найме.',
  openGraph: {
    title: 'TRUEHIRE — Честный найм',
    description: 'Не резюме. Позиция. Намерения и условия без скрытых механизмов.',
    images: [{ url: '/og.svg', width: 1200, height: 630, alt: 'TRUEHIRE — Честный найм' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TRUEHIRE — Честный найм',
    description: 'Не резюме. Позиция. Намерения и условия без скрытых механизмов.',
    images: ['/og.svg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
