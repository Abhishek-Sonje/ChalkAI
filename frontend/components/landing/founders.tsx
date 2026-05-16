"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FadeIn } from "./fade-in";
import { Linkedin, Twitter, Mail } from "lucide-react";

const foundersData = [
  {
    name: "Jaydeep",
    role: "Co-founder",
    bio: "Computer Science student obsessed with turning grand engineering concepts into lightweight, high-performance web systems for classrooms worldwide.",
    initials: "J",
    imageSrc: "/jay.jpg",
    socials: {
      twitter: "https://x.com/jayydeeppp",
      linkedin: "https://www.linkedin.com/in/jaydeepwagaskar/",
      email: "mailto:jaydeepwaghaskar@gmail.com",
    },
  },
  {
    name: "Abhishek",
    role: "Co-founder",
    bio: "Engineering student passionate about building delightful, high-end motion tools that empower tutors and redefine modern digital learning.",
    initials: "A",
    imageSrc: "/abhi.jpg",
    socials: {
      twitter: "https://x.com/Abhi_SDev",
      linkedin: "https://www.linkedin.com/in/abhishek-sonje-83a333209/",
      email: "mailto:work.abhishek036@gmail.com",
    },
  },
];

/* ==========================================================================
   SKETCHED CARD BACKGROUND COMPONENT (WITH PAPER CANVAS FILL)
   ========================================================================== */
function SketchedPaperFrame() {
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

      {/* Main Front Frame Stroke & Textured Paper Fill */}
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

      {/* Fine Drafting Paper Dot-Matrix Overlay */}
      <div className="absolute inset-4 opacity-[0.03] mix-blend-multiply pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="card-dot-matrix"
              width="14"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="7" cy="7" r="1" fill="#1a1a1a" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#card-dot-matrix)" />
        </svg>
      </div>
    </div>
  );
}

interface FounderCardProps {
  founder: (typeof foundersData)[0];
}

function FounderCard({ founder }: FounderCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative flex flex-col h-full sm:flex-row gap-6 p-8 md:p-10 transition-transform duration-200 hover:-translate-y-1">
      {/* Hand-drawn Frame Asset with Paper Overlay */}
      <SketchedPaperFrame />

      {/* AVATAR FRAME SYSTEM */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 border-2 border-chalk-border bg-[#faf9f5] rounded-2xl flex items-center justify-center font-sketch text-3xl font-black text-chalk-purple overflow-hidden shadow-[2px_2px_0px_0px_var(--chalk-border)] relative z-10 group-hover:rotate-3 transition-transform duration-200">
        {!imgError ? (
          <Image
            src={founder.imageSrc}
            alt={`${founder.name} Profile`}
            width={120}
            height={120}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span>{founder.initials}</span>
        )}
      </div>

      {/* STRATIFIED PROFILE COPY */}
      <div className="relative z-10 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-sketch text-2xl font-bold text-chalk-purple mb-0.5 tracking-tight">
            {founder.name}
          </h3>
          <div className="text-xs font-bold text-chalk-gray tracking-wider uppercase mb-3.5">
            {founder.role}
          </div>
          <p className="text-xs md:text-sm text-chalk-ink/80 font-medium leading-relaxed mb-6">
            {founder.bio}
          </p>
        </div>

        {/* BRUTALIST SOCIAL ACTION BUTTONS */}
        <div className="flex items-center gap-3">
          <a
            href={founder.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 border-2 border-chalk-border bg-[#faf9f5] rounded-xl flex items-center justify-center text-chalk-gray hover:text-chalk-purple hover:bg-[#f1ebfa] shadow-[1.5px_1.5px_0px_0px_var(--chalk-border)] hover:shadow-[2.5px_2.5px_0px_0px_var(--chalk-border)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0px_0px_0px_0px_transparent] transition-all duration-150"
            title={`${founder.name} on LinkedIn`}
          >
            <Linkedin className="w-4 h-4 stroke-[2.25]" />
          </a>
          <a
            href={founder.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 border-2 border-chalk-border bg-[#faf9f5] rounded-xl flex items-center justify-center text-chalk-gray hover:text-chalk-purple hover:bg-[#f1ebfa] shadow-[1.5px_1.5px_0px_0px_var(--chalk-border)] hover:shadow-[2.5px_2.5px_0px_0px_var(--chalk-border)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0px_0px_0px_0px_transparent] transition-all duration-150"
            title={`${founder.name} on X`}
          >
            <Twitter className="w-4 h-4 fill-current stroke-none" />
          </a>
          <a
            href={founder.socials.email}
            className="w-8 h-8 border-2 border-chalk-border bg-[#faf9f5] rounded-xl flex items-center justify-center text-chalk-gray hover:text-chalk-purple hover:bg-[#f1ebfa] shadow-[1.5px_1.5px_0px_0px_var(--chalk-border)] hover:shadow-[2.5px_2.5px_0px_0px_var(--chalk-border)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0px_0px_0px_0px_transparent] transition-all duration-150"
            title={`Email ${founder.name}`}
          >
            <Mail className="w-4 h-4 stroke-[2.25]" />
          </a>
        </div>
      </div>
    </div>
  );
}

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

export function Founders() {
  return (
    <section className="py-24 px-[5vw] bg-[#faf9f5] border-b border-chalk-border/20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        {/* SECTION HEADER LAYOUT */}
        <div className="text-center mb-20">
          <FadeIn>
            <SketchMark flip/>
            <h2 className="font-sketch text-3xl md:text-5xl font-normal text-chalk-ink relative inline-block tracking-tight">
              Created by students, for educators
              <span className="absolute left-0 bottom-[-6px] w-full h-[3px] bg-chalk-purple/30 rounded-full" />
            </h2>
            <SketchMark/>
          </FadeIn>
        </div>

        {/* TARGET RESPONSIVE MAPPED LAYOUT LOOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-8 max-w-4xl mx-auto items-stretch">
          {foundersData.map((founder, i) => (
            <FadeIn key={founder.name} delay={i * 100}>
              <FounderCard founder={founder} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
