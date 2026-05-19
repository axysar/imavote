import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );

  // CSP: allow inline styles (Tailwind), wallet connectors, RPC endpoints
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.alchemy.com https://*.infura.io https://rpc.sepolia.org https://sepolia-rollup.arbitrum.io https://sepolia.base.org https://arb1.arbitrum.io https://mainnet.base.org https://cloudflare-eth.com https://relay.walletconnect.com https://relay.walletconnect.org wss://relay.walletconnect.com wss://relay.walletconnect.org http://127.0.0.1:8545",
    "frame-src 'self' https://verify.walletconnect.com https://verify.walletconnect.org",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    // Apply to all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icon-.*\\.png).*)",
  ],
};
