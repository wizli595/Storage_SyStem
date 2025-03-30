"use client";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-4 px-6 shadow-lg flex items-center justify-between z-50">
      <Link href="/" className="text-xl font-bold">
        INVENTRA
      </Link>
      <nav className="flex gap-6">
        <Link
          href="/docs"
          className="hover:text-gray-500 dark:hover:text-gray-300 transition">
          Docs
        </Link>
        <Link
          href="/dashboard"
          className="hover:text-gray-500 dark:hover:text-gray-300 transition">
          Dashboard
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition">
          {theme === "dark" ? (
            <motion.svg
              key="sun"
              initial={{ rotate: 180, scale: 0.5 }}
              animate={{ rotate: 360, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v2m0 14v2m8-8h-2M6 12H4m14.364-6.364l-1.414 1.414M6.636 6.636L5.222 5.222m13.142 13.142l-1.414-1.414M6.636 17.364l-1.414 1.414"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="moon"
              initial={{ rotate: 0, scale: 0.5 }}
              animate={{ rotate: 180, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3a9 9 0 0 0 0 18 9 9 0 0 1 0-18z"
              />
            </motion.svg>
          )}
        </button>
      </nav>
    </motion.header>
  );
}
