"use client";

import { useTheme } from "@/context/ThemeProvider";
import { useSidebar } from "@/context/SidebarProvider";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaSun, FaMoon } from "react-icons/fa";
import { Menu } from "lucide-react";

type HeaderProps = {
  compact?: boolean;
};

export default function Header({ compact = false }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full shadow-lg flex items-center justify-between z-50 transition-colors duration-500
        ${
          compact
            ? "py-2 px-4 bg-transparent text-gray-900 dark:text-white"
            : "py-4 px-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        }
      `}>
      <div className="flex items-center gap-4">
        {/* Only render burger button if not compact */}
        {!compact && <BurgerButton />}

        {/* Logo */}
        <Link
          href="/"
          className={`font-bold tracking-wide ${
            compact ? "text-xl" : "text-2xl"
          }`}>
          INVENTRA
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-6">
        <Link
          href="/docs"
          className="hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
          Docs
        </Link>
        <Link
          href="/dashboard"
          className="hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
          Dashboard
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: 180, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -180, scale: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xl">
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>
    </motion.header>
  );
}

// New component that will only be used when needed
function BurgerButton() {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      onClick={toggleSidebar}
      className="sm:hidden p-2 rounded-md bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
      aria-label="Toggle Sidebar">
      <Menu className="w-6 h-6" />
    </button>
  );
}
