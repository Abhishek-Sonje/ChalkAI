"use client";

import React from "react";
import { FadeIn } from "./fade-in";
import { PencilIcon, BulbIcon, UsersIcon, CloudIcon } from "./icons";
import { Cloud, Lightbulb, PencilRulerIcon, User } from "lucide-react";

const features = [
  {
    icon: <PencilRulerIcon />,
    title: "Smart Drawing",
    desc: "AI helps you refine your sketches and diagrams in real-time.",
  },
  {
    icon: <Lightbulb />,
    title: "AI Suggestions",
    desc: "Get intelligent suggestions to improve your teaching and explanations.",
  },
  {
    icon: <User />,
    title: "Interactive Lessons",
    desc: "Engage students with live collaboration and interactive whiteboard.",
  },
  {
    icon: <Cloud />,
    title: "Save & Share",
    desc: "Save your board and share instantly with your students.",
  },
];

export function Features() {
  return (
    <section className="px-[5vw] py-20 max-w-[1400px] mx-auto text-center">
      <FadeIn>
        <h2 className="font-sketch text-3xl md:text-4xl text-chalk-ink mb-4">
          Everything you need on one{" "}
          <span
            className="
    relative inline-block
    before:content-['']
    before:absolute
    before:left-0 before:right-0
    before:bottom-[-4px]
    before:h-[1.25px]
    before:bg-chalk-ink
    before:rounded-full
    before:rotate-[-0.4deg]

    after:content-['']
    after:absolute
    after:left-[6px] after:right-[-2px]
    after:bottom-[-7px]
    after:h-[1.25px]
    after:bg-chalk-ink
    after:rounded-full
    after:rotate-[0.6deg]
  "
          >
            intelligent
          </span>{" "}
          board
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {features.map((f, i) => (
          <FadeIn key={f.title} delay={i * 70}>
            <div
              className="group relative bg-white border-[2px] border-chalk-border rounded-2xl p-6 text-left
                       hover:-translate-y-1 active:translate-y-0
                       hover:shadow-[6px_6px_0px_0px_var(--chalk-border)]
                       active:shadow-[2px_2px_0px_0px_var(--chalk-border)]
                       transition-all duration-200 cursor-default overflow-hidden
                       flex flex-col justify-between h-full min-h-[260px]"
            >
              {/* Subtle background ink / chalk bleed */}
              <div className="absolute inset-0 bg-chalk-purple-light opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none" />

              {/* Card content */}
              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="w-12 h-12 border-[2px] border-chalk-border bg-chalk-bg rounded-xl
                           flex items-center justify-center mb-5
                           shadow-[2px_2px_0px_0px_var(--chalk-border)]
                           group-hover:shadow-[3px_3px_0px_0px_var(--chalk-border)]
                           group-hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="text-xl transition-transform duration-300 group-hover:scale-110">
                    {f.icon}
                  </span>
                </div>

                {/* Heading */}
                <h3 className="font-sketch text-xl mb-2.5 text-chalk-ink">
                  <span
                    className="underline decoration-wavy underline-offset-4
                             decoration-chalk-purple/20
                             group-hover:decoration-chalk-purple
                             transition-colors duration-300"
                  >
                    {f.title}
                  </span>
                </h3>

                {/* Description */}
                <p className="text-sm text-chalk-gray leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
