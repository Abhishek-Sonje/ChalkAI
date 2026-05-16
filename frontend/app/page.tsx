"use client";

import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { Founders } from "@/components/landing/founders";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function ChalkAILanding() {
  return (
    <div className="bg-chalk-bg font-sans text-chalk-ink overflow-x-hidden">
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Founders />
      <CTA />
      <Footer />
    </div>
  );
}