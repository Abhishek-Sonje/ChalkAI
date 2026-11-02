"use client";

import { Whiteboard } from "@/components/whiteboard";
import { getTldrawLicenseKey } from "@/lib/tldraw-license";
import { useIsClient } from "@/lib/use-is-client";

export function ShareViewer({
  title,
  snapshot,
}: {
  title: string;
  snapshot: unknown;
}) {
  const mounted = useIsClient();
  if (!mounted) return null;

  return (
    <div className="relative w-full h-dvh bg-[#faf9f5]">
      <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-20 max-w-[calc(100%-1.5rem)] px-3 sm:px-4 py-2 bg-white border-2 border-chalk-border rounded-full font-sketch font-bold text-sm sm:text-base text-chalk-ink shadow-[3px_3px_0px_0px_var(--chalk-border)] truncate text-center">
        {title} · view only
      </div>
      <Whiteboard
        onExportReady={() => {}}
        generatedImage={null}
        onAcceptSuggestion={() => {}}
        snapshot={snapshot}
        readOnly
        licenseKey={getTldrawLicenseKey()}
      />
    </div>
  );
}
