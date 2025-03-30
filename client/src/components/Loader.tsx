"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(false), 15000); // Loader lasts 1.5s
    return () => clearTimeout(timeout);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      key="server-loader"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center gap-4">
        <motion.div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg font-semibold">
          Loading...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
