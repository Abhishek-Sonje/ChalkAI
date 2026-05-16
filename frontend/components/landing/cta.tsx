"use client";

import React from "react";
import Link from "next/link";
import { FadeIn } from "./fade-in";
import { LogoIcon, ArrowRightIcon } from "./icons";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";

export function CTA() {
  const { isSignedIn } = useAuth();

  return (
    <section className="py-20 px-[5vw]">
      <div className="max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="relative bg-chalk-ink rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full border-2 border-white/10" />
            <div className="absolute -bottom-14 left-48 w-60 h-60 rounded-full border-2 border-white/5" />
            
            <div className="relative z-10 text-center md:text-left">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 mx-auto md:mx-0">
                <LogoIcon />
              </div>
              <h2 className="font-sketch text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to transform the way you teach?
              </h2>
              <p className="text-sm text-white/50">
                Chalk AI is completely open. Just plug in your Gemini API key and start creating.
              </p>
            </div>
            
            {!isSignedIn ? (
              <SignUpButton mode="modal">
                <button className="relative z-10 shrink-0 flex items-center gap-2 px-7 py-3.5 bg-white text-chalk-ink font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)] active:scale-95 transition-all duration-300">
                  Get Started
                  <ArrowRightIcon />
                </button>
              </SignUpButton>
            ) : (
              <Link href="/board">
                <button className="relative z-10 shrink-0 flex items-center gap-2 px-7 py-3.5 bg-white text-chalk-ink font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)] active:scale-95 transition-all duration-300">
                  Go to My Board
                  <ArrowRightIcon />
                </button>
              </Link>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
