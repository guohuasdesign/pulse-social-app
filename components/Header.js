// Top navigation bar
import { cookies } from "next/headers";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get("token")?.value);

  return (
    <header className="surface sticky top-0 z-10 flex items-center justify-between rounded-none border-b-0 px-4 py-3" style={{ borderRadius: 0, borderLeft: "none", borderRight: "none", borderTop: "none" }}>
      <h1 className="text-xl font-medium" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>Pulse</h1>
      <nav>
        <ul className="flex items-center gap-6">
          <li>
            <Link
              href={isLoggedIn ? "/home" : "/"}
              className="text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: "var(--text-muted)" }}
            >
              Home
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link
                  href="/about"
                  className="text-sm font-medium hover:opacity-70 transition-opacity"
                  style={{ color: "var(--text-muted)" }}
                >
                  About
                </Link>
              </li>
              <li>
                <LogoutButton />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  className="text-sm font-medium hover:opacity-70 transition-opacity"
                  style={{ color: "var(--text-muted)" }}
                >
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="btn-primary text-sm" style={{ padding: "6px 14px" }}>
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
