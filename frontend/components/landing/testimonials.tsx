"use client";

import React from "react";
import { FadeIn } from "./fade-in";
import { Star } from "lucide-react";

const reviews = [
  {
    quote:
      "The AI suggestions are spot on! It helps me explain complex topics in a simpler way.",
    name: "Priya Mehta",
    role: "Physics Tutor",
    initials: "PM",
  },
  {
    quote:
      "My students are more engaged than ever. Chalk AI makes my lessons interactive and fun.",
    name: "Rohit Verma",
    role: "Chemistry Tutor",
    initials: "RV",
  },
  {
    quote:
      "I save so much time with AI enhancements. It's a must-have tool for every tutor.",
    name: "Sneha Iyer",
    role: "Biology Tutor",
    initials: "SI",
  },
  {
    quote:
      "Drawing diagrams used to take forever. Now it's done in seconds with smart suggestions.",
    name: "Kavya Nair",
    role: "Math Tutor",
    initials: "KN",
  },
  {
    quote:
      "The collaboration feature is brilliant. My students can see changes in real-time.",
    name: "Arjun Sinha",
    role: "Science Tutor",
    initials: "AS",
  },
];

export function Testimonials() {
  // Triple items list to prevent visual clipping or gaps on extra-wide monitors
  const reviewSet = [...reviews, ...reviews, ...reviews];

  return (
    <section className="py-24 px-[5vw] bg-[#faf9f5] border-b border-chalk-border/20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        {/* HERO FEATURED TESTIMONIAL VIEW */}
        <FadeIn>
          <div className="bg-white border-2 border-chalk-border rounded-[24px] p-8 md:p-12 grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-10 shadow-[6px_6px_0px_0px_var(--chalk-border)] hover:shadow-[8px_8px_0px_0px_var(--chalk-border)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[2px_2px_0px_0px_var(--chalk-border)] transition-all duration-200 mb-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-chalk-purple-light/10 to-transparent pointer-events-none" />

            <div className="relative z-10">
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
            <div className="relative z-10 w-16 h-16 border-2 border-chalk-border bg-[#faf9f5] rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_var(--chalk-border)] rotate-3 hover:rotate-0 transition-transform duration-200 mx-auto md:mx-0">
              <Star className="w-7 h-7 text-chalk-purple fill-chalk-purple-light stroke-[2]" />
            </div>
          </div>
        </FadeIn>

        {/* SECTION MARQUEE HEADER */}
        <div className="text-center mb-12">
          <FadeIn>
            <h2 className="font-sketch text-2xl md:text-5xl text-chalk-ink flex items-center justify-center gap-3 tracking-tight">
              <span className="text-chalk-purple animate-pulse text-lg md:text-xl">
                ✦
              </span>
              Loved by tutors worldwide
              <span className="text-chalk-purple animate-pulse text-lg md:text-xl">
                ✦
              </span>
            </h2>
          </FadeIn>
        </div>

        {/* INFINITE SMOOTH MARQUEE INTERFACE SECTION */}
        <div className="relative overflow-hidden w-full select-none py-4">
          {/* Edge Feathering Shims Overlays */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-44 z-20 bg-gradient-to-r from-[#faf9f5] via-[#faf9f5]/40 to-transparent pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-44 z-20 bg-gradient-to-l from-[#faf9f5] via-[#faf9f5]/40 to-transparent pointer-events-none" />

          {/* Sliding Track */}
          <div className="flex gap-6 w-max animate-marquee will-change-transform hover:[animation-play-state:paused] transition-all">
            {reviewSet.map((r, i) => (
              <div
                key={i}
                className="w-[300px] shrink-0 bg-white border-2 border-chalk-border rounded-2xl p-6 text-left
                           shadow-[4px_4px_0px_0px_var(--chalk-border)] hover:shadow-[6px_6px_0px_0px_var(--chalk-border)]
                           hover:-translate-y-1 active:translate-y-0 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="font-sketch text-4xl text-chalk-purple/40 font-serif leading-none h-4 -translate-y-2">
                    “
                  </div>
                  <p className="text-sm text-chalk-ink font-medium leading-relaxed mb-6 mt-2">
                    {r.quote}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-chalk-border/5">
                  <div className="w-10 h-10 border-2 border-chalk-border bg-chalk-purple-light rounded-xl flex items-center justify-center font-sketch text-sm font-bold text-chalk-purple shadow-[2px_2px_0px_0px_var(--chalk-border)]">
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
