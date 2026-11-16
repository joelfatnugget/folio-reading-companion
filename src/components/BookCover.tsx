import React from 'react';

const PALETTES = [
  {
    bg: 'from-[#5C241B] via-[#732F24] to-[#421812]',
    accent: '#E8C59B',
    text: '#FAF3E8',
  },
  {
    bg: 'from-[#1F3A33] via-[#2A4D43] to-[#152823]',
    accent: '#C9D8C5',
    text: '#F3F7F4',
  },
  {
    bg: 'from-[#1E2B3C] via-[#293B52] to-[#131C28]',
    accent: '#C4D1E0',
    text: '#F2F5F8',
  },
  {
    bg: 'from-[#4A3820] via-[#614A2B] to-[#332615]',
    accent: '#E6CFA8',
    text: '#FAF5EB',
  },
  {
    bg: 'from-[#2E2938] via-[#3E374D] to-[#1E1A26]',
    accent: '#D5CCE6',
    text: '#F5F3F9',
  },
];

function hashTitle(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

interface BookCoverProps {
  title: string;
  author: string;
  coverUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export function BookCover({
  title,
  author,
  coverUrl,
  size = 'md',
}: BookCoverProps) {
  const palette = PALETTES[hashTitle(title) % PALETTES.length];
  const [shortTitle, subtitle] = title.split(':').map((s) => s.trim());

  const sizeClasses =
    size === 'sm'
      ? 'w-14 h-20 rounded-r-md rounded-l-xs p-2'
      : size === 'lg'
        ? 'w-36 h-52 sm:w-40 sm:h-56 rounded-r-lg rounded-l-xs p-4'
        : 'w-24 h-36 rounded-r-md rounded-l-xs p-3';

  if (coverUrl) {
    return (
      <div
        className={`${sizeClasses} relative shrink-0 overflow-hidden shadow-md border border-black/15 dark:border-white/10 p-0!`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={`${title} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/35 to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} relative shrink-0 bg-gradient-to-br ${palette.bg} shadow-md border border-black/20 dark:border-white/10 flex flex-col justify-between select-none overflow-hidden`}
      style={{ color: palette.text }}
    >
      {/* Book spine crease */}
      <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/35 via-white/10 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 left-2.5 w-px bg-black/25 pointer-events-none" />

      {/* Subtle cloth-bound inner frame */}
      <div
        className="relative z-10 h-full flex flex-col justify-between pl-1.5 border-l border-white/10"
      >
        <div className="space-y-1">
          <div
            className="w-5 h-px opacity-60"
            style={{ backgroundColor: palette.accent }}
          />
          <p
            className={`font-serif-editorial font-medium leading-tight tracking-tight ${
              size === 'sm'
                ? 'text-[10px] line-clamp-3'
                : size === 'lg'
                  ? 'text-base sm:text-lg line-clamp-4'
                  : 'text-xs line-clamp-3'
            }`}
          >
            {shortTitle}
          </p>
          {size === 'lg' && subtitle && (
            <p
              className="text-[10px] leading-snug opacity-75 line-clamp-2"
              style={{ color: palette.accent }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <p
          className={`uppercase tracking-widest truncate opacity-85 font-mono-meta ${
            size === 'sm' ? 'text-[7px]' : 'text-[9px]'
          }`}
          style={{ color: palette.accent }}
        >
          {author.split(' ').slice(-1)[0]}
        </p>
      </div>
    </div>
  );
}
