"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "@/components/ui-provider";
import { cn } from "@/lib/utils";

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const { isFullscreen } = useUI();
  const pathname = usePathname();
  const isEditorPage = pathname.startsWith("/board/");

  if (pathname.startsWith("/share/") || isEditorPage) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[80] px-3 sm:px-[4vw] pt-3 sm:pt-5 pointer-events-none transition-transform duration-300 select-none",
        isFullscreen && "-translate-y-full",
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <header className="max-w-[1200px] mx-auto bg-[#faf9f5]/75 backdrop-blur-lg border-2 border-chalk-border rounded-2xl sm:rounded-full px-3 sm:px-6 py-2 sm:py-3 flex items-center justify-between gap-2 pointer-events-auto shadow-[4px_4px_0px_0px_var(--chalk-border)] hover:shadow-[5px_5px_0px_0px_var(--chalk-border)] transition-all duration-200">
        <Link
          href="/"
          className="font-sketch text-base sm:text-xl font-bold flex items-center gap-3 text-chalk-ink group relative shrink-0"
        >
          <span className="relative tracking-tight">
            Chalk AI
            <span className="absolute left-0 bottom-[-1px] w-0 h-[2px] bg-chalk-purple transition-all duration-300 group-hover:w-full rounded-full" />
          </span>
        </Link>

        <div className="flex items-center gap-2 font-medium">{children}</div>
      </header>
    </div>
  );
}
