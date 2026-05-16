"use client";

import { usePathname } from "next/navigation";
import { useUI } from "@/components/ui-provider";
import { cn } from "@/lib/utils";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isFullscreen } = useUI();
  const pathname = usePathname();
  const isBoardPage = pathname === "/board";

  return (
    <main className={cn(
      "transition-all duration-500 ease-in-out min-h-screen",
      (isFullscreen || isBoardPage) ? "pt-0" : "pt-8"
    )}>
      {children}
    </main>
  );
}
