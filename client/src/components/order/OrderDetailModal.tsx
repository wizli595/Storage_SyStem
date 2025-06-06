"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchOrderById } from "@/server/orders/orderApi";
import { IoIosCloseCircle } from "react-icons/io";

export default function OrderDetailModal({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) {
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
  });

  if (isLoading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <motion.div
        className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg relative"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <IoIosCloseCircle className="text-2xl" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Order Details</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Plate: {order?.plate?.name || "Unknown"}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Plate Price:{" "}
          {order?.plate?.price ? `$${order.plate.price.toFixed(2)}` : "N/A"}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Quantity: {order?.quantity}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          Status: {order?.isDeleted ? "Deleted" : "Active"}
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          Created:{" "}
          {order?.createdAt
            ? new Date(order.createdAt).toLocaleDateString()
            : "N/A"}
        </p>
      </motion.div>
    </motion.div>
  );
}
