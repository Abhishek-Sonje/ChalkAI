import { auth } from "@clerk/nextjs/server";
import { ReactNode } from "react";

interface ShowProps {
  when: "signed-in" | "signed-out";
  children: ReactNode;
}

/**
 * A helper component to conditionally show content based on authentication state.
 * Uses the latest Clerk auth() API.
 */
export async function Show({ when, children }: ShowProps) {
  const { userId } = await auth();
  const isSignedIn = !!userId;

  if (when === "signed-in" && isSignedIn) {
    return <>{children}</>;
  }

  if (when === "signed-out" && !isSignedIn) {
    return <>{children}</>;
  }

  return null;
}
