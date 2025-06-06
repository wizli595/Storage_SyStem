"use client";

import { motion } from "framer-motion";

export default function KpiCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-all">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
        {title}
      </h2>
      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        {value}
      </p>
    </motion.div>
  );
}
