"use client";

import { usePathname } from "next/navigation";

export default function HeaderVisibility({ children }) {
  const pathname = usePathname();
  const hiddenPages = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  if (hiddenPages.includes(pathname)) {
    return null;
  }

  return children;
}
