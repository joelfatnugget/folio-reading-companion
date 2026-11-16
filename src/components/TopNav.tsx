'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Moon, Network, Settings2, Sun } from 'lucide-react';
import { useLibrary } from '@/components/LibraryProvider';
import { SettingsModal } from '@/components/SettingsModal';

export function TopNav() {
  const pathname = usePathname();
  const { theme, toggleTheme, setSettingsOpen } = useLibrary();

  return (
    <>
      <header
        className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--bg-canvas) 88%, transparent)',
          borderColor: 'var(--border-hairline)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-7">
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <BookOpen
                className="w-4 h-4 transition-transform group-hover:-rotate-6"
                style={{ color: 'var(--accent-primary)' }}
              />
              <span className="font-serif-editorial text-xl font-medium tracking-tight">
                Folio
              </span>
            </Link>

            <nav className="flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  pathname === '/'
                    ? 'font-medium bg-black/5 dark:bg-white/10'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                Library
              </Link>
              <Link
                href="/themes"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  pathname.startsWith('/themes')
                    ? 'font-medium bg-black/5 dark:bg-white/10'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                Themes & Connections
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border transition-colors hover:opacity-80"
              style={{ borderColor: 'var(--border-hairline)' }}
              aria-label="Toggle color theme"
              title={theme === 'light' ? 'Switch to dark slate' : 'Switch to warm paper'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors hover:opacity-80"
              style={{ borderColor: 'var(--border-hairline)' }}
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>
      <SettingsModal />
    </>
  );
}
