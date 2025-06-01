"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HomeClient() {
  const [year, setYear] = useState<string | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white p-8 transition-colors duration-300">
      {/* Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-cover dark:opacity-10 opacity-20 pointer-events-none"
      />

      {/* Hero */}
      <div className="z-10 text-center max-w-2xl">
        <Image
          className="dark:invert mx-auto"
          src="/log.png"
          alt="Logo"
          width={200}
          height={50}
          priority
        />
        <h1 className="text-4xl sm:text-6xl font-bold mt-6">
          🗃️ Welcome to Storage Manager
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mt-4">
          🍽️ Effortlessly track and manage your restaurant stock with ease.
        </p>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="flex gap-6 mt-10 z-10">
        <a
          href="/dashboard"
          className="px-6 py-3 text-lg font-semibold rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-300 shadow-lg">
          🚀 Get Started
        </a>
        <a
          href="/docs"
          className="px-6 py-3 text-lg font-semibold rounded-full border border-gray-400 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg">
          📖 Learn More
        </a>
      </motion.div>

      {/* Footer */}
      {year && (
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute bottom-6 text-gray-500 dark:text-gray-400 text-sm">
          © {year} Storage Manager. All Rights Reserved. 🧾
        </motion.footer>
      )}
    </motion.div>
  );
}
