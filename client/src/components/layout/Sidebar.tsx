"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/context/SidebarProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Overview", href: "/dashboard" },
  { name: "Stock", href: "/dashboard/stock" }, // Stock levels
  { name: "Orders", href: "/dashboard/orders" }, // 🛒 Orders Page
  { name: "Stock Requests", href: "/dashboard/stock-requests" }, // 📦 Stock Requests Page
  { name: "Plates", href: "/dashboard/plates" }, // 🍽️ Plates Page
  { name: "Stock Logs", href: "/dashboard/stock-logs" }, // 📚 Stock Logs Page
  { name: "Stock Verfication", href: "/dashboard/stock-verfication" }, // 🔍 Stock Verification Page
];

export default function Sidebar() {
  const { isOpen, closeSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      {/* Background overlay on mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            onClick={closeSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-30 sm:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar static for Desktop */}
      <div className="hidden sm:block sm:w-64 sm:fixed sm:top-0 sm:left-0 sm:h-full sm:bg-white sm:dark:bg-gray-900 sm:shadow-2xl sm:px-6 sm:py-8 sm:text-gray-900 sm:dark:text-white">
        <SidebarContent pathname={pathname} />
      </div>

      {/* Sidebar motion for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-2xl px-6 py-8 z-40 sm:hidden">
            <SidebarContent pathname={pathname} onLinkClick={closeSidebar} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({
  pathname,
  onLinkClick,
}: {
  pathname: string;
  onLinkClick?: () => void;
}) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${
              pathname === item.href
                ? "bg-gray-200 dark:bg-gray-700 font-bold"
                : ""
            }`}>
            {item.name}
          </Link>
        ))}
      </nav>
    </>
  );
}
