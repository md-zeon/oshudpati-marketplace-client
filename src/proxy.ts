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

  const publicPaths = [
    "/",
    "/shop",
    "/signin",
    "/signup",
    "/auth-callback",
    "/contact",
    "/about",
    "/faq",
    "/privacy",
    "/terms",
    "/email-verified",
    "/verify-email",
    "/cart",
    "/wishlist",
    "/blog",
  ];

  const isPublicPath =
    publicPaths.includes(pathname) ||
    pathname.startsWith("/medicine/") ||
    pathname.startsWith("/order-tracking") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/api/auth/");

  if (isPublicPath) {
    return NextResponse.next();
  }

  const session = await userService.getSession();

  if (!session?.success) {
    return NextResponse.redirect(
      new URL(`/signin?redirect=${encodeURIComponent(pathname)}`, req.url),
    );
  }

  const userRole = session.data.user.role;

  if (pathname === "/signin" || pathname === "/signup") {
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
