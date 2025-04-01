"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const menuItems = [
  { name: "Overview", href: "/dashboard" },
  { name: "Stock", href: "/dashboard/some" },
  // { name: "Orders", href: "/dashboard/orders" },
  // { name: "Analytics", href: "/dashboard/analytics" },
];

export default function Sidebar() {
  return (
    <motion.aside
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-16 left-0 w-60 h-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg p-6 transition-colors duration-300">
      <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
      <nav className="flex flex-col gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
            {item.name}
          </Link>
        ))}
      </nav>
    </motion.aside>
  );
}
