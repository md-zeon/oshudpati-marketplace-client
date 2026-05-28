import { NextRequest, NextResponse } from "next/server";
import { Roles } from "./constants/roles";
import { userService } from "./services/user.service";

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  let isAuthenticated = false;
  let userRole = Roles.CUSTOMER;

  const session = await userService.getSession();

  console.log("Session:", session);

  if (session.success) {
    isAuthenticated = true;
    userRole = session.data.user.role;
  } else {
    console.error("Failed to fetch session:", session);
  }

  console.log("Authentication status:", { isAuthenticated, userRole });

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if ((isAuthenticated && pathname === "/signin") || pathname === "/signup") {
    // Redirect to the appropriate dashboard based on user role
    if (userRole === Roles.ADMIN) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    } else if (userRole === Roles.SELLER) {
      return NextResponse.redirect(new URL("/seller/dashboard", req.url));
    } else if (userRole === Roles.CUSTOMER) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Role-based redirection
  // Admins should not access seller or customer routes, Sellers should not access admin or customer routes, and Customers should not access admin or seller routes.
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
  matcher: ["/dashboard/:path*", "/admin/:path*", "/seller/:path*"],
};
