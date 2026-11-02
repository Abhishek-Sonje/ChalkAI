"use client";

import { useState } from "react";
import { X } from "lucide-react";

const STEPS = [
  { title: "Draw", body: "Sketch shapes, arrows, or notes on the board." },
  { title: "Describe", body: "Type what you meant in the bar at the bottom." },
  { title: "Generate", body: "Press + or the sparkles to let AI clean it up." },
  { title: "Accept", body: "Press Tab to keep the suggestion, or Esc to discard it." },
];

export function BoardOnboarding({
  open,
  onDone,
}: {
  open: boolean;
  onDone: () => void;
}) {
  const [step, setStep] = useState(0);

  if (!open) return null;

  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[180] grid place-items-center p-4">
      <div className="absolute inset-0 bg-chalk-ink/40" onClick={onDone} />
      <div className="relative z-10 w-full max-w-md bg-white border-[3px] border-chalk-border rounded-3xl p-5 sm:p-7 shadow-[8px_8px_0px_0px_var(--chalk-border)]">
        <button
          type="button"
          onClick={onDone}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg border-2 border-chalk-border flex items-center justify-center"
          aria-label="Skip"
        >
          <X className="w-4 h-4" />
        </button>
        <p className="text-xs font-bold tracking-widest text-chalk-purple mb-2">
          STEP {step + 1} / {STEPS.length}
        </p>
        <h2 className="font-sketch text-2xl font-bold text-chalk-ink mb-2">
          {STEPS[step].title}
        </h2>
        <p className="text-sm text-chalk-gray font-medium mb-6">{STEPS[step].body}</p>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onDone}
            className="text-sm font-semibold text-chalk-gray hover:text-chalk-ink"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => {
              if (isLast) onDone();
              else setStep((s) => s + 1);
            }}
            className="px-5 py-2 bg-chalk-ink text-white text-sm font-semibold rounded-lg"
          >
            {isLast ? "Start drawing" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
