"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { signInWithGoogle, signOutAction } from "@/app/actions/auth";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

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

export function HeaderAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-24 rounded-lg bg-chalk-border/30 animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <>
        <GoogleSignInButton className="text-sm font-medium text-chalk-ink-soft hover:text-chalk-ink transition-colors inline-flex items-center gap-2">
          <GoogleIcon className="w-4 h-4" />
          Log in
        </GoogleSignInButton>
        <GoogleSignInButton className="px-5 py-2 text-sm font-semibold bg-chalk-ink text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all active:scale-95 inline-flex items-center gap-2">
          Get Started
        </GoogleSignInButton>
      </>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/board"
        className="text-sm font-semibold text-chalk-ink hover:text-chalk-purple transition-colors"
      >
        Board
      </Link>
      <form action={signOutAction}>
        <button
          type="submit"
          title="Sign out"
          className="flex items-center gap-2 rounded-full border-2 border-chalk-border bg-white pl-1 pr-3 py-1 hover:border-chalk-purple transition-colors"
        >
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name ?? "Account"}
              className="w-7 h-7 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="w-7 h-7 rounded-full bg-chalk-purple-light text-chalk-purple text-xs font-bold flex items-center justify-center">
              {(session.user.name ?? "U").slice(0, 1)}
            </span>
          )}
          <span className="text-xs font-semibold text-chalk-ink-soft">Sign out</span>
        </button>
      </form>
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
