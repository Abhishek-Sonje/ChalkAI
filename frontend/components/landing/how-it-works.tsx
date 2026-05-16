"use client";

import React from "react";
import { FadeIn } from "./fade-in";
import {
  PenTool,
  Brain,
  Sparkles,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    num: "01",
    icon: <Sparkles className="w-7 h-7 text-chalk-purple stroke-[2]" />,
    title: "Plug in your Key",
    desc: "Simply add your Gemini API key in the board settings to unlock full AI power for free.",
  },
  {
    num: "02",
    icon: <PenTool className="w-7 h-7 text-chalk-ink stroke-[2]" />,
    title: "You Draw",
    desc: "Sketch your geometric shapes or ideas naturally on the smart board.",
  },
  {
    num: "03",
    icon: <Brain className="w-7 h-7 text-chalk-purple stroke-[2]" />,
    title: "AI Understands",
    desc: "Our vision model instantly recognizes your drawings and mathematical context.",
  },
  {
    num: "04",
    icon: <GraduationCap className="w-7 h-7 text-chalk-ink stroke-[2]" />,
    title: "You Teach Better",
    desc: "Deliver clear explanations and engage students with AI-enhanced visuals.",
  },
];

export function HowItWorks() {
  return (
    <section className="px-[5vw] py-24 bg-[#faf9f5] border-t border-b border-chalk-border/30 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        {/* SECTION HEADER */}
        <div className="text-center mb-20">
          <FadeIn>
            <h2 className="font-sketch text-3xl md:text-5xl text-chalk-ink relative inline-block">
              How Chalk AI works
              <span className="absolute left-0 bottom-[-8px] w-full h-[4px] bg-chalk-purple/40 rounded-full" />
            </h2>
          </FadeIn>
        </div>

        {/* PROCESS FLOW WRAPPER */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {/* DESKTOP BACKGROUND CONNECTOR LINE */}
          <div className="hidden lg:block absolute top-[85px] left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-chalk-border pointer-events-none z-0" />

          {steps.map((step, i) => (
            <React.Fragment key={step.num}>
              <FadeIn delay={i * 100} className="relative z-10 w-full">
                <div className="group flex flex-col items-center text-center px-4 bg-white lg:bg-transparent p-6 lg:p-0 rounded-2xl border-2 border-transparent hover:border-chalk-border/10 lg:hover:border-transparent hover:bg-white/50 lg:hover:bg-transparent transition-all duration-300">
                  {/* STEP BUBBLE HEADER */}
                  <span className="font-sketch text-xs font-bold tracking-widest text-chalk-purple/70 bg-chalk-purple-light/50 lg:bg-transparent px-2.5 py-1 rounded-full mb-4">
                    STEP {step.num}
                  </span>

                  {/* PREMIUM THEMED ICON BOX */}
                  <div
                    className="relative w-20 h-20 border-[2.5px] border-chalk-border bg-white rounded-2xl flex items-center justify-center mb-5
                                  shadow-[4px_4px_0px_0px_var(--chalk-border)] group-hover:shadow-[6px_6px_0px_0px_var(--chalk-border)]
                                  group-hover:-translate-y-1 transition-all duration-200"
                  >
                    {step.icon}
                  </div>

                  {/* STEP TITLE */}
                  <h3 className="font-sketch text-xl font- mb-2.5 text-chalk-ink">
                    <span className="underline decoration-wavy underline-offset-4 decoration-transparent group-hover:decoration-chalk-purple/40 transition-colors duration-300">
                      {step.title}
                    </span>
                  </h3>

                  {/* STEP DESCRIPTION */}
                  <p className="text-xs md:text-sm text-chalk-gray leading-relaxed max-w-[220px] font-medium">
                    {step.desc}
                  </p>
                </div>
              </FadeIn>

              {/* TRANSLATING CONNECTOR ARROW FOR IN-BETWEEN STEPS */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:flex absolute top-[70px] h-fit items-center justify-center text-chalk-ink-soft/60 pointer-events-none z-20"
                  style={{ left: `calc(${(i + 1) * 25}% - 14px)` }}
                >
                  <div className="bg-[#faf9f5] p-1.5 rounded-full border border-chalk-border/20 shadow-sm animate-pulse">
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
