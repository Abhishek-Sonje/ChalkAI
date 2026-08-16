"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { signInWithGoogle } from "@/app/actions/auth";
import { useIsClient } from "@/lib/use-is-client";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

const headerButtonClass =
  "px-3 sm:px-5 py-2 text-sm font-semibold bg-chalk-ink text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all active:scale-95";

export function GoogleSignInButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form action={signInWithGoogle}>
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}

function SignInModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const mounted = useIsClient();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] grid place-items-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-chalk-ink/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 w-full max-w-sm bg-white border-[3px] border-chalk-border rounded-3xl p-8 shadow-[8px_8px_0px_0px_var(--chalk-border)]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-xl border-2 border-chalk-border bg-white flex items-center justify-center text-chalk-ink hover:text-chalk-purple transition-colors"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            <h2 className="font-sketch text-2xl font-bold text-chalk-ink mb-6 pr-8">
              Sign in
            </h2>

            <GoogleSignInButton className="w-full inline-flex items-center justify-center gap-3 px-5 py-3.5 bg-white text-chalk-ink font-semibold rounded-xl border-2 border-chalk-border hover:bg-[#faf9f5] transition-colors">
              <GoogleMark className="w-5 h-5" />
              Sign in with Google
            </GoogleSignInButton>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function HeaderAuth() {
  const { data: session, status } = useSession();
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  if (status === "loading") {
    return <div className="h-9 w-24 rounded-lg bg-chalk-border/30 animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsSignInOpen(true)}
          className={headerButtonClass}
        >
          Log in
        </button>
        <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
      </>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Link
        href="/boards"
        className="text-sm font-semibold text-chalk-ink hover:text-chalk-purple transition-colors px-2 py-1"
      >
        Boards
      </Link>
      <Link
        href="/account"
        className="flex items-center gap-2 text-sm font-semibold text-chalk-ink hover:text-chalk-purple transition-colors"
        aria-label="Account"
      >
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt=""
            className="w-8 h-8 rounded-full border-2 border-chalk-border"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="w-8 h-8 rounded-full bg-chalk-purple-light text-chalk-purple text-xs font-bold flex items-center justify-center border-2 border-chalk-border">
            {(session.user.name ?? "U").slice(0, 1)}
          </span>
        )}
        <span className="hidden sm:inline">Account</span>
      </Link>
    </div>
  );
}

export function useIsSignedIn() {
  const { data: session, status } = useSession();
  return {
    isSignedIn: !!session?.user,
    isLoaded: status !== "loading",
  };
}
