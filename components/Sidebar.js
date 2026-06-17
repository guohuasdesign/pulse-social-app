"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const Sidebar = () => {
  const pathname = usePathname();
  const publicPages = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  if (publicPages.includes(pathname)) {
    return null;
  }

  const menuItems = [
    { name: "Home", path: "/home" },
    { name: "Bookmarks", path: "/bookmarks" },
  ];

  return (
    <aside
      className="surface fixed inset-x-3 bottom-3 z-20 px-3 py-2 md:sticky md:top-16 md:inset-auto md:h-[calc(100vh-4rem)] md:w-64 md:rounded-none md:border-y-0 md:border-l-0 md:bg-transparent md:px-4 md:py-6 md:shadow-none"
    >
      <nav>
        <ul className="grid grid-cols-2 gap-2 md:block md:space-y-1">
          {menuItems.map((item) => {
            const isActive = mounted && pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="block rounded-md px-3 py-2 text-center text-sm font-medium transition-colors md:text-left"
                  style={
                    isActive
                      ? {
                          background: "rgba(180, 88, 55, 0.08)",
                          color: "var(--accent)",
                        }
                      : { color: "var(--text-muted)" }
                  }
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
