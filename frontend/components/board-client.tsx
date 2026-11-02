"use client";

import { useState, useCallback, useRef, useEffect, type ReactElement } from "react";
import { Whiteboard } from "@/components/whiteboard";
import { IntentInput } from "@/components/intent-input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Sparkles, Check, X, Mic, MicOff, Key, Link2, CheckCheck, LayoutTemplate, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApiKey } from "@/components/api-key-provider";
import { ApiKeyModal } from "@/components/api-key-modal";
import { BoardOnboarding } from "@/components/board-onboarding";
import { ExampleGallery } from "@/components/example-gallery";
import { BoardSwitcher } from "@/components/board-switcher";
import { ModelPicker } from "@/components/model-picker";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { loadExampleSketch, takePersistableSnapshot, type ExampleSketchId } from "@/lib/example-sketches";
import { cn } from "@/lib/utils";
import type { Editor } from "@tldraw/tldraw";

function ActionTip({ label, children }: { label: string; children: ReactElement }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

type BoardClientProps = {
  licenseKey?: string;
  boardId?: string;
  initialTitle?: string;
  initialSnapshot?: unknown;
  initialShareId?: string | null;
  showOnboarding?: boolean;
};

export function BoardClient({
  licenseKey,
  boardId,
  initialTitle = "Untitled board",
  initialSnapshot = null,
  initialShareId = null,
  showOnboarding = false,
}: BoardClientProps) {
  const { hasKey, isLoaded, selectedModelId } = useApiKey();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [compactBar, setCompactBar] = useState(false);
  const [intent, setIntent] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSignal, setResetSignal] = useState(0);
  const exportFnRef = useRef<(() => Promise<string | null>) | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [shareId, setShareId] = useState<string | null>(initialShareId);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "idle">("saved");
  const [copied, setCopied] = useState(false);
  const [showExamples, setShowExamples] = useState(!initialSnapshot);
  const [examplesConfirmOpen, setExamplesConfirmOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(showOnboarding);
  const editorRef = useRef<Editor | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const acceptAiRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [agentTranscript, setAgentTranscript] = useState("");
  const agentTranscriptRef = useRef("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
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
        },
        body: JSON.stringify({
          prompt: promptText,
          image_data: base64Image,
          model: selectedModelId,
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
  }, [intent, selectedModelId]);

  const persistBoard = useCallback(
    async (payload: { title?: string; snapshot?: unknown }) => {
      if (!boardId) return;
      setSaveState("saving");
      try {
        const res = await fetch(`/api/boards/${boardId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setSaveState(res.ok ? "saved" : "idle");
      } catch {
        setSaveState("idle");
      }
    },
    [boardId]
  );

  const handleSnapshot = useCallback(
    (snapshot: unknown, opts?: { immediate?: boolean }) => {
      if (!boardId) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSaveState("saving");
      if (opts?.immediate) {
        void persistBoard({ snapshot });
        return;
      }
      saveTimer.current = setTimeout(() => {
        void persistBoard({ snapshot });
      }, 1600);
    },
    [boardId, persistBoard]
  );

  const handleTitleBlur = useCallback(() => {
    const next = title.trim() || "Untitled board";
    setTitle(next);
    void persistBoard({ title: next });
  }, [title, persistBoard]);

  const handleShare = useCallback(async () => {
    if (!boardId) return;
    const res = await fetch(`/api/boards/${boardId}/share`, { method: "POST" });
    if (!res.ok) return;
    const data = await res.json();
    const id = data.board.shareId as string;
    setShareId(id);
    const url = `${window.location.origin}/share/${id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [boardId]);

  const closeExamples = useCallback(() => {
    setShowExamples(false);
  }, []);

  const boardHasContent = useCallback(() => {
    if (generatedImage) return true;
    const editor = editorRef.current;
    if (!editor) return false;
    return editor.getCurrentPageShapeIds().size > 0;
  }, [generatedImage]);

  const openExamples = useCallback(() => {
    if (showExamples) {
      setShowExamples(false);
      setExamplesConfirmOpen(false);
      return;
    }
    if (boardHasContent()) {
      setExamplesConfirmOpen(true);
      return;
    }
    setShowExamples(true);
  }, [showExamples, boardHasContent]);

  const confirmOpenExamples = useCallback(() => {
    setExamplesConfirmOpen(false);
    setShowExamples(true);
  }, []);

  const handlePickExample = useCallback((id: ExampleSketchId) => {
    const apply = (attempt = 0) => {
      const editor = editorRef.current;
      if (!editor) {
        if (attempt < 20) {
          window.setTimeout(() => apply(attempt + 1), 50);
          return;
        }
        setError("Canvas not ready. Try again in a moment.");
        closeExamples();
        return;
      }
      try {
        loadExampleSketch(editor, id);
        closeExamples();
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Could not load that example. Try drawing instead.");
        closeExamples();
      }
    };
    apply();
  }, [closeExamples]);

  const finishOnboarding = useCallback(() => {
    setOnboardingOpen(false);
    void fetch("/api/account", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboardingComplete: true }),
    });
  }, []);

  const handleAcceptSuggestion = useCallback(() => {
    setGeneratedImage(null);
    setIntent("");
    setResetSignal((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const flush = () => {
      if (!boardId || !editorRef.current) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      void takePersistableSnapshot(editorRef.current).then((snapshot) => {
        void persistBoard({ snapshot });
      });
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
    };
  }, [boardId, persistBoard]);

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
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
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
        try {
          recognition.start();
        } catch {
          // already started
        }
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
      } catch {
        // recognition start can throw if already running
      }
    }
  }, [isListening, handleRequestSuggestion]);

  const handleDrawingActivity = useCallback(() => {
    lastActivityTimeRef.current = Date.now();
  }, []);

  if (!isMounted) return null;

  // Show API key setup if key not loaded yet or missing
  if (isLoaded && !hasKey) {
    return (
      <div className="relative w-full min-h-dvh bg-[#faf9f5] flex flex-col items-center justify-center gap-6 overflow-hidden">
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
            <h2 className="font-sketch text-2xl sm:text-3xl font-black text-chalk-ink mb-2">Almost there!</h2>
            <p className="text-chalk-gray font-medium leading-relaxed">
              Chalk AI needs a <strong className="text-chalk-ink">Gemini API key</strong> to generate diagrams. It is hashed and encrypted on your account.
            </p>
          </div>
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 bg-chalk-ink text-white font-bold rounded-2xl border-2 border-chalk-ink
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
    <TooltipProvider delayDuration={200}>
    <div className="relative w-full h-dvh bg-background overflow-hidden font-sans">
      <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-0.75rem)] max-w-4xl flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pointer-events-auto px-0.5">
        <BoardSwitcher currentBoardId={boardId} />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          className="px-2 sm:px-3 py-1.5 text-sm font-semibold bg-white/90 border-2 border-chalk-border rounded-xl text-center min-w-0 w-[7.5rem] sm:min-w-[160px] sm:w-auto sm:max-w-[240px] outline-none focus:border-chalk-purple"
        />
        <span className="hidden md:inline text-[11px] text-chalk-gray font-medium px-2">
          {saveState === "saving" ? "Saving…" : "Saved"}
        </span>
        <ActionTip label={copied ? "Link copied" : shareId ? "Copy share link" : "Share board"}>
          <Button
            onClick={handleShare}
            variant="ghost"
            size="sm"
            className="h-8 rounded-xl border-2 border-chalk-border bg-white text-xs font-semibold px-2 sm:px-3"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5 sm:mr-1" /> : <Link2 className="w-3.5 h-3.5 sm:mr-1" />}
            <span className="hidden sm:inline">{copied ? "Copied" : shareId ? "Copy link" : "Share"}</span>
          </Button>
        </ActionTip>
        <ActionTip label="Example sketches">
          <Button
            onClick={openExamples}
            variant="ghost"
            size="sm"
            className="h-8 rounded-xl border-2 border-chalk-border bg-white text-xs font-semibold px-2 sm:px-3"
          >
            <LayoutTemplate className="w-3.5 h-3.5 sm:mr-1" />
            <span className="hidden sm:inline">Examples</span>
          </Button>
        </ActionTip>
      </div>

      <div className="absolute inset-0">
        <Whiteboard
          onExportReady={handleExportReady}
          generatedImage={generatedImage}
          onAcceptSuggestion={handleAcceptSuggestion}
          onBindAccept={(fn) => {
            acceptAiRef.current = fn;
          }}
          onDrawingActivity={handleDrawingActivity}
          licenseKey={licenseKey}
          snapshot={initialSnapshot}
          onSnapshot={handleSnapshot}
          onEditor={(editor) => {
            editorRef.current = editor;
          }}
        />
      </div>

      {showExamples && (
        <ExampleGallery
          onPick={handlePickExample}
          onClose={closeExamples}
        />
      )}
      {examplesConfirmOpen && (
        <div className="fixed inset-0 z-[200] grid place-items-center p-4">
          <button
            type="button"
            aria-label="Cancel"
            className="absolute inset-0 bg-chalk-ink/40 backdrop-blur-[2px]"
            onClick={() => setExamplesConfirmOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white border-[3px] border-chalk-border rounded-3xl p-5 sm:p-7 shadow-[8px_8px_0px_0px_var(--chalk-border)]">
            <div className="w-12 h-12 border-2 border-chalk-border bg-chalk-purple-light rounded-2xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-chalk-purple stroke-[2]" />
            </div>
            <h2 className="font-sketch text-2xl font-bold text-chalk-ink mb-2">
              Replace this board?
            </h2>
            <p className="text-sm text-chalk-gray font-medium leading-relaxed mb-6">
              Loading an example removes the drawings and images currently on this board. Are you sure you want to continue?
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setExamplesConfirmOpen(false)}
                className="px-4 py-2.5 border-2 border-chalk-border text-sm font-semibold rounded-xl bg-white hover:bg-[#faf9f5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmOpenExamples}
                className="px-4 py-2.5 bg-chalk-ink text-white text-sm font-semibold rounded-xl"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      <BoardOnboarding open={onboardingOpen} onDone={finishOnboarding} />

      <div
        className={cn(
          "absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-[15] px-2 sm:px-4 pointer-events-none transition-all duration-300",
          compactBar ? "w-auto max-w-[calc(100vw-1rem)]" : "w-[calc(100%-0.75rem)] max-w-3xl"
        )}
      >
        <motion.div
          layout
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={cn(
            "glass rounded-2xl shadow-2xl pointer-events-auto flex flex-col gap-2 relative",
            compactBar ? "py-1" : "p-1"
          )}
        >
          <div
            className={cn(
              compactBar
                ? "flex items-center gap-1 m-1 p-0.5"
                : "flex flex-col md:flex-row md:items-center gap-1 m-1.5 sm:m-2 p-1"
            )}
          >
            <div className={cn("flex items-center gap-1 min-w-0", !compactBar && "w-full md:flex-1")}>
            <ActionTip label="Improve sketch">
              <Button
                onClick={() => handleRequestSuggestion("Enhance this sketch into a professional diagram.")}
                disabled={isLoading}
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <Sparkles className="w-5 h-5" />
              </Button>
            </ActionTip>

            {!compactBar && (
              <IntentInput
                onIntentChange={setIntent}
                onSubmit={handleRequestSuggestion}
                disabled={isLoading}
                resetSignal={resetSignal}
              />
            )}
            </div>

            <div className={cn("flex items-center gap-1 shrink-0", !compactBar && "w-full md:w-auto justify-between md:justify-start overflow-x-auto")}>
            <ActionTip label="Generate diagram">
              <Button
                onClick={() =>
                  handleRequestSuggestion(
                    compactBar && !intent.trim() && !agentTranscript.trim()
                      ? "Enhance this sketch into a professional diagram."
                      : undefined
                  )
                }
                disabled={isLoading || (!compactBar && !intent.trim() && !agentTranscript.trim())}
                size="icon"
                className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-sm"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </Button>
            </ActionTip>

            <ActionTip label={isListening ? "Stop voice input" : "Voice input"}>
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
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
            </ActionTip>

            {!compactBar && (
              <>
                <div className="min-w-0 flex-1 md:flex-none">
                  <ModelPicker />
                </div>
                <ActionTip label="API keys">
                  <Button
                    onClick={() => setShowApiKeyModal(true)}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 shrink-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    <Key className="h-4 w-4" />
                  </Button>
                </ActionTip>
              </>
            )}

            <ActionTip label={compactBar ? "Show more options" : "Hide extra options"}>
              <Button
                onClick={() => setCompactBar((v) => !v)}
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 font-semibold"
              >
                {compactBar ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </ActionTip>
            </div>
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
      </div>

      <AnimatePresence>
        {generatedImage && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-24 left-3 right-3 sm:left-auto sm:right-8 sm:bottom-8 z-30 glass p-3 sm:p-4 rounded-3xl shadow-2xl flex flex-col gap-4 w-auto max-w-none sm:max-w-[300px] origin-bottom-right"
          >
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow-lg">
                    AI
                  </span>
                  <span className="text-sm font-semibold tracking-tight">Suggestion</span>
                </div>
                <ActionTip label="Dismiss suggestion">
                  <Button
                    variant="ghost" 
                    size="icon" 
                    onClick={handleRejectSuggestion}
                    className="h-8 w-8 rounded-full hover:bg-black/5"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </ActionTip>
            </div>

            <div className="bg-white rounded-2xl border border-black/5 overflow-hidden flex items-center justify-center relative min-h-[140px] sm:min-h-[200px] max-h-[40vh] sm:max-h-[400px]">
              <img
                src={`data:image/png;base64,${generatedImage}`}
                alt="Refined diagram"
                className="max-w-full max-h-[40vh] sm:max-h-[400px] object-contain"
              />
            </div>

            <div className="flex items-center justify-end gap-2 sm:gap-3 pt-1">
                <Button
                  variant="outline"
                  onClick={handleRejectSuggestion}
                  className="rounded-xl border-black/10 hover:bg-black/5 hover:text-red-600 hover:border-red-200 transition-colors h-9 px-4 text-xs"
                >
                  <X className="w-3.5 h-3.5 mr-1.5" />
                  Reject<span className="hidden sm:inline"> (Esc)</span>
                </Button>
                <Button
                  onClick={() => acceptAiRef.current?.()}
                  className="rounded-xl bg-black text-white hover:bg-black/90 hover:scale-105 transition-all shadow-lg shadow-black/20 h-9 px-4 sm:px-6 text-xs"
                >
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  Accept<span className="hidden sm:inline"> (Tab)</span>
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
    </TooltipProvider>
  );
}
