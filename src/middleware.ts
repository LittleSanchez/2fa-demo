
import { NextResponse } from "next/server";
import { middlewareAuth } from "./utils/auth/middleware-auth";

export default middlewareAuth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // Auth pages redirect for logged in users
  if (isLoggedIn && pathname.startsWith("/auth/")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

// Optionally export config to match more paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
