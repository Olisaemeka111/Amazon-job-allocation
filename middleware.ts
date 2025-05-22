import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { DEBUG_MODE } from "./lib/debug-mode"

export function middleware(request: NextRequest) {
  // In debug mode, allow access to all routes
  if (DEBUG_MODE) {
    return NextResponse.next()
  }

  // List of public paths that don't require authentication
  const publicPaths = [
    "/login",
    "/register",
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/logout",
    "/api/auth/session",
    "/api/init-db",
    "/api/direct-login",
    "/debug",
  ]

  // Check if the current path is public
  const { pathname } = request.nextUrl
  const isPublicPath = publicPaths.some(
    (path) =>
      pathname.startsWith(path) ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/static") ||
      pathname === "/favicon.ico" ||
      pathname === "/robots.txt",
  )

  // Allow access to public paths without authentication
  if (isPublicPath) {
    return NextResponse.next()
  }

  // For protected routes, check for session cookie
  const sessionCookie = request.cookies.get("session")

  // If no session cookie, redirect to login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Allow access to protected routes
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
