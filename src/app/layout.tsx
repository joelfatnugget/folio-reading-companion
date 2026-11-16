import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Newsreader } from 'next/font/google';
import './globals.css';
import { LibraryProvider } from '@/components/LibraryProvider';
import { TopNav } from '@/components/TopNav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Folio — Conscientious Reading & Active Recall Companion',
  description:
    'Session-based active recall and editorial AI synthesis for non-fiction readers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen transition-colors duration-200">
        <LibraryProvider>
          <div className="min-h-screen flex flex-col">
            <TopNav />
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
              {children}
            </main>
          </div>
        </LibraryProvider>
      </body>
    </html>
  );
}
