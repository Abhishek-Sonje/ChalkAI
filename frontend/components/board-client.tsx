"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Whiteboard } from "@/components/whiteboard";
import { IntentInput } from "@/components/intent-input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, RotateCcw, Sparkles, Check, X, Mic, MicOff, Maximize2, Minimize2, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/components/ui-provider";
import { cn } from "@/lib/utils";
import { useApiKey } from "@/components/api-key-provider";
import { ApiKeyModal } from "@/components/api-key-modal";


export function BoardClient() {
  const { isFullscreen, toggleFullscreen } = useUI();
  const { apiKey, hasKey, isLoaded } = useApiKey();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [intent, setIntent] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const exportFnRef = useRef<(() => Promise<string | null>) | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [agentTranscript, setAgentTranscript] = useState("");
  const agentTranscriptRef = useRef("");
  const recognitionRef = useRef<any>(null);
  const idleCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isListeningRef = useRef(false);
  const lastActivityTimeRef = useRef(Date.now());

  // Sync refs with state
  useEffect(() => {
    agentTranscriptRef.current = agentTranscript;
  }, [agentTranscript]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const handleExportReady = useCallback(
    (exportFn: () => Promise<string | null>) => {
      exportFnRef.current = exportFn;
    },
    []
  );

  const handleRequestSuggestion = useCallback(async (overridePrompt?: string) => {
    if (!exportFnRef.current) {
      setError("Canvas not ready. Please wait a moment and try again.");
      return;
    }

    const promptText = typeof overridePrompt === "string" ? overridePrompt : intent;

    if (!promptText.trim()) {
      setError("Please provide an intent description");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const imageDataUrl = await exportFnRef.current();
      let base64Image: string | undefined;

      if (imageDataUrl) {
        if (imageDataUrl.startsWith("data:image/png;base64,")) {
          base64Image = imageDataUrl.replace("data:image/png;base64,", "");
        } else {
          const response = await fetch(imageDataUrl);
          const blob = await response.blob();
          const reader = new FileReader();
          await new Promise((resolve, reject) => {
            reader.onloadend = resolve;
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          const dataUrl = reader.result as string;
          base64Image = dataUrl.replace("data:image/png;base64,", "");
        }
      }

      const apiResponse = await fetch("/api/complete-diagram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-gemini-api-key": apiKey } : {}),
        },
        body: JSON.stringify({
          prompt: promptText,
          image_data: base64Image,
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        if (errorData.error === "NO_API_KEY") {
          setShowApiKeyModal(true);
          throw new Error("Please set up your Gemini API key to use AI features.");
        }
        throw new Error(errorData.error || "Failed to get AI suggestion");
      }

      const data = await apiResponse.json();
      setGeneratedImage(data.image_data);
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to get AI suggestion"
      );
    } finally {
      setIsLoading(false);
    }
  }, [intent]);

  const handleAcceptSuggestion = useCallback(() => {
    setGeneratedImage(null);
    setIntent("");
    setResetSignal((prev) => prev + 1);
  }, []);

  const handleClearCanvas = useCallback(() => {
    setGeneratedImage(null);
    setError(null);
    setIntent("");
    setResetSignal((prev) => prev + 1);
  }, []);

  const handleRejectSuggestion = useCallback(() => {
    setGeneratedImage(null);
  }, []);

  useEffect(() => {
    if (!generatedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleRejectSuggestion();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [generatedImage, handleRejectSuggestion]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        }
      }
      if (finalTranscript) {
        setAgentTranscript((prev) => prev + finalTranscript);
        lastActivityTimeRef.current = Date.now();
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        try { recognition.start(); } catch (e) {}
      }
    };

    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, []);

  const toggleListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      if (idleCheckIntervalRef.current) {
        clearInterval(idleCheckIntervalRef.current);
        idleCheckIntervalRef.current = null;
      }
      setIsListening(false);
      isListeningRef.current = false;
      if (agentTranscriptRef.current.trim()) {
        handleRequestSuggestion(agentTranscriptRef.current.trim());
      }
    } else {
      setAgentTranscript("");
      agentTranscriptRef.current = "";
      lastActivityTimeRef.current = Date.now();
      try {
        recognition.start();
        setIsListening(true);
        isListeningRef.current = true;
        idleCheckIntervalRef.current = setInterval(() => {
          const idleTime = Date.now() - lastActivityTimeRef.current;
          if (idleTime > 4500 && agentTranscriptRef.current.trim() && isListeningRef.current) {
            handleRequestSuggestion(agentTranscriptRef.current.trim());
            recognition.stop();
            setIsListening(false);
            isListeningRef.current = false;
            if (idleCheckIntervalRef.current) {
              clearInterval(idleCheckIntervalRef.current);
              idleCheckIntervalRef.current = null;
            }
          }
        }, 500);
      } catch (e) {}
    }
  }, [isListening, handleRequestSuggestion]);

  const handleDrawingActivity = useCallback(() => {
    lastActivityTimeRef.current = Date.now();
  }, []);

  if (!isMounted) return null;

  // Show API key setup if key not loaded yet or missing
  if (isLoaded && !hasKey) {
    return (
      <div className="relative w-full h-screen bg-[#faf9f5] flex flex-col items-center justify-center gap-6 overflow-hidden">
        {/* Dot grid background */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.5" fill="#e0dfd7" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>

        <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-md px-6">
          <div className="w-20 h-20 bg-chalk-purple-light border-[3px] border-chalk-border rounded-3xl flex items-center justify-center shadow-[5px_5px_0px_0px_var(--chalk-border)]">
            <Key className="w-9 h-9 text-chalk-purple stroke-[1.5]" />
          </div>
          <div>
            <h2 className="font-sketch text-3xl font-black text-chalk-ink mb-2">Almost there!</h2>
            <p className="text-chalk-gray font-medium leading-relaxed">
              Chalk AI needs your <strong className="text-chalk-ink">Gemini API key</strong> to power AI diagram generation. Your key is stored locally and never shared.
            </p>
          </div>
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-chalk-ink text-white font-bold rounded-2xl border-2 border-chalk-ink
                       shadow-[5px_5px_0px_0px_var(--chalk-purple)] hover:shadow-[2px_2px_0px_0px_var(--chalk-purple)]
                       hover:-translate-y-0.5 active:translate-y-0 active:shadow-none
                       transition-all duration-150"
          >
            <Key className="w-4 h-4 stroke-[2.5]" />
            Connect Gemini API Key
          </button>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-chalk-gray hover:text-chalk-purple transition-colors font-medium"
          >
            Get a free key at Google AI Studio →
          </a>
        </div>

        <ApiKeyModal
          isOpen={showApiKeyModal}
          onClose={() => setShowApiKeyModal(false)}
          required={!hasKey}
        />
      </div>
    );
  }

  return (
    <div className={cn(
      "relative w-full bg-background overflow-hidden font-sans transition-all duration-500",
      isFullscreen ? "h-screen" : "h-[calc(100vh-64px)]"
    )}>
      <div className="absolute inset-0 z-0">
        <Whiteboard
          onExportReady={handleExportReady}
          generatedImage={generatedImage}
          onAcceptSuggestion={handleAcceptSuggestion}
          onDrawingActivity={handleDrawingActivity}
        />
      </div>

      <div className="absolute bottom-24 backdrop-blur-md left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4 pointer-events-none">
        <motion.div
          layout
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="glass rounded-2xl shadow-2xl pointer-events-auto flex flex-col gap-2 "
        >
          <div className="flex items-center m-2 gap-2 p-1">
            <Button
              onClick={() => handleRequestSuggestion("Enhance this sketch into a professional diagram.")}
              disabled={isLoading}
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-full text-muted-foreground  hover:text-foreground hover:bg-muted/50"
              title="Improvise (Quick Enhance)"
            >
              <Sparkles className="w-5 h-5" />
            </Button>
            
            <IntentInput
              onIntentChange={setIntent}
              onSubmit={handleRequestSuggestion}
              disabled={isLoading}
              resetSignal={resetSignal}
            />

            <Button
              onClick={() => handleRequestSuggestion()}
              disabled={isLoading || (!intent.trim() && !agentTranscript.trim())}
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </Button>

            <Button
              onClick={toggleListening}
              disabled={isLoading}
              variant={isListening ? "default" : "ghost"}
              size="icon"
              className={`h-10 w-10 shrink-0 rounded-xl transition-all ${
                isListening 
                  ? "bg-red-500 text-white hover:bg-red-600 animate-pulse" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

          {/* API Key Settings */}
            <Button
              onClick={() => setShowApiKeyModal(true)}
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
              title="Gemini API Key Settings"
            >
              <Key className="h-4 w-4" />
            </Button>

            {/* Fullscreen Button */}
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
          </div>

          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-2 text-xs bg-red-50/50 rounded-lg mx-1 mb-1 border border-red-100/50">
                  <div className="flex items-center gap-2 text-red-600 font-medium mb-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Listening...
                  </div>
                  <p className="text-muted-foreground italic">
                    {agentTranscript || "Start speaking..."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 py-2 text-xs text-red-500 bg-red-50/50 rounded-lg mx-1 mb-1 border border-red-100/50">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleClearCanvas}
            disabled={isLoading}
            className="pointer-events-auto absolute -right-12 bottom-4 p-3 glass rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground hover:rotate-90 transform duration-300"
            title="Clear Canvas"
        >
           <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>

      <AnimatePresence>
        {generatedImage && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-8 right-8 z-30 glass p-4 rounded-3xl shadow-2xl flex flex-col gap-4 w-auto max-w-[300px] origin-bottom-right"
          >
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow-lg">
                    AI
                  </span>
                  <span className="text-sm font-semibold tracking-tight">Suggestion</span>
                </div>
                <Button
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRejectSuggestion}
                  className="h-8 w-8 rounded-full hover:bg-black/5"
                >
                  <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 overflow-hidden flex items-center justify-center relative min-h-[200px] max-h-[400px]">
              <img
                src={`data:image/png;base64,${generatedImage}`}
                alt="Refined diagram"
                className="max-w-full max-h-[400px] object-contain"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={handleRejectSuggestion}
                  className="rounded-xl border-black/10 hover:bg-black/5 hover:text-red-600 hover:border-red-200 transition-colors h-9 px-4 text-xs"
                >
                  <X className="w-3.5 h-3.5 mr-1.5" />
                  Reject (Esc)
                </Button>
                <Button
                  onClick={handleAcceptSuggestion}
                  className="rounded-xl bg-black text-white hover:bg-black/90 hover:scale-105 transition-all shadow-lg shadow-black/20 h-9 px-6 text-xs"
                >
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  Accept (Tab)
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        required={false}
      />
    </div>
  );
}
