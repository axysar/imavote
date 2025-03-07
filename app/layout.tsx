import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "iMaVote | Secure Decentralized Voting",
  description:
    "Enterprise-grade blockchain voting platform for transparent organizational governance.",
  keywords: ["voting", "blockchain", "ethereum", "governance", "web3"],
  openGraph: {
    title: "iMaVote",
    description: "Decentralized voting for the modern age.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500/30">
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)]" />
        <Providers>
          <Navbar />
          <div className="pt-16">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
