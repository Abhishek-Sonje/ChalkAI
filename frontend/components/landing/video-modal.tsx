"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
}

export function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-chalk-ink/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-5xl aspect-video bg-white rounded-3xl border-4 border-chalk-border shadow-[12px_12px_0px_0px_var(--chalk-border)] overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white border-2 border-chalk-border rounded-xl flex items-center justify-center text-chalk-ink hover:text-chalk-purple hover:rotate-90 transition-all duration-300 shadow-[2px_2px_0px_0px_var(--chalk-border)]"
            >
              <X className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Video Placeholder / Player */}
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#faf9f5]">
              {videoUrl ? (
                <iframe
                  src={videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center gap-4 text-center px-6">
                  <div className="w-20 h-20 bg-chalk-purple-light rounded-3xl flex items-center justify-center mb-2 animate-pulse">
                     <div className="w-10 h-10 border-4 border-chalk-purple border-t-transparent rounded-full animate-spin" />
                  </div>
                  <h3 className="font-sketch text-2xl font-bold text-chalk-ink">Demo Video Coming Soon</h3>
                  <p className="text-chalk-gray max-w-md font-medium">
                    We're currently polishing the ultimate Chalk AI demonstration. Stay tuned for a full walkthrough of our AI-powered intelligent board!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
