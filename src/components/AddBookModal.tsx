'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLibrary } from '@/components/LibraryProvider';
import { BookStatus } from '@/types/reading';

interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddBookModal({ open, onClose }: AddBookModalProps) {
  const { addBook } = useLibrary();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('280');
  const [currentPage, setCurrentPage] = useState('0');
  const [status, setStatus] = useState<BookStatus>('reading');

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    await addBook({
      title,
      author,
      total_pages: Number(totalPages) || 250,
      current_page: Number(currentPage) || 0,
      status,
    });
    setTitle('');
    setAuthor('');
    setTotalPages('280');
    setCurrentPage('0');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-md rounded-xl border p-6 shadow-xl"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-hairline)',
        }}
      >
        <div
          className="flex items-center justify-between pb-4 border-b"
          style={{ borderColor: 'var(--border-hairline)' }}
        >
          <h2 className="font-serif-editorial text-xl font-medium">
            Add Book to Library
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:opacity-75"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Art of Doing Science and Engineering"
              className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
              style={{ borderColor: 'var(--border-hairline)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Author
            </label>
            <input
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Richard W. Hamming"
              className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
              style={{ borderColor: 'var(--border-hairline)' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Current Pg
              </label>
              <input
                type="number"
                min={0}
                value={currentPage}
                onChange={(e) => setCurrentPage(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
                style={{ borderColor: 'var(--border-hairline)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Total Pgs
              </label>
              <input
                type="number"
                min={1}
                required
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
                style={{ borderColor: 'var(--border-hairline)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookStatus)}
                className="w-full rounded-lg border px-2 py-2 text-sm bg-transparent"
                style={{ borderColor: 'var(--border-hairline)' }}
              >
                <option value="reading">Reading</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-sm hover:opacity-80"
              style={{ borderColor: 'var(--border-hairline)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
