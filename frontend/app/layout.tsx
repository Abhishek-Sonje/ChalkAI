import type { Metadata } from "next";
import { Geist, Geist_Mono, Kalam, Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { HeaderAuth } from "@/components/auth-buttons";
import { UIProvider } from "@/components/ui-provider";
import { ApiKeyProvider } from "@/components/api-key-provider";
import { Header } from "@/components/header";
import { LayoutWrapper } from "@/components/layout-wrapper";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

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
  metadataBase: new URL("https://chalk-ai.vercel.app"),
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
        <AuthProvider>
          <ApiKeyProvider>
          <UIProvider>
            <Header>
              <HeaderAuth />
            </Header>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </UIProvider>
          </ApiKeyProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
