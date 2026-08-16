"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Key, ExternalLink, Check, AlertCircle, Loader2, X, Sparkles, Trash2, ChevronDown } from "lucide-react";
import { useApiKey } from "@/components/api-key-provider";
import { IMAGE_PROVIDERS, getProviderMeta, type ImageModelProvider } from "@/lib/image-models";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose?: () => void;
  required?: boolean;
}

export function ApiKeyModal({ isOpen, onClose, required = false }: ApiKeyModalProps) {
  const { setApiKey, keys, hasKey, removeApiKey } = useApiKey();
  const [step, setStep] = useState<"ask" | "add">("add");
  const [inputValue, setInputValue] = useState("");
  const [provider, setProvider] = useState<ImageModelProvider>("google");
  const providerMeta = getProviderMeta(provider);
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [prevOpen, setPrevOpen] = useState(isOpen);
  const inputRef = useRef<HTMLInputElement>(null);

  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (isOpen) {
      setInputValue("");
      setShowKey(false);
      setStatus("idle");
      setErrorMessage("");
      setStep(hasKey ? "ask" : "add");
    }
  }

  useEffect(() => {
    if (isOpen && step === "add") {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, step]);

  const handleSave = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setStatus("error");
      setErrorMessage("Please enter your API key.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: trimmed, provider }),
      });
      const data = await res.json();

      if (data.valid) {
        try {
          await setApiKey(trimmed, provider);
        } catch {
          setStatus("error");
          setErrorMessage("Key is valid, but could not be saved to your account. Try again.");
          return;
        }
        setStatus("success");
        setInputValue("");
        setTimeout(() => {
          onClose?.();
        }, 1000);
      } else {
        setStatus("error");
        setErrorMessage(data.reason ?? "Invalid API key. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Could not connect to validation service. Check your internet connection.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") void handleSave();
    if (e.key === "Escape" && !required) onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!required ? onClose : undefined}
            className="absolute inset-0 bg-chalk-ink/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-lg max-h-[min(90dvh,40rem)] overflow-y-auto bg-[#faf9f5] border-[3px] border-chalk-border rounded-2xl sm:rounded-3xl shadow-[10px_10px_0px_0px_var(--chalk-border)] z-10"
          >
            {!(required && !hasKey) && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-9 h-9 border-2 border-chalk-border bg-white rounded-xl flex items-center justify-center text-chalk-gray hover:text-chalk-ink hover:rotate-90 transition-all duration-200 shadow-[1.5px_1.5px_0px_0px_var(--chalk-border)]"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}

            <div className="h-1.5 w-full bg-gradient-to-r from-chalk-purple via-chalk-purple/70 to-transparent" />

            <div className="p-5 sm:p-8">
              <div className="flex items-start gap-3 sm:gap-4 mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-chalk-purple-light border-[2.5px] border-chalk-border rounded-2xl flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_var(--chalk-border)]">
                  <Key className="w-6 h-6 text-chalk-purple stroke-[2]" />
                </div>
                <div>
                  <h2 className="font-sketch text-xl sm:text-2xl font-bold text-chalk-ink leading-tight mb-1 pr-8">
                    {step === "ask" ? "API keys" : hasKey ? "Add another key" : "Connect your API key"}
                  </h2>
                  <p className="text-sm text-chalk-gray font-medium leading-relaxed">
                    {step === "ask"
                      ? "You already added an API key. Want to add another? If the first key fails, the next one is used automatically."
                      : "Keys are saved to your account, hashed, and stored encrypted. Only the start of the key is shown."}
                  </p>
                </div>
              </div>

              {keys.length > 0 && (
                <div className="mb-4 space-y-2">
                  {keys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-chalk-border rounded-xl"
                    >
                      <span className="text-[11px] font-semibold text-chalk-purple shrink-0">
                        {getProviderMeta((key.provider as ImageModelProvider) ?? "google").label}
                      </span>
                      <code className="flex-1 font-mono text-sm text-chalk-ink truncate">{key.hint}</code>
                      <button
                        type="button"
                        onClick={() => void removeApiKey(key.id)}
                        className="p-1.5 text-chalk-gray hover:text-red-600"
                        title="Remove key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {step === "ask" ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("add")}
                    className="flex-1 px-4 py-3 bg-chalk-ink text-white font-bold rounded-xl border-2 border-chalk-ink"
                  >
                    Add another key
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-3 border-2 border-chalk-border font-semibold rounded-xl bg-white"
                  >
                    Not now
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block font-sketch text-sm font-bold text-chalk-ink mb-2 tracking-wide">
                      Provider
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full h-11 justify-between rounded-xl border-2 border-chalk-border bg-white px-3 font-semibold"
                        >
                          {providerMeta.label}
                          <ChevronDown className="h-4 w-4 opacity-70" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-56">
                        {IMAGE_PROVIDERS.map((item) => (
                          <DropdownMenuItem key={item.id} onSelect={() => setProvider(item.id)}>
                            {item.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mb-4">
                    <label className="block font-sketch text-sm font-bold text-chalk-ink mb-2 tracking-wide">
                      {providerMeta.label} API key
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-chalk-purple">
                        <Sparkles className="w-4 h-4 stroke-[2]" />
                      </div>
                      <input
                        ref={inputRef}
                        type={showKey ? "text" : "password"}
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          if (status !== "idle") {
                            setStatus("idle");
                            setErrorMessage("");
                          }
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={providerMeta.keyPlaceholder}
                        autoComplete="off"
                        className="w-full pl-10 pr-12 py-3.5 bg-white border-2 border-chalk-border rounded-xl font-mono text-sm text-chalk-ink placeholder:text-chalk-gray/50 outline-none focus:border-chalk-purple focus:shadow-[0_0_0_3px_var(--chalk-purple-light)] transition-all duration-200 shadow-[2px_2px_0px_0px_var(--chalk-border)]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-chalk-gray hover:text-chalk-ink transition-colors"
                      >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {status === "error" && errorMessage && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, height: 0, y: -8 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -8 }}
                        className="mb-4 overflow-hidden"
                      >
                        <div className="flex items-start gap-2.5 px-4 py-3 bg-red-50 border-2 border-red-200 rounded-xl text-sm text-red-700">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 stroke-[2.5]" />
                          <span className="font-medium">{errorMessage}</span>
                        </div>
                      </motion.div>
                    )}
                    {status === "success" && (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, height: 0, y: -8 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -8 }}
                        className="mb-4 overflow-hidden"
                      >
                        <div className="flex items-center gap-2.5 px-4 py-3 bg-green-50 border-2 border-green-200 rounded-xl text-sm text-green-700">
                          <Check className="w-4 h-4 shrink-0 stroke-[2.5]" />
                          <span className="font-medium">API key verified and saved to your account.</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={() => void handleSave()}
                    disabled={status === "loading" || status === "success"}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-chalk-ink text-white font-bold rounded-xl border-2 border-chalk-ink
                               shadow-[4px_4px_0px_0px_var(--chalk-purple)] hover:shadow-[2px_2px_0px_0px_var(--chalk-purple)]
                               hover:-translate-y-0.5 active:translate-y-0 active:shadow-none
                               disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_var(--chalk-purple)]
                               transition-all duration-150 mb-4"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying key…</span>
                      </>
                    ) : status === "success" ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4 stroke-[2.5]" />
                        <span>{hasKey ? "Verify & add key" : "Verify & save key"}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-xs text-chalk-gray font-medium">
                    <span>Don&apos;t have a key?</span>
                    <a
                      href={providerMeta.docsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-chalk-purple hover:underline font-bold"
                    >
                      Get a key at {providerMeta.docsLabel}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
