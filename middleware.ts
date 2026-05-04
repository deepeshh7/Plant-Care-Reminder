import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuthenticated = !!req.auth;
  const pathname = req.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/signin",
    "/signup",
    "/reset-password",
  ];

  // API routes that don't require authentication
  const publicApiRoutes = [
    "/api/auth",
  ];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route));
  const isPublicApiRoute = publicApiRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = pathname.startsWith("/signin") || pathname.startsWith("/signup") || pathname.startsWith("/reset-password");

  // Allow public API routes
  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect unauthenticated users to signin for protected routes
  if (!isAuthenticated && !isPublicRoute && !pathname.startsWith("/api")) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.\\.(?:svg|png|jpg|jpeg|gif|webp)$).)",
  ],
};

export const runtime = "nodejs";