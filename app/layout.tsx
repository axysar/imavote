import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://imavote.xyz"),
  title: {
    default: "iMaVote · Secure Decentralized Voting",
    template: "%s · iMaVote",
  },
  description:
    "Enterprise-grade blockchain voting platform for transparent, tamper-proof organizational governance.",
  keywords: [
    "voting",
    "blockchain",
    "ethereum",
    "governance",
    "dao",
    "web3",
    "sepolia",
  ],
  authors: [{ name: "AxAy Labs" }],
  openGraph: {
    title: "iMaVote",
    description: "Decentralized voting for the modern age.",
    type: "website",
    locale: "en_US",
    siteName: "iMaVote",
  },
  twitter: {
    card: "summary_large_image",
    title: "iMaVote",
    description: "Decentralized voting for the modern age.",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://eth-sepolia.g.alchemy.com" />
        <link rel="preconnect" href="https://arb-sepolia.g.alchemy.com" />
        <link rel="preconnect" href="https://base-sepolia.g.alchemy.com" />
        <link rel="dns-prefetch" href="https://relay.walletconnect.com" />
      </head>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500/30 flex flex-col">
        <div
          className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]"
          aria-hidden="true"
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-indigo-600 focus:text-white"
        >
          Skip to main content
        </a>
        <Providers>
          <Navbar />
          <div id="main" className="pt-16 flex-1">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
