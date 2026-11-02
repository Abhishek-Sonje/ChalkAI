"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Home, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

type BoardRow = {
  id: string;
  title: string;
};

export function BoardSwitcher({ currentBoardId }: { currentBoardId?: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [boards, setBoards] = useState<BoardRow[] | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    void fetch("/api/boards")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.boards) setBoards(data.boards);
      });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        onClick={() => setOpen((v) => !v)}
        variant="ghost"
        size="sm"
        className="h-8 rounded-xl border-2 border-chalk-border bg-white text-xs font-semibold px-2 sm:px-3"
      >
        <LayoutGrid className="w-3.5 h-3.5 sm:mr-1" />
        <span className="hidden sm:inline">Boards</span>
        <ChevronDown className={`w-3.5 h-3.5 ml-0.5 sm:ml-1 transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-[80] w-[min(16rem,calc(100vw-1.5rem))] bg-white border-2 border-chalk-border rounded-2xl shadow-[4px_4px_0px_0px_var(--chalk-border)] overflow-hidden">
          <div className="max-h-64 overflow-y-auto py-1">
            {boards === null ? (
              <p className="px-3 py-2 text-xs text-chalk-gray">Loading…</p>
            ) : boards.length === 0 ? (
              <p className="px-3 py-2 text-xs text-chalk-gray">No other boards yet</p>
            ) : (
              boards.map((board) => {
                const current = board.id === currentBoardId;
                return (
                  <button
                    key={board.id}
                    type="button"
                    disabled={current}
                    onClick={() => {
                      setOpen(false);
                      if (!current) router.push(`/board/${board.id}`);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold truncate ${
                      current
                        ? "bg-chalk-purple-light text-chalk-purple"
                        : "text-chalk-ink hover:bg-[#faf9f5]"
                    }`}
                  >
                    {board.title || "Untitled board"}
                    {current ? " · current" : ""}
                  </button>
                );
              })
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              router.push("/");
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-chalk-ink border-t-2 border-chalk-border hover:bg-[#faf9f5]"
          >
            <Home className="w-3.5 h-3.5" />
            Go to home
          </button>
        </div>
      )}
    </div>
  );
}
