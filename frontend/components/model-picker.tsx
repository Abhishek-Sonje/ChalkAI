"use client";

import { Check, ChevronDown } from "lucide-react";
import { getImageModel, IMAGE_MODELS, modelsByProvider } from "@/lib/image-models";
import { useApiKey } from "@/components/api-key-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function ModelPicker({ className }: { className?: string }) {
  const { selectedModelId, setSelectedModelId } = useApiKey();
  const selected = getImageModel(selectedModelId);
  const suggested = IMAGE_MODELS.filter((model) => model.recommended);
  const groups = modelsByProvider();

  return (
    <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex min-w-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "h-auto min-h-10 min-w-0 w-full max-w-full sm:min-w-[8.5rem] sm:w-auto sm:max-w-[13.5rem] shrink-0 rounded-xl border border-black/10 bg-white/90 px-2 py-1.5 text-[11px] font-semibold leading-tight text-foreground hover:bg-muted/50 whitespace-normal",
                  className
                )}
              >
                <span className="text-left leading-tight break-words">{selected.label}</span>
                <ChevronDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[min(18rem,calc(100vw-1.5rem))]">
              {suggested.length > 0 && (
                <>
                  <DropdownMenuLabel>Suggested</DropdownMenuLabel>
                  {suggested.map((model) => (
                    <DropdownMenuItem
                      key={`suggested-${model.id}`}
                      onSelect={() => setSelectedModelId(model.id)}
                      className="items-start justify-between gap-2 py-2 text-[11px] leading-snug whitespace-normal bg-white focus:bg-[#f7f6f2] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
                    >
                      <span className="min-w-0 flex-1 whitespace-normal">
                        {model.label}
                        <span className="ml-1.5 inline-flex align-middle rounded-full bg-[#f7f6f2] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-chalk-gray">
                          Suggested
                        </span>
                      </span>
                      {model.id === selected.id && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </>
              )}
              {groups.map((group, index) => (
                <div key={group.id}>
                  {index > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                  {group.models.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onSelect={() => setSelectedModelId(model.id)}
                      className={cn(
                        "items-start justify-between gap-2 py-2 text-[11px] leading-snug whitespace-normal",
                        model.recommended && "bg-white focus:bg-[#f7f6f2]"
                      )}
                    >
                      <span className="min-w-0 flex-1 whitespace-normal">{model.label}</span>
                      {model.id === selected.id && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                    </DropdownMenuItem>
                  ))}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </span>
      </TooltipTrigger>
      <TooltipContent>Choose image model</TooltipContent>
    </Tooltip>
    </TooltipProvider>
  );
}
