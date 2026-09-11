import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const botPatterns = [
  "Bytespider",
  "GPTBot",
  "ChatGPT-User",
  "CCBot",
  "anthropic-ai",
  "ClaudeBot",
  "Amazonbot",
  "Applebot-Extended",
  "FacebookBot",
  "Meta-ExternalAgent",
  "DataForSeoBot",
  "Scrapy",
  "Semrush",
  "Ahrefs",
  "MJ12bot",
  "DotBot",
  "SeekportBot",
  "Sogou",
  "Exabot",
  "Nutch",
  "Baiduspider",
  "YandexBot",
  "bingbot",
  "MicrosoftPreview",
  "msnbot",
  "MicrosoftBingPreview",
  "MicrosoftBingbot",
  "Bingbot",
  "BingPreview",
];

const suspiciousPatterns = [
  "\\.php",
  "\\.asp",
  "\\.cgi",
  "\\.pl",
  "\\.py",
  "wp-admin",
  "wp-login",
  "xmlrpc",
  "wp-content",
  "wp-includes",
  "admin",
  "login",
  "register",
  "phpmyadmin",
];

function isBot(userAgent: string): boolean {
  const lowerUA = userAgent.toLowerCase();
  return botPatterns.some((bot) => lowerUA.includes(bot.toLowerCase()));
}

function isSuspicious(path: string): boolean {
  const lowerPath = path.toLowerCase();
  return suspiciousPatterns.some((pattern) =>
    new RegExp(pattern, "i").test(lowerPath)
  );
}

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  const { pathname } = request.nextUrl;

  if (isBot(userAgent)) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  if (isSuspicious(pathname)) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const rateLimitKey = `rate_limit_${ip}`;
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 100;

  const response = NextResponse.next();

  response.headers.set("X-RateLimit-Limit", maxRequests.toString());
  response.headers.set("X-RateLimit-Remaining", "100");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
