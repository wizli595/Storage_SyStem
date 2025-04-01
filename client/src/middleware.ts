import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/session";

export async function middleware(req: NextRequest) {
  const session = await getSession();
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth/login");
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (session && isAuthPage) {
    // If user is already logged in and visits login page, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
