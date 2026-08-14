"use client";

import React from "react";
import { FadeIn } from "./fade-in";
import { Cloud, Lightbulb, PencilRuler, User } from "lucide-react";
import { DecorativeIcon } from "./decorative-icon";

const SketchMark = ({ flip = false }: { flip?: boolean }) => (
  <svg
    width="13"
    height="20"
    viewBox="0 0 13 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`hidden md:inline-block ${
      flip ? "scale-x-[-1]" : ""
    } text-chalk-ink -translate-y-5 mx-2 `}
  >
    <path
      d="M1 6.53608C1.02255 6.51353 1.04511 6.49098 1.6093 5.88168C2.17349 5.27238 3.27863 4.07702 3.88177 3.43868C4.66176 2.61317 4.93942 2.25494 5.17965 1.73107C5.23672 1.61591 5.30438 1.54825 5.37307 1.44573C5.44175 1.34322 5.50942 1.20789 5.64747 1.00012"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M5.37408 9.88496C5.41919 9.88496 5.8033 9.74963 7.08306 9.38672C8.00196 9.15913 9.46797 8.84338 10.2683 8.66944C11.0686 8.4955 11.1588 8.47294 11.2518 8.44971"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M4.96399 16.6512C4.98654 16.6512 5.0091 16.6512 5.08838 16.6625C5.16766 16.6737 5.30298 16.6963 6.28613 17.0124C7.26927 17.3285 9.09614 17.9374 11.1151 18.7015"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const features = [
  {
    icon: <PencilRuler className="w-5 h-5 text-chalk-purple stroke-[2.25]" />,
    title: "Smart Drawing",
    desc: "AI helps you refine your sketches, flowcharts, and complex diagrams in real-time.",
  },
  {
    icon: <Lightbulb className="w-5 h-5 text-chalk-ink stroke-[2.25]" />,
    title: "AI Suggestions",
    desc: "Get intelligent contextual prompts to improve your math proof steps and explanations.",
  },
  {
    icon: <User className="w-5 h-5 text-chalk-purple stroke-[2.25]" />,
    title: "Interactive Lessons",
    desc: "Engage students with clean real-time whiteboard spaces built for digital collaboration.",
  },
  {
    icon: <Cloud className="w-5 h-5 text-chalk-ink stroke-[2.25]" />,
    title: "Save & Share",
    desc: "Instantly capture your finished sketch boards and generate quick review links.",
  },
];

/* ==========================================================================
   SKETCHED CARD BACKGROUND COMPONENT
   ========================================================================== */
function SketchedCardFrame() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0">
      {/* Brutalist Shadow Layer */}
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

      {/* Main Front Frame Stroke & Canvas Fill */}
      <svg
        viewBox="0 0 156 192"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full text-chalk-border group-hover:text-chalk-ink/60 transition-colors duration-200"
      >
        <path
          d="M9.16561 3.64698C3.57966 5.74239 2.04036 8.14184 2.16562 14.647V17.147C-0.0952449 82.01 0.344262 116.383 1.16561 177.647C2.09219 185.77 4.83188 187.739 10.6656 190.147C62.0782 191.738 90.5667 191.797 140.666 190.147C151.852 188.876 155.388 186.493 154.166 177.647C155.408 112.487 155.372 76.1509 154.166 11.647C154.262 5.91872 152.531 3.6558 145.666 1.64698C92.3721 -0.231581 62.4854 0.0387487 9.16561 3.64698Z"
          fill="#ffffff"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function Features() {
  return (
    <section className="relative px-[5vw] py-24 max-w-[1400px] mx-auto text-center bg-[#faf9f5]">
      {/* Decorative Icons */}
      <DecorativeIcon 
        src="/landing/icons8-note-100.png" 
        alt="Note" 
        className="top-10 left-[5%]" 
        rotate={-15} 
        size={90} 
      />
      <DecorativeIcon 
        src="/landing/icons8-pin-100.png" 
        alt="Pin" 
        className="bottom-2 right-[1%]" 
        rotate={20} 
        size={90} 
      />

      {/* HEADER SECTION WITH SKETCH UNDERLINE ATTRIBUTES */}
      <div className="mb-16">
        <FadeIn>
          <h2 className="font-sketch text-3xl md:text-5xl text-chalk-ink tracking-tight">
            <SketchMark flip/>
            <span>
            Everything you need on one{" "}
            <span className="relative inline-block px-1 select-none text-chalk-purple">
              intelligent
              <span className="absolute left-0 bottom-[-4px] w-full h-[1.5px] bg-chalk-purple rounded-full rotate-[-0.5deg]" />
              <span className="absolute left-[6px] bottom-[-7px] w-full h-[1.5px] bg-chalk-purple rounded-full rotate-[0.5deg]" />
            </span>{" "}
              board</span>
            <SketchMark/>
          </h2>
        </FadeIn>
      </div>

      {/* FEATURE GRID SYSTEM MAPPED WITH THE CUSTOM ASSET FRAME */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mt-16">
        {features.map((f, i) => (
          <FadeIn key={f.title} delay={i * 70}>
            <div className="group relative p-8 text-left transition-transform duration-200 hover:-translate-y-1.5 flex flex-col justify-between h-full min-h-[280px]">
              
              {/* Dynamic Hand-drawn Frame Injector Asset */}
              <SketchedCardFrame />

              {/* CARD CONTAINER CONTENT MARKUP LAYER */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  
                  {/* ICON BUBBLE ASSEMBLY */}
                  <div className="w-12 h-12 border-2 border-chalk-border bg-[#faf9f5] rounded-xl flex items-center justify-center mb-6
                                 shadow-[2px_2px_0px_0px_var(--chalk-border)] group-hover:shadow-[3.5px_3.5px_0px_0px_var(--chalk-border)]
                                 group-hover:-translate-y-0.5 group-hover:rotate-3 transition-all duration-200">
                    <span className="transition-transform duration-200 group-hover:scale-105">
                      {f.icon}
                    </span>
                  </div>

                  {/* HEADER CONTENT COPY ELEMENT */}
                  <h3 className="font-sketch text-xl font-bold mb-3 text-chalk-ink tracking-tight">
                    <span className="underline decoration-wavy underline-offset-4 decoration-transparent group-hover:decoration-chalk-purple/40 transition-colors duration-300">
                      {f.title}
                    </span>
                  </h3>

                  {/* BODY DESCRIPTIONS PRIMITIVE */}
                  <p className="text-xs md:text-sm text-chalk-gray leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>
              </div>

            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}