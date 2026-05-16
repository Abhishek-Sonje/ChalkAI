"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "chalk_ai_gemini_key";

interface ApiKeyContextValue {
  apiKey: string | null;
  hasKey: boolean;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  isLoaded: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextValue>({
  apiKey: null,
  hasKey: false,
  setApiKey: () => {},
  clearApiKey: () => {},
  isLoaded: false,
});

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setApiKeyState(stored);
    } catch {}
    setIsLoaded(true);
  }, []);

  const setApiKey = useCallback((key: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, key);
    } catch {}
    setApiKeyState(key);
  }, []);

  const clearApiKey = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setApiKeyState(null);
  }, []);

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        hasKey: !!apiKey,
        setApiKey,
        clearApiKey,
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
