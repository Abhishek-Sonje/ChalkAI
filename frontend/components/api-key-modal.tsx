"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Key, ExternalLink, Check, AlertCircle, Loader2, X, Sparkles } from "lucide-react";
import { useApiKey } from "@/components/api-key-provider";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose?: () => void;
  /** If true, the modal cannot be dismissed without saving a key */
  required?: boolean;
}

export function ApiKeyModal({ isOpen, onClose, required = false }: ApiKeyModalProps) {
  const { setApiKey, apiKey } = useApiKey();
  const [inputValue, setInputValue] = useState(apiKey ?? "");
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue(apiKey ?? "");
      setStatus("idle");
      setErrorMessage("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, apiKey]);

  const handleSave = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setStatus("error");
      setErrorMessage("Please enter your Gemini API key.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: trimmed }),
      });
      const data = await res.json();

      if (data.valid) {
        setApiKey(trimmed);
        setStatus("success");
        setTimeout(() => {
          onClose?.();
        }, 1200);
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
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape" && !required) onClose?.();
  };

  const isExistingKey = !!apiKey;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!required ? onClose : undefined}
            className="absolute inset-0 bg-chalk-ink/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-lg bg-[#faf9f5] border-[3px] border-chalk-border rounded-3xl shadow-[10px_10px_0px_0px_var(--chalk-border)] overflow-hidden z-10"
          >
            {/* Close button */}
            {!required && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-9 h-9 border-2 border-chalk-border bg-white rounded-xl flex items-center justify-center text-chalk-gray hover:text-chalk-ink hover:rotate-90 transition-all duration-200 shadow-[1.5px_1.5px_0px_0px_var(--chalk-border)]"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}

            {/* Purple accent header stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-chalk-purple via-chalk-purple/70 to-transparent" />

            <div className="p-8">
              {/* Icon + Title */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-chalk-purple-light border-[2.5px] border-chalk-border rounded-2xl flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_var(--chalk-border)]">
                  <Key className="w-6 h-6 text-chalk-purple stroke-[2]" />
                </div>
                <div>
                  <h2 className="font-sketch text-2xl font-bold text-chalk-ink leading-tight mb-1">
                    {isExistingKey ? "Update API Key" : "Connect Your Gemini Key"}
                  </h2>
                  <p className="text-sm text-chalk-gray font-medium leading-relaxed">
                    {isExistingKey
                      ? "Replace your existing Gemini API key."
                      : "Chalk AI uses Google Gemini to enhance your drawings. Your key is stored locally and never sent to our servers."}
                  </p>
                </div>
              </div>

              {/* Input */}
              <div className="mb-4">
                <label className="block font-sketch text-sm font-bold text-chalk-ink mb-2 tracking-wide">
                  Gemini API Key
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
                      if (status !== "idle") { setStatus("idle"); setErrorMessage(""); }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="AIza..."
                    className="w-full pl-10 pr-12 py-3.5 bg-white border-[2px] border-chalk-border rounded-xl font-mono text-sm text-chalk-ink placeholder:text-chalk-gray/50 outline-none focus:border-chalk-purple focus:shadow-[0_0_0_3px_var(--chalk-purple-light)] transition-all duration-200 shadow-[2px_2px_0px_0px_var(--chalk-border)]"
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

              {/* Status / Error message */}
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
                      <span className="font-medium">API key verified and saved! You're all set.</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Save Button */}
              <button
                onClick={handleSave}
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
                    <span>Verified!</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4 stroke-[2.5]" />
                    <span>{isExistingKey ? "Update & Verify Key" : "Verify & Save Key"}</span>
                  </>
                )}
              </button>

              {/* Get key link */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-chalk-gray font-medium">
                <span>Don't have a key?</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-chalk-purple hover:underline font-bold"
                >
                  Get one free at Google AI Studio
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
