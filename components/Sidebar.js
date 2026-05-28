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
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/explore" },
    { name: "Notifications", path: "/notifications" },
    { name: "Following", path: "/following" },
    { name: "Messages", path: "/messages" },
    { name: "Bookmarks", path: "/bookmarks" },
    { name: "Profile", path: "/profile" },
    { name: "More", path: "/more" },
  ];

  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white px-4 py-6">
      <nav>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = mounted && pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
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
