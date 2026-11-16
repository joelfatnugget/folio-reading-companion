import { LLMConfig, LLMProvider } from '@/types/reading';

interface CompletionRequest {
  systemPrompt: string;
  userPrompt: string;
  config?: Partial<LLMConfig>;
}

export function resolveServerLLMConfig(
  override?: Partial<LLMConfig>
): LLMConfig | null {
  const provider =
    (override?.provider as LLMProvider | undefined) ||
    (process.env.LLM_PROVIDER as LLMProvider | undefined) ||
    (process.env.GEMINI_API_KEY
      ? 'gemini'
      : process.env.OPENAI_API_KEY
        ? 'openai'
        : process.env.OLLAMA_BASE_URL
          ? 'ollama'
          : undefined);

  if (!provider) return null;

  if (provider === 'openai') {
    const apiKey = override?.apiKey?.trim() || process.env.OPENAI_API_KEY;
    if (!apiKey) return null;
    return {
      provider: 'openai',
      apiKey,
      baseUrl:
        override?.baseUrl?.trim() ||
        process.env.OPENAI_BASE_URL ||
        'https://api.openai.com/v1',
      model:
        override?.model?.trim() || process.env.OPENAI_MODEL || 'gpt-4o-mini',
    };
  }

  if (provider === 'gemini') {
    const apiKey = override?.apiKey?.trim() || process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return {
      provider: 'gemini',
      apiKey,
      model:
        override?.model?.trim() ||
        process.env.GEMINI_MODEL ||
        'gemini-2.5-flash',
    };
  }

  if (provider === 'ollama') {
    const baseUrl =
      override?.baseUrl?.trim() ||
      process.env.OLLAMA_BASE_URL ||
      'http://localhost:11434';
    return {
      provider: 'ollama',
      baseUrl,
      model:
        override?.model?.trim() || process.env.OLLAMA_MODEL || 'llama3.2',
    };
  }

  return null;
}

export async function generateLLMCompletion({
  systemPrompt,
  userPrompt,
  config: override,
}: CompletionRequest): Promise<string | null> {
  const config = resolveServerLLMConfig(override);
  if (!config) return null;

  if (config.provider === 'openai') {
    const url = `${(config.baseUrl || 'https://api.openai.com/v1').replace(/\/$/, '')}/chat/completions`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || 'gpt-4o-mini',
        temperature: 0.4,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI-compatible API error (${res.status})`);
    }
    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? null;
  }

  if (config.provider === 'gemini') {
    const model = config.model || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(config.apiKey || '')}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.4 },
      }),
    });

    if (!res.ok) {
      throw new Error(`Gemini API error (${res.status})`);
    }
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  }

  if (config.provider === 'ollama') {
    const url = `${(config.baseUrl || 'http://localhost:11434').replace(/\/$/, '')}/api/chat`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model || 'llama3.2',
        stream: false,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama API error (${res.status})`);
    }
    const data = await res.json();
    return data?.message?.content ?? null;
  }

  return null;
}
