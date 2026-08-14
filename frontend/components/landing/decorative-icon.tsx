"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { FadeIn } from "./fade-in";

interface DecorativeIconProps {
  src: string;
  alt: string;
  className?: string;
  rotate?: number;
  size?: number;
  delay?: number;
  opacity?: number;
}

export function DecorativeIcon({
  src,
  alt,
  className,
  rotate = 0,
  size = 60,
  delay = 0,
  opacity = 0.5,
}: DecorativeIconProps) {
  return (
    <div
      className={cn(
        "absolute pointer-events-none select-none hidden lg:block z-0",
        className
      )}
      style={{
        transform: `rotate(${rotate}deg)`,
        opacity: opacity,
      }}
    >
      <FadeIn delay={delay}>
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          // className="w-full h-auto"
        />
      </FadeIn>
    </div>
  );
}
