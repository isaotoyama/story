import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const blockedBots = [
  "ahrefsbot",
  "semrushbot",
  "mj12bot",
  "dotbot",
  "petalbot",
  "bytespider",
  "ccbot",
  "gptbot",
  "claudebot",
  "anthropic-ai",
  "google-extended",
  "perplexitybot",
  "youbot",
  "facebookexternalhit"
];

export default clerkMiddleware((auth, req) => {
  const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";

  const isBlocked = blockedBots.some((bot) => userAgent.includes(bot));

  if (isBlocked) {
    return new NextResponse("Blocked", { status: 403 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};
