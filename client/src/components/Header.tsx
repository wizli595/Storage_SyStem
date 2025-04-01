"use client";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaSun, FaMoon } from "react-icons/fa";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-4 px-6 shadow-lg flex items-center justify-between z-50 transition-colors duration-500">
      <Link href="/" className="text-xl font-bold">
        INVENTRA
      </Link>
      <nav className="flex gap-6 items-center">
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
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={theme}
              initial={{ rotate: 180, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: -180, scale: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl">
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>
    </motion.header>
  );
}
