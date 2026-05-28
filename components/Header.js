// Top navigation bar
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <h1 className="text-2xl font-bold">
        pulse: you could social using your Idea
      </h1>
      <nav>
        <ul className="flex items-center gap-6">
          <li>
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
          </li>
          <li>
            <Link href="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
