"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "./fade-in";
import { PlayIcon, SparkleIcon } from "./icons";
import { ArrowRight, Sparkles } from "lucide-react";
import { VideoModal } from "./video-modal";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";

/* =========================
   Triangle Sketch (RE-POSITIONED TO MATCH NEW FRAME)
   ========================= */
const TriangleSketch = () => (
  <svg
    viewBox="0 0 380 240"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-auto"
  >
    {/* Grid dots */}
    {[...Array(6)].map((_, r) =>
      [...Array(8)].map((_, c) => (
        <circle
          key={`${r}-${c}`}
          cx={20 + c * 50}
          cy={20 + r * 42}
          r="1.5"
          fill="#e0dfd7"
        />
      )),
    )}

    {/* Triangle */}
    <path
      d="M140 200 L240 40 L340 200 Z"
      stroke="#1a1a1a"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Hatching */}
    {[
      ["175 170", "225 80"],
      ["185 182", "245 90"],
      ["195 192", "265 100"],
      ["207 199", "283 112"],
      ["220 200", "300 125"],
      ["237 200", "316 138"],
    ].map(([a, b], i) => (
      <path
        key={i}
        d={`M${a} L${b}`}
        stroke="#7b5ea7"
        strokeWidth="1"
        opacity="0.35"
      />
    ))}

    {/* Labels */}
    <text x="238" y="34" fontFamily="Caveat, cursive" fontSize="17">
      A
    </text>
    <text x="129" y="210" fontFamily="Caveat, cursive" fontSize="17">
      B
    </text>
    <text x="342" y="210" fontFamily="Caveat, cursive" fontSize="17">
      C
    </text>

    {/* Altitude */}
    <path
      d="M240 40 L240 200"
      stroke="#7b5ea7"
      strokeWidth="1.5"
      strokeDasharray="5 4"
      opacity="0.7"
    />
    <text
      x="245"
      y="125"
      fontFamily="Caveat, cursive"
      fontSize="14"
      fill="#7b5ea7"
    >
      h
    </text>

    {/* Formula */}
    <text x="100" y="175" fontFamily="Caveat, cursive" fontSize="18">
      Area =
    </text>
    <text x="168" y="165" fontFamily="Caveat, cursive" fontSize="15">
      1
    </text>
    <line x1="165" y1="168" x2="182" y2="168" stroke="#1a1a1a" />
    <text x="168" y="180" fontFamily="Caveat, cursive" fontSize="15">
      2
    </text>
    <text x="186" y="175" fontFamily="Caveat, cursive" fontSize="18">
      × b × h
    </text>
  </svg>
);

/* =========================
   HERO
   ========================= */
export function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <section className="min-h-[calc(100dvh-76px)] grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-[5vw] py-12 mx-auto overflow-hidden bg-[#faf9f5]">
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
      
      {/* REVAMPED LEFT CONTENT */}
      <div className="lg:pr-6 z-10 relative flex flex-col justify-center text-left">
        
        {/* PREMIUM FLOATING SUB-ACCENT BADGE */}
        <FadeIn delay={0}>
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white border-2 border-chalk-border rounded-full shadow-[2px_2px_0px_0px_var(--chalk-border)] mb-6 w-fit group">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chalk-purple opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-chalk-purple"></span>
            </span>
            <span className="font-sketch text-xs font-bold uppercase tracking-wider text-chalk-ink/80 flex items-center gap-1">
              AI for Smarter Teaching <Sparkles className="w-3 h-3 text-chalk-purple ml-0.5 group-hover:rotate-12 transition-transform" />
            </span>
          </div>
        </FadeIn>

        {/* HIGH-CONTRAST SKETCH TYPOGRAPHY */}
        <FadeIn delay={80}>
          <h1 className="font-sketch text-5xl md:text-6xl xl:text-6xl leading-[1.1] text-chalk-ink mb-6 tracking-tight">
            Teach. Draw.
            <br />
            Improve with{" "}
            <span className="text-chalk-purple relative inline-block group whitespace-nowrap">
              AI.
              <span className="absolute left-0 bottom-1 w-full h-[5px] bg-chalk-purple/20 rounded-full transition-all duration-300 group-hover:bg-chalk-purple/35" />
            </span>
          </h1>
        </FadeIn>

        {/* REBALANCED SYSTEM DESCRIPTIVE PARAGRAPH */}
        <FadeIn delay={160}>
          <p className="text-base md:text-md text-chalk-gray max-w-xl font-medium leading-relaxed mb-10">
            Chalk AI functions as your contextual, real-time smart board. Sketch hardware configurations, geometry parameters, or raw equations, and let custom vector vision models clean, align, and enhance your work live.
          </p>
        </FadeIn>

        {/* TACTILE CALL TO ACTIONS BAR */}
        <FadeIn delay={240}>
          <div className="flex flex-wrap items-center gap-5">
            {/* Main Action Call */}
            {!isSignedIn ? (
              <SignUpButton mode="modal">
                <button className="group inline-flex items-center gap-2 px-8 py-4 bg-chalk-ink text-white font-bold rounded-2xl border-2 border-chalk-ink
                                shadow-[4px_4px_0px_0px_var(--chalk-purple)] hover:shadow-[2px_2px_0px_0px_var(--chalk-purple)]
                                hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0px_0px_0px_0px_transparent]
                                transition-all duration-150">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </button>
              </SignUpButton>
            ) : (
              <Link href="/board">
                <button className="group inline-flex items-center gap-2 px-8 py-4 bg-chalk-ink text-white font-bold rounded-2xl border-2 border-chalk-ink
                                shadow-[4px_4px_0px_0px_var(--chalk-purple)] hover:shadow-[2px_2px_0px_0px_var(--chalk-purple)]
                                hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0px_0px_0px_0px_transparent]
                                transition-all duration-150">
                  <span>Go to My Board</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                </button>
              </Link>
            )}

            {/* Video Interactive Layer Hook */}
            <button 
              onClick={() => setIsVideoOpen(true)}
              className="group inline-flex items-center gap-3 px-6 py-4 bg-white text-chalk-ink font-bold rounded-2xl border-2 border-chalk-border
                               shadow-[4px_4px_0px_0px_var(--chalk-border)] hover:shadow-[2px_2px_0px_0px_var(--chalk-border)]
                               hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0px_0px_0px_0px_transparent]
                               transition-all duration-150">
              <span className="w-7 h-7 bg-[#faf9f5] border-2 border-chalk-border rounded-lg flex items-center justify-center group-hover:bg-[#f1ebfa] group-hover:border-chalk-purple transition-colors">
                <PlayIcon className="w-3 h-3 text-chalk-ink group-hover:text-chalk-purple transition-colors" />
              </span>
              <span className="text-sm tracking-tight">Watch Live Demo</span>
            </button>
          </div>
        </FadeIn>
      </div>

      {/* RIGHT FRAME - UNTOUCHED & MAINTAINING 20% OVERFLOW */}
      <div className="relative hidden lg:flex items-center justify-end overflow-visible">
        <FadeIn delay={200}>
          <div className="relative w-[160%] max-w-none translate-x-[5%] translate-y-[-2%]">
            {/* Frame PNG */}
            <Image
              src="/landing/frame.png"
              alt="Chalk Board Frame"
              width={1200}
              height={1200}
              className="w-full h-auto object-contain"
              priority
            />

            {/* Content inside frame - Inset and aligned to the whiteboard surface */}
            <div className="absolute inset-0 flex items-center justify-center px-[12%] translate-x-[-12%] py-[10%]">
              <TriangleSketch />
            </div>

            {/* AI Assistant */}
            <div className="absolute bottom-[10%] right-[8%] bg-white border rounded-xl p-2 px-3 flex items-center gap-2 text-xs shadow">
              <div className="w-7 h-7 bg-chalk-purple-light rounded flex items-center justify-center">
                <SparkleIcon />
              </div>
              <div>
                <div className="font-bold">AI Assistant</div>
                <div className="text-chalk-purple text-[11px]">
                  Suggesting...
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}