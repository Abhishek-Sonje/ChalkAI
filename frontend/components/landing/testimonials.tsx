"use client";

import React, { useState } from "react";
import { FadeIn } from "./fade-in";
import { Star } from "lucide-react";
import { DecorativeIcon } from "./decorative-icon";

const reviews = [
  {
    quote: "The AI suggestions are spot on! It helps me explain complex topics in a simpler way.",
    name: "Priya Mehta",
    role: "Physics Tutor",
    initials: "PM",
  },
  {
    quote: "My students are more engaged than ever. Chalk AI makes my lessons interactive and fun.",
    name: "Rohit Verma",
    role: "Chemistry Tutor",
    initials: "RV",
  },
  {
    quote: "I save so much time with AI enhancements. It's a must-have tool for every tutor.",
    name: "Sneha Iyer",
    role: "Biology Tutor",
    initials: "SI",
  },
  {
    quote: "Drawing diagrams used to take forever. Now it's done in seconds with smart suggestions.",
    name: "Kavya Nair",
    role: "Math Tutor",
    initials: "KN",
  },
  {
    quote: "The collaboration feature is brilliant. My students can see changes in real-time.",
    name: "Arjun Sinha",
    role: "Science Tutor",
    initials: "AS",
  },
];

/* ==========================================================================
   SKETCHED PAPER BACKDROP FRAME ARCHITECTURE
   ========================================================================== */
function SketchedPaperFrame() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0">
      {/* Brutalist Shadow Background Path Layer */}
      <svg
        viewBox="0 0 156 192"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full translate-x-1 translate-y-1 md:translate-x-1.5 md:translate-y-1.5 text-chalk-border/30 transition-transform duration-200 group-hover:translate-x-2 group-hover:translate-y-2"
      >
        <path
          d="M9.16561 3.64698C3.57966 5.74239 2.04036 8.14184 2.16562 14.647V17.147C-0.0952449 82.01 0.344262 116.383 1.16561 177.647C2.09219 185.77 4.83188 187.739 10.6656 190.147C62.0782 191.738 90.5667 191.797 140.666 190.147C151.852 188.876 155.388 186.493 154.166 177.647C155.408 112.487 155.372 76.1509 154.166 11.647C154.262 5.91872 152.531 3.6558 145.666 1.64698C92.3721 -0.231581 62.4854 0.0387487 9.16561 3.64698Z"
          fill="currentColor"
        />
      </svg>

      {/* Main Front Custom Outline & Premium Off-White Canvas Core */}
      <svg
        viewBox="0 0 156 192"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full text-chalk-border group-hover:text-chalk-ink transition-colors duration-200"
      >
        <path
          d="M9.16561 3.64698C3.57966 5.74239 2.04036 8.14184 2.16562 14.647V17.147C-0.0952449 82.01 0.344262 116.383 1.16561 177.647C2.09219 185.77 4.83188 187.739 10.6656 190.147C62.0782 191.738 90.5667 191.797 140.666 190.147C151.852 188.876 155.388 186.493 154.166 177.647C155.408 112.487 155.372 76.1509 154.166 11.647C154.262 5.91872 152.531 3.6558 145.666 1.64698C92.3721 -0.231581 62.4854 0.0387487 9.16561 3.64698Z"
          fill="#fdfcf7"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Fine-grain Technical Grid Dot Matrix Blueprint Overlay */}
      <div className="absolute inset-4 opacity-[0.03] mix-blend-multiply pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="testimonial-dot-pattern" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="7" cy="7" r="1" fill="#1a1a1a" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testimonial-dot-pattern)" />
        </svg>
      </div>
    </div>
  );
}

export function Testimonials() {
  const reviewSet = [...reviews, ...reviews, ...reviews];

  return (
    <section className="relative py-24 px-[5vw] bg-[#faf9f5] border-b border-chalk-border/20 overflow-hidden">
      
      {/* Decorative Assets */}
      <DecorativeIcon 
        src="/landing/icons8-calendar-100.png" 
        alt="Calendar" 
        className="top-20 left-[2%]" 
        rotate={-10} 
        size={90} 
      />

      <div className="max-w-[1200px] mx-auto relative">
        
        {/* HERO FEATURED TESTIMONIAL VIEW SYSTEM */}
        <FadeIn>
          <div className="group relative p-8 md:p-12 mb-28 transition-transform duration-200 hover:-translate-y-1">
            
            {/* Structural Hand-drawn Backdrop Core */}
            <SketchedPaperFrame />

            {/* Inner Content Grid Frame */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-10">
              <div>
                <p className="font-sketch text-xl md:text-3xl leading-relaxed text-chalk-ink mb-8 max-w-3xl">
                  <span className="text-4xl text-chalk-purple font-serif inline-block translate-y-2 mr-1">
                    “
                  </span>
                  Chalk AI has changed the way I teach. It's like having an{" "}
                  <span className="text-chalk-purple underline decoration-wavy underline-offset-4 decoration-chalk-purple/40">
                    intelligent co-teacher
                  </span>{" "}
                  live on my board.
                </p>

                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 border-2 border-chalk-border bg-chalk-purple-light rounded-xl flex items-center justify-center font-sketch font-bold text-chalk-purple shadow-[2px_2px_0px_0px_var(--chalk-border)]">
                    AS
                  </div>
                  <div>
                    <div className="font-bold text-base text-chalk-ink">
                      Amit Sharma
                    </div>
                    <div className="text-xs text-chalk-gray font-medium">
                      Math Tutor & Content Creator
                    </div>
                  </div>
                </div>
              </div>

              {/* STICKY BADGE INSIGNIA */}
              <div className="w-16 h-16 border-2 border-chalk-border bg-[#faf9f5] rounded-2xl flex items-center justify-center shadow-[3px_3px_0px_0px_var(--chalk-border)] group-hover:rotate-6 transition-transform duration-200 mx-auto md:mx-0">
                <Star className="w-7 h-7 text-chalk-purple fill-chalk-purple-light stroke-[2]" />
              </div>
            </div>

          </div>
        </FadeIn>

        {/* MARQUEE ANCHOR HEADINGS */}
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="font-sketch text-2xl md:text-5xl text-chalk-ink flex items-center justify-center gap-3 tracking-tight">
              <span className="text-chalk-purple animate-pulse text-lg md:text-xl select-none">
                ✦
              </span>
              Loved by tutors worldwide
              <span className="text-chalk-purple animate-pulse text-lg md:text-xl select-none">
                ✦
              </span>
            </h2>
          </FadeIn>
        </div>

        {/* INFINITE SMOOTH MARQUEE INTERFACE TRACK */}
        <div className="relative overflow-hidden w-full select-none py-6">
          {/* Feathered Mask Shims */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-44 z-20 bg-gradient-to-r from-[#faf9f5] via-[#faf9f5]/40 to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-44 z-20 bg-gradient-to-l from-[#faf9f5] via-[#faf9f5]/40 to-transparent pointer-events-none" />

          {/* Running Tape Track Component */}
          <div className="flex gap-8 w-max animate-marquee will-change-transform hover:[animation-play-state:paused] transition-all">
            {reviewSet.map((r, i) => (
              <div
                key={i}
                className="group relative w-[310px] shrink-0 p-7 text-left transition-transform duration-200 hover:-translate-y-1 hover:rotate-1 flex flex-col justify-between min-h-[240px]"
              >
                {/* Structural Paper Frame for each item in the tape slider */}
                <SketchedPaperFrame />

                {/* Card Content Elements */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="font-sketch text-4xl text-chalk-purple/40 font-serif leading-none h-4 -translate-y-2">
                      “
                    </div>
                    <p className="text-xs md:text-sm text-chalk-ink font-medium leading-relaxed mb-6 mt-3">
                      {r.quote}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-chalk-border/10">
                    <div className="w-10 h-10 border-2 border-chalk-border bg-chalk-purple-light rounded-xl flex items-center justify-center font-sketch text-sm font-bold text-chalk-purple shadow-[1.5px_1.5px_0px_0px_var(--chalk-border)]">
                      {r.initials}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-bold text-[13px] text-chalk-ink truncate">
                        {r.name}
                      </div>
                      <div className="text-[11px] text-chalk-gray font-medium truncate">
                        {r.role}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}