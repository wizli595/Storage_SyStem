"use client";

import { motion } from "framer-motion";

interface LowStockAlertProps {
  count: number;
}

export default function LowStockAlert({ count }: LowStockAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center">
      ⚠️ {count} items are below minimum stock. Check them now!
    </motion.div>
  );
}
