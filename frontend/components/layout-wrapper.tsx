"use client";

import { usePathname } from "next/navigation";
import { useUI } from "@/components/ui-provider";
import { cn } from "@/lib/utils";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isFullscreen } = useUI();
  const pathname = usePathname();
  const isCanvasPage =
    pathname.startsWith("/board/") || pathname.startsWith("/share/");
  const isAppPage =
    pathname.startsWith("/boards") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/home");

  return (
    <main
      className={cn(
        "min-h-screen",
        isCanvasPage || isFullscreen ? "pt-0" : isAppPage ? "pt-24 sm:pt-36" : "pt-20 sm:pt-24"
      )}
    >
      {children}
    </main>
  );
}
