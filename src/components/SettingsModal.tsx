'use client';

import React, { useRef, useState } from 'react';
import { Download, RotateCcw, Upload, X } from 'lucide-react';
import { useLibrary } from '@/components/LibraryProvider';
import { LLMProvider } from '@/types/reading';

export function SettingsModal() {
  const {
    settingsOpen,
    setSettingsOpen,
    llmConfig,
    updateLLMConfig,
    exportJSON,
    importJSON,
    resetLibrary,
  } = useLibrary();

  const [provider, setProvider] = useState<LLMProvider>(llmConfig.provider);
  const [apiKey, setApiKey] = useState(llmConfig.apiKey || '');
  const [baseUrl, setBaseUrl] = useState(llmConfig.baseUrl || '');
  const [model, setModel] = useState(llmConfig.model || '');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!settingsOpen) return null;

  const handleSaveLLM = (e: React.FormEvent) => {
    e.preventDefault();
    updateLLMConfig({
      provider,
      apiKey: apiKey.trim() || undefined,
      baseUrl: baseUrl.trim() || undefined,
      model: model.trim() || undefined,
    });
    setStatusMsg('AI provider settings saved locally.');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      await importJSON(text);
      setStatusMsg('Library imported successfully.');
    } catch {
      setStatusMsg('Invalid JSON file. Please export from Folio first.');
    }
  };

  const handleReset = async () => {
    await resetLibrary();
    setStatusMsg('Library restored to sample seed data.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
      <div
        className="w-full max-w-lg rounded-xl border p-6 shadow-xl"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-hairline)',
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border-hairline)' }}>
          <div>
            <h2 className="font-serif-editorial text-xl font-medium">
              Companion Settings
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Configure your LLM endpoint or back up your local library.
            </p>
          </div>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-1.5 rounded-lg hover:opacity-75 transition-opacity"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSaveLLM} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              AI Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as LLMProvider)}
              className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
              style={{ borderColor: 'var(--border-hairline)' }}
            >
              <option value="openai">OpenAI-Compatible Endpoint</option>
              <option value="gemini">Google Gemini API</option>
              <option value="ollama">Local Ollama Instance</option>
            </select>
          </div>

          {provider !== 'ollama' && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                API Key (stored in browser)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  provider === 'gemini' ? 'AIza...' : 'sk-...'
                }
                className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
                style={{ borderColor: 'var(--border-hairline)' }}
              />
            </div>
          )}

          {provider !== 'gemini' && (
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Base URL (optional)
              </label>
              <input
                type="url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder={
                  provider === 'ollama'
                    ? 'http://localhost:11434'
                    : 'https://api.openai.com/v1'
                }
                className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
                style={{ borderColor: 'var(--border-hairline)' }}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Model Name (optional)
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={
                provider === 'gemini'
                  ? 'gemini-2.5-flash'
                  : provider === 'ollama'
                    ? 'llama3.2'
                    : 'gpt-4o-mini'
              }
              className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
              style={{ borderColor: 'var(--border-hairline)' }}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            Save AI Configuration
          </button>
        </form>

        <div className="mt-6 pt-5 border-t space-y-3" style={{ borderColor: 'var(--border-hairline)' }}>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Library Data (Local-First)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={exportJSON}
              className="flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:opacity-80"
              style={{ borderColor: 'var(--border-hairline)' }}
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:opacity-80"
              style={{ borderColor: 'var(--border-hairline)' }}
            >
              <Upload className="w-3.5 h-3.5" />
              Import JSON
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium hover:opacity-80"
              style={{ borderColor: 'var(--border-hairline)' }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Seed
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImportFile}
          />
          {statusMsg && (
            <p className="text-xs pt-1" style={{ color: 'var(--accent-secondary)' }}>
              {statusMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
