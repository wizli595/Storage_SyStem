"use client";
import { motion } from "framer-motion";
import Header from "@/components/Header";

export default function Docs() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <Header compact />

      <main className="max-w-4xl mx-auto pt-24 p-8">
        <h1 className="text-4xl font-bold">📖 Documentation</h1>
        <p className="text-gray-500 dark:text-gray-300 mt-4">
          Welcome to the **INVENTRA Docs**! Here, yoxu ll find everything you
          need to get started.
        </p>
      </main>
    </motion.div>
  );
}
