"use client";

import { motion } from "framer-motion";

interface Order {
  id: string;
  plateId: string;
  quantity: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  plate?: {
    id: string;
    name: string;
    price: number;
    createdAt: string;
    updatedAt: string;
  };
}

export default function OrderCard({
  order,
  onClick,
}: {
  order: Order;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="cursor-pointer bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition"
      onClick={onClick}>
      <h2 className="text-xl font-semibold mb-2">
        {order.plate?.name || "Unknown Plate"}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Quantity: {order.quantity}
      </p>
      <p className="text-sm text-gray-400 mt-2">
        Created: {new Date(order.createdAt).toLocaleDateString()}
      </p>
    </motion.div>
  );
}
