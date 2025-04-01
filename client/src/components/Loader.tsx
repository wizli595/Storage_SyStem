"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 15); // speed of progress (adjust as needed)

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9999] bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <div className="text-center text-xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
          Loading... {progress}%
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
            className="h-full bg-indigo-600 dark:bg-indigo-400"
          />
        </div>
      </div>
    </motion.div>
  );
}
