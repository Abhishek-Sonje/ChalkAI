import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ClerkProvider, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Show } from "@/components/clerk-helpers";
import { UIProvider } from "@/components/ui-provider";
import { Header } from "@/components/header";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { Caveat, Nunito, Kalam, Inter } from "next/font/google";
import "./globals.css";

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal"],
  variable: "--font-sketch",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
});

// const nunito = Nunito({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
//   style: ["normal", "italic"],
//   variable: "--font-body",
// });


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChalkAI - Turn Sketches into Professional Diagrams",
  description:
    "An intelligent whiteboard that uses Google Gemini AI to transform hand-drawn sketches into clean, publication-ready diagrams instantly.",
  keywords: [
    "whiteboard",
    "AI",
    "Gemini",
    "diagrams",
    "tldraw",
    "sketch to code",
    "visualization",
    "productivity",
  ],
  authors: [{ name: "ChalkAI Team" }],
  openGraph: {
    title: "ChalkAI - Turn Sketches into Professional Diagrams",
    description:
      "Transform rough sketches into clean diagrams with AI. The intelligent whiteboard for your workflow.",
    url: "https://chalk-ai.vercel.app",
    siteName: "ChalkAI",
    images: [
      {
        url: "/ChalkAI.png",
        width: 1200,
        height: 630,
        alt: "ChalkAI Demo Canvas",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChalkAI - Turn Sketches into Professional Diagrams",
    description:
      "Transform rough sketches into clean diagrams with AI. The intelligent whiteboard for your workflow.",
    images: ["/ChalkAI.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}  ${inter.variable} ${kalam.variable} antialiased`}
      >
        <ClerkProvider>
          <UIProvider>
            <Header>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-chalk-ink-soft hover:text-chalk-ink transition-colors">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-5 py-2 text-sm font-semibold bg-chalk-ink text-white rounded-lg hover:-translate-y-0.5 hover:shadow-lg transition-all active:scale-95">
                    Get Started
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <div className="flex items-center gap-4">
                  <Link
                    href="/board"
                    className="text-sm font-semibold text-chalk-ink hover:text-chalk-purple transition-colors"
                  >
                    Board
                  </Link>
                  <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }} />
                </div>
              </Show>
            </Header>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </UIProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
