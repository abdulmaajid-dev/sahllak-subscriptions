import { NextResponse } from "next/server";

export default async function middleware(request) {
  // Use request.cookies instead of importing cookies
  const LoginCookie = await request.cookies.get("isLoggedIn");
  const { pathname } = await request.nextUrl;

  // Redirect logged-out users from dashboard
  if (!LoginCookie && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect logged-in users from home page
  if (LoginCookie && pathname === "/") {
    return NextResponse.redirect(
      new URL("/dashboard/subscriptions", request.url)
    );
  }

  return NextResponse.next();
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
};

