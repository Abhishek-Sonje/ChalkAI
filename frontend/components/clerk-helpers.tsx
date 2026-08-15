"use client";

import { useAuth } from "@clerk/nextjs";
import { ReactNode } from "react";

interface ShowProps {
  when: "signed-in" | "signed-out";
  children: ReactNode;
}

/**
 * Conditionally render children from auth state without calling server `auth()`.
 * Using `useAuth()` keeps the root layout working on 404s and unmatched routes
 * where Clerk middleware is not attached.
 */
export function Show({ when, children }: ShowProps) {
  const { userId, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  const isSignedIn = !!userId;

  if (when === "signed-in" && isSignedIn) {
    return <>{children}</>;
  }

  if (when === "signed-out" && !isSignedIn) {
    return <>{children}</>;
  }

  return null;
}
