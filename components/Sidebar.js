"use client";

// Left menu (HomePage, Explore, Notifications, Messages, Bookmarks, Lists, Profile, More)
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
    "/onboarding",
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
    { name: "Explore", path: "/explore" },
    { name: "Notifications", path: "/notifications" },
    { name: "Following", path: "/following" },
    { name: "Messages", path: "/messages" },
    { name: "Bookmarks", path: "/bookmarks" },
    { name: "Profile", path: "/profile" },
    { name: "More", path: "/more" },
  ];

  return (
    <aside
      className="sticky top-16 h-[calc(100vh-4rem)] w-64 px-4 py-6"
      style={{ borderRight: "1px solid var(--border)" }}
    >
      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = mounted && pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="block rounded-md px-3 py-2 text-sm font-medium transition-colors"
                  style={
                    isActive
                      ? { background: "rgba(180, 88, 55, 0.08)", color: "var(--accent)" }
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
