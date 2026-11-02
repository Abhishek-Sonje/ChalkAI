"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, Link2 } from "lucide-react";

type BoardRow = {
  id: string;
  title: string;
  shareId: string | null;
  updatedAt: string;
};

export function BoardsClient() {
  const router = useRouter();
  const [boards, setBoards] = useState<BoardRow[] | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/boards")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { boards?: BoardRow[] } | null) => {
        if (!cancelled && data?.boards) setBoards(data.boards);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const createBoard = async () => {
    setCreating(true);
    const res = await fetch("/api/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled board" }),
    });
    const data = await res.json();
    if (data.board?.id) router.push(`/board/${data.board.id}`);
    else setCreating(false);
  };

  const deleteBoard = async (id: string) => {
    if (!confirm("Delete this board?")) return;
    await fetch(`/api/boards/${id}`, { method: "DELETE" });
    setBoards((rows) => rows?.filter((b) => b.id !== id) ?? null);
  };

  return (
    <div className="max-w-[1100px] mx-auto px-[5vw] pb-16 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="font-sketch text-3xl sm:text-4xl text-chalk-ink">My boards</h1>
          <p className="text-sm text-chalk-gray mt-2 font-medium">
            Pick up where you left off, or start a new sketch.
          </p>
        </div>
        <button
          onClick={() => void createBoard()}
          disabled={creating}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-chalk-ink text-white font-semibold rounded-xl hover:-translate-y-0.5 transition-transform disabled:opacity-60 w-full sm:w-auto"
        >
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          New board
        </button>
      </div>

      {boards === null ? (
        <div className="flex justify-center py-20 text-chalk-gray">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : boards.length === 0 ? (
        <div className="border-2 border-dashed border-chalk-border rounded-3xl p-12 text-center bg-white">
          <p className="font-sketch text-xl text-chalk-ink mb-2">No boards yet</p>
          <p className="text-sm text-chalk-gray mb-6">Create one and try an example sketch.</p>
          <button
            onClick={() => void createBoard()}
            className="px-5 py-2.5 bg-chalk-ink text-white font-semibold rounded-xl"
          >
            Create your first board
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {boards.map((board) => (
            <div
              key={board.id}
              className="bg-white border-2 border-chalk-border rounded-2xl p-5 shadow-[4px_4px_0px_0px_var(--chalk-border)] flex flex-col gap-4"
            >
              <Link href={`/board/${board.id}`} className="flex-1">
                <h2 className="font-sketch text-xl text-chalk-ink">{board.title}</h2>
                <p className="text-xs text-chalk-gray mt-1">
                  Updated {new Date(board.updatedAt).toLocaleString()}
                </p>
              </Link>
              <div className="flex items-center justify-between">
                {board.shareId ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-chalk-purple">
                    <Link2 className="w-3 h-3" /> Shared
                  </span>
                ) : (
                  <span className="text-xs text-chalk-gray">Private</span>
                )}
                <button
                  type="button"
                  onClick={() => void deleteBoard(board.id)}
                  className="p-2 rounded-lg text-chalk-gray hover:text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
