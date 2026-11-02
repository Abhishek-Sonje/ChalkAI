"use client";

import React from "react";
import Link from "next/link";
import { FadeIn } from "./fade-in";
import { ArrowRightIcon } from "./icons";
import { GoogleSignInButton, useIsSignedIn } from "@/components/auth-buttons";
import { DecorativeIcon } from "./decorative-icon";

export function CTA() {
  const { isSignedIn } = useIsSignedIn();

  return (
    <section className="relative py-12 sm:py-20 px-[5vw]">
      {/* Decorative Icons */}
      <DecorativeIcon 
        src="/landing/icons8-cloud-100.png" 
        alt="Cloud" 
        className="top-0 right-[15%]" 
        rotate={10} 
        size={80} 
      />
      <div className="max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="relative bg-chalk-ink rounded-3xl p-6 sm:p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full border-2 border-white/10" />
            <div className="absolute -bottom-14 left-48 w-60 h-60 rounded-full border-2 border-white/5" />
            
            <div className="relative z-10 text-center md:text-left">
              
              <h2 className="font-sketch text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to transform the way you teach?
              </h2>
              <p className="text-sm text-white/50">
                Chalk AI is completely open. Just plug in your Gemini API key and start creating.
              </p>
            </div>
            
            {!isSignedIn ? (
              <GoogleSignInButton className="relative z-10 shrink-0 w-full md:w-auto justify-center flex items-center gap-2 px-7 py-3.5 bg-white text-chalk-ink font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)] active:scale-95 transition-all duration-300">
                Get Started
                <ArrowRightIcon />
              </GoogleSignInButton>
            ) : (
              <Link href="/boards" className="w-full md:w-auto">
                <button className="relative z-10 shrink-0 w-full md:w-auto justify-center flex items-center gap-2 px-7 py-3.5 bg-white text-chalk-ink font-bold rounded-xl hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)] active:scale-95 transition-all duration-300">
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
