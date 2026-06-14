// Top navigation bar
import { cookies } from "next/headers";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get("token")?.value);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <h1 className="text-2xl font-bold">Pulse: social using your Idea</h1>
      <nav>
        <ul className="flex items-center gap-6">
          <li>
            <Link
              href={isLoggedIn ? "/home" : "/"}
              className="text-gray-700 hover:text-blue-600"
            >
              Home
            </Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-blue-600"
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
                  className="text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-gray-700 hover:text-blue-600"
                >
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
