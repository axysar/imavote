import { NextResponse } from "next/server";

export const runtime = "edge";

export function GET() {
  return NextResponse.json({
    status: "ok",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    chains: [11155111, 421614, 84532, 42161, 8453, 1, 31337],
  });
}
