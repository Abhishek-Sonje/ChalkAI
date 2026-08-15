"use client";

import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";
import { LogoIcon } from "./icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-chalk-ink text-white py-12 px-[5vw] border-t-4 border-chalk-border/40 relative overflow-hidden">
      {/* Subtle hand-drawn aesthetic grid pattern texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="footer-grid"
              width="30"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="15" cy="15" r="1" fill="#ffffff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          {/* BRAND SIGNATURE IDENTIFIER */}
          <div className="flex flex-col gap-1.5">
            <div className="font-sketch text-2xl font-bold flex items-center gap-2.5 text-white tracking-tight">
              <LogoIcon />
              <span>Chalk AI</span>
            </div>
            <p className="text-xs md:text-sm text-white/50 max-w-xs font-medium leading-relaxed">
              The AI-powered smart board built by students, transforming how
              educators sketch and explain complex ideas.
            </p>
          </div>

          {/* BRUTALIST CALL TO ACTIONS (GITHUB & SOCIAL CHANNELS) */}
          <div className="flex flex-wrap items-center gap-4">
            {/* TARGET HIGH-AGENCY GITHUB CONNECTOR */}
            <a
              href="https://github.com/jaydxxp/ChalkAI"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/5 border-2 border-white/10 rounded-xl text-sm font-bold text-white/90
                         hover:bg-white/10 hover:border-white/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Github className="w-4 h-4 stroke-[2]" />
              <span>Star on GitHub</span>
            </a>


          
            
          </div>
        </div>

        {/* REINFORCED CHALKBOARD RULER DIVIDER */}
        <div className="h-[2px] bg-gradient-to-r from-white/5 via-white/20 to-white/5 mb-6" />

        {/* BOTTOM METADATA LAYER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11px] md:text-xs text-white/40 font-medium tracking-wide">
            © {currentYear} Chalk AI. Handcrafted with care. All rights
            reserved.
          </span>
          <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-white/30 font-medium font-sketch">
            <span>Built by</span>
            <a
              href="https://github.com/jaydxxp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-chalk-purple hover:underline transition-colors"
            >
              Jaydeep
            </a>
            <span>&</span>
            <a
              href="https://github.com/AbhishekSonje"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-chalk-purple hover:underline transition-colors"
            >
              Abhishek
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
