import { NextRequest, NextResponse } from "next/server";
import { Roles } from "./constants/roles";
import { userService } from "./services/user.service";

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

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const userAgent = req.headers.get("user-agent") || "";

  if (isBot(userAgent)) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  if (isSuspicious(pathname)) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  let isAuthenticated = false;
  let userRole = Roles.CUSTOMER;

  if (pathname === "/auth-callback") {
    return NextResponse.next();
  }

  const session = await userService.getSession();

  if (session?.success) {
    isAuthenticated = true;
    userRole = session.data.user.role;
  } else {
    console.error("Failed to fetch session:", session);
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(
      new URL(`/signin?redirect=${encodeURIComponent(pathname)}`, req.url),
    );
  }

  if (
    (isAuthenticated && pathname === "/signin") ||
    (isAuthenticated && pathname === "/signup")
  ) {
    if (userRole === Roles.ADMIN) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else if (userRole === Roles.SELLER) {
      return NextResponse.redirect(new URL("/seller/dashboard", req.url));
    } else if (userRole === Roles.CUSTOMER) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (pathname === "/dashboard/profile") {
    if (userRole === Roles.ADMIN) {
      return NextResponse.redirect(new URL("/admin/profile", req.url));
    } else if (userRole === Roles.SELLER) {
      return NextResponse.redirect(new URL("/seller/profile", req.url));
    }
  }

  if (
    userRole === Roles.ADMIN &&
    (pathname.startsWith("/seller") || pathname.startsWith("/dashboard"))
  ) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  } else if (
    userRole === Roles.SELLER &&
    (pathname.startsWith("/admin") || pathname.startsWith("/dashboard"))
  ) {
    return NextResponse.redirect(new URL("/seller/dashboard", req.url));
  } else if (
    userRole === Roles.CUSTOMER &&
    (pathname.startsWith("/admin") || pathname.startsWith("/seller"))
  ) {
    return NextResponse.redirect(new URL("/customer/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
