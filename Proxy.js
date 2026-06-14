import { NextResponse } from "next/server";

const publicPages = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/onboarding",
];

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const isPublicPage = publicPages.includes(pathname);

  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && isPublicPage) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
