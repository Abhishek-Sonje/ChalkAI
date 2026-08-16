"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { EXAMPLE_SKETCHES, type ExampleSketchId } from "@/lib/example-sketches";
import { useIsClient } from "@/lib/use-is-client";

const AUTO_CLOSE_MS = 10_000;

export function ExampleGallery({
  onPick,
  onClose,
}: {
  onPick: (id: ExampleSketchId) => void;
  onClose: () => void;
}) {
  const mounted = useIsClient();
  const [remaining, setRemaining] = useState(10);

  useEffect(() => {
    const closeTimer = window.setTimeout(onClose, AUTO_CLOSE_MS);
    const tick = window.setInterval(() => {
      setRemaining((s) => Math.max(0, s - 1));
    }, 1000);
    return () => {
      window.clearTimeout(closeTimer);
      window.clearInterval(tick);
    };
  }, [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[20000] grid place-items-center p-4 pointer-events-auto">
      <button
        type="button"
        aria-label="Dismiss examples"
        onClick={onClose}
        className="absolute inset-0 bg-chalk-ink/35 backdrop-blur-[2px]"
      />
      <div className="relative z-10 w-[min(92vw,560px)] max-h-[min(90dvh,36rem)] overflow-y-auto bg-white border-2 border-chalk-border rounded-2xl p-4 sm:p-5 shadow-[6px_6px_0px_0px_var(--chalk-border)]">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="font-sketch text-lg font-bold text-chalk-ink">Start from an example</p>
            <p className="text-xs text-chalk-gray mt-0.5">Closes in {remaining}s</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close examples"
            className="w-8 h-8 rounded-xl border-2 border-chalk-border bg-white flex items-center justify-center text-chalk-ink hover:text-chalk-purple"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXAMPLE_SKETCHES.map((example) => (
            <button
              key={example.id}
              type="button"
              onClick={() => onPick(example.id)}
              className="text-left p-3 rounded-xl border-2 border-chalk-border hover:border-chalk-purple hover:bg-chalk-purple-light/40 transition-colors"
            >
              <div className="font-semibold text-sm text-chalk-ink">{example.title}</div>
              <div className="text-xs text-chalk-gray mt-1">{example.blurb}</div>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
