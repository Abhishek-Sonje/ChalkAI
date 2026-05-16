"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FadeIn } from "./fade-in";
import { Linkedin, Twitter, Mail } from "lucide-react";

const foundersData = [
  {
    name: "Jaydeep",
    role: "Co-founder ",
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
    role: "Co-founder ",
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

interface FounderCardProps {
  founder: (typeof foundersData)[0];
}

function FounderCard({ founder }: FounderCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="group flex flex-col h-full sm:flex-row gap-6 p-6 md:p-8 bg-white border-2 border-chalk-border rounded-2xl 
                    hover:-translate-y-1 active:translate-y-0
                    hover:shadow-[6px_6px_0px_0px_var(--chalk-border)] active:shadow-[2px_2px_0px_0px_var(--chalk-border)] 
                    transition-all duration-200 relative overflow-hidden"
    >
      {/* Subtle background context tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-chalk-purple-light/10 to-transparent pointer-events-none" />

      {/* AVATAR FRAME SYSTEM WITH AUTONOMOUS FALLBACK */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 border-2 border-chalk-border bg-[#faf9f5] rounded-2xl flex items-center justify-center font-sketch text-3xl font-black text-chalk-purple overflow-hidden shadow-[3px_3px_0px_0px_var(--chalk-border)] relative z-10 group-hover:rotate-2 transition-transform">
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
          <div className="text-xs font-bold text-chalk-gray tracking-wider uppercase mb-3">
            {founder.role}
          </div>
          <p className="text-sm text-chalk-ink/80 font-medium leading-relaxed mb-5">
            {founder.bio}
          </p>
        </div>

        {/* BRUTALIST SOCIAL BUTTON SLOTS */}
        <div className="flex items-center gap-3">
          <a
            href={founder.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 border-2 border-chalk-border bg-[#faf9f5] rounded-xl flex items-center justify-center text-chalk-gray hover:text-chalk-purple hover:bg-[#f1ebfa] shadow-[2px_2px_0px_0px_var(--chalk-border)] hover:translate-y-[-1px] active:translate-y-0 active:shadow-[0px_0px_0px_0px_transparent] transition-all duration-150"
          >
            <Linkedin className="w-4 h-4 stroke-[2]" />
          </a>
          <a
            href={founder.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 border-2 border-chalk-border bg-[#faf9f5] rounded-xl flex items-center justify-center text-chalk-gray hover:text-chalk-purple hover:bg-[#f1ebfa] shadow-[2px_2px_0px_0px_var(--chalk-border)] hover:translate-y-[-1px] active:translate-y-0 active:shadow-[0px_0px_0px_0px_transparent] transition-all duration-150"
          >
            <Twitter className="w-4 h-4 fill-current stroke-none" />
          </a>
          <a
            href={founder.socials.email}
            className="w-8 h-8 border-2 border-chalk-border bg-[#faf9f5] rounded-xl flex items-center justify-center text-chalk-gray hover:text-chalk-purple hover:bg-[#f1ebfa] shadow-[2px_2px_0px_0px_var(--chalk-border)] hover:translate-y-[-1px] active:translate-y-0 active:shadow-[0px_0px_0px_0px_transparent] transition-all duration-150"
          >
            <Mail className="w-4 h-4 stroke-[2]" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function Founders() {
  return (
    <section className="py-24 px-[5vw] bg-[#faf9f5] border-b border-chalk-border/20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        {/* LIGHT NON-BOLD HEADING LAYOUT */}
        <div className="text-center mb-16">
          <FadeIn>
            <h2 className="font-sketch text-3xl md:text-5xl font-normal text-chalk-ink relative inline-block tracking-tight">
              Created by students, for educators
              <span className="absolute left-0 bottom-[-6px] w-full h-[3px] bg-chalk-purple/30 rounded-full" />
            </h2>
          </FadeIn>
        </div>

        {/* TARGET LAYOUT LOOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl  mx-auto items-stretch">
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
