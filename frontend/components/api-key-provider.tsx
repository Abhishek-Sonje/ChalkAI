"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { DEFAULT_IMAGE_MODEL_ID, getImageModel } from "@/lib/image-models";

const STORAGE_KEY = "chalk_ai_gemini_key";
const MODEL_STORAGE_KEY = "chalk_ai_image_model";

export type PublicApiKey = {
  id: string;
  provider: string;
  hint: string;
};

interface ApiKeyContextValue {
  keys: PublicApiKey[];
  apiKey: string | null;
  hasKey: boolean;
  setApiKey: (key: string, provider?: string) => Promise<void>;
  removeApiKey: (id?: string) => Promise<void>;
  clearApiKey: () => void;
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
  isLoaded: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextValue>({
  keys: [],
  apiKey: null,
  hasKey: false,
  setApiKey: async () => {},
  removeApiKey: async () => {},
  clearApiKey: () => {},
  selectedModelId: DEFAULT_IMAGE_MODEL_ID,
  setSelectedModelId: () => {},
  isLoaded: false,
});

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [keys, setKeys] = useState<PublicApiKey[]>([]);
  const [selectedModelId, setSelectedModelIdState] = useState(DEFAULT_IMAGE_MODEL_ID);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadAccount = useCallback(async () => {
    const res = await fetch("/api/account");
    const data = res.ok ? await res.json() : null;
    if (data?.keys) setKeys(data.keys);
    else if (data?.hasGeminiKey) setKeys([{ id: "legacy", provider: "google", hint: "AIza********" }]);
    if (data?.preferredModelId) {
      setSelectedModelIdState(getImageModel(data.preferredModelId).id);
    }
    return data;
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
        const storedModel = localStorage.getItem(MODEL_STORAGE_KEY);
        if (storedModel) setSelectedModelIdState(getImageModel(storedModel).id);
      } catch {}

      if (stored) {
        try {
          await fetch("/api/account/gemini-key", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apiKey: stored }),
          });
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
      }

      try {
        if (!cancelled) await loadAccount();
      } catch {
      } finally {
        if (!cancelled) setIsLoaded(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadAccount]);

  const setApiKey = useCallback(async (key: string, provider = "google") => {
    const res = await fetch("/api/account/gemini-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: key, provider }),
    });
    if (!res.ok) {
      throw new Error("Could not save the key to your account.");
    }
    const data = await res.json();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    if (data.keys) setKeys(data.keys);
    else await loadAccount();
  }, [loadAccount]);

  const removeApiKey = useCallback(async (id?: string) => {
    const url = id ? `/api/account/gemini-key?id=${encodeURIComponent(id)}` : "/api/account/gemini-key";
    const res = await fetch(url, { method: "DELETE" });
    const data = res.ok ? await res.json() : null;
    setKeys(data?.keys ?? []);
  }, []);

  const clearApiKey = useCallback(() => {
    void removeApiKey();
  }, [removeApiKey]);

  const setSelectedModelId = useCallback((id: string) => {
    const next = getImageModel(id).id;
    setSelectedModelIdState(next);
    try {
      localStorage.setItem(MODEL_STORAGE_KEY, next);
    } catch {}
    void fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferredModelId: next }),
    }).catch(() => {});
  }, []);

  return (
    <ApiKeyContext.Provider
      value={{
        keys,
        apiKey: null,
        hasKey: keys.length > 0,
        setApiKey,
        removeApiKey,
        clearApiKey,
        selectedModelId,
        setSelectedModelId,
        isLoaded,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  return useContext(ApiKeyContext);
}
