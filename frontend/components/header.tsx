"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUI } from "@/components/ui-provider";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const { isFullscreen, toggleFullscreen } = useUI();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isBoardPage = pathname === "/board";

  if (isBoardPage) {
    return (
      <div className="fixed top-12 left-2 z-[100] pointer-events-auto">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md border-2 border-chalk-border rounded-xl font-sketch text-chalk-ink font-bold shadow-[3px_3px_0px_0px_var(--chalk-border)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <div className="w-6 h-6 bg-chalk-purple-light border border-chalk-border rounded-lg flex items-center justify-center">
            <Pencil className="w-3 h-3 text-chalk-purple" />
          </div>
          <span>Home</span>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-[4vw] pt-5 pointer-events-none transition-transform duration-300 select-none",
        isFullscreen && "-translate-y-full",
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <header className="max-w-[1200px] mx-auto bg-[#faf9f5]/75 backdrop-blur-lg border-2 border-chalk-border rounded-full px-6 py-3 flex items-center justify-between pointer-events-auto shadow-[4px_4px_0px_0px_var(--chalk-border)] hover:shadow-[5px_5px_0px_0px_var(--chalk-border)] transition-all duration-200">
        {/* BRAND SIGNATURE IDENTIFIER */}
        <Link
          href="/"
          className="font-sketch text-xl font-bold flex items-center gap-3 text-chalk-ink group relative"
        >
          {/* Stylized Modern Pencil Container */}
          <div className="w-8 h-8 bg-chalk-purple-light border-2 border-chalk-border rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-200 shadow-[1.5px_1.5px_0px_0px_var(--chalk-border)]">
            <Pencil className="w-4 h-4 text-chalk-purple stroke-[2.5]" />
          </div>
          <span className="relative tracking-tight">
            Chalk AI
            <span className="absolute left-0 bottom-[-1px] w-0 h-[2px] bg-chalk-purple transition-all duration-300 group-hover:w-full rounded-full" />
          </span>
        </Link>

        {/* ACTIONS RACK WRAPPER */}
        <div className="flex items-center gap-3">
          {/* MODERN FULLSCREEN TOGGLE */}
          {!isHomePage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="h-9 w-9 border-2 border-chalk-border bg-white rounded-full text-chalk-gray hover:text-chalk-purple hover:bg-[#f1ebfa]
                         shadow-[1.5px_1.5px_0px_0px_var(--chalk-border)] hover:shadow-[2.5px_2.5px_0px_0px_var(--chalk-border)]
                         hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0px_0px_0px_0px_transparent]
                         transition-all duration-150"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <Maximize2 className="w-4 h-4 stroke-[2.5]" />
              )}
            </Button>
          )}

          {/* CHALK-STYLE CONTAINER DIVIDER */}
          {!isHomePage && <div className="w-[1.5px] h-5 bg-chalk-border/20 self-center mx-0.5" />}

          {/* AUTH SLOTS / CHILD INJECTIONS */}
          <div className="flex items-center gap-2 font-medium">{children}</div>
        </div>
      </header>
    </div>
  );
}
