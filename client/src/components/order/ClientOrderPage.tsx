// app/components/orders/OrdersDashboard.tsx
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/server/orders/orderApi";
import { AnimatePresence, motion } from "framer-motion";
import OrderCard from "@/components/order/OrderCard";
import OrderDetailModal from "@/components/order/OrderDetailModal";
import NewOrderModal from "@/components/order/NewOrderModal";
import { FaPlus } from "react-icons/fa";

function KpiCard({ title, value }: { title: string; value: number }) {
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

export default function OrdersDashboard() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    staleTime: 1000 * 60 * 5, // 5 min stale
  });

  const activeOrders = orders.filter((order) => !order.isDeleted);

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
          📦 Orders Management
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewOrderModal(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition-all">
          <FaPlus /> New Order
        </motion.button>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <KpiCard title="Total Orders" value={orders.length} />
        <KpiCard title="Active Orders" value={activeOrders.length} />
        <KpiCard
          title="Deleted Orders"
          value={orders.length - activeOrders.length}
        />
      </div>

      {/* ORDERS LIST */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-48 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Failed to load orders.</p>
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="w-40 h-40 mb-6 opacity-70">
            {/* Inline SVG (no network needed) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full text-gray-400">
              <path d="M21 16V8a2 2 0 0 0-2-2h-4l-2-2h-2l-2 2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
            </svg>
          </div>
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No orders found. Create your first one!
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onClick={() => setSelectedOrderId(order.id)}
            />
          ))}
        </motion.div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedOrderId && (
          <OrderDetailModal
            orderId={selectedOrderId}
            onClose={() => setSelectedOrderId(null)}
          />
        )}
        {showNewOrderModal && (
          <NewOrderModal onClose={() => setShowNewOrderModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
