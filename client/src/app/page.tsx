"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      {/* Background Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-cover opacity-10"></motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 text-center max-w-2xl">
        <Image
          className="dark:invert mx-auto"
          src="/logo.svg"
          alt="Next.js Logo"
          width={200}
          height={50}
          priority
        />
        <h1 className="text-4xl sm:text-6xl font-bold mt-6">
          Welcome to Storage Manager
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mt-4">
          Effortlessly track and manage your restaurant stock with ease.
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
        className="flex gap-6 mt-10 z-10">
        <a
          href="/dashboard"
          className="px-6 py-3 text-lg font-semibold rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 shadow-lg">
          Get Started
        </a>
        <a
          href="/docs"
          className="px-6 py-3 text-lg font-semibold rounded-full border border-gray-500 hover:bg-gray-700 transition-all duration-300 shadow-lg">
          Learn More
        </a>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, ease: "easeOut" }}
        className="absolute bottom-6 text-gray-400 text-sm">
        © {new Date().getFullYear()} Storage Manager. All Rights Reserved.
      </motion.footer>
    </div>
  );
}
