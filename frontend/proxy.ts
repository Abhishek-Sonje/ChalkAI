import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected =
    pathname === "/board" ||
    pathname.startsWith("/board/") ||
    pathname === "/home" ||
    pathname.startsWith("/home/");

  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/board/:path*", "/home/:path*"],
};
