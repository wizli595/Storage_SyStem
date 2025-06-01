"use client";

import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  value: string;
  Icon: React.ElementType;
  description: string;
}

export default function DashboardCard({
  title,
  value,
  Icon,
  description,
}: DashboardCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      }}
      className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {description}
          </p>
        </div>
      </div>
      <p className="text-4xl font-bold mt-4">{value}</p>
    </motion.div>
  );
}
